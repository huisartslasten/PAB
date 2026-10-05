const BUCKET = 'lesson-photos';

export function createPhotoStorageService(db, { canManage = () => true, idFactory = () => crypto.randomUUID() } = {}) {
  if (!db) throw new Error('Supabase client ontbreekt.');

  async function compressPhoto(file) {
    if (!file) return null;
    if (file.size <= 5 * 1024 * 1024 && /^image\/(jpeg|png|webp)$/i.test(file.type || '')) return file;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Foto kon niet worden gelezen.'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Foto kon niet worden geopend.'));
        img.onload = () => {
          const max = 1800;
          const scale = Math.min(1, max / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round((img.naturalWidth || 1) * scale));
          canvas.height = Math.max(1, Math.round((img.naturalHeight || 1) * scale));
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(blob => {
            if (!blob) return reject(new Error('Foto kon niet worden verkleind.'));
            resolve(new File([blob], 'bronfoto.jpg', { type: 'image/jpeg', lastModified: Date.now() }));
          }, 'image/jpeg', 0.82);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function uploadForLesson(lessonId, file, createdBy = null) {
    if (!canManage()) throw new Error('Log eerst in als ouder.');
    if (!lessonId || !file) throw new Error('Geen les of foto geselecteerd.');

    const prepared = await compressPhoto(file);
    const ext = prepared.type === 'image/png' ? 'png' : 'jpg';
    const path = `lessons/${String(lessonId)}/${idFactory()}.${ext}`;
    const upload = await db.storage.from(BUCKET).upload(path, prepared, {
      contentType: prepared.type,
      cacheControl: '31536000',
      upsert: false
    });

    if (upload.error) throw upload.error;

    const inserted = await db.from('lesson_photos').insert({
      lesson_id: Number(lessonId),
      storage_path: path,
      original_name: file.name || 'bronfoto',
      mime_type: prepared.type,
      size_bytes: prepared.size,
      created_by: createdBy
    }).select('id,lesson_id,storage_path,original_name,mime_type,size_bytes,created_at').single();

    if (inserted.error) {
      await db.storage.from(BUCKET).remove([path]);
      throw inserted.error;
    }
    return inserted.data;
  }

  async function listForLesson(lessonId) {
    if (!lessonId || !canManage()) return [];
    const result = await db.from('lesson_photos')
      .select('id,lesson_id,storage_path,original_name,mime_type,size_bytes,created_at')
      .eq('lesson_id', Number(lessonId))
      .order('created_at', { ascending: true });
    if (result.error) throw result.error;

    const rows = result.data || [];
    if (!rows.length) return [];

    const signed = await db.storage.from(BUCKET).createSignedUrls(rows.map(row => row.storage_path), 3600);
    if (signed.error) return rows.map(row => ({ ...row, url: '' }));
    return rows.map((row, index) => ({ ...row, url: signed.data?.[index]?.signedUrl || '' }));
  }

  async function remove(id, path) {
    if (!canManage()) return false;
    const storageResult = await db.storage.from(BUCKET).remove([path]);
    if (storageResult.error) throw storageResult.error;
    const rowResult = await db.from('lesson_photos').delete().eq('id', Number(id));
    if (rowResult.error) throw rowResult.error;
    return true;
  }

  return Object.freeze({ compressPhoto, uploadForLesson, listForLesson, remove });
}
