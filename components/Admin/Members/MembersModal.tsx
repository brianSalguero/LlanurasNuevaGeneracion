'use client';

import { useEffect, useState } from 'react';

type MemberForm = {
  id?: number;
  nombre: string;
  apellido: string;
  rol: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  image: File | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: MemberForm & { removeImage?: boolean }) => void;
  loading?: boolean;
  initialData?: {
    id?: number;
    nombre?: string;
    apellido?: string;
    rol?: string;
    instagram?: string | null;
    facebook?: string | null;
    tiktok?: string | null;
    imagen?: string | null;
  } | null;
};

export default function MembersModal({
  open,
  onClose,
  onSave,
  loading = false,
  initialData,
}: Props) {
  const [form, setForm] = useState<MemberForm>({
    nombre: '',
    apellido: '',
    rol: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    image: null,
  });

  const [preview, setPreview] = useState<string>('');
  const [removeImage, setRemoveImage] = useState(false);
  // =========================
  // INIT / EDIT MODE
  // =========================
  useEffect(() => {
    if (open && initialData) {
      setForm({
        id: initialData.id,
        nombre: initialData.nombre || '',
        apellido: initialData.apellido || '',
        rol: initialData.rol || '',
        instagram: initialData.instagram ?? '',
        facebook: initialData.facebook ?? '',
        tiktok: initialData.tiktok ?? '',
        image: null,
      });

      setPreview(initialData.imagen || '');
      setRemoveImage(false);
    }

    if (open && !initialData) {
      setForm({
        nombre: '',
        apellido: '',
        rol: '',
        instagram: '',
        facebook: '',
        tiktok: '',
        image: null,
      });

      setPreview('');
      setRemoveImage(false);
    }
  }, [open, initialData]);

  // =========================
  // CLEAN OBJECT URL
  // =========================
  useEffect(() => {
    return () => {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (!open) return null;

  const updateField = (key: keyof MemberForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl p-6 relative shadow-2xl">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl"
        >
          ✕
        </button>

        {/* TITLE */}
        <h2 className="text-xl font-bold text-amber-500 mb-4">
          {initialData ? 'Editar integrante' : 'Nuevo integrante'}
        </h2>

        {/* INPUTS */}
        <div className="space-y-3">
          <input
            value={form.nombre}
            onChange={(e) => updateField('nombre', e.target.value)}
            placeholder="Nombre"
            className="w-full p-3 rounded bg-slate-100 dark:bg-slate-800"
          />

          <input
            value={form.apellido}
            onChange={(e) => updateField('apellido', e.target.value)}
            placeholder="Apellido"
            className="w-full p-3 rounded bg-slate-100 dark:bg-slate-800"
          />

          <input
            value={form.rol}
            onChange={(e) => updateField('rol', e.target.value)}
            placeholder="Rol"
            className="w-full p-3 rounded bg-slate-100 dark:bg-slate-800"
          />

          <input
            value={form.instagram}
            onChange={(e) => updateField('instagram', e.target.value)}
            placeholder="Instagram"
            className="w-full p-3 rounded bg-slate-100 dark:bg-slate-800"
          />

          <input
            value={form.facebook}
            onChange={(e) => updateField('facebook', e.target.value)}
            placeholder="Facebook"
            className="w-full p-3 rounded bg-slate-100 dark:bg-slate-800"
          />

          <input
            value={form.tiktok}
            onChange={(e) => updateField('tiktok', e.target.value)}
            placeholder="TikTok"
            className="w-full p-3 rounded bg-slate-100 dark:bg-slate-800"
          />
        </div>

        {/* IMAGE */}
        <input
          type="file"
          accept="image/*"
          className="mt-4 mb-3"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            updateField('image', file);

            if (file) {
              const url = URL.createObjectURL(file);
              setPreview(url);
            }
          }}
        />

        {preview && (
          <div className="relative mb-3">
            <img
              src={preview}
              className="w-full h-48 object-cover rounded"
            />

            <button
              onClick={() => {
                updateField('image', null);
                setPreview('');
                setRemoveImage(true);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              Quitar
            </button>
          </div>
        )}

        {/* SAVE */}
        <button
          onClick={() => onSave({ ...form, removeImage })}
          disabled={loading}
          className="w-full bg-amber-500 py-3 rounded-xl font-bold disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>

      </div>
    </div>
  );
}