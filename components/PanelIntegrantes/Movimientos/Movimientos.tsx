"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Modal from "@/components/PanelIntegrantes/Modal/Modal";

type DashboardProps = {
    session: {
        id: number;
        nombre: string;
        apellido?: string;
        imagen?: string | null;
        rol?: string;
    };
};

type Movimiento = {
    id: number;
    tipo: "ingreso" | "gasto" | "cuota";
    categoria: string;
    concepto: string;
    importe: number;
    observaciones?: string | null;
    fecha: string;
};

export default function Movimientos({ session }: DashboardProps) {
    const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const [openModal, setOpenModal] = useState(false);

    // FORMULARIO
    // Solo se pueden crear ingresos o gastos manualmente.
    const [tipo, setTipo] = useState<"ingreso" | "gasto">("ingreso");
    const [categoria, setCategoria] = useState("");
    const [concepto, setConcepto] = useState("");
    const [importe, setImporte] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [totalCuotas, setTotalCuotas] = useState(0);

    const [error, setError] = useState("");

    const [filtro, setFiltro] = useState<
        "todos" | "ingresos" | "cuotas" | "gastos"
    >("todos");

    // =========================
    // OBTENER MOVIMIENTOS
    // =========================

    const fetchMovimientos = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("movimientos")
            .select("*")
            .in("tipo", ["ingreso", "gasto", "cuota"])
            .order("fecha", { ascending: false });

        if (error) {
            console.error("Error obteniendo movimientos:", error);
            setLoading(false);
            return;
        }

        setMovimientos(data ?? []);
        setLoading(false);
    };

    const fetchCuotas = async () => {
        const { data, error } = await supabase
            .from("cuotas")
            .select("importe");

        if (error) {
            console.error("Error obteniendo cuotas:", error);
            return;
        }

        const cuotasTotal =
            data?.reduce(
                (total, cuota) => total + Number(cuota.importe),
                0
            ) ?? 0;

        setTotalCuotas(cuotasTotal);
    };

    useEffect(() => {
        fetchMovimientos();
        fetchCuotas();
    }, []);

    // =========================
    // TOTALES
    // =========================

    // INGRESOS + CUOTAS
    // INGRESOS NORMALES
    const ingresosMovimientos = movimientos
        .filter(
            (movimiento) =>
                movimiento.tipo === "ingreso"
        )
        .reduce(
            (total, movimiento) =>
                total + Number(movimiento.importe),
            0
        );

    // INGRESOS TOTALES = INGRESOS + CUOTAS
    const totalIngresos =
        ingresosMovimientos + totalCuotas;

    // GASTOS
    const totalGastos = movimientos
        .filter(
            (movimiento) => movimiento.tipo === "gasto"
        )
        .reduce(
            (total, movimiento) =>
                total + Number(movimiento.importe),
            0
        );

    // CAJA
    const cajaActual = totalIngresos - totalGastos;

    const movimientosFiltrados = movimientos.filter((movimiento) => {
        if (filtro === "ingresos") {
            return movimiento.tipo === "ingreso";
        }

        if (filtro === "cuotas") {
            return movimiento.tipo === "cuota";
        }

        if (filtro === "gastos") {
            return movimiento.tipo === "gasto";
        }

        return true;
    });

    // =========================
    // LIMPIAR FORMULARIO
    // =========================

    const limpiarFormulario = () => {
        setTipo("ingreso");
        setCategoria("");
        setConcepto("");
        setImporte("");
        setObservaciones("");
        setError("");
    };

    // =========================
    // CERRAR MODAL
    // =========================

    const cerrarModal = () => {
        if (guardando) return;

        setOpenModal(false);
        limpiarFormulario();
    };

    // =========================
    // AÑADIR MOVIMIENTO
    // =========================

    const añadirMovimiento = async () => {
        setError("");

        if (!categoria.trim()) {
            setError("La categoría es obligatoria.");
            return;
        }

        if (!concepto.trim()) {
            setError("El concepto es obligatorio.");
            return;
        }

        if (!importe || Number(importe) <= 0) {
            setError("Introduce un importe válido.");
            return;
        }

        setGuardando(true);

        try {
            const { error } = await supabase
                .from("movimientos")
                .insert([
                    {
                        tipo,
                        categoria: categoria.trim(),
                        concepto: concepto.trim(),
                        importe: Number(importe),
                        observaciones: observaciones.trim() || null,
                        fecha: new Date().toISOString(),
                        responsable_id: session.id,
                    },
                ]);

            if (error) {
                console.error(
                    "Error añadiendo movimiento:",
                    error
                );

                setError(
                    "No se ha podido guardar el movimiento."
                );

                return;
            }

            await fetchMovimientos();

            setOpenModal(false);
            limpiarFormulario();

        } catch (error) {
            console.error(error);
            setError("Ha ocurrido un error.");
        } finally {
            setGuardando(false);
        }
    };

    // =========================
    // DATOS VISUALES DEL TIPO
    // =========================

    const getTipoNombre = (
        movimiento: Movimiento
    ) => {
        if (movimiento.tipo === "cuota") {
            return "Cuota";
        }

        if (movimiento.tipo === "ingreso") {
            return "Ingreso";
        }

        return "Gasto";
    };

    const esIngreso = (
        movimiento: Movimiento
    ) => {
        return (
            movimiento.tipo === "ingreso" ||
            movimiento.tipo === "cuota"
        );
    };

    return (
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 min-h-screen p-6">

            {/* =========================
          HEADER
      ========================= */}

            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
                        Movimientos
                    </h1>

                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Gestiona los ingresos y gastos del grupo.
                    </p>

                    {session.rol && (
                        <span className="inline-block mt-3 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-semibold">
                            {session.rol}
                        </span>
                    )}
                </div>

                <button
                    onClick={() => setOpenModal(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-3 rounded-xl transition"
                >
                    + Añadir movimiento
                </button>

            </div>

            {/* =========================
          RESUMEN
      ========================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">

                {/* CAJA */}

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-800">

                    <p className="text-slate-500 text-sm">
                        Caja actual
                    </p>

                    <h2
                        className={`text-3xl md:text-4xl font-bold mt-3 ${cajaActual >= 0
                            ? "text-amber-500"
                            : "text-red-500"
                            }`}
                    >
                        {cajaActual.toFixed(2)} €
                    </h2>

                    <p className="text-slate-500 text-sm mt-2">
                        Ingresos + cuotas - gastos
                    </p>

                </div>

                {/* INGRESOS + CUOTAS */}

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-800">

                    <p className="text-slate-500 text-sm">
                        Total ingresos
                    </p>

                    <h2 className="text-3xl md:text-4xl font-bold mt-3 text-green-600">
                        +{totalIngresos.toFixed(2)} €
                    </h2>

                    <p className="text-slate-500 text-sm mt-2">
                        Ingresos y cuotas recibidas
                    </p>

                </div>

                {/* GASTOS */}

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-800">

                    <p className="text-slate-500 text-sm">
                        Total gastos
                    </p>

                    <h2 className="text-3xl md:text-4xl font-bold mt-3 text-red-500">
                        -{totalGastos.toFixed(2)} €
                    </h2>

                    <p className="text-slate-500 text-sm mt-2">
                        Dinero gastado
                    </p>

                </div>

            </div>

            {/* =========================
          LISTA MOVIMIENTOS
      ========================= */}

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            Movimientos
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            {movimientosFiltrados.length} movimientos mostrados
                        </p>
                    </div>

                    {/* FILTROS */}

                    <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">

                        {/* TODOS */}

                        <button
                            type="button"
                            onClick={() => setFiltro("todos")}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filtro === "todos"
                                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                                }`}
                        >
                            Todos
                        </button>


                        {/* INGRESOS */}

                        <button
                            type="button"
                            onClick={() => setFiltro("ingresos")}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filtro === "ingresos"
                                ? "bg-green-600 text-white shadow-sm"
                                : "text-slate-500 hover:text-green-600 dark:hover:text-green-400"
                                }`}
                        >
                            Ingresos
                        </button>


                        {/* CUOTAS */}

                        <button
                            type="button"
                            onClick={() => setFiltro("cuotas")}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filtro === "cuotas"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
                                }`}
                        >
                            Cuotas
                        </button>


                        {/* GASTOS */}

                        <button
                            type="button"
                            onClick={() => setFiltro("gastos")}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filtro === "gastos"
                                ? "bg-red-500 text-white shadow-sm"
                                : "text-slate-500 hover:text-red-500 dark:hover:text-red-400"
                                }`}
                        >
                            Gastos
                        </button>

                    </div>

                </div>

                {loading ? (
                    <div className="py-10 text-center text-slate-500">
                        Cargando movimientos...
                    </div>

                ) : movimientos.length === 0 ? (

                    <div className="py-12 text-center">

                        <p className="text-slate-500">
                            No hay movimientos registrados.
                        </p>

                        <button
                            onClick={() => setOpenModal(true)}
                            className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-xl"
                        >
                            Añadir el primero
                        </button>

                    </div>

                ) : movimientosFiltrados.length === 0 ? (

                    <div className="py-12 text-center">

                        <p className="text-slate-500">
                            No hay movimientos de este tipo.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-4">

                        {movimientosFiltrados.map((movimiento) => {

                            const ingreso =
                                esIngreso(movimiento);

                            return (
                                <div
                                    key={movimiento.id}
                                    className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                                >

                                    {/* ICONO / TIPO */}

                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${ingreso
                                            ? "bg-green-100 text-green-600 dark:bg-green-500/20"
                                            : "bg-red-100 text-red-500 dark:bg-red-500/20"
                                            }`}
                                    >
                                        {ingreso ? "↑" : "↓"}
                                    </div>

                                    {/* INFORMACIÓN */}

                                    <div className="flex-1 min-w-0">

                                        <div className="flex flex-wrap items-center gap-2">

                                            <p className="font-bold text-slate-800 dark:text-white">
                                                {movimiento.concepto}
                                            </p>

                                            <span
                                                className={`text-xs px-2 py-1 rounded-full font-semibold ${movimiento.tipo === "gasto"
                                                    ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                                    : movimiento.tipo === "cuota"
                                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                                                        : "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                                                    }`}
                                            >
                                                {getTipoNombre(movimiento)}
                                            </span>

                                        </div>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">

                                            <span>
                                                {movimiento.categoria}
                                            </span>

                                            <span>
                                                {new Date(
                                                    movimiento.fecha
                                                ).toLocaleDateString("es-ES")}
                                            </span>

                                        </div>

                                        {movimiento.observaciones && (
                                            <p className="text-sm text-slate-500 mt-2">
                                                {movimiento.observaciones}
                                            </p>
                                        )}

                                    </div>

                                    {/* IMPORTE */}

                                    <div
                                        className={`text-lg font-bold whitespace-nowrap ${ingreso
                                            ? "text-green-600"
                                            : "text-red-500"
                                            }`}
                                    >
                                        {ingreso ? "+" : "-"}
                                        {Number(
                                            movimiento.importe
                                        ).toFixed(2)} €
                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>

            {/* =========================
          MODAL
      ========================= */}

            <Modal
                open={openModal}
                onClose={cerrarModal}
                title="Añadir movimiento"
            >

                <div className="space-y-5">

                    {/* TIPO */}

                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Tipo
                        </label>

                        <div className="grid grid-cols-2 gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setTipo("ingreso")
                                }
                                className={`py-3 rounded-xl font-semibold border transition ${tipo === "ingreso"
                                    ? "bg-green-600 text-white border-green-600"
                                    : "border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    }`}
                            >
                                ↑ Ingreso
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setTipo("gasto")
                                }
                                className={`py-3 rounded-xl font-semibold border transition ${tipo === "gasto"
                                    ? "bg-red-500 text-white border-red-500"
                                    : "border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    }`}
                            >
                                ↓ Gasto
                            </button>

                        </div>
                    </div>

                    {/* CATEGORÍA */}

                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Categoría *
                        </label>

                        <input
                            type="text"
                            value={categoria}
                            onChange={(e) =>
                                setCategoria(e.target.value)
                            }
                            placeholder="Ej. Transporte, Vestuario..."
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    {/* CONCEPTO */}

                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Concepto *
                        </label>

                        <input
                            type="text"
                            value={concepto}
                            onChange={(e) =>
                                setConcepto(e.target.value)
                            }
                            placeholder="Ej. Compra de telas"
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    {/* IMPORTE */}

                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Importe *
                        </label>

                        <div className="relative">

                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={importe}
                                onChange={(e) =>
                                    setImporte(e.target.value)
                                }
                                placeholder="0.00"
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-amber-500"
                            />

                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                                €
                            </span>

                        </div>
                    </div>

                    {/* OBSERVACIONES */}

                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Observaciones
                            <span className="font-normal text-slate-400">
                                {" "}
                                (opcional)
                            </span>
                        </label>

                        <textarea
                            value={observaciones}
                            onChange={(e) =>
                                setObservaciones(e.target.value)
                            }
                            placeholder="Añade cualquier información adicional..."
                            rows={4}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    {/* ERROR */}

                    {error && (
                        <div className="bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* BOTÓN */}

                    <button
                        type="button"
                        onClick={añadirMovimiento}
                        disabled={guardando}
                        className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition"
                    >
                        {guardando
                            ? "Guardando..."
                            : "Guardar movimiento"}
                    </button>

                </div>

            </Modal>

        </div>
    );
}