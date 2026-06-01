'use client';

import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: number;
    titulo: string;
    descripcion: string;
    image: File | null;
  }& { removeImage?: boolean }) => void;
  loading?: boolean;
  initialData?: {
    id?: number;
    titulo?: string;
    descripcion?: string;
    imagen?: string;
  } | null;
};

export default function NewsModal({
  open,
  onClose,
  onSave,
  loading,
  initialData,
}: Props) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitulo(initialData.titulo || '');
      setDescripcion(initialData.descripcion || '');
      setPreview(initialData.imagen || '');
      setRemoveImage(false);
    } else {
      setTitulo('');
      setDescripcion('');
      setImage(null);
      setPreview('');
      setRemoveImage(false);
    }
  }, [initialData, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl p-6 relative">

        <button onClick={onClose} className="absolute top-3 right-3 text-xl">
          ✕
        </button>

        <h2 className="text-xl font-bold text-amber-500 mb-4">
          {initialData ? 'Editar noticia' : 'Nueva noticia'}
        </h2>

        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título"
          className="w-full mb-3 p-3 rounded bg-slate-100 dark:bg-slate-800"
        />

        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
          rows={6}
          className="w-full mb-3 p-3 rounded bg-slate-100 dark:bg-slate-800"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setImage(file);
            if (file) setPreview(URL.createObjectURL(file));
          }}
          className="mb-3"
        />

        {preview && (
          <div className="relative mb-3">
            <img src={preview} className="w-full h-48 object-cover rounded mb-3" />

            <button
              onClick={() => {
                setImage(null);
                setPreview('');
                setRemoveImage(true);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              Quitar
            </button>
          </div>
        )}

        <button
          onClick={() => onSave({
            id: (initialData as any)?.id, titulo, descripcion, image, removeImage,
          })}
          disabled={loading}
          className="w-full bg-amber-500 py-3 rounded-xl font-bold disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}