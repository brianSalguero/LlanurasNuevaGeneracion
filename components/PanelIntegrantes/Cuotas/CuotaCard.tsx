"use client";

type Integrante = {
    id: number;
    nombre: string;
    apellido: string;
    rol: string;
    imagen?: string | null;
    fecha_alta: Date;
    inicio_cuotas?: string | null;
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
    const mesActual = hoy.getMonth() + 1;

    /*
     * Fecha desde la que esta integrante debe pagar cuotas.
     *
     * Si tiene inicio_cuotas:
     *     usamos esa fecha.
     *
     * Si no tiene inicio_cuotas:
     *     usamos fecha_alta.
     */
    const fechaInicioCuotas = integrante.inicio_cuotas
        ? new Date(integrante.inicio_cuotas)
        : new Date(integrante.fecha_alta);

    const anioInicioCuotas = fechaInicioCuotas.getFullYear();
    const mesInicioCuotas = fechaInicioCuotas.getMonth() + 1;

    /*
     * Calculamos cuántos meses de cuotas corresponden
     * durante el año actual.
     *
     * Ejemplo:
     *
     * inicio_cuotas = agosto 2026
     *
     * Agosto
     * Septiembre
     * Octubre
     * Noviembre
     * Diciembre
     *
     * = 5 meses
     */
    let numMeses = 0;

    if (anioInicioCuotas < anioActual) {

        // Lleva pagando desde antes de este año.
        numMeses = 12;

    } else if (anioInicioCuotas === anioActual) {

        // Empieza este mismo año.
        numMeses = 13 - mesInicioCuotas;

    } else {

        // Todavía no ha comenzado a pagar.
        numMeses = 0;
    }

    /*
     * Evitamos que el número de cuotas pagadas
     * supere el número de cuotas que corresponden.
     */
    const cuotasPagadasValidas = Math.min(
        cuotasPagadas,
        numMeses
    );

    /*
     * Porcentaje de progreso.
     */
    const porcentaje =
        numMeses > 0
            ? (cuotasPagadasValidas / numMeses) * 100
            : 0;

    /*
     * Importe total pagado.
     */
    const totalAbonado = cuotasPagadasValidas * 5;

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

                <h2
                    className="
                        text-lg
                        md:text-xl
                        font-bold
                        text-slate-800
                        dark:text-white
                        truncate
                    "
                >
                    {integrante.nombre} {integrante.apellido}
                </h2>

                <p className="text-sm text-slate-500 mt-1 truncate">
                    {integrante.rol}
                </p>

            </div>


            {/* Resumen */}
            <div className="mt-4 md:mt-6">

                <div className="flex justify-between text-sm text-slate-500 mb-2">

                    <span>
                        Cuotas pagadas
                    </span>

                    <span>
                        {cuotasPagadasValidas}/{numMeses}
                    </span>

                </div>


                {/* Barra de progreso */}
                <div
                    className="
                        w-full
                        h-2.5
                        md:h-3
                        rounded-full
                        bg-slate-200
                        dark:bg-slate-700
                        overflow-hidden
                    "
                >

                    <div
                        className="h-full bg-green-500 transition-all"
                        style={{
                            width: `${porcentaje}%`,
                        }}
                    />

                </div>


                {/* Información del pago */}
                <div
                    className="
                        mt-4
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                        sm:justify-between
                        sm:items-center
                    "
                >

                    <div>

                        <p className="text-xs text-slate-500">
                            Total abonado
                        </p>

                        <p className="text-2xl font-bold text-green-600">
                            {totalAbonado.toFixed(2)} €
                        </p>

                    </div>

                </div>

            </div>

        </button>
    );
}