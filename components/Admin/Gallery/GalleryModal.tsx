'use client';

import { useEffect, useState } from 'react';

type ImageItem = {
  file?: File;
  url: string;
  isNew: boolean;
  imagen_key: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  loading?: boolean;
  initialData?: any;
};

export default function GalleryModal({
  open,
  onClose,
  onSave,
  loading,
  initialData,
}: Props) {
  const [lugar, setLugar] = useState('');
  const [fecha, setFecha] = useState('');

  const [images, setImages] = useState<ImageItem[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [videoInput, setVideoInput] = useState('');
  const [initialImages, setInitialImages] = useState<ImageItem[]>([]);

  useEffect(() => {
    if (!open) return;

    setLugar(initialData?.lugar ?? '');
    setFecha(initialData?.fecha ?? '');

    const mapped = (initialData?.images ?? []).map((img: any) => ({
      url: img.url,
      imagen_key: img.imagen_key ?? null,
      isNew: false,
    }));

    setImages(mapped);
    setInitialImages(mapped);
    setVideos(initialData?.videos ?? []);
  }, [open, initialData]);

  if (!open) return null;

  const addImages = (files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true,
      imagen_key: null,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addVideo = () => {
    if (!videoInput.trim()) return;
    setVideos((prev) => [...prev, videoInput.trim()]);
    setVideoInput('');
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const newFiles = images.filter((i) => i.isNew && i.file).map((i) => i.file!);

    const existingImages = images
      .filter((i) => !i.isNew)
      .map((i) => ({ url: i.url, imagen_key: i.imagen_key }));

    const deletedImages = initialImages.filter(
      (init) => !images.find((img) => img.url === init.url)
    );

    onSave({
      id: initialData?.id,
      lugar,
      fecha,
      images: newFiles,
      existingImages,
      deletedImages,
      videos,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">

        {/* CLOSE */}
        <button onClick={onClose} className="absolute top-3 right-3 text-xl">
          ✕
        </button>

        <h2 className="text-xl font-bold text-amber-500 mb-4">
          {initialData ? 'Editar galería' : 'Nueva galería'}
        </h2>

        {/* INPUTS */}
        <input
          value={lugar}
          onChange={(e) => setLugar(e.target.value)}
          placeholder="Lugar"
          className="w-full p-3 mb-3 rounded bg-slate-100 dark:bg-slate-800"
        />

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-slate-100 dark:bg-slate-800 text-sm appearance-none"
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => addImages(e.target.files)}
          className="mb-3"
        />

        {/* 🖼️ IMÁGENES → SOLO 2 FILAS + SCROLL */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[180px] overflow-y-auto pr-2 mb-4">

          {images.map((img, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-lg group shadow-sm"
            >
              <div className="h-24 sm:h-28 md:h-32 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                <img
                  src={img.url}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* overlay suave */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />

              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-red-500 text-white rounded-full text-sm sm:text-base leading-none shadow-md hover:bg-red-600 transition"
              >
                ✕
              </button>
            </div>
          ))}

        </div>

        {/* 🎥 VIDEOS */}
        <div className="flex gap-2 mb-3">
          <input
            value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
            placeholder="URL YouTube"
            className="flex-1 p-2 rounded bg-slate-100 dark:bg-slate-800 text-center"
          />

          <button
            onClick={addVideo}
            className="bg-slate-700 text-white px-3 rounded"
          >
            +
          </button>
        </div>

        {/* VIDEOS LIST → SOLO 3 VISIBLE + SCROLL */}
        <div className="max-h-[120px] overflow-y-auto space-y-2 mb-4 pr-1">

          {videos.map((v, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 bg-slate-200 dark:bg-slate-700 rounded"
            >
              <p className="text-xs truncate w-full text-center px-2">
                {v}
              </p>

              <button
                onClick={() => removeVideo(i)}
                className="text-red-500 ml-2"
              >
                ✕
              </button>
            </div>
          ))}

        </div>

        {/* SAVE */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-amber-500 py-3 rounded-xl font-bold"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>

      </div>
    </div>
  );
}