export const convertToWebP = (file: File): Promise<Blob> =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/webp', 0.8);
    };
  });

export const normalizeImage = async (file: File): Promise<File> => {
  const isHeic =
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    file.name.toLowerCase().endsWith('.heic');

  if (!isHeic) return file;

  const heic2any = (await import('heic2any')).default;

  const converted = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.9,
  });

  const blob = Array.isArray(converted) ? converted[0] : converted;

  return new File([blob], file.name.replace(/\.heic$/i, '.jpg'), {
    type: 'image/jpeg',
  });
};

export const prepareImage = async (file: File) => {
  const normalized = await normalizeImage(file);
  const webp = await convertToWebP(normalized);

  return new File([webp], `${Date.now()}.webp`, {
    type: 'image/webp',
  });
};