type Section = 'news' | 'members' | 'gallery';

type Props = {
  section: Section;
  setSection: (s: Section) => void;
  onLogout: () => void;
};

export default function Sidebar({
  section,
  setSection,
  onLogout,
}: Props) {
  const btnClass = (active: boolean) =>
    `w-full text-left px-4 py-3 rounded-xl font-semibold transition ${active
      ? 'bg-amber-500 text-white'
      : 'hover:bg-slate-200 dark:hover:bg-slate-800'
    }`;

  return (
    <aside className="hidden md:flex fixed left-0 top-20 h-[calc(100vh-80px)] w-72 flex-col justify-between bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6">      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-amber-500">
            Admin Panel
          </h1>
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setSection('news')}
            className={btnClass(section === 'news')}
          >
            Noticias
          </button>

          <button
            onClick={() => setSection('members')}
            className={btnClass(section === 'members')}
          >
            Integrantes
          </button>

          <button
            onClick={() => setSection('gallery')}
            className={btnClass(section === 'gallery')}
          >
            Galería
          </button>
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