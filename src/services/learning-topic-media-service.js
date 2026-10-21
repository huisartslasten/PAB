const BUCKET = 'lesson-photos';

export function createLearningTopicMediaService(db, { canManage = () => false, idFactory = () => crypto.randomUUID() } = {}) {
  if (!db) throw new Error('A Supabase client is required.');

  async function compressPhoto(file) {
    if (!file) return null;
    if (file.size <= 5 * 1024 * 1024 && /^image\/(jpeg|png|webp)$/i.test(file.type || '')) return file;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Afbeelding kon niet worden gelezen.'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Afbeelding kon niet worden geopend.'));
        img.onload = () => {
          const max = 1800;
          const scale = Math.min(1, max / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round((img.naturalWidth || 1) * scale));
          canvas.height = Math.max(1, Math.round((img.naturalHeight || 1) * scale));
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(blob => blob
            ? resolve(new File([blob], 'leerstofafbeelding.jpg', { type: 'image/jpeg', lastModified: Date.now() }))
            : reject(new Error('Afbeelding kon niet worden verkleind.')), 'image/jpeg', 0.82);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function uploadForTopic(topicId, file, createdBy = null) {
    if (!canManage()) throw new Error('Log eerst in als ouder.');
    if (!topicId || !file) throw new Error('Geen onderwerp of afbeelding geselecteerd.');
    const prepared = await compressPhoto(file);
    const ext = prepared.type === 'image/png' ? 'png' : 'jpg';
    const path = `learning-topics/${String(topicId)}/${idFactory()}.${ext}`;
    const upload = await db.storage.from(BUCKET).upload(path, prepared, { contentType: prepared.type, cacheControl: '31536000', upsert: false });
    if (upload.error) throw upload.error;
    const inserted = await db.from('learning_topic_media').insert({
      learning_topic_id: Number(topicId), storage_path: path, original_name: file.name || 'leerstofafbeelding',
      mime_type: prepared.type, size_bytes: prepared.size, created_by: createdBy
    }).select('id,learning_topic_id,storage_path,original_name,mime_type,size_bytes,created_at').single();
    if (inserted.error) {
      await db.storage.from(BUCKET).remove([path]);
      throw inserted.error;
    }
    return inserted.data;
  }

  async function getByIds(ids = [], { signedSeconds = 3600 } = {}) {
    const wanted = [...new Set((Array.isArray(ids) ? ids : []).map(Number).filter(Boolean))];
    if (!wanted.length) return [];
    const result = await db.from('learning_topic_media').select('id,learning_topic_id,storage_path,original_name,mime_type,size_bytes,created_at').in('id', wanted);
    if (result.error) throw result.error;
    const rows = result.data || [];
    if (!rows.length) return [];
    const signed = await db.storage.from(BUCKET).createSignedUrls(rows.map(row => row.storage_path), signedSeconds);
    if (signed.error) return rows.map(row => ({ ...row, url: '' }));
    const byPath = new Map((signed.data || []).map(item => [item.path, item.signedUrl || '']));
    return rows.map(row => ({ ...row, url: byPath.get(row.storage_path) || '' }));
  }

  async function remove(id) {
    if (!canManage()) return false;
    const found = await db.from('learning_topic_media').select('storage_path').eq('id', Number(id)).maybeSingle();
    if (found.error) throw found.error;
    if (!found.data) return false;
    const storage = await db.storage.from(BUCKET).remove([found.data.storage_path]);
    if (storage.error) throw storage.error;
    const deleted = await db.from('learning_topic_media').delete().eq('id', Number(id));
    if (deleted.error) throw deleted.error;
    return true;
  }

  async function removeForTopic(topicId) {
    if (!canManage()) throw new Error('Log eerst in als ouder.');
    const found = await db.from('learning_topic_media').select('id,storage_path').eq('learning_topic_id', Number(topicId));
    if (found.error) throw found.error;
    const rows = found.data || [];
    if (rows.length) {
      const storage = await db.storage.from(BUCKET).remove(rows.map(row => row.storage_path));
      if (storage.error) throw storage.error;
    }
    const deleted = await db.from('learning_topic_media').delete().eq('learning_topic_id', Number(topicId));
    if (deleted.error) throw deleted.error;
    return rows.length;
  }

  return Object.freeze({ compressPhoto, uploadForTopic, getByIds, remove, removeForTopic });
}
