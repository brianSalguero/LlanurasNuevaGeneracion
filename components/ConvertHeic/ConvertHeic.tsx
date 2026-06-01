import heic2any from "heic2any";

export const normalizeImage = async (file: File): Promise<File> => {
  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/HEIC" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic");

  if (!isHeic) return file;

  const converted = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.9,
  });

  const blob = Array.isArray(converted) ? converted[0] : converted;

  return new File(
    [blob],
    file.name.replace(/\.heic$/i, ".jpg"),
    { type: "image/jpeg" }
  );
};