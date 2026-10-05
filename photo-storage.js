/* PacoGO TEST — lesson source photo storage */
(function(){
  const BUCKET='lesson-photos';
  let currentPhotoPicker=null;
  function esc(v){return typeof escapeHtml==='function'?escapeHtml(v):String(v??'').replace(/[&<>\'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
  function msg(text,type='success'){if(typeof showMessage==='function')showMessage(text,type);else console.log(text)}
  function canManage(){return typeof isParentLoggedIn==='function'&&isParentLoggedIn()}
  async function compressPhoto(file){
    if(!file)return null;
    if(file.size<=5*1024*1024 && /^image\/(jpeg|png|webp)$/i.test(file.type))return file;
    return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(new Error('Foto kon niet worden gelezen.'));reader.onload=()=>{const img=new Image();img.onerror=()=>reject(new Error('Foto kon niet worden geopend.'));img.onload=()=>{const max=1800,scale=Math.min(1,max/Math.max(img.naturalWidth||1,img.naturalHeight||1)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round((img.naturalWidth||1)*scale));canvas.height=Math.max(1,Math.round((img.naturalHeight||1)*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);canvas.toBlob(blob=>{if(!blob)return reject(new Error('Foto kon niet worden verkleind.'));resolve(new File([blob],'bronfoto.jpg',{type:'image/jpeg',lastModified:Date.now()}));},'image/jpeg',.82)};img.src=reader.result};reader.readAsDataURL(file)})
  }
  async function uploadForLesson(lessonId,file){
    if(!canManage())throw new Error('Log eerst in als ouder.');
    if(!lessonId||!file)throw new Error('Geen les of foto geselecteerd.');
    const prepared=await compressPhoto(file),ext=prepared.type==='image/png'?'png':'jpg',path='lessons/'+String(lessonId)+'/'+crypto.randomUUID()+'.'+ext;
    const upload=await db.storage.from(BUCKET).upload(path,prepared,{contentType:prepared.type,cacheControl:'31536000',upsert:false});
    if(upload.error)throw upload.error;
    const inserted=await db.from('lesson_photos').insert({lesson_id:Number(lessonId),storage_path:path,original_name:file.name||'bronfoto',mime_type:prepared.type,size_bytes:prepared.size,created_by:currentSession?.user?.id||null}).select('id,lesson_id,storage_path,original_name,mime_type,size_bytes,created_at').single();
    if(inserted.error){await db.storage.from(BUCKET).remove([path]);throw inserted.error}
    return inserted.data
  }
  async function loadPhotos(lessonId){
    if(!lessonId||!canManage())return [];
    const res=await db.from('lesson_photos').select('id,lesson_id,storage_path,original_name,mime_type,size_bytes,created_at').eq('lesson_id',Number(lessonId)).order('created_at',{ascending:true});
    if(res.error){console.error('Lesson photo load error:',res.error);return []}
    const rows=res.data||[];if(!rows.length)return [];
    const signed=await db.storage.from(BUCKET).createSignedUrls(rows.map(x=>x.storage_path),3600);
    if(signed.error){console.error('Lesson photo signed URL error:',signed.error);return rows.map(x=>({...x,url:''}))}
    return rows.map((x,i)=>({...x,url:signed.data?.[i]?.signedUrl||''}))
  }
  async function deletePhoto(id,path){
    if(!canManage())return;
    if(!confirm('Deze bronfoto verwijderen?'))return;
    const removed=await db.storage.from(BUCKET).remove([path]);
    if(removed.error){msg('Foto verwijderen uit opslag mislukt: '+removed.error.message,'error');return}
    const row=await db.from('lesson_photos').delete().eq('id',Number(id));
    if(row.error){msg('De foto is uit Storage verwijderd, maar de koppeling kon niet worden verwijderd.','error');return}
    msg('Bronfoto verwijderd.','success');await renderLessonPhotos(currentLesson?.id)
  }
  async function renderLessonPhotos(lessonId){
    const panel=document.getElementById('lessonPhotosPanel');if(!panel)return;
    if(!canManage()||!lessonId){panel.classList.add('hidden');return}
    panel.classList.remove('hidden');panel.innerHTML='<div class="small">📷 Bronfoto\'s laden...</div>';
    const photos=await loadPhotos(lessonId);
    if(!photos.length){panel.innerHTML='<div class="lesson-photos-head"><div><h3>📷 Bronfoto</h3><div class="small">Aan deze les is nog geen bronfoto gekoppeld.</div></div><button type="button" class="secondary" onclick="openExistingLessonPhotoPicker()">➕ Foto toevoegen</button></div>';return}
    panel.innerHTML='<div class="lesson-photos-head"><div><h3>📷 Bronfoto'+(photos.length===1?'':\'s\')+'</h3><div class="small">Opgeslagen in PacoGO Storage.</div></div><button type="button" class="secondary" onclick="openExistingLessonPhotoPicker()">➕ Foto toevoegen</button></div><div class="lesson-photos-grid">'+photos.map(p=>'<figure class="lesson-photo-card">'+(p.url?'<a href="'+esc(p.url)+'" target="_blank" rel="noopener"><img src="'+esc(p.url)+'" alt="Bronfoto"></a>':'<div class="lesson-photo-missing">Foto niet beschikbaar</div>')+'<figcaption><span>'+esc(p.original_name||'Bronfoto')+'</span><button type="button" class="danger" onclick="deleteLessonPhoto('+Number(p.id)+','+JSON.stringify(p.storage_path)+')">🗑️ Verwijderen</button></figcaption></figure>').join('')+'</div>'
  }
  async function addPhotoToCurrentLesson(file){
    if(!canManage()||!currentLesson||!file)return;
    try{msg('📷 Foto wordt opgeslagen...','success');await uploadForLesson(currentLesson.id,file);await renderLessonPhotos(currentLesson.id);msg('📷 Bronfoto opgeslagen bij de les.','success')}catch(error){console.error('Lesson photo upload error:',error);msg('Foto opslaan mislukt: '+(error?.message||'onbekende fout'),'error')}
  }
  window.deleteLessonPhoto=deletePhoto;
  window.openExistingLessonPhotoPicker=function(){
    if(!canManage()||!currentLesson)return;
    if(currentPhotoPicker){currentPhotoPicker.remove();currentPhotoPicker=null}
    const input=document.createElement('input');input.type='file';input.accept='image/*';input.capture='environment';input.style.display='none';
    input.onchange=async e=>{const file=e.target.files?.[0];if(file)await addPhotoToCurrentLesson(file);input.remove();currentPhotoPicker=null};document.body.appendChild(input);currentPhotoPicker=input;input.click()
  };
  function ensurePhotoUi(){
    const lessonView=document.getElementById('lessonView'),admin=document.getElementById('lessonAdminButtons');
    if(admin&&!document.getElementById('addLessonPhotoButton')){const button=document.createElement('button');button.id='addLessonPhotoButton';button.className='secondary';button.type='button';button.textContent='📷 Foto toevoegen';button.onclick=window.openExistingLessonPhotoPicker;admin.appendChild(button)}
    if(lessonView&&!document.getElementById('lessonPhotosPanel')){const panel=document.createElement('section');panel.id='lessonPhotosPanel';panel.className='lesson-photos-panel hidden';const content=document.getElementById('lessonContent');if(content)content.insertAdjacentElement('afterend',panel);else lessonView.appendChild(panel)}
    const addBtn=document.getElementById('addLessonPhotoButton');if(addBtn)addBtn.classList.toggle('hidden',!canManage())
  }
  function ensurePhotoSaveControl(){
    const review=document.getElementById('photoReview');if(!review||document.getElementById('photoSaveOriginal'))return;
    const box=document.createElement('div');box.className='photo-save-original-box';box.innerHTML='<label class="photo-save-original-label"><input id="photoSaveOriginal" type="checkbox" checked> 📷 Bronfoto bewaren bij deze les</label><div class="small">De foto wordt verkleind indien nodig en opgeslagen in PacoGO Storage. De foto staat los van de OCR/lesinhoud.</div>';
    const button=review.querySelector('button.success.big');if(button)review.insertBefore(box,button);else review.appendChild(box)
  }
  function patchFunctions(){
    if(typeof showLesson==='function'&&!showLesson.__photoPatched){const original=showLesson;const wrapped=function(){const result=original.apply(this,arguments);ensurePhotoUi();syncPhotoUi();if(currentLesson?.id)renderLessonPhotos(currentLesson.id);return result};wrapped.__photoPatched=true;window.showLesson=wrapped}
    if(typeof showPhotoLesson==='function'&&!showPhotoLesson.__photoPatched){const original=showPhotoLesson;const wrapped=async function(){const result=await original.apply(this,arguments);ensurePhotoSaveControl();return result};wrapped.__photoPatched=true;window.showPhotoLesson=wrapped}
    if(typeof createLessonFromPhoto==='function'&&!createLessonFromPhoto.__photoPatched){const original=createLessonFromPhoto;const wrapped=async function(){const save=document.getElementById('photoSaveOriginal');const file=typeof photoLessonSelectedFile!=='undefined'?photoLessonSelectedFile:null;const result=await original.apply(this,arguments);if(save?.checked&&file&&currentLesson?.id){try{await uploadForLesson(currentLesson.id,file);msg('📷 Bronfoto ook opgeslagen bij de nieuwe les.','success')}catch(error){console.error('New lesson source photo error:',error);msg('Les is gemaakt, maar de bronfoto kon niet worden opgeslagen.','error')}}return result};wrapped.__photoPatched=true;window.createLessonFromPhoto=wrapped}
  }
  function syncPhotoUi(){ensurePhotoUi();const admin=document.getElementById('lessonAdminButtons'),btn=document.getElementById('addLessonPhotoButton');if(btn)btn.classList.toggle('hidden',!canManage()||!currentLesson);if(admin)admin.classList.toggle('hidden',false)}
  const style=document.createElement('style');style.textContent='.lesson-photos-panel{margin-top:18px;padding:18px 20px;background:#fffdf0;border:2px solid #f4e8a8;border-radius:20px;box-shadow:0 8px 18px rgba(16,43,87,.08)}.lesson-photos-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.lesson-photos-head h3{margin:0;font-family:"Baloo 2",Nunito,sans-serif;font-size:24px;color:#102b57}.lesson-photos-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}.lesson-photo-card{margin:0;background:#fff;border:1px solid #dce9f6;border-radius:16px;overflow:hidden}.lesson-photo-card a{display:block;background:#f7fbff}.lesson-photo-card img{display:block;width:100%;height:220px;object-fit:contain}.lesson-photo-card figcaption{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px;font-size:12px;color:#667894}.lesson-photo-card figcaption button{padding:7px 9px;font-size:12px}.lesson-photo-missing{height:220px;display:flex;align-items:center;justify-content:center;color:#667894;background:#f7fbff}.photo-save-original-box{margin:12px 0;padding:12px 14px;background:#eef8ff;border:2px solid #bfe6ff;border-radius:14px}.photo-save-original-label{display:flex;align-items:center;gap:8px;font-weight:900;color:#126fc9}.photo-save-original-label input{width:18px;height:18px}@media(max-width:700px){.lesson-photos-head{align-items:flex-start;flex-direction:column}.lesson-photos-head button{width:100%}.lesson-photos-grid{grid-template-columns:1fr}.lesson-photo-card img,.lesson-photo-missing{height:260px}}';document.head.appendChild(style);
  function boot(){ensurePhotoUi();patchFunctions();ensurePhotoSaveControl();syncPhotoUi();setTimeout(()=>{ensurePhotoUi();patchFunctions();ensurePhotoSaveControl();syncPhotoUi()},500);setTimeout(()=>{ensurePhotoUi();patchFunctions();ensurePhotoSaveControl();syncPhotoUi()},1500)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
