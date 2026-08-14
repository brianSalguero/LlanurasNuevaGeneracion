type Section =
  | "Dashboard"
  | "Integrantes"
  | "MisCuotas"
  | "Movimientos"
  | "Cuotas";

type Props = {
  section: Section;
  setSection: (s: Section) => void;
  onLogout: () => void;
  session: {
    id: number;
    nombre: string;
    apellido?: string;
    imagen?: string | null;
    rol?: string;
  };
};

export default function Sidebar({
  section,
  setSection,
  onLogout,
  session,
}: Props) {

  const btnClass = (active: boolean) =>
    `w-full text-left px-4 py-3 rounded-xl font-semibold transition ${
      active
        ? "bg-amber-500 text-white"
        : "hover:bg-slate-200 dark:hover:bg-slate-800"
    }`;

  // =========================
  // PERMISOS
  // =========================

  // Usuarios que pueden acceder a Cuotas
  const usuariosCuotas = [1, 2, 3, 15];

  const puedeVerCuotas =
    usuariosCuotas.includes(session.id);

  // Usuarios que pueden acceder a Movimientos
  // Solo 1, 2, 3 y 15
  const usuariosMovimientos = [1, 2, 3, 15];

  const puedeVerMovimientos =
    usuariosMovimientos.includes(session.id);

  // Usuarios que pueden acceder a Mis Cuotas
  // Todos excepto la tesorera (15)
  const puedeVerMisCuotas =
    session.id !== 15;


  return (
    <aside className="hidden md:flex fixed left-0 top-20 h-[calc(100vh-80px)] w-72 flex-col justify-between bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6">

      {/* ========================= */}
      {/* TOP */}
      {/* ========================= */}

      <div>

        <nav className="flex flex-col gap-2">

          {/* ========================= */}
          {/* DASHBOARD */}
          {/* ========================= */}

          <button
            onClick={() => setSection("Dashboard")}
            className={btnClass(
              section === "Dashboard"
            )}
          >
            Panel de control
          </button>


          {/* ========================= */}
          {/* INTEGRANTES */}
          {/* ========================= */}

          <button
            onClick={() => setSection("Integrantes")}
            className={btnClass(
              section === "Integrantes"
            )}
          >
            Integrantes
          </button>


          {/* ========================= */}
          {/* MOVIMIENTOS */}
          {/* SOLO 1, 2, 3 Y 15 */}
          {/* ========================= */}

          {puedeVerMovimientos && (
            <button
              onClick={() => setSection("Movimientos")}
              className={btnClass(
                section === "Movimientos"
              )}
            >
              Movimientos
            </button>
          )}


          {/* ========================= */}
          {/* MIS CUOTAS */}
          {/* TODOS EXCEPTO 15 */}
          {/* ========================= */}

          {puedeVerMisCuotas && (
            <button
              onClick={() => setSection("MisCuotas")}
              className={btnClass(
                section === "MisCuotas"
              )}
            >
              Mis Cuotas
            </button>
          )}


          {/* ========================= */}
          {/* CUOTAS */}
          {/* 1, 2, 3 Y 15 */}
          {/* ========================= */}

          {puedeVerCuotas && (
            <button
              onClick={() => setSection("Cuotas")}
              className={btnClass(
                section === "Cuotas"
              )}
            >
              Cuotas
            </button>
          )}

        </nav>

      </div>


      {/* ========================= */}
      {/* LOGOUT */}
      {/* ========================= */}

      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 transition text-white font-bold py-3 rounded-xl"
      >
        Cerrar sesión
      </button>

    </aside>
  );
}