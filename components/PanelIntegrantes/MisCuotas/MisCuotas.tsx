"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
    session: {
        id: number;
        fecha_alta: Date;
    };
};

const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

export default function MisCuotas({ session }: Props) {
    const [cuotas, setCuotas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCuotas = async () => {
        const anio = new Date().getFullYear();

        const { data, error } = await supabase
            .from("cuotas")
            .select("*")
            .eq("integrante_id", session.id)
            .eq("anio", anio)
            .order("mes", { ascending: true });

        if (!error && data) {
            setCuotas(data);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchCuotas();
    }, []);

    const hoy = new Date();
    const anioActual = hoy.getFullYear();
    const mesActual = hoy.getMonth() + 1;
    const fechaAlta = new Date(session.fecha_alta);

    const anioAlta = fechaAlta.getFullYear();
    const mesAlta = fechaAlta.getMonth() + 1;


    const numMeses =
        anioAlta === anioActual
            ? 12 - mesAlta + 1
            : 12;

    const meses = useMemo(() => {

        return nombresMeses.map((nombre, index) => {

            const numeroMes = index + 1;

            const cuota = cuotas.find(
                (c) => c.mes === numeroMes
            );


            let estado: "pagado" | "actual" | "futuro" | "no_corresponde" =
                "futuro";


            // Antes de la fecha de alta
            if (
                anioAlta === anioActual &&
                numeroMes < mesAlta
            ) {
                estado = "no_corresponde";
            }

            else if (cuota) {
                estado = "pagado";
            }

            else if (numeroMes <= mesActual) {
                estado = "actual";
            }


            return {
                nombre,
                numeroMes,
                estado,
                cuota,
            };

        });

    }, [
        cuotas,
        mesActual,
        mesAlta,
        anioAlta,
        anioActual
    ]);

    const totalPagadas = cuotas.length;

    const porcentaje = Math.min(
        (totalPagadas / numMeses) * 100,
        100
    );

    const ultimaCuota =
        cuotas.length > 0 ? cuotas[cuotas.length - 1] : null;

    const proximaPendiente = meses.find(
        (m) => m.estado === "actual"
    );

    const estadoGeneral =
        proximaPendiente == null
            ? "✅ Al corriente"
            : "🕒 Cuotas pendientes";

    if (loading) {
        return (
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 min-h-screen flex items-center justify-center">
                <p className="text-slate-500">
                    Cargando cuotas...
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 min-h-screen p-6">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
                    Mis cuotas
                </h1>

                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base">
                    Consulta el estado de tus cuotas del grupo.
                </p>
            </div>

            {/* Resumen */}
            <div className="flex flex-col lg:flex-row justify-between gap-8">

                {/* Estado */}
                <div className="flex-1 min-w-0 text-center lg:text-left">

                    <p className="text-slate-500 text-sm">
                        Estado
                    </p>

                    <h2
                        className={`text-2xl md:text-3xl font-bold mt-2 ${proximaPendiente ? "text-red-500" : "text-green-600"
                            }`}
                    >
                        {estadoGeneral}
                    </h2>

                    <p className="text-slate-500 mt-4">
                        Última cuota pagada:
                        <span className="font-semibold text-slate-700 dark:text-white">
                            {" "}
                            {ultimaCuota
                                ? `${nombresMeses[ultimaCuota.mes - 1]} ${ultimaCuota.anio}`
                                : "Sin pagos"}
                        </span>
                    </p>

                    <p className="text-slate-500 mt-2">
                        Próxima cuota:
                        <span className="font-semibold text-slate-700 dark:text-white">
                            {" "}
                            {proximaPendiente
                                ? `${proximaPendiente.nombre} ${anioActual}`
                                : "Todas pagadas"}
                        </span>
                    </p>

                </div>


                {/* Progreso */}
                <div className="w-full lg:flex-1">

                    <p className="text-slate-500 text-sm mb-3 text-center lg:text-left">
                        Progreso anual
                    </p>

                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-4 overflow-hidden">

                        <div
                            className="bg-amber-500 h-4 rounded-full transition-all"
                            style={{ width: `${porcentaje}%` }}
                        />

                    </div>

                    <p className="mt-3 text-center lg:text-left font-semibold text-slate-700 dark:text-white">
                        {totalPagadas} / {numMeses} cuotas pagadas
                    </p>

                </div>

            </div>

            {/* Meses */}
            {/* Meses */}
<div className="mt-10">

    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        Año {anioActual}
    </h2>


    {/* MÓVIL */}
    <div className="md:hidden">

        <div className="
            bg-white
            dark:bg-slate-900
            rounded-3xl
            border
            border-slate-200
            dark:border-slate-800
            p-6
        ">

            <div className="flex justify-between items-center">

                <div>
                    <p className="text-sm text-slate-500">
                        Progreso de cuotas
                    </p>

                    <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                        {totalPagadas}/{numMeses}
                    </p>
                </div>


                <div className="
                    w-16
                    h-16
                    rounded-full
                    bg-green-100
                    dark:bg-green-950
                    flex
                    items-center
                    justify-center
                    text-green-600
                    font-bold
                ">
                    {Math.round(porcentaje)}%
                </div>

            </div>


            {/* Barra */}
            <div className="
                mt-6
                h-3
                bg-slate-200
                dark:bg-slate-700
                rounded-full
                overflow-hidden
            ">
                <div
                    className="
                        h-full
                        bg-green-500
                        transition-all
                    "
                    style={{
                        width: `${porcentaje}%`
                    }}
                />
            </div>



            {/* Meses pagados */}
            <div className="mt-6">

                <p className="text-sm text-slate-500 mb-3">
                    Meses pagados
                </p>


                <div className="flex flex-wrap gap-2">

                    {meses
                        .filter(m => m.estado === "pagado")
                        .map(m => (

                            <span
                                key={m.numeroMes}
                                className="
                                    px-3
                                    py-1.5
                                    rounded-full
                                    bg-green-100
                                    dark:bg-green-950
                                    text-green-700
                                    dark:text-green-400
                                    text-sm
                                    font-semibold
                                "
                            >
                                {m.nombre.slice(0,3)}
                            </span>

                        ))}


                    {totalPagadas === 0 && (
                        <span className="text-slate-500 text-sm">
                            Ninguna cuota pagada
                        </span>
                    )}

                </div>

            </div>



            {/* Próxima cuota */}
            <div className="
                mt-6
                pt-5
                border-t
                border-slate-200
                dark:border-slate-700
            ">

                <p className="text-sm text-slate-500">
                    Próxima cuota
                </p>


                <p className="mt-1 font-bold text-lg text-amber-500">

                    {proximaPendiente
                        ? `${proximaPendiente.nombre} ${anioActual}`
                        : "Todas pagadas 🎉"}

                </p>

            </div>


        </div>

    </div>




    {/* ESCRITORIO */}
    <div className="
        hidden
        md:grid
        gap-4
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
    ">

        {meses.map((mes) => {

            const styles =
                mes.estado === "no_corresponde"
                    ? "bg-slate-200 border-slate-300 dark:bg-slate-800 dark:border-slate-700 opacity-50"
                    : mes.estado === "pagado"
                        ? "bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-700"
                        : mes.estado === "actual"
                            ? "bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-700"
                            : "bg-slate-50 border-slate-300 dark:bg-slate-900 dark:border-slate-700";


            const texto =
                mes.estado === "no_corresponde"
                    ? "— No pertenecía al grupo"
                    : mes.estado === "pagado"
                        ? "✅ Pagada"
                        : mes.estado === "actual"
                            ? "🕒 Pendiente"
                            : "— Próximamente";


            return (
                <div
                    key={mes.numeroMes}
                    className={`
                        rounded-2xl
                        border
                        p-5
                        transition
                        hover:shadow-lg
                        ${styles}
                    `}
                >

                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                        {mes.nombre}
                    </h3>


                    <p className="mt-5 font-semibold">
                        {texto}
                    </p>


                    {mes.cuota && (
                        <>
                            <p className="mt-4 text-sm text-slate-500">
                                Pagada el{" "}
                                {new Date(mes.cuota.fecha)
                                    .toLocaleDateString("es-ES")}
                            </p>

                            <p className="mt-1 font-semibold text-green-600">
                                {Number(mes.cuota.importe).toFixed(2)} €
                            </p>
                        </>
                    )}

                </div>
            );

        })}

    </div>

</div>

            {/* Historial */}
            <div className="mt-10 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">

                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                    Historial de pagos
                </h2>

                {cuotas.length === 0 ? (

                    <div className="py-10 text-center text-slate-500">
                        Todavía no hay cuotas registradas.
                    </div>

                ) : (
                    <>
                        {/* Móvil */}
                        <div className="md:hidden space-y-4">

                            {[...cuotas]
                                .sort((a, b) =>
                                    a.anio !== b.anio ? b.anio - a.anio : b.mes - a.mes
                                )
                                .map((cuota) => (

                                    <div
                                        key={cuota.id}
                                        className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900"
                                    >
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Fecha</span>
                                            <span>
                                                {new Date(cuota.fecha).toLocaleDateString("es-ES")}
                                            </span>
                                        </div>

                                        <div className="flex justify-between mt-3 gap-4">
                                            <span className="text-slate-500">Concepto</span>

                                            <span className="font-medium text-right">
                                                Cuota {nombresMeses[cuota.mes - 1]} {cuota.anio}
                                            </span>
                                        </div>

                                        <div className="flex justify-between mt-3">
                                            <span className="text-slate-500">Importe</span>

                                            <span className="font-bold text-green-600">
                                                {Number(cuota.importe).toFixed(2)} €
                                            </span>
                                        </div>
                                    </div>

                                ))}

                        </div>

                        {/* Escritorio */}
                        <div className="hidden md:block overflow-x-auto">

                            <table className="w-full">

                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                        <th className="text-left py-3">Fecha</th>
                                        <th className="text-left py-3">Concepto</th>
                                        <th className="text-right py-3">Importe</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {[...cuotas]
                                        .sort((a, b) =>
                                            a.anio !== b.anio ? b.anio - a.anio : b.mes - a.mes
                                        )
                                        .map((cuota) => (

                                            <tr
                                                key={cuota.id}
                                                className="border-b border-slate-100 dark:border-slate-800"
                                            >
                                                <td className="py-4">
                                                    {new Date(cuota.fecha).toLocaleDateString("es-ES")}
                                                </td>

                                                <td>
                                                    Cuota {nombresMeses[cuota.mes - 1]} {cuota.anio}
                                                </td>

                                                <td className="text-right font-semibold text-green-600">
                                                    {Number(cuota.importe).toFixed(2)} €
                                                </td>
                                            </tr>

                                        ))}

                                </tbody>

                            </table>

                        </div>
                    </>
                )}

            </div>

        </div>
    );
}