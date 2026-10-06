/* PacoGO TEST — lesson source photo storage */
// Professional refactor gate: runtime save ownership is now external to index.html.
(function(){
  const BUCKET='lesson-photos';
  let currentPhotoPicker=null;

  function esc(v){return typeof escapeHtml==='function'?escapeHtml(v):String(v??'').replace(/[&<>\'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]))}
  function msg(text,type='success'){if(typeof showMessage==='function')showMessage(text,type);else console.log(text)}
  function canManage(){return typeof isParentLoggedIn==='function'&&isParentLoggedIn()}

  async function compressPhoto(file){
    if(!file)return null;
    if(file.size<=5*1024*1024 && /^image\/(jpeg|png|webp)$/i.test(file.type))return file;
    return new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onerror=()=>reject(new Error('Foto kon niet worden gelezen.'));
      reader.onload=()=>{
        const img=new Image();
        img.onerror=()=>reject(new Error('Foto kon niet worden geopend.'));
        img.onload=()=>{
          const max=1800,scale=Math.min(1,max/Math.max(img.naturalWidth||1,img.naturalHeight||1));
          const canvas=document.createElement('canvas');
          canvas.width=Math.max(1,Math.round((img.naturalWidth||1)*scale));
          canvas.height=Math.max(1,Math.round((img.naturalHeight||1)*scale));
          canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
          canvas.toBlob(blob=>{
            if(!blob)return reject(new Error('Foto kon niet worden verkleind.'));
            resolve(new File([blob],'bronfoto.jpg',{type:'image/jpeg',lastModified:Date.now()}));
          },'image/jpeg',.82);
        };
        img.src=reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function uploadForLesson(lessonId,file){
    if(!canManage())throw new Error('Log eerst in als ouder.');
    if(!lessonId||!file)throw new Error('Geen les of foto geselecteerd.');
    const prepared=await compressPhoto(file);
    const ext=prepared.type==='image/png'?'png':'jpg';
    const path='lessons/'+String(lessonId)+'/'+crypto.randomUUID()+'.'+ext;
    const upload=await db.storage.from(BUCKET).upload(path,prepared,{contentType:prepared.type,cacheControl:'31536000',upsert:false});
    if(upload.error)throw upload.error;
    const createdBy=typeof currentSession!=='undefined'?(currentSession?.user?.id||null):null;
    const inserted=await db.from('lesson_photos').insert({lesson_id:Number(lessonId),storage_path:path,original_name:file.name||'bronfoto',mime_type:prepared.type,size_bytes:prepared.size,created_by:createdBy}).select('id,lesson_id,storage_path,original_name,mime_type,size_bytes,created_at').single();
    if(inserted.error){await db.storage.from(BUCKET).remove([path]);throw inserted.error}
    return inserted.data;
  }

  async function loadPhotos(lessonId){
    if(!lessonId||!canManage())return [];
    const res=await db.from('lesson_photos').select('id,lesson_id,storage_path,original_name,mime_type,size_bytes,created_at').eq('lesson_id',Number(lessonId)).order('created_at',{ascending:true});
    if(res.error){console.error('Lesson photo load error:',res.error);return []}
    const rows=res.data||[];
    if(!rows.length)return [];
    const signed=await db.storage.from(BUCKET).createSignedUrls(rows.map(x=>x.storage_path),3600);
    if(signed.error){console.error('Lesson photo signed URL error:',signed.error);return rows.map(x=>({...x,url:''}))}
    return rows.map((x,i)=>({...x,url:signed.data?.[i]?.signedUrl||''}));
  }

  async function deletePhoto(id,path){
    if(!canManage())return;
    if(!confirm('Deze bronfoto verwijderen?'))return;
    const removed=await db.storage.from(BUCKET).remove([path]);
    if(removed.error){msg('Foto verwijderen uit opslag mislukt: '+removed.error.message,'error');return}
    const row=await db.from('lesson_photos').delete().eq('id',Number(id));
    if(row.error){msg('De foto is uit Storage verwijderd, maar de koppeling kon niet worden verwijderd.','error');return}
    msg('Bronfoto verwijderd.','success');
    await renderLessonPhotos(currentLesson?.id);
  }

  async function renderLessonPhotos(lessonId){
    const panel=document.getElementById('lessonPhotosPanel');
    if(!panel)return;
    if(!canManage()||!lessonId){panel.classList.add('hidden');return}
    panel.classList.remove('hidden');
    panel.innerHTML='<div class="small">📷 Bronfoto\'s laden...</div>';
    const photos=await loadPhotos(lessonId);
    if(!photos.length){
      panel.innerHTML='<div class="lesson-photos-head"><div><h3>📷 Bronfoto</h3><div class="small">Aan deze les is nog geen bronfoto gekoppeld.</div></div><button type="button" class="secondary" onclick="openExistingLessonPhotoPicker()">➕ Foto toevoegen</button></div>';
      return;
    }
    panel.innerHTML='<div class="lesson-photos-head"><div><h3>📷 Bronfoto'+(photos.length===1?'':"'s")+'</h3><div class="small">Opgeslagen in PacoGO Storage.</div></div><button type="button" class="secondary" onclick="openExistingLessonPhotoPicker()">➕ Foto toevoegen</button></div><div class="lesson-photos-grid">'+photos.map(p=>'<figure class="lesson-photo-card">'+(p.url?'<a href="'+esc(p.url)+'" target="_blank" rel="noopener"><img src="'+esc(p.url)+'" alt="Bronfoto"></a>':'<div class="lesson-photo-missing">Foto niet beschikbaar</div>')+'<figcaption><span>'+esc(p.original_name||'Bronfoto')+'</span><button type="button" class="danger" onclick="deleteLessonPhoto('+Number(p.id)+','+JSON.stringify(p.storage_path)+')">🗑️ Verwijderen</button></figcaption></figure>').join('')+'</div>';
  }

  async function addPhotoToCurrentLesson(file){
    if(!canManage()||!currentLesson||!file)return;
    try{
      msg('📷 Foto wordt opgeslagen...','success');
      await uploadForLesson(currentLesson.id,file);
      await renderLessonPhotos(currentLesson.id);
      msg('📷 Bronfoto opgeslagen bij de les.','success');
    }catch(error){
      console.error('Lesson photo upload error:',error);
      msg('Foto opslaan mislukt: '+(error?.message||'onbekende fout'),'error');
    }
  }

  window.saveLessonSourcePhoto=uploadForLesson;
  window.deleteLessonPhoto=deletePhoto;
  window.openExistingLessonPhotoPicker=function(){
    if(!canManage()||!currentLesson)return;
    if(currentPhotoPicker){currentPhotoPicker.remove();currentPhotoPicker=null}
    const input=document.createElement('input');
    input.type='file';input.accept='image/*';input.capture='environment';input.style.display='none';
    input.onchange=async e=>{const file=e.target.files?.[0];if(file)await addPhotoToCurrentLesson(file);input.remove();currentPhotoPicker=null};
    document.body.appendChild(input);currentPhotoPicker=input;input.click();
  };

  function ensurePhotoUi(){
    const lessonView=document.getElementById('lessonView'),admin=document.getElementById('lessonAdminButtons');
    if(admin&&!document.getElementById('addLessonPhotoButton')){
      const button=document.createElement('button');
      button.id='addLessonPhotoButton';button.className='secondary';button.type='button';button.textContent='📷 Foto toevoegen';button.onclick=window.openExistingLessonPhotoPicker;admin.appendChild(button);
    }
    if(lessonView&&!document.getElementById('lessonPhotosPanel')){
      const panel=document.createElement('section');
      panel.id='lessonPhotosPanel';panel.className='lesson-photos-panel hidden';
      const content=document.getElementById('lessonContent');
      if(content)content.insertAdjacentElement('afterend',panel);else lessonView.appendChild(panel);
    }
    const addBtn=document.getElementById('addLessonPhotoButton');
    if(addBtn)addBtn.classList.toggle('hidden',!canManage());
  }

  window.syncLessonPhotoUi=function(lessonId){
    ensurePhotoUi();
    const addBtn=document.getElementById('addLessonPhotoButton');
    if(addBtn)addBtn.classList.toggle('hidden',!canManage()||!lessonId);
    if(lessonId)renderLessonPhotos(lessonId);else document.getElementById('lessonPhotosPanel')?.classList.add('hidden');
  };
  window.renderLessonPhotos=renderLessonPhotos;

  const style=document.createElement('style');
  style.textContent='.lesson-photos-panel{margin-top:18px;padding:18px 20px;background:#fffdf0;border:2px solid #f4e8a8;border-radius:20px;box-shadow:0 8px 18px rgba(16,43,87,.08)}.lesson-photos-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.lesson-photos-head h3{margin:0;font-family:"Baloo 2",Nunito,sans-serif;font-size:24px;color:#102b57}.lesson-photos-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}.lesson-photo-card{margin:0;background:#fff;border:1px solid #dce9f6;border-radius:16px;overflow:hidden}.lesson-photo-card a{display:block;background:#f7fbff}.lesson-photo-card img{display:block;width:100%;height:220px;object-fit:contain}.lesson-photo-card figcaption{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px;font-size:12px;color:#667894}.lesson-photo-card figcaption button{padding:7px 9px;font-size:12px}.lesson-photo-missing{height:220px;display:flex;align-items:center;justify-content:center;color:#667894;background:#f7fbff}@media(max-width:700px){.lesson-photos-head{align-items:flex-start;flex-direction:column}.lesson-photos-head button{width:100%}.lesson-photos-grid{grid-template-columns:1fr}.lesson-photo-card img,.lesson-photo-missing{height:260px}}';
  document.head.appendChild(style);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensurePhotoUi);else ensurePhotoUi();
})();

// TEST/refactor runtime bridge: capture the V4.78 classic-script bindings before
// entering the ES-module boundary. Top-level let/const bindings are intentionally
// exposed through getters so mutable application state is always read live.
const lessonSaveRuntimeBridge = Object.defineProperties({}, {
  document: { get: () => document },
  db: { get: () => db },
  currentSubject: { get: () => currentSubject, set: value => { currentSubject = value; } },
  currentLesson: { get: () => currentLesson, set: value => { currentLesson = value; } },
  currentSession: { get: () => currentSession },
  PARENT_IDS: { get: () => PARENT_IDS },
  lessons: { get: () => lessons },
  currentStudent: { get: () => currentStudent, set: value => { currentStudent = value; } },
  normalizeSubvakKey: { get: () => normalizeSubvakKey },
  renderTestCalendar: { get: () => renderTestCalendar },
  refreshPageSidebars: { get: () => refreshPageSidebars },
  showMessage: { get: () => showMessage },
  showHome: { get: () => showHome },
  loadLessons: { get: () => loadLessons },
  checkDictationSpelling: { get: () => checkDictationSpelling },
  upsertTestDate: { get: () => upsertTestDate },
  removeTestDate: { get: () => removeTestDate }
});

// Explicit runtime facade: saveLesson is callable synchronously by the legacy
// V4.78 inline handlers, but execution cannot enter the new runtime until the
// bootstrap readiness contract resolves. A bootstrap failure is propagated;
// the legacy implementation is never used as a fallback.
const lessonSaveRuntimeBootstrap = import('./src/features/lessons/lesson-save-runtime-bootstrap.js')
  .then(({ bootstrapLessonSaveRuntime }) => bootstrapLessonSaveRuntime({
    runtime: lessonSaveRuntimeBridge,
    target: window
  }));
window.pacoGOLessonSaveRuntimeReady = lessonSaveRuntimeBootstrap;
window.saveLesson = async function saveLessonRuntimeFacade(...args){
  const runtimeSaveLesson = await lessonSaveRuntimeBootstrap;
  return runtimeSaveLesson(...args);
};

// Guest lesson access runtime facade: the V4.78 guest assignment handler is
// exposed synchronously, but execution waits for the refactored guest bootstrap.
// There is deliberately no legacy fallback after bootstrap failure.
const lessonGuestAccessRuntimeBridge = Object.defineProperties({}, {
  requireParent: { get: () => requireParent },
  currentStudent: { get: () => currentStudent },
  db: { get: () => db },
  renderParentStudent: { get: () => renderParentStudent },
  showMessage: { get: () => showMessage }
});
const lessonGuestAccessRuntimeBootstrap = import('./src/features/lessons/lesson-guest-access-runtime-bootstrap.js')
  .then(({ bootstrapLessonGuestAccessRuntime }) => bootstrapLessonGuestAccessRuntime({
    runtime: lessonGuestAccessRuntimeBridge,
    target: window
  }));
window.pacoGOLessonGuestAccessRuntimeReady = lessonGuestAccessRuntimeBootstrap;
window.setGuestLesson = async function setGuestLessonRuntimeFacade(...args){
  const runtimeHandler = await lessonGuestAccessRuntimeBootstrap;
  return runtimeHandler.setGuestLesson(...args);
};

// Photo-to-lesson runtime facade: the V4.78 photo lesson creation handler is
// exposed synchronously, but execution waits for the refactored photo bootstrap.
// The bridge reads classic-script state live and reuses the existing source-photo
// storage function; there is deliberately no legacy fallback.
const lessonPhotoRuntimeBridge = Object.defineProperties({}, {
  requireParent: { get: () => requireParent },
  db: { get: () => db },
  loadLessons: { get: () => loadLessons },
  lessons: { get: () => lessons },
  setCurrentStudent: { get: () => value => { currentStudent = value; } },
  setCurrentSubject: { get: () => value => { currentSubject = value; } },
  setCurrentLesson: { get: () => value => { currentLesson = value; } },
  saveSourcePhoto: { get: () => window.saveLessonSourcePhoto },
  showParentDashboard: { get: () => showParentDashboard },
  showMessage: { get: () => showMessage }
});
const lessonPhotoRuntimeBootstrap = import('./src/features/lessons/lesson-photo-runtime-bootstrap.js')
  .then(({ bootstrapLessonPhotoRuntime }) => bootstrapLessonPhotoRuntime({
    runtime: lessonPhotoRuntimeBridge,
    target: window
  }));
window.pacoGOLessonPhotoRuntimeReady = lessonPhotoRuntimeBootstrap;
window.createLessonFromPhoto = async function createLessonFromPhotoRuntimeFacade(input){
  const runtimeHandler = await lessonPhotoRuntimeBootstrap;
  return runtimeHandler(input);
};

// Recovery runtime facade: the four V4.78 recovery handlers are exposed
// synchronously, but execution waits for the refactored recovery bootstrap.
// There is deliberately no legacy fallback after bootstrap failure.
const lessonRecoveryRuntimeBridge = Object.defineProperties({}, {
  requireParent: { get: () => requireParent },
  db: { get: () => db },
  currentLesson: { get: () => currentLesson, set: value => { currentLesson = value; } },
  currentSubject: { get: () => currentSubject, set: value => { currentSubject = value; } },
  currentStudent: { get: () => currentStudent, set: value => { currentStudent = value; } },
  parentSelectedStudent: { get: () => parentSelectedStudent },
  closeDeleteModal: { get: () => closeDeleteModal },
  closeArchiveModal: { get: () => closeArchiveModal },
  loadLessons: { get: () => loadLessons },
  showSubject: { get: () => showSubject },
  showParentDashboard: { get: () => showParentDashboard },
  renderParentDashboard: { get: () => renderParentDashboard },
  showMessage: { get: () => showMessage }
});

const lessonRecoveryRuntimeBootstrap = import('./src/features/lessons/lesson-recovery-runtime-bootstrap.js')
  .then(({ bootstrapLessonRecoveryRuntime }) => bootstrapLessonRecoveryRuntime({
    runtime: lessonRecoveryRuntimeBridge,
    target: window
  }));
window.pacoGOLessonRecoveryRuntimeReady = lessonRecoveryRuntimeBootstrap;
window.confirmDeleteLesson = async function confirmDeleteLessonRuntimeFacade(...args){
  const runtimeHandler = await lessonRecoveryRuntimeBootstrap;
  return runtimeHandler.confirmDeleteLesson(...args);
};
window.confirmArchiveLesson = async function confirmArchiveLessonRuntimeFacade(...args){
  const runtimeHandler = await lessonRecoveryRuntimeBootstrap;
  return runtimeHandler.confirmArchiveLesson(...args);
};
window.restoreArchivedLesson = async function restoreArchivedLessonRuntimeFacade(...args){
  const runtimeHandler = await lessonRecoveryRuntimeBootstrap;
  return runtimeHandler.restoreArchivedLesson(...args);
};
window.restoreDeletedLesson = async function restoreDeletedLessonRuntimeFacade(...args){
  const runtimeHandler = await lessonRecoveryRuntimeBootstrap;
  return runtimeHandler.restoreDeletedLesson(...args);
};