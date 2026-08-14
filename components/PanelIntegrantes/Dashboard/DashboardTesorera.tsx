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

type Pendiente = {
  id: number;
  nombre: string;
  apellido?: string;
  imagen?: string | null;
  mesesPendientes: number;
  dineroPendiente: number;
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

export default function DashboardTesorera({
  session,
}: DashboardProps) {

  // =========================
  // DATOS
  // =========================

  const [cajaActual, setCajaActual] = useState(0);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [totalCuotas, setTotalCuotas] = useState(0);

  const [pendientesIntegrantes, setPendientesIntegrantes] =
    useState<Pendiente[]>([]);

  const [totalIntegrantes, setTotalIntegrantes] = useState(0);
  const [cuotasPagadas, setCuotasPagadas] = useState(0);

  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [cuotas, setCuotas] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [cumpleanios, setCumpleanios] = useState<any[]>([]);

  // =========================
  // MODALES
  // =========================

  const [openMovimientos, setOpenMovimientos] = useState(false);
  const [openCuotas, setOpenCuotas] = useState(false);
  const [openPendientes, setOpenPendientes] = useState(false);
  const [openEventos, setOpenEventos] = useState(false);
  const [openCumpleanos, setOpenCumpleanos] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  const [todosMovimientos, setTodosMovimientos] = useState<any[]>([]);
  const [todasCuotas, setTodasCuotas] = useState<any[]>([]);
  const [todosEventos, setTodosEventos] = useState<any[]>([]);
  const [todosCumpleanos, setTodosCumpleanos] = useState<any[]>([]);

  // =========================
  // PASSWORD
  // =========================

  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordRepetir, setPasswordRepetir] = useState("");

  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // =========================
  // CAJA
  // =========================

  const fetchCaja = async () => {
    const { data: movimientosData, error: errorMovimientos } =
      await supabase
        .from("movimientos")
        .select("tipo, importe");

    const { data: cuotasData, error: errorCuotas } =
      await supabase
        .from("cuotas")
        .select("importe");

    if (errorMovimientos || errorCuotas) {
      console.error(
        errorMovimientos || errorCuotas
      );
      return;
    }

    const ingresos =
      movimientosData
        ?.filter((m) => m.tipo === "ingreso")
        .reduce(
          (total, m) => total + Number(m.importe),
          0
        ) ?? 0;

    const gastos =
      movimientosData
        ?.filter((m) => m.tipo === "gasto")
        .reduce(
          (total, m) => total + Number(m.importe),
          0
        ) ?? 0;

    const cuotasTotal =
      cuotasData?.reduce(
        (total, c) => total + Number(c.importe),
        0
      ) ?? 0;

    setTotalIngresos(ingresos);
    setTotalGastos(gastos);
    setTotalCuotas(cuotasTotal);

    setCajaActual(
      cuotasTotal + ingresos - gastos
    );
  };

  // =========================
  // CUOTAS
  // =========================

  const fetchCuotas = async () => {
    const hoy = new Date();

    const mesActual = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();

    // =========================
    // INTEGRANTES
    // =========================

    const {
      data: integrantesData,
      error: errorIntegrantes,
    } = await supabase
      .from("integrantes")
      .select(
        "id, nombre, apellido, imagen, inicio_cuotas, fecha_alta"
      );

    if (errorIntegrantes || !integrantesData) {
      console.error(errorIntegrantes);
      return;
    }

    setTotalIntegrantes(integrantesData.length);

    // =========================
    // TODAS LAS CUOTAS
    // =========================

    const {
      data: cuotasData,
      error: errorCuotas,
    } = await supabase
      .from("cuotas")
      .select(`
        id,
        integrante_id,
        mes,
        anio,
        importe,
        fecha,
        integrantes (
          nombre,
          apellido,
          imagen
        )
      `);

    if (errorCuotas || !cuotasData) {
      console.error(errorCuotas);
      return;
    }

    // =========================
    // TOTAL CUOTAS PAGADAS
    // =========================

    setCuotasPagadas(cuotasData.length);

    // =========================
    // CALCULAR DEUDA
    // =========================

    const pendientes: Pendiente[] = [];

    integrantesData.forEach((integrante) => {

      // -----------------------------------------
      // CUOTAS DE ESTE INTEGRANTE
      // -----------------------------------------

      const cuotasPersona = cuotasData
        .filter(
          (cuota) =>
            cuota.integrante_id === integrante.id
        )
        .sort((a, b) => {

          const anioA = Number(a.anio);
          const anioB = Number(b.anio);

          if (anioA !== anioB) {
            return anioA - anioB;
          }

          const mesA = Number(a.mes);
          const mesB = Number(b.mes);

          if (mesA !== mesB) {
            return mesA - mesB;
          }

          const fechaA = a.fecha
            ? new Date(a.fecha).getTime()
            : 0;

          const fechaB = b.fecha
            ? new Date(b.fecha).getTime()
            : 0;

          return fechaA - fechaB;
        });

      // -----------------------------------------
      // DETERMINAR DESDE CUÁNDO DEBE PAGAR
      // -----------------------------------------

      let fechaInicio: Date | null = null;

      /*
       * PRIORIDAD:
       *
       * 1. inicio_cuotas
       * 2. última cuota pagada
       * 3. fecha_alta
       */

      if (integrante.inicio_cuotas) {

        // ---------------------------------------
        // TIENE inicio_cuotas
        // ---------------------------------------

        fechaInicio = new Date(
          integrante.inicio_cuotas
        );

      } else if (cuotasPersona.length > 0) {

        // ---------------------------------------
        // NO TIENE inicio_cuotas
        // USAMOS LA ÚLTIMA CUOTA PAGADA
        // ---------------------------------------

        const ultimaCuota =
          cuotasPersona[cuotasPersona.length - 1];

        /*
         * La última cuota pagada corresponde
         * al último mes que ha pagado.
         *
         * La deuda comienza desde el mes
         * siguiente a esa cuota.
         */

        const anioUltima =
          Number(ultimaCuota.anio);

        const mesUltima =
          Number(ultimaCuota.mes);

        if (mesUltima === 12) {

          fechaInicio = new Date(
            anioUltima + 1,
            0,
            1
          );

        } else {

          fechaInicio = new Date(
            anioUltima,
            mesUltima,
            1
          );

        }

      } else if (integrante.fecha_alta) {

        // ---------------------------------------
        // NO TIENE inicio_cuotas
        // NO TIENE CUOTAS
        // USAMOS fecha_alta
        // ---------------------------------------

        fechaInicio = new Date(
          integrante.fecha_alta
        );

      }

      // -----------------------------------------
      // SI NO TENEMOS FECHA
      // -----------------------------------------

      if (!fechaInicio) {
        return;
      }

      // -----------------------------------------
      // MES/AÑO DE INICIO
      // -----------------------------------------

      const anioInicio =
        fechaInicio.getFullYear();

      const mesInicio =
        fechaInicio.getMonth() + 1;

      // -----------------------------------------
      // CONVERTIMOS A UN ÍNDICE DE MESES
      // -----------------------------------------

      const indiceInicio =
        anioInicio * 12 +
        (mesInicio - 1);

      const indiceActual =
        anioActual * 12 +
        (mesActual - 1);

      // -----------------------------------------
      // MESES QUE DEBERÍA HABER PAGADO
      // -----------------------------------------

      let mesesQueDebePagar =
        indiceActual - indiceInicio + 1;

      if (mesesQueDebePagar < 0) {
        mesesQueDebePagar = 0;
      }

      // -----------------------------------------
      // CUOTAS PAGADAS DESDE EL INICIO
      // -----------------------------------------

      let cuotasPagadasDesdeInicio = 0;

      cuotasPersona.forEach((cuota) => {

        const anioCuota =
          Number(cuota.anio);

        const mesCuota =
          Number(cuota.mes);

        const indiceCuota =
          anioCuota * 12 +
          (mesCuota - 1);

        // Solo contamos cuotas dentro
        // del periodo correspondiente
        if (
          indiceCuota >= indiceInicio &&
          indiceCuota <= indiceActual
        ) {
          cuotasPagadasDesdeInicio++;
        }

      });

      // -----------------------------------------
      // DEUDA
      // -----------------------------------------

      const mesesPendientes =
        Math.max(
          0,
          mesesQueDebePagar -
          cuotasPagadasDesdeInicio
        );

      const dineroPendiente =
        mesesPendientes * 5;

      // -----------------------------------------
      // SOLO MOSTRAMOS QUIEN DEBE
      // -----------------------------------------

      if (mesesPendientes > 0) {

        pendientes.push({
          id: integrante.id,
          nombre: integrante.nombre,
          apellido: integrante.apellido,
          imagen: integrante.imagen,
          mesesPendientes,
          dineroPendiente,
        });

      }

    });

    // =========================
    // ORDENAR DEUDA
    // =========================

    pendientes.sort(
      (a, b) =>
        b.dineroPendiente -
        a.dineroPendiente
    );

    setPendientesIntegrantes(
      pendientes
    );

    // =========================
    // ÚLTIMAS CUOTAS
    // =========================

    const ultimas =
      [...cuotasData]
        .sort((a, b) => {

          const fechaA =
            a.fecha
              ? new Date(a.fecha).getTime()
              : 0;

          const fechaB =
            b.fecha
              ? new Date(b.fecha).getTime()
              : 0;

          return fechaB - fechaA;

        })
        .slice(0, 5);

    setCuotas(ultimas);

    // =========================
    // TODAS LAS CUOTAS
    // =========================

    setTodasCuotas(
      [...cuotasData].sort(
        (a, b) => {

          const fechaA =
            a.fecha
              ? new Date(a.fecha).getTime()
              : 0;

          const fechaB =
            b.fecha
              ? new Date(b.fecha).getTime()
              : 0;

          return fechaB - fechaA;

        }
      )
    );
  };

  // =========================
  // MOVIMIENTOS
  // =========================

  const fetchMovimientos = async () => {

    const {
      data,
      error,
    } = await supabase
      .from("movimientos")
      .select("*")
      .in(
        "tipo",
        ["ingreso", "gasto"]
      )
      .order(
        "fecha",
        {
          ascending: false,
        }
      );

    if (error || !data) return;

    setMovimientos(
      data.slice(0, 5)
    );

    setTodosMovimientos(data);
  };

  // =========================
  // EVENTOS
  // =========================

  const fetchEventos = async () => {

    const hoy =
      new Date()
        .toISOString()
        .split("T")[0];

    const {
      data,
      error,
    } = await supabase
      .from("eventos")
      .select("*")
      .gte("fecha", hoy)
      .order(
        "fecha",
        {
          ascending: true,
        }
      );

    if (error || !data) return;

    setEventos(
      data.slice(0, 4)
    );

    setTodosEventos(data);
  };

  // =========================
  // CUMPLEAÑOS
  // =========================

  const fetchCumpleanios = async () => {

    const {
      data,
      error,
    } = await supabase
      .from("integrantes")
      .select(
        "id, nombre, apellido, imagen, fecha_nacimiento"
      );

    if (error || !data) return;

    const hoy = new Date();

    const ordenados =
      data
        .filter(
          (persona) =>
            persona.fecha_nacimiento
        )
        .map((persona) => {

          const nacimiento =
            new Date(
              persona.fecha_nacimiento
            );

          const proximo =
            new Date(
              hoy.getFullYear(),
              nacimiento.getMonth(),
              nacimiento.getDate()
            );

          if (proximo < hoy) {
            proximo.setFullYear(
              hoy.getFullYear() + 1
            );
          }

          return {
            ...persona,
            proximoCumple: proximo,
          };

        })
        .sort(
          (a, b) =>
            a.proximoCumple.getTime() -
            b.proximoCumple.getTime()
        );

    setCumpleanios(
      ordenados.slice(0, 4)
    );

    setTodosCumpleanos(
      ordenados
    );
  };

  // =========================
  // PASSWORD
  // =========================

  const cambiarPassword = async () => {

    setPasswordError("");
    setPasswordSuccess("");

    if (
      !passwordActual ||
      !passwordNueva ||
      !passwordRepetir
    ) {
      setPasswordError(
        "Completa todos los campos."
      );
      return;
    }

    if (passwordNueva.length < 8) {
      setPasswordError(
        "La contraseña debe tener al menos 8 caracteres."
      );
      return;
    }

    if (
      passwordNueva !==
      passwordRepetir
    ) {
      setPasswordError(
        "Las contraseñas no coinciden."
      );
      return;
    }

    setLoadingPassword(true);

    try {

      const res =
        await fetch(
          "/api/cambiarContrasena",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id: session.id,
              passwordActual,
              passwordNueva,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        setPasswordError(
          data.message
        );

        return;
      }

      setPasswordSuccess(
        data.message
      );

      setPasswordActual("");
      setPasswordNueva("");
      setPasswordRepetir("");

      setTimeout(() => {
        setOpenPassword(false);
      }, 1000);

    } catch {

      setPasswordError(
        "Ha ocurrido un error."
      );

    } finally {

      setLoadingPassword(false);

    }
  };

  // =========================
  // CARGA
  // =========================

  useEffect(() => {

    fetchCaja();
    fetchCuotas();
    fetchMovimientos();
    fetchEventos();
    fetchCumpleanios();

  }, []);

  // =========================
  // RENDER
  // =========================

  return (
    <div className="flex-1 bg-slate-100 dark:bg-slate-950 min-h-screen p-4 md:p-6">

      {/* HEADER */}

      <div className="mb-8 flex flex-col items-center text-center md:flex-row md:text-left gap-5">

        {session.imagen ? (

          <img
            src={session.imagen}
            alt={session.nombre}
            className="w-20 h-20 rounded-full object-cover border-4 border-amber-500"
          />

        ) : (

          <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center text-white text-3xl font-bold">
            {session.nombre
              .charAt(0)
              .toUpperCase()}
          </div>

        )}

        <div>

          <h1 className="text-2xl md:text-4xl font-bold text-slate-800 dark:text-white">
            ¡Bienvenida, {session.nombre}! 👋
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Resumen financiero del grupo.
          </p>

          <span className="inline-block mt-3 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-semibold">
            Tesorera
          </span>

        </div>

      </div>


      {/* CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* CAJA */}

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-800">

          <p className="text-slate-500 text-sm">
            Caja actual
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-amber-500">
            {cajaActual.toFixed(2)} €
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            Disponible actualmente
          </p>

        </div>


        {/* INGRESOS */}

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-800">

          <p className="text-slate-500 text-sm">
            Ingresos
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-green-600">
            {totalIngresos.toFixed(2)} €
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            Otros ingresos
          </p>

        </div>


        {/* GASTOS */}

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-800">

          <p className="text-slate-500 text-sm">
            Gastos
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-red-500">
            {totalGastos.toFixed(2)} €
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            Gastos registrados
          </p>

        </div>


        {/* CUOTAS */}

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-800">

          <p className="text-slate-500 text-sm">
            Cuotas cobradas
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-blue-500">
            {totalCuotas.toFixed(2)} €
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            Total acumulado
          </p>

        </div>

      </div>


      {/* CUOTAS PENDIENTES */}

      <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Cuotas pendientes
            </h3>

            <p className="text-slate-500 mt-1">
              Integrantes que tienen cuotas pendientes de pago.
            </p>

          </div>

          <button
            onClick={() =>
              setOpenPendientes(true)
            }
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Ver todos
          </button>

        </div>


        <div className="mt-6 space-y-4">

          {pendientesIntegrantes
            .slice(0, 5)
            .map((persona) => (

              <div
                key={persona.id}
                className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-4"
              >

                {persona.imagen ? (

                  <img
                    src={persona.imagen}
                    alt={persona.nombre}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />

                ) : (

                  <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                    {persona.nombre
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                )}

                <div className="flex-1 min-w-0">

                  <p className="font-semibold text-slate-800 dark:text-white truncate">
                    {persona.nombre}{" "}
                    {persona.apellido}
                  </p>

                  <p className="text-sm text-slate-500">
                    {persona.mesesPendientes}{" "}
                    {persona.mesesPendientes === 1
                      ? "cuota pendiente"
                      : "cuotas pendientes"}
                  </p>

                </div>

                <div className="text-right">

                  <p className="font-bold text-red-500 whitespace-nowrap">
                    {persona.dineroPendiente.toFixed(2)} €
                  </p>

                  <p className="text-xs text-slate-400">
                    pendiente
                  </p>

                </div>

              </div>

            ))}


          {pendientesIntegrantes.length === 0 && (

            <div className="py-8 text-center">

              <p className="text-green-600 font-semibold">
                🎉 Todos los integrantes están al día.
              </p>

            </div>

          )}

        </div>

      </div>


      {/* MOVIMIENTOS + CUOTAS */}

      <div className="grid gap-6 mt-8 lg:grid-cols-2">

        {/* MOVIMIENTOS */}

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">

          <div className="flex items-center justify-between mb-6">

            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Últimos movimientos
            </h3>

            <button
              onClick={() =>
                setOpenMovimientos(true)
              }
              className="text-xs md:text-sm px-3 md:px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
            >
              Ver todos
            </button>

          </div>

          <div className="space-y-5">

            {movimientos.map(
              (movimiento) => (

                <div
                  key={movimiento.id}
                  className="flex items-center"
                >

                  <div className="flex-1 min-w-0">

                    <p className="font-semibold text-slate-700 dark:text-white truncate">
                      {movimiento.concepto}
                    </p>

                    <p className="text-sm text-slate-500">
                      {new Date(
                        movimiento.fecha
                      ).toLocaleDateString(
                        "es-ES"
                      )}
                    </p>

                  </div>

                  <span
                    className={`font-bold whitespace-nowrap ${
                      movimiento.tipo ===
                      "ingreso"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {movimiento.tipo ===
                    "ingreso"
                      ? "+"
                      : "-"}
                    {Number(
                      movimiento.importe
                    ).toFixed(2)} €
                  </span>

                </div>

              )
            )}

            {movimientos.length === 0 && (

              <p className="text-center text-slate-500">
                No hay movimientos.
              </p>

            )}

          </div>

        </div>


        {/* CUOTAS */}

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">

          <div className="flex items-center justify-between mb-6">

            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Últimas cuotas cobradas
            </h3>

            <button
              onClick={() =>
                setOpenCuotas(true)
              }
              className="text-xs md:text-sm px-3 md:px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
            >
              Ver todas
            </button>

          </div>

          <div className="space-y-5">

            {cuotas.map((cuota) => (

              <div
                key={cuota.id}
                className="flex justify-between items-center"
              >

                <div>

                  <p className="font-semibold text-slate-700 dark:text-white">
                    {cuota.integrantes?.nombre}{" "}
                    {cuota.integrantes?.apellido}
                  </p>

                  <p className="text-sm text-slate-500">
                    Cuota de{" "}
                    {nombresMeses[
                      cuota.mes - 1
                    ]}{" "}
                    {cuota.anio}
                  </p>

                  <p className="text-sm text-slate-500">
                    {cuota.fecha
                      ? new Date(
                          cuota.fecha
                        ).toLocaleDateString(
                          "es-ES"
                        )
                      : "Sin fecha"}
                  </p>

                </div>

                <span className="font-bold text-green-600">
                  {Number(
                    cuota.importe
                  ).toFixed(2)} €
                </span>

              </div>

            ))}

            {cuotas.length === 0 && (

              <p className="text-center text-slate-500">
                No hay cuotas registradas.
              </p>

            )}

          </div>

        </div>

      </div>


      {/* EVENTOS + CUMPLEAÑOS */}

      <div className="grid gap-6 mt-8 lg:grid-cols-2">

        {/* EVENTOS */}

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">

          <div className="flex items-center justify-between mb-6">

            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Próximos eventos
            </h3>

            <button
              onClick={() =>
                setOpenEventos(true)
              }
              className="text-xs md:text-sm px-3 md:px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
            >
              Ver todos
            </button>

          </div>

          <div className="space-y-5">

            {eventos.map((evento) => (

              <div
                key={evento.id}
                className="border-l-4 border-amber-500 pl-4"
              >

                <p className="font-semibold text-slate-800 dark:text-white">
                  {evento.titulo}
                </p>

                <p className="text-sm text-slate-500">

                  {new Date(
                    evento.fecha
                  ).toLocaleDateString(
                    "es-ES",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    }
                  )}

                  {evento.hora &&
                    ` · ${evento.hora
                      .split(":")
                      .slice(0, 2)
                      .join(":")}`}

                </p>

              </div>

            ))}

            {eventos.length === 0 && (

              <p className="text-center text-slate-500">
                No hay eventos próximos.
              </p>

            )}

          </div>

        </div>


        {/* CUMPLEAÑOS */}

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">

          <div className="flex items-center justify-between mb-6">

            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Próximos cumpleaños
            </h3>

            <button
              onClick={() =>
                setOpenCumpleanos(true)
              }
              className="text-xs md:text-sm px-3 md:px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
            >
              Ver todos
            </button>

          </div>

          <div className="space-y-5">

            {cumpleanios.map(
              (persona) => (

                <div
                  key={persona.id}
                  className="flex items-center gap-4"
                >

                  {persona.imagen ? (

                    <img
                      src={persona.imagen}
                      alt={persona.nombre}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                  ) : (

                    <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                      {persona.nombre[0]}
                    </div>

                  )}

                  <div>

                    <p className="font-semibold text-slate-800 dark:text-white">
                      {persona.nombre}{" "}
                      {persona.apellido}
                    </p>

                    <p className="text-sm text-slate-500">
                      🎂{" "}
                      {persona.proximoCumple.toLocaleDateString(
                        "es-ES",
                        {
                          day: "numeric",
                          month: "long",
                        }
                      )}
                    </p>

                  </div>

                </div>

              )
            )}

            {cumpleanios.length === 0 && (

              <p className="text-center text-slate-500">
                No hay cumpleaños próximos.
              </p>

            )}

          </div>

        </div>

      </div>


      {/* SEGURIDAD */}

      <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">

        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
          Seguridad
        </h3>

        <p className="text-slate-500 mt-2">
          Cambia tu contraseña siempre que quieras.
        </p>

        <button
          onClick={() =>
            setOpenPassword(true)
          }
          className="mt-5 bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-xl font-semibold"
        >
          Cambiar contraseña
        </button>

      </div>


      {/* MODAL MOVIMIENTOS */}

      <Modal
        open={openMovimientos}
        onClose={() =>
          setOpenMovimientos(false)
        }
        title="Todos los movimientos"
      >

        <div className="space-y-4">

          {todosMovimientos.map(
            (movimiento) => (

              <div
                key={movimiento.id}
                className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3"
              >

                <div>

                  <p className="font-semibold">
                    {movimiento.concepto}
                  </p>

                  <p className="text-sm text-slate-500">
                    {new Date(
                      movimiento.fecha
                    ).toLocaleDateString(
                      "es-ES"
                    )}
                  </p>

                </div>

                <span
                  className={`font-bold ${
                    movimiento.tipo ===
                    "ingreso"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {movimiento.tipo ===
                  "ingreso"
                    ? "+"
                    : "-"}
                  {Number(
                    movimiento.importe
                  ).toFixed(2)} €
                </span>

              </div>

            )
          )}

        </div>

      </Modal>


      {/* MODAL CUOTAS */}

      <Modal
        open={openCuotas}
        onClose={() =>
          setOpenCuotas(false)
        }
        title="Todas las cuotas"
      >

        <div className="space-y-4">

          {todasCuotas.map((cuota) => (

            <div
              key={cuota.id}
              className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-4"
            >

              {cuota.integrantes?.imagen ? (

                <img
                  src={cuota.integrantes.imagen}
                  alt={cuota.integrantes.nombre}
                  className="w-12 h-12 rounded-full object-cover"
                />

              ) : (

                <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                  {cuota.integrantes?.nombre
                    ?.charAt(0)
                    .toUpperCase() || "?"}
                </div>

              )}

              <div className="flex-1 min-w-0">

                <p className="font-semibold text-slate-800 dark:text-white truncate">
                  {cuota.integrantes?.nombre}{" "}
                  {cuota.integrantes?.apellido}
                </p>

                <p className="text-sm text-slate-500">
                  Cuota de{" "}
                  {nombresMeses[
                    cuota.mes - 1
                  ]}{" "}
                  {cuota.anio}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  {cuota.fecha
                    ? new Date(
                        cuota.fecha
                      ).toLocaleDateString(
                        "es-ES"
                      )
                    : "Sin fecha"}
                </p>

              </div>

              <span className="font-bold text-green-600 whitespace-nowrap">
                {Number(
                  cuota.importe
                ).toFixed(2)} €
              </span>

            </div>

          ))}

          {todasCuotas.length === 0 && (

            <p className="text-center text-slate-500 py-6">
              No hay cuotas registradas.
            </p>

          )}

        </div>

      </Modal>


      {/* MODAL PENDIENTES */}

      <Modal
        open={openPendientes}
        onClose={() =>
          setOpenPendientes(false)
        }
        title="Cuotas pendientes de los integrantes"
      >

        <div className="space-y-4">

          {pendientesIntegrantes.map(
            (persona) => (

              <div
                key={persona.id}
                className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-4"
              >

                {persona.imagen ? (

                  <img
                    src={persona.imagen}
                    alt={persona.nombre}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />

                ) : (

                  <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                    {persona.nombre
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                )}

                <div className="flex-1 min-w-0">

                  <p className="font-semibold text-slate-800 dark:text-white">
                    {persona.nombre}{" "}
                    {persona.apellido}
                  </p>

                  <p className="text-sm text-slate-500">
                    {persona.mesesPendientes}{" "}
                    {persona.mesesPendientes === 1
                      ? "cuota pendiente"
                      : "cuotas pendientes"}
                  </p>

                </div>

                <div className="text-right">

                  <p className="font-bold text-red-500 whitespace-nowrap">
                    {persona.dineroPendiente.toFixed(2)} €
                  </p>

                  <p className="text-xs text-slate-400">
                    deuda total
                  </p>

                </div>

              </div>

            )
          )}

          {pendientesIntegrantes.length === 0 && (

            <div className="py-8 text-center">

              <p className="text-green-600 font-semibold">
                🎉 Todos los integrantes están al día.
              </p>

            </div>

          )}

        </div>

      </Modal>


      {/* MODAL EVENTOS */}

      <Modal
        open={openEventos}
        onClose={() =>
          setOpenEventos(false)
        }
        title="Próximos eventos"
      >

        <div className="space-y-4">

          {todosEventos.map(
            (evento) => (

              <div
                key={evento.id}
                className="border-l-4 border-amber-500 pl-4"
              >

                <p className="font-semibold text-lg">
                  {evento.titulo}
                </p>

                <p className="text-slate-500">

                  {new Date(
                    evento.fecha
                  ).toLocaleDateString(
                    "es-ES",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}

                  {evento.hora &&
                    ` · ${evento.hora
                      .split(":")
                      .slice(0, 2)
                      .join(":")}`}

                </p>

                {evento.lugar && (

                  <p className="text-sm text-slate-500 mt-1">
                    📍 {evento.lugar}
                  </p>

                )}

              </div>

            )
          )}

        </div>

      </Modal>


      {/* MODAL CUMPLEAÑOS */}

      <Modal
        open={openCumpleanos}
        onClose={() =>
          setOpenCumpleanos(false)
        }
        title="Próximos cumpleaños"
      >

        <div className="space-y-4">

          {todosCumpleanos.map(
            (persona) => (

              <div
                key={persona.id}
                className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-3"
              >

                {persona.imagen ? (

                  <img
                    src={persona.imagen}
                    alt={persona.nombre}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                ) : (

                  <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                    {persona.nombre.charAt(0)}
                  </div>

                )}

                <div className="flex-1">

                  <p className="font-semibold">
                    {persona.nombre}{" "}
                    {persona.apellido}
                  </p>

                  <p className="text-sm text-slate-500">
                    {persona.proximoCumple.toLocaleDateString(
                      "es-ES",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      }
                    )}
                  </p>

                </div>

              </div>

            )
          )}

        </div>

      </Modal>


      {/* MODAL PASSWORD */}

      <Modal
        open={openPassword}
        onClose={() =>
          setOpenPassword(false)
        }
        title="Cambiar contraseña"
      >

        <div className="space-y-4">

          <input
            type="password"
            placeholder="Contraseña actual"
            value={passwordActual}
            onChange={(e) =>
              setPasswordActual(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3"
          />

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={passwordNueva}
            onChange={(e) =>
              setPasswordNueva(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3"
          />

          <input
            type="password"
            placeholder="Repetir nueva contraseña"
            value={passwordRepetir}
            onChange={(e) =>
              setPasswordRepetir(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3"
          />

          {passwordError && (
            <p className="text-red-500 text-sm">
              {passwordError}
            </p>
          )}

          {passwordSuccess && (
            <p className="text-green-600 text-sm">
              {passwordSuccess}
            </p>
          )}

          <button
            onClick={cambiarPassword}
            disabled={loadingPassword}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50"
          >
            {loadingPassword
              ? "Guardando..."
              : "Actualizar contraseña"}
          </button>

        </div>

      </Modal>

    </div>
  );
}