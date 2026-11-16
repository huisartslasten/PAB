export function isAgendaImageFile(file) {
  return Boolean(file && String(file.type || '').startsWith('image/'));
}

export function isAgendaVideoFile(file) {
  return Boolean(file && String(file.type || '').startsWith('video/'));
}

export function agendaMediaKind(file) {
  if (isAgendaImageFile(file)) return 'image';
  if (isAgendaVideoFile(file)) return 'video';
  return 'unknown';
}

export function imageDimensionsForWidth(width, height, maxWidth = 1280) {
  const w = Number(width) || 0;
  const h = Number(height) || 0;
  if (!w || !h) return { width: 1, height: 1, scale: 1 };
  const scale = Math.min(1, Number(maxWidth) / w);
  return {
    width: Math.max(1, Math.round(w * scale)),
    height: Math.max(1, Math.round(h * scale)),
    scale
  };
}

export function createAgendaMediaReader({ FileReaderClass = globalThis.FileReader, ImageClass = globalThis.Image } = {}) {
  async function imageToDataUrl(file, maxWidth = 1280) {
    if (!isAgendaImageFile(file)) throw new Error('Expected an image file.');
    if (!FileReaderClass || !ImageClass) throw new Error('Image reader is unavailable.');

    return new Promise((resolve, reject) => {
      const reader = new FileReaderClass();
      reader.onerror = () => reject(new Error('Bestand kon niet worden gelezen.'));
      reader.onload = () => {
        const image = new ImageClass();
        image.onload = () => {
          const size = imageDimensionsForWidth(image.naturalWidth, image.naturalHeight, maxWidth);
          const canvas = document.createElement('canvas');
          canvas.width = size.width;
          canvas.height = size.height;
          const context = canvas.getContext('2d', { willReadFrequently: true });
          context.drawImage(image, 0, 0, size.width, size.height);
          resolve(canvas.toDataURL('image/jpeg', 0.78));
        };
        image.onerror = () => reject(new Error('Afbeelding kon niet worden geopend.'));
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function videoFrameToDataUrl(video, time, maxWidth = 1280) {
    if (!video) throw new Error('Video element is required.');
    await new Promise(resolve => {
      const onSeek = () => {
        video.removeEventListener('seeked', onSeek);
        resolve();
      };
      video.addEventListener('seeked', onSeek);
      video.currentTime = time;
    });
    const width = video.videoWidth || 720;
    const height = video.videoHeight || 1280;
    const size = imageDimensionsForWidth(width, height, maxWidth);
    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(video, 0, 0, size.width, size.height);
    return canvas.toDataURL('image/jpeg', 0.78);
  }

  return Object.freeze({ imageToDataUrl, videoFrameToDataUrl });
}
