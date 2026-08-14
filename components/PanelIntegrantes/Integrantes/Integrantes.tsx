"use client";

type Integrante = {
    id: number;
    nombre: string;
    apellido: string;
    rol: string;
    imagen?: string | null;
};

type Props = {
    integrantes: Integrante[];
};

export default function MembersPage({ integrantes }: Props) {
    return (
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 min-h-screen p-4 md:p-6">

            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
                    Integrantes
                </h1>

                <p className="mt-2 text-sm md:text-base text-slate-500 dark:text-slate-400">
                    Actualmente hay {integrantes.length} integrantes en el grupo.
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {integrantes.map((integrante) => (
                    <div
                        key={integrante.id}
                        className="
          bg-white
          dark:bg-slate-900
          rounded-2xl
          shadow-sm
          border
          border-slate-200
          dark:border-slate-800
          overflow-hidden
          hover:shadow-lg
          transition
        "
                    >
                        {/* Imagen */}
                        <div className="h-40 sm:h-52 lg:h-60 bg-slate-200 dark:bg-slate-800">
                            {integrante.imagen ? (
                                <img
                                    src={integrante.imagen}
                                    alt={integrante.nombre}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl sm:text-5xl font-bold text-slate-400">
                                    {integrante.nombre.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Datos */}
                        <div className="p-3 sm:p-5">

                            <h2 className="text-base sm:text-xl font-bold text-slate-800 dark:text-white leading-tight">
                                {integrante.nombre}
                            </h2>

                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                                {integrante.apellido}
                            </p>

                            <span
                                className="
              inline-block
              mt-3
              px-2.5
              py-1
              sm:px-3
              rounded-full
              bg-amber-500
              text-white
              text-xs
              sm:text-sm
              font-semibold
            "
                            >
                                {integrante.rol}
                            </span>

                        </div>
                    </div>
                ))}

            </div>

            {/* Sin integrantes */}
            {integrantes.length === 0 && (
                <div className="text-center mt-20 text-slate-500">
                    No hay integrantes registrados.
                </div>
            )}

        </div>
    );
}