type DashboardProps = {
  session: {
    id: number;
    nombre: string;
    apellido?: string;
    imagen?: string | null;
    rol?: string;
  };
};

import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase';
import Modal from "@/components/PanelIntegrantes/Modal/Modal";

export default function Dashboard({ session }: DashboardProps) {

  // MODALES
  const [openMovimientos, setOpenMovimientos] = useState(false);
  const [openCuotas, setOpenCuotas] = useState(false);
  const [openEventos, setOpenEventos] = useState(false);
  const [openCumpleanos, setOpenCumpleanos] = useState(false);


  // DATOS COMPLETOS
  const [todosMovimientos, setTodosMovimientos] = useState<any[]>([]);
  const [todasCuotas, setTodasCuotas] = useState<any[]>([]);
  const [todosEventos, setTodosEventos] = useState<any[]>([]);
  const [todosCumpleanos, setTodosCumpleanos] = useState<any[]>([]);

  // INTEGRANTES //
  const [totalIntegrantes, setTotalIntegrantes] = useState(0);
  const [totalHombres, setTotalHombres] = useState(0);
  const [totalMujeres, setTotalMujeres] = useState(0);

  // CAJA ACTUAL //
  const [cajaActual, setCajaActual] = useState(0);

  // IMPORTE PENDIENTE //
  const [deuda, setDeuda] = useState(0);
  const [ultimoPago, setUltimoPago] = useState("Sin pagos");

  // MOVIMIENTOS //
  const [movimientos, setMovimientos] = useState<any[]>([]);

  // CUOTAS //
  const [ultimasCuotas, setUltimasCuotas] = useState<any[]>([]);

  // Eventos //
  const [eventos, setEventos] = useState<any[]>([]);

  // Cumpleaños //
  const [cumpleanios, setCumpleanios] = useState<any[]>([]);

  const fetchIntegrantes = async () => {
    const { data, error } = await supabase
      .from("integrantes")
      .select("sexo");

    if (error || !data) return;

    setTotalIntegrantes(data.length - 1);

    setTotalHombres(
      data.filter((i) => i.sexo === "Hombre").length
    );

    setTotalMujeres(
      data.filter((i) => i.sexo === "Mujer").length - 1
    );
  };

  const fetchCaja = async () => {

    // Obtener movimientos
    const { data: movimientos, error: errorMovimientos } = await supabase
      .from("movimientos")
      .select("tipo, importe");

    // Obtener cuotas pagadas
    const { data: cuotas, error: errorCuotas } = await supabase
      .from("cuotas")
      .select("importe");

    if (errorMovimientos || errorCuotas) return;

    // Total ingresos de movimientos
    const totalIngresos =
      movimientos
        ?.filter((m) => m.tipo === "ingreso")
        .reduce((acc, m) => acc + Number(m.importe), 0) ?? 0;

    // Total gastos
    const totalGastos =
      movimientos
        ?.filter((m) => m.tipo === "gasto")
        .reduce((acc, m) => acc + Number(m.importe), 0) ?? 0;

    // Total cuotas
    const totalCuotas =
      cuotas?.reduce((acc, c) => acc + Number(c.importe), 0) ?? 0;

    const caja = totalCuotas + totalIngresos - totalGastos;

    setCajaActual(caja);
  };

  const fetchDeuda = async () => {
    const { data, error } = await supabase
      .from("cuotas")
      .select("mes, anio")
      .eq("integrante_id", session.id)
      .order("anio", { ascending: false })
      .order("mes", { ascending: false })
      .limit(1);

    if (error) return;

    const hoy = new Date();

    const mesActual = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();

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

    let mesesPendientes = 0;

    if (data && data.length > 0) {
      const ultima = data[0];

      mesesPendientes =
        (anioActual - ultima.anio) * 12 +
        (mesActual - ultima.mes);

      setUltimoPago(`${nombresMeses[ultima.mes - 1]} ${ultima.anio}`);
    } else {
      mesesPendientes = mesActual;
      setUltimoPago("Sin pagos");
    }

    setDeuda(Math.max(0, mesesPendientes) * 5);
  };

  const fetchMovimientos = async () => {
    const { data, error } = await supabase
      .from("movimientos")
      .select("*")
      .in("tipo", ["ingreso", "gasto"])
      .order("fecha", { ascending: false })
      .limit(3);

    if (error || !data) return;

    setMovimientos(data);
  };

  const fetchUltimasCuotas = async () => {
    const { data, error } = await supabase
      .from("cuotas")
      .select("id, mes, anio, importe, fecha")
      .eq("integrante_id", session.id)
      .order("anio", { ascending: false })
      .order("mes", { ascending: false })
      .limit(3);

    if (error || !data) return;

    setUltimasCuotas(data);
  };

  const fetchEventos = async () => {
    const hoy = new Date().toISOString();

    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .gte("fecha", hoy)
      .order("fecha", { ascending: true })
      .limit(4);


    if (error || !data) return;

    setEventos(data);
  };

  const fetchTodosMovimientos = async () => {
    const { data, error } = await supabase
      .from("movimientos")
      .select("*")
      .in("tipo", ["ingreso", "gasto"])
      .gte("fecha", "2026-01-01")
      .lt("fecha", "2027-01-01")
      .order("fecha", { ascending: false });

    if (error || !data) return;

    setTodosMovimientos(data);
  };

  const fetchTodasCuotas = async () => {
    const { data, error } = await supabase
      .from("cuotas")
      .select("*")
      .eq("integrante_id", session.id)
      .eq("anio", 2026)
      .order("mes", { ascending: false });

    if (error || !data) return;

    setTodasCuotas(data);
  };

  const fetchTodosEventos = async () => {
    const hoy = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .gte("fecha", hoy)
      .order("fecha", { ascending: true });

    if (error || !data) return;

    setTodosEventos(data);
  };

  const fetchCumpleanios = async () => {
    const { data, error } = await supabase
      .from("integrantes")
      .select("id, nombre, apellido, imagen, fecha_nacimiento");

    if (error || !data) return;

    const hoy = new Date();

    const ordenados = data
      .filter((p) => p.fecha_nacimiento)
      .map((persona) => {
        const nacimiento = new Date(persona.fecha_nacimiento);

        const proximo = new Date(
          hoy.getFullYear(),
          nacimiento.getMonth(),
          nacimiento.getDate()
        );

        if (proximo < hoy) {
          proximo.setFullYear(hoy.getFullYear() + 1);
        }

        return {
          ...persona,
          proximoCumple: proximo,
        };
      })
      .sort(
        (a, b) =>
          a.proximoCumple.getTime() - b.proximoCumple.getTime()
      );

    setCumpleanios(ordenados.slice(0, 4)); // Dashboard
    setTodosCumpleanos(ordenados);          // Modal
  };

  useEffect(() => {
    fetchIntegrantes();
    fetchCaja();
    fetchDeuda();
    fetchMovimientos();
    fetchUltimasCuotas();
    fetchEventos();
    fetchCumpleanios();

    // Modales
    fetchTodosMovimientos();
    fetchTodasCuotas();
    fetchTodosEventos();
  }, []);

  return (
    <div className="flex-1 bg-slate-100 dark:bg-slate-950 min-h-screen p-6">

      {/* Header */}
      <div className="mb-8 flex flex-col items-center text-center md:flex-row md:text-left md:items-center gap-5">

        <div className="flex items-center gap-5">

          {session.imagen ? (
            <img
              src={session.imagen}
              alt={session.nombre}
              className="w-20 h-20 rounded-full object-cover border-4 border-amber-500"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center text-white text-3xl font-bold">
              {session.nombre.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-slate-800 dark:text-white">
              ¡Bienvenido, {session.nombre}! 👋
            </h1>

            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Aquí tienes un resumen del estado del grupo.
            </p>

            {session.rol && (
              <span className="inline-block mt-3 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-semibold">
                {session.rol}
              </span>
            )}
          </div>

        </div>

      </div>

      {/* Cards superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-4 md:p-6 border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 text-sm">Integrantes</p>

          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-slate-800 dark:text-white">
            {totalIntegrantes}
          </h2>

          <div className="flex gap-4 mt-4 text-sm">

            <span className="text-blue-500 font-semibold">
              👨 {totalHombres} hombres
            </span>

            <span className="text-pink-500 font-semibold">
              👩 {totalMujeres} mujeres
            </span>

          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 text-sm">Caja actual</p>

          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-amber-500">
            {cajaActual.toFixed(2)} €
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            Disponible
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 text-sm">
            Próximo evento
          </p>

          {eventos.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold mt-3 text-slate-800 dark:text-white">
                {eventos[0].titulo}
              </h2>

              <p className="text-slate-500 text-sm mt-3">
                {new Date(eventos[0].fecha).toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {eventos[0].hora &&
                  ` · ${eventos[0].hora.split(":").slice(0, 2).join(":")}`}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mt-3 text-slate-800 dark:text-white">
                Sin eventos
              </h2>

              <p className="text-slate-500 text-sm mt-3">
                No hay eventos programados.
              </p>
            </>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 text-sm">
            Cuotas pendientes
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-red-500">
            {deuda.toFixed(2)} €
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            Último mes pagado: {ultimoPago}
          </p>
        </div>

      </div>

      {/* Segunda fila */}
      <div className="grid gap-6 mt-8 lg:grid-cols-2">

        {/* Movimientos */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Últimos movimientos
            </h3>

            <button
              onClick={() => setOpenMovimientos(true)}
              className="text-xs md:text-sm px-3 md:px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
            >
              Ver todos
            </button>
          </div>

          <div className="space-y-5">
            {movimientos.map((movimiento) => (
              <div
                key={movimiento.id}
                className="flex items-center"
              >
                <div className="flex-1 w-18">
                  <p className="font-semibold text-slate-700 dark:text-white truncate">
                    {movimiento.concepto}
                  </p>

                  <p className="text-sm text-slate-500">
                    {new Date(movimiento.fecha).toLocaleDateString("es-ES")}
                  </p>
                </div>

                <span
                  className={`w-18 text-right font-bold whitespace-nowrap ${movimiento.tipo === "ingreso"
                    ? "text-green-600"
                    : "text-red-500"
                    }`}
                >
                  {movimiento.tipo === "ingreso" ? "+" : "-"}
                  {Number(movimiento.importe).toFixed(2)} €
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Últimas cuotas */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Últimas cuotas pagadas
            </h3>

            <button
              onClick={() => setOpenCuotas(true)}
              className="text-xs md:text-sm px-3 md:px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
            >
              Ver todos
            </button>
          </div>

          <div className="space-y-5">

            {ultimasCuotas.map((cuota) => (
              <div
                key={cuota.id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-slate-700 dark:text-white">
                    {[
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
                    ][cuota.mes - 1]} {cuota.anio}
                  </p>

                  <p className="text-sm text-slate-500">
                    {cuota.fecha
                      ? new Date(cuota.fecha).toLocaleDateString("es-ES")
                      : "Fecha no disponible"}
                  </p>
                </div>

                <span className="font-bold text-green-600">
                  {Number(cuota.importe).toFixed(2)} €
                </span>
              </div>
            ))}

            {ultimasCuotas.length === 0 && (
              <p className="text-slate-500 text-center">
                No hay cuotas registradas.
              </p>
            )}

          </div>

        </div>

      </div>

      {/* Tercera fila*/}
      <div className="grid gap-6 mt-8 lg:grid-cols-2">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Próximos eventos
            </h3>

            <button
              onClick={() => setOpenEventos(true)}
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
                  {new Date(evento.fecha).toLocaleDateString("es-ES", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                  {evento.hora &&
                    ` · ${evento.hora.split(":").slice(0, 2).join(":")}`}
                </p>
              </div>
            ))}

            {eventos.length === 0 && (
              <p className="text-slate-500 text-center">
                No hay eventos próximos.
              </p>
            )}

          </div>

        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Próximos cumpleaños
            </h3>

            <button
              onClick={() => setOpenCumpleanos(true)}
              className="text-xs md:text-sm px-3 md:px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
            >
              Ver todos
            </button>
          </div>

          <div className="space-y-5">

            {cumpleanios.map((persona) => (
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
                    {persona.nombre} {persona.apellido}
                  </p>

                  <p className="text-sm text-slate-500">
                    🎂{" "}
                    {persona.proximoCumple.toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {cumpleanios.length === 0 && (
              <p className="text-center text-slate-500">
                No hay cumpleaños próximos.
              </p>
            )}

          </div>

        </div>
      </div>

      {/* ================= MODAL MOVIMIENTOS ================= */}

      <Modal
        open={openMovimientos}
        onClose={() => setOpenMovimientos(false)}
        title="Movimientos 2026"
      >
        <div className="space-y-4">
          {todosMovimientos.map((movimiento) => (
            <div
              key={movimiento.id}
              className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3"
            >
              <div>
                <p className="font-semibold">
                  {movimiento.concepto}
                </p>

                <p className="text-sm text-slate-500">
                  {new Date(movimiento.fecha).toLocaleDateString("es-ES")}
                </p>
              </div>

              <span
                className={`font-bold ${movimiento.tipo === "ingreso"
                  ? "text-green-600"
                  : "text-red-500"
                  }`}
              >
                {movimiento.tipo === "ingreso" ? "+" : "-"}
                {Number(movimiento.importe).toFixed(2)} €
              </span>
            </div>
          ))}
        </div>
      </Modal>

      {/* ================= MODAL CUOTAS ================= */}

      <Modal
        open={openCuotas}
        onClose={() => setOpenCuotas(false)}
        title="Cuotas 2026"
      >
        <div className="space-y-4">

          {todasCuotas.map((cuota) => (
            <div
              key={cuota.id}
              className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3"
            >
              <div>
                <p className="font-semibold">
                  {[
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
                  ][cuota.mes - 1]} {cuota.anio}
                </p>

                <p className="text-sm text-slate-500">
                  {new Date(cuota.fecha).toLocaleDateString("es-ES")}
                </p>
              </div>

              <span className="font-bold text-green-600">
                {Number(cuota.importe).toFixed(2)} €
              </span>
            </div>
          ))}

        </div>
      </Modal>

      {/* ================= MODAL EVENTOS ================= */}

      <Modal
        open={openEventos}
        onClose={() => setOpenEventos(false)}
        title="Próximos eventos"
      >
        <div className="space-y-4">

          {todosEventos.map((evento) => (
            <div
              key={evento.id}
              className="border-l-4 border-amber-500 pl-4"
            >
              <p className="font-semibold text-lg">
                {evento.titulo}
              </p>

              <p className="text-slate-500">
                {new Date(evento.fecha).toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}

                {evento.hora &&
                  ` · ${evento.hora.split(":").slice(0, 2).join(":")}`}
              </p>

              {evento.lugar && (
                <p className="text-sm text-slate-500 mt-1">
                  📍 {evento.lugar}
                </p>
              )}
            </div>
          ))}

        </div>
      </Modal>

      {/* ================ MODAL CUMPLEAÑOS ================ */}
      <Modal
        open={openCumpleanos}
        onClose={() => setOpenCumpleanos(false)}
        title="Próximos cumpleaños"
      >
        <div className="space-y-4">

          {todosCumpleanos.map((persona) => (
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
                  {persona.nombre} {persona.apellido}
                </p>

                <p className="text-sm text-slate-500">
                  {persona.proximoCumple.toLocaleDateString("es-ES", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>
          ))}

        </div>
      </Modal>
    </div>
  );
}