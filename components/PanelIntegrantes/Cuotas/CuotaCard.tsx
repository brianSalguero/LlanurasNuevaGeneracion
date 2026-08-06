"use client";

type Integrante = {
    id: number;
    nombre: string;
    apellido: string;
    rol: string;
    imagen?: string | null;
    fecha_alta: Date;
};

type Props = {
    integrante: Integrante;
    cuotasPagadas: number;
    onClick: () => void;
};

export default function CuotaCard({
    integrante,
    cuotasPagadas,
    onClick,
}: Props) {
    const hoy = new Date();

    const anioActual = hoy.getFullYear();
    const anioAlta = new Date(integrante.fecha_alta).getFullYear();
    const mesAlta = new Date(integrante.fecha_alta).getMonth() + 1;

    const numMeses =
        anioAlta === anioActual
            ? 13 - mesAlta
            : 12;

    return (
        <button
            onClick={onClick}
            className="
        w-full
        bg-white
        dark:bg-slate-900
        border
        border-slate-200
        dark:border-slate-800
        rounded-3xl
        shadow-sm
        hover:shadow-lg
        hover:-translate-y-1
        transition
        p-4
        md:p-6
        text-left
    "
        >
            {/* Foto */}
            <div className="flex justify-center">

                {integrante.imagen ? (
                    <img
                        src={integrante.imagen}
                        alt={integrante.nombre}
                        className="
              w-20
              h-20
              md:w-28
              md:h-28
              rounded-full
              object-cover
              border-4
              border-amber-500
            "
                    />
                ) : (
                    <div
                        className="
              w-20
              h-20
              md:w-28
              md:h-28
              rounded-full
              bg-slate-300
              dark:bg-slate-700
              flex
              items-center
              justify-center
              text-3xl
              md:text-4xl
              font-bold
            "
                    >
                        {integrante.nombre.charAt(0)}
                    </div>
                )}

            </div>

            {/* Información */}
            <div className="mt-5 text-center">

                <h2 className="
text-lg
md:text-xl
font-bold
text-slate-800
dark:text-white
truncate
">
                    {integrante.nombre} {integrante.apellido}
                </h2>

                <p className="text-sm text-slate-500 mt-1 truncate">
                    {integrante.rol}
                </p>

            </div>

            {/* Resumen */}
            <div className="mt-4 md:mt-6">

                <div className="flex justify-between text-sm text-slate-500 mb-2">
                    <span>Cuotas pagadas</span>
                    <span>{cuotasPagadas}/{numMeses}</span>
                </div>

                <div className="
w-full
h-2.5
md:h-3
rounded-full
bg-slate-200
dark:bg-slate-700
overflow-hidden
">
                    <div
                        className="h-full bg-green-500 transition-all"
                        style={{
                            width: `${(cuotasPagadas / numMeses) * 100}%`,
                        }}
                    />
                </div>

                <div className="
mt-4
flex
flex-col
gap-3
sm:flex-row
sm:justify-between
sm:items-center
">

                    <div>
                        <p className="text-xs text-slate-500">
                            Total abonado
                        </p>

                        <p className="text-2xl font-bold text-green-600">
                            {cuotasPagadas * 5} €
                        </p>
                    </div>
                </div>
            </div>
        </button>
    );
}