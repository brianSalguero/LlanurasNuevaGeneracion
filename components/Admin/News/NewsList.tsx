import { News } from '@/types/types';

type Props = {
  news: News[];
  onEdit: (item: News) => void;
  onDelete: (item: News) => void;
  onCreate?: () => void;
};

export default function NewsList({
  news,
  onEdit,
  onDelete,
  onCreate,
}: Props) {
  return (
    <div className="pt-10 space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
          Noticias
        </h2>

        {onCreate && (
          <button
            onClick={onCreate}
            className="bg-amber-500 hover:bg-amber-600 transition text-white font-bold px-5 py-2 rounded-xl shadow"
          >
            Añadir noticia
          </button>
        )}
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {news.map((item) => (
          <div
            key={item.id}
            className="
              flex items-center gap-4
              bg-slate-100 dark:bg-slate-900
              rounded-xl p-3 sm:p-4
              shadow-sm hover:shadow-md
              transition
            "
          >
            {/* IMAGE */}
            {item.imagen && (
              <img
                src={item.imagen}
                className="
                  w-14 h-14 sm:w-20 sm:h-20
                  object-cover rounded-lg
                  flex-shrink-0
                "
              />
            )}

            {/* CONTENT */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-amber-500 truncate">
                {item.titulo}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                {item.descripcion}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit(item)}
                className="
                  px-3 py-1 text-sm
                  bg-blue-500 hover:bg-blue-600
                  text-white rounded-lg
                  transition
                "
              >
                Editar
              </button>

              <button
                onClick={() => onDelete(item)}
                className="
                  px-3 py-1 text-sm
                  bg-red-500 hover:bg-red-600
                  text-white rounded-lg
                  transition
                "
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}