"use client";

import { useEffect, useState } from "react";

type Integrante = {
    id: number;
    nombre: string;
    apellido: string;
    rol: string;
    imagen?: string | null;
    fecha_alta: Date;
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

    useEffect(() => {
        if (!integrante) return;

        const pagados = cuotas
            .filter(
                (c) =>
                    c.integrante_id === integrante.id &&
                    c.anio === anioSeleccionado
            )
            .map((c) => c.mes);

        setSeleccionados(pagados);
    }, [integrante, cuotas, anioSeleccionado]);

    if (!open || !integrante) return null;

    const toggleMes = (mes: number) => {
        if (seleccionados.includes(mes)) {
            setSeleccionados((prev) => prev.filter((m) => m !== mes));
        } else {
            setSeleccionados((prev) => [...prev, mes]);
        }
    };

    const guardar = async () => {
        setGuardando(true);

        await onGuardar(anioSeleccionado, seleccionados);

        setGuardando(false);
        onClose();
    };

    const fechaAlta = new Date(integrante.fecha_alta);
    const anioAlta = fechaAlta.getFullYear();
    const mesAlta = fechaAlta.getMonth() + 1;

    const anioActual = new Date().getFullYear();
    const anios = [];

    for (let a = anioAlta; a <= anioActual + 2; a++) {
        anios.push(a);
    }
    return (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">

            <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl">

                {/* Header */}
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
                                {integrante.nombre} {integrante.apellido}
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

                {/* Contenido */}
                <div className="p-6">

                    <div className="flex justify-between mb-6">

                        <div>

                            <p className="text-sm text-slate-500 mb-2">
                                Año
                            </p>

                            <select
                                value={anioSeleccionado}
                                onChange={(e) => setAnioSeleccionado(Number(e.target.value))}
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
                                    <option key={anio} value={anio}>
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

                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                        {meses.map((mes) => {
                            const deshabilitado =
                                anioSeleccionado < anioAlta ||
                                (anioSeleccionado === anioAlta && mes.id < mesAlta);

                            // Está pagada en la base de datos
                            const pagada = seleccionados.includes(mes.id);

                            return (
                                <button
                                    key={mes.id}
                                    disabled={deshabilitado}
                                    onClick={() => !deshabilitado && toggleMes(mes.id)}
                                    className={`
          h-20
          rounded-2xl
          font-semibold
          transition
          border-2
          ${deshabilitado
                                            ? "bg-slate-200 dark:bg-slate-800 text-slate-400 border-transparent cursor-not-allowed"
                                            : pagada
                                                ? "bg-green-500 border-green-500 text-white"
                                                : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:bg-amber-500 hover:border-amber-500 hover:text-white"
                                        }
        `}
                                >
                                    {mes.nombre}
                                </button>
                            );
                        })}
                    </div>

                </div>

                {/* Footer */}
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
                        className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold"
                    >
                        {guardando ? "Guardando..." : "Guardar cambios"}
                    </button>

                </div>

            </div>

        </div>
    );
}