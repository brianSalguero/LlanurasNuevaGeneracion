"use client";

import { useEffect, useState } from "react";

type Integrante = {
    id: number;
    nombre: string;
    apellido: string;
    rol: string;
    imagen?: string | null;
    fecha_alta: Date;
    inicio_cuotas?: string | null;
};

type Cuota = {
    integrante_id: number;
    mes: number;
    anio: number;
};

type Props = {
    open: boolean;
    onClose: () => void;
    integrante: Integrante | null;
    cuotas: Cuota[];
    onGuardar: (
        anio: number,
        meses: number[]
    ) => Promise<void>;
};

const meses = [
    { id: 1, nombre: "Enero" },
    { id: 2, nombre: "Febrero" },
    { id: 3, nombre: "Marzo" },
    { id: 4, nombre: "Abril" },
    { id: 5, nombre: "Mayo" },
    { id: 6, nombre: "Junio" },
    { id: 7, nombre: "Julio" },
    { id: 8, nombre: "Agosto" },
    { id: 9, nombre: "Septiembre" },
    { id: 10, nombre: "Octubre" },
    { id: 11, nombre: "Noviembre" },
    { id: 12, nombre: "Diciembre" },
];

export default function CuotasModal({
    open,
    onClose,
    integrante,
    cuotas,
    onGuardar,
}: Props) {

    const [seleccionados, setSeleccionados] = useState<number[]>([]);
    const [guardando, setGuardando] = useState(false);

    const [anioSeleccionado, setAnioSeleccionado] = useState(
        new Date().getFullYear()
    );

    // =========================
    // Fecha de inicio de cuotas
    // =========================

    const fechaInicioCuotas = integrante?.inicio_cuotas
        ? new Date(integrante.inicio_cuotas)
        : integrante
            ? new Date(integrante.fecha_alta)
            : null;

    const anioInicioCuotas = fechaInicioCuotas
        ? fechaInicioCuotas.getFullYear()
        : 0;

    const mesInicioCuotas = fechaInicioCuotas
        ? fechaInicioCuotas.getMonth() + 1
        : 1;


    // =========================
    // Cargar cuotas pagadas
    // =========================

    useEffect(() => {

        if (!integrante) return;

        const pagados = cuotas
            .filter((c) => {

                // Pertenece al integrante
                if (c.integrante_id !== integrante.id) {
                    return false;
                }

                // Pertenece al año seleccionado
                if (c.anio !== anioSeleccionado) {
                    return false;
                }

                /*
                 * Si el año seleccionado es el año
                 * en el que comenzaron sus cuotas,
                 * ignoramos meses anteriores.
                 */
                if (
                    anioSeleccionado === anioInicioCuotas &&
                    c.mes < mesInicioCuotas
                ) {
                    return false;
                }

                /*
                 * Si el año seleccionado es anterior
                 * al inicio de sus cuotas, no hay cuotas.
                 */
                if (anioSeleccionado < anioInicioCuotas) {
                    return false;
                }

                return true;
            })
            .map((c) => c.mes);

        setSeleccionados(pagados);

    }, [
        integrante,
        cuotas,
        anioSeleccionado,
        anioInicioCuotas,
        mesInicioCuotas,
    ]);


    if (!open || !integrante) return null;


    // =========================
    // Cambiar estado de un mes
    // =========================

    const toggleMes = (mes: number) => {

        /*
         * No permitimos modificar meses anteriores
         * al inicio de cuotas.
         */
        const mesDeshabilitado =
            anioSeleccionado < anioInicioCuotas ||
            (
                anioSeleccionado === anioInicioCuotas &&
                mes < mesInicioCuotas
            );

        if (mesDeshabilitado) return;

        if (seleccionados.includes(mes)) {

            setSeleccionados((prev) =>
                prev.filter((m) => m !== mes)
            );

        } else {

            setSeleccionados((prev) => [
                ...prev,
                mes,
            ]);

        }
    };


    // =========================
    // Guardar
    // =========================

    const guardar = async () => {

        setGuardando(true);

        try {

            await onGuardar(
                anioSeleccionado,
                seleccionados
            );

            onClose();

        } finally {

            setGuardando(false);

        }
    };


    // =========================
    // Años disponibles
    // =========================

    const fechaAlta = new Date(
        integrante.fecha_alta
    );

    const anioAlta = fechaAlta.getFullYear();

    const anioActual = new Date().getFullYear();

    const anios: number[] = [];

    for (
        let a = anioAlta;
        a <= anioActual + 2;
        a++
    ) {
        anios.push(a);
    }


    // =========================
    // Render
    // =========================

    return (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">

            <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl">

                {/* ================= HEADER ================= */}

                <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">

                    <div className="flex items-center gap-4">

                        {integrante.imagen ? (

                            <img
                                src={integrante.imagen}
                                alt={integrante.nombre}
                                className="w-16 h-16 rounded-full object-cover"
                            />

                        ) : (

                            <div className="w-16 h-16 rounded-full bg-slate-300 flex items-center justify-center font-bold text-2xl">
                                {integrante.nombre[0]}
                            </div>

                        )}

                        <div>

                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                                {integrante.nombre}{" "}
                                {integrante.apellido}
                            </h2>

                            <p className="text-slate-500">
                                {integrante.rol}
                            </p>

                        </div>

                    </div>

                    <button
                        onClick={onClose}
                        className="text-3xl leading-none text-slate-500 hover:text-red-500 transition"
                    >
                        ×
                    </button>

                </div>


                {/* ================= CONTENIDO ================= */}

                <div className="p-6">

                    {/* Año + total */}

                    <div className="flex justify-between mb-6">

                        <div>

                            <p className="text-sm text-slate-500 mb-2">
                                Año
                            </p>

                            <select
                                value={anioSeleccionado}
                                onChange={(e) =>
                                    setAnioSeleccionado(
                                        Number(e.target.value)
                                    )
                                }
                                className="
                                    rounded-xl
                                    border
                                    border-slate-300
                                    dark:border-slate-700
                                    bg-white
                                    dark:bg-slate-800
                                    px-4
                                    py-2
                                    font-semibold
                                "
                            >

                                {anios.map((anio) => (

                                    <option
                                        key={anio}
                                        value={anio}
                                    >
                                        {anio}
                                    </option>

                                ))}

                            </select>

                        </div>


                        <div className="text-right">

                            <p className="text-sm text-slate-500">
                                Total abonado
                            </p>

                            <p className="text-2xl font-bold text-green-600">
                                {seleccionados.length * 5} €
                            </p>

                        </div>

                    </div>


                    {/* ================= MESES ================= */}

                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">

                        {meses.map((mes) => {

                            const deshabilitado =
                                anioSeleccionado < anioInicioCuotas ||
                                (
                                    anioSeleccionado ===
                                    anioInicioCuotas &&
                                    mes.id < mesInicioCuotas
                                );

                            const pagada =
                                seleccionados.includes(mes.id);


                            return (

                                <button
                                    key={mes.id}
                                    disabled={deshabilitado}
                                    onClick={() =>
                                        toggleMes(mes.id)
                                    }
                                    className={`
                                        h-20
                                        rounded-2xl
                                        font-semibold
                                        transition
                                        border-2

                                        ${
                                            deshabilitado
                                                ? `
                                                    bg-slate-200
                                                    dark:bg-slate-800
                                                    text-slate-400
                                                    border-transparent
                                                    cursor-not-allowed
                                                `
                                                : pagada
                                                    ? `
                                                        bg-green-500
                                                        border-green-500
                                                        text-white
                                                    `
                                                    : `
                                                        bg-white
                                                        dark:bg-slate-900
                                                        border-slate-300
                                                        dark:border-slate-700
                                                        hover:bg-amber-500
                                                        hover:border-amber-500
                                                        hover:text-white
                                                    `
                                        }
                                    `}
                                >
                                    {mes.nombre}
                                </button>

                            );

                        })}

                    </div>


                    {/* ================= INFORMACIÓN ================= */}

                    {anioSeleccionado === anioInicioCuotas && (

                        <p className="mt-5 text-sm text-slate-500">

                            Las cuotas comienzan en{" "}
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {meses[mesInicioCuotas - 1]?.nombre}
                            </span>
                            .

                        </p>

                    )}

                </div>


                {/* ================= FOOTER ================= */}

                <div className="flex justify-end gap-4 border-t border-slate-200 dark:border-slate-800 p-6">

                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-800"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={guardar}
                        disabled={guardando}
                        className="
                            px-6
                            py-3
                            rounded-xl
                            bg-amber-500
                            hover:bg-amber-600
                            text-white
                            font-bold
                            disabled:opacity-50
                        "
                    >
                        {guardando
                            ? "Guardando..."
                            : "Guardar cambios"}
                    </button>

                </div>

            </div>

        </div>
    );
}