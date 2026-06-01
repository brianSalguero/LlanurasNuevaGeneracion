import { Gallery } from '@/types/types';
import { useEffect } from 'react';

type Props = {
  galerias: Gallery[];
  onCreate?: () => void;
  onDelete?: (gallery: Gallery) => void;
  onEdit?: (gallery: Gallery) => void;
};

export default function GalleryList({
  galerias,
  onCreate,
  onDelete,
  onEdit,
}: Props) {
  return (
    <div className="pt-10 space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
          Galerías
        </h2>

        {onCreate && (
          <button
            onClick={onCreate}
            className="
              bg-amber-500 hover:bg-amber-600
              transition text-white font-bold
              px-5 py-2 rounded-xl shadow
            "
          >
            Añadir galería
          </button>
        )}
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {galerias.map((g) => (

          <div
            key={g.id}
            className="
              flex items-center justify-between
              bg-slate-100 dark:bg-slate-900
              rounded-xl p-3 sm:p-4
              shadow-sm hover:shadow-md
              transition
            "
          >

            {/* CONTENT */}
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-amber-500 truncate">
                {g.lugar}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300">
                {g.fecha}
              </p>
            </div>

            {/* STATS */}
            <div className="text-xs sm:text-sm text-slate-500 flex gap-3 flex-shrink-0">
              <span>📸 {g.imagenes?.length ?? 0}</span>
              <span>🎥 {g.videos?.length ?? 0}</span>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 ml-4">
              {onEdit && (
                <button
                  onClick={() => onEdit(g)}
                  className="
                    px-3 py-1 rounded-lg
                    bg-blue-500 hover:bg-blue-600
                    text-white text-sm
                    transition
                  "
                >
                  Editar
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(g)}
                  className="
                    px-3 py-1 rounded-lg
                    bg-red-500 hover:bg-red-600
                    text-white text-sm
                    transition
                  "
                >
                  Borrar
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}