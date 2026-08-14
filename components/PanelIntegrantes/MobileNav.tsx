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

export default function MobileNav({
  section,
  setSection,
  onLogout,
  session,
}: Props) {

  // =========================
  // PERMISOS
  // =========================

  // IDs 1, 2, 3 y 15
  // pueden ver Movimientos
  const usuariosMovimientos = [1, 2, 3, 15];

  const puedeVerMovimientos =
    usuariosMovimientos.includes(session.id);


  // IDs 1, 2, 3 y 15
  // pueden ver Cuotas
  const usuariosCuotas = [1, 2, 3, 15];

  const puedeVerCuotas =
    usuariosCuotas.includes(session.id);


  // Todos excepto el ID 15
  // pueden ver Mis Cuotas
  const puedeVerMisCuotas =
    session.id !== 15;


  // =========================
  // ESTILOS
  // =========================

  const btnClass = (active: boolean) =>
    `flex-1 py-3 text-xs font-semibold transition ${
      active
        ? "bg-amber-500 text-white"
        : "hover:bg-slate-200 dark:hover:bg-slate-800"
    }`;


  return (
    <div className="pt-20 md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex">

      {/* ========================= */}
      {/* DASHBOARD */}
      {/* ========================= */}

      <button
        onClick={() => setSection("Dashboard")}
        className={btnClass(
          section === "Dashboard"
        )}
      >
        Panel
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


      {/* ========================= */}
      {/* LOGOUT */}
      {/* ========================= */}

      <button
        onClick={onLogout}
        className="md:hidden fixed bottom-4 left-4 bg-red-500 hover:bg-red-600 transition text-white font-bold py-3 px-6 rounded-xl shadow-lg z-50"
      >
        Cerrar sesión
      </button>

    </div>
  );
}