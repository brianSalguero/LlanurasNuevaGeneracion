type Section = 'Dashboard' | 'Integrantes' | 'MisCuotas' | 'Cuotas';

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
  session
}: Props) {
  const btnClass = (active: boolean) =>
    `w-full text-left px-4 py-3 rounded-xl font-semibold transition ${active
      ? 'bg-amber-500 text-white'
      : 'hover:bg-slate-200 dark:hover:bg-slate-800'
    }`;


  const usuariosCuotas = [1, 2, 3, 15];
  const puedeVerCuotas = usuariosCuotas.includes(session.id);

  return (
    <aside className="hidden md:flex fixed left-0 top-20 h-[calc(100vh-80px)] w-72 flex-col justify-between bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6">      {/* TOP */}
      <div>

        {/* NAV */}
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setSection('Dashboard')}
            className={btnClass(section === 'Dashboard')}
          >
            Panel de control
          </button>

          <button
            onClick={() => setSection('Integrantes')}
            className={btnClass(section === 'Integrantes')}
          >
            Integrantes
          </button>

          <button
            onClick={() => setSection('MisCuotas')}
            className={btnClass(section === 'MisCuotas')}
          >
            Mis Cuotas
          </button>

          {puedeVerCuotas && (
            <button
              onClick={() => setSection('Cuotas')}
              className={btnClass(section === 'Cuotas')}
            >
              Cuotas
            </button>
          )}
        </nav>
      </div>

      {/* BOTTOM */}
      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 transition text-white font-bold py-3 rounded-xl"
      >
        Cerrar sesión
      </button>

    </aside>
  );
}