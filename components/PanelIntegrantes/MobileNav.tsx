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


export default function MobileNav({ section, setSection, onLogout, session }: Props) {

  const usuariosCuotas = [1, 2, 3, 15];
  const puedeVerCuotas = usuariosCuotas.includes(session.id);

  const btnClass = (active: boolean) =>
    `flex-1 py-3 text-sm font-semibold transition ${active
      ? 'bg-amber-500 text-white'
      : 'hover:bg-slate-200 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="pt-20 md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex">

      <button
        onClick={() => setSection('Dashboard')}
        className={btnClass(section === 'Dashboard')}
      >
        Panel
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
      <button
        onClick={onLogout}
        className="md:hidden fixed bottom-4 left-4 bg-red-500 hover:bg-red-600 transition text-white font-bold py-3 px-6 rounded-xl shadow-lg z-50"
      >
        Cerrar sesión
      </button>
    </div>
  );
}