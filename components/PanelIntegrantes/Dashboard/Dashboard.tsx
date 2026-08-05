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

export default function Dashboard({ session }: DashboardProps) {

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

  useEffect(() => {
    fetchIntegrantes();
    fetchCaja();
    fetchDeuda();
    fetchMovimientos();
    fetchUltimasCuotas();
    fetchEventos();
  }, []);

  return (
    <div className="flex-1 bg-slate-100 dark:bg-slate-950 min-h-screen p-6">

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

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
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
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
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 text-sm">Integrantes</p>

          <h2 className="text-4xl font-bold mt-3 text-slate-800 dark:text-white">
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

          <h2 className="text-4xl font-bold mt-3 text-amber-500">
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

          <h2 className="text-4xl font-bold mt-3 text-red-500">
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

          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
            Últimos movimientos (Sin contar las cuotas)
          </h3>

          <div className="space-y-5">
            {movimientos.map((movimiento) => (
              <div
                key={movimiento.id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-slate-700 dark:text-white">
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

        </div>

        {/* Últimas cuotas */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">

          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
            Últimas cuotas pagadas
          </h3>

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
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mt-8">

        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
          Próximos eventos
        </h3>

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

    </div>
  );
}