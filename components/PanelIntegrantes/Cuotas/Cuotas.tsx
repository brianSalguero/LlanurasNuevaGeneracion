"use client";

import { useEffect, useState } from "react";
import CuotaCard from "./CuotaCard";
import CuotasModal from "./CuotasModal";

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
    integrantes: Integrante[];

    session: {
        id: number;
        nombre: string;
        apellido?: string;
        imagen?: string | null;
        rol?: string;
    };
};

export default function Cuotas({ integrantes, session }: Props) {
    const [busqueda, setBusqueda] = useState("");
    const [cuotas, setCuotas] = useState<Cuota[]>([]);
    const [integranteSeleccionado, setIntegranteSeleccionado] =
        useState<Integrante | null>(null);

    // =========================
    // Cargar cuotas
    // =========================

    const cargarCuotas = async () => {
        try {
            const res = await fetch("/api/cuotas");
            const data = await res.json();

            if (res.ok) {
                setCuotas(data.cuotas);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        cargarCuotas();
    }, []);

    // =========================
    // Contar cuotas pagadas
    // =========================

    const cuotasPagadas = (integranteId: number) => {
        const integrante = integrantes.find(
            (i) => i.id === integranteId
        );

        if (!integrante) return 0;

        const anioActual = new Date().getFullYear();

        /*
         * Si tiene inicio_cuotas utilizamos esa fecha.
         * Si no tiene, utilizamos fecha_alta.
         */
        const fechaInicio = integrante.inicio_cuotas
            ? new Date(integrante.inicio_cuotas)
            : new Date(integrante.fecha_alta);

        const anioInicio = fechaInicio.getFullYear();
        const mesInicio = fechaInicio.getMonth() + 1;

        /*
         * Contamos únicamente las cuotas del año actual
         * que estén dentro del período que le corresponde.
         */
        return cuotas.filter((c) => {
            if (c.integrante_id !== integranteId) {
                return false;
            }

            if (c.anio !== anioActual) {
                return false;
            }

            /*
             * Si empieza las cuotas este mismo año,
             * no contamos enero, febrero, etc. anteriores
             * a su mes de inicio.
             */
            if (
                anioInicio === anioActual &&
                c.mes < mesInicio
            ) {
                return false;
            }

            /*
             * Si el inicio de cuotas es posterior al año actual,
             * todavía no debería tener cuotas.
             */
            if (anioInicio > anioActual) {
                return false;
            }

            return true;
        }).length;
    };

    // =========================
    // Registrar cuota
    // =========================

    const guardarMeses = async (
        anio: number,
        meses: number[]
    ) => {
        if (!integranteSeleccionado) return;

        try {
            // Id del usuario que está realizando la operación
            const responsable_id = session.id;

            // Cuotas actuales del integrante para ese año
            const cuotasActuales = cuotas.filter(
                (c) =>
                    c.integrante_id === integranteSeleccionado.id &&
                    c.anio === anio
            );

            // INSERTAR las nuevas
            for (const mes of meses) {
                const existe = cuotasActuales.some(
                    (c) => c.mes === mes
                );

                if (!existe) {
                    await fetch("/api/cuotas", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            integrante_id:
                                integranteSeleccionado.id,
                            mes,
                            anio,
                            responsable_id,
                        }),
                    });
                }
            }

            // ELIMINAR las desmarcadas
            for (const cuota of cuotasActuales) {
                const sigueSeleccionada =
                    meses.includes(cuota.mes);

                if (!sigueSeleccionada) {
                    await fetch("/api/cuotas", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            integrante_id:
                                integranteSeleccionado.id,
                            mes: cuota.mes,
                            anio,
                            responsable_id,
                        }),
                    });
                }
            }

            await cargarCuotas();

        } catch (error) {
            console.error(error);
            alert("Ha ocurrido un error.");
        }
    };

    // =========================
    // Buscar
    // =========================

    const integrantesFiltrados = integrantes.filter((i) =>
        `${i.nombre} ${i.apellido}`
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    return (
        <>
            <div className="flex-1 min-h-screen bg-slate-100 dark:bg-slate-950 p-6">

                {/* Header */}
                <div className="mb-8">

                    <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
                        Registrar cuotas
                    </h1>

                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        Selecciona un integrante para registrar las cuotas.
                    </p>

                </div>

                {/* Buscador */}
                <div className="mb-8">

                    <input
                        type="text"
                        placeholder="Buscar integrante..."
                        value={busqueda}
                        onChange={(e) =>
                            setBusqueda(e.target.value)
                        }
                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-300
                            dark:border-slate-700
                            bg-white
                            dark:bg-slate-900
                            px-4
                            py-2.5
                            text-sm
                            outline-none
                            focus:border-amber-500
                            focus:ring-2
                            focus:ring-amber-500/20
                        "
                    />

                </div>

                {/* Cards */}
                <div
                    className="
                        grid
                        grid-cols-1
                        xs:grid-cols-2
                        sm:grid-cols-2
                        lg:grid-cols-3
                        xl:grid-cols-4
                        gap-4
                        md:gap-6
                    "
                >

                    {integrantesFiltrados.map((integrante) => (

                        <CuotaCard
                            key={integrante.id}
                            integrante={integrante}
                            cuotasPagadas={cuotasPagadas(
                                integrante.id
                            )}
                            onClick={() =>
                                setIntegranteSeleccionado(
                                    integrante
                                )
                            }
                        />

                    ))}

                </div>

            </div>

            {/* Modal */}
            {integranteSeleccionado && (

                <CuotasModal
                    open={!!integranteSeleccionado}
                    integrante={integranteSeleccionado}
                    cuotas={cuotas}
                    onClose={() =>
                        setIntegranteSeleccionado(null)
                    }
                    onGuardar={guardarMeses}
                />

            )}

        </>
    );
}