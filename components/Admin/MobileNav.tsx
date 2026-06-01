import { supabase } from '@/lib/supabase';

type Section = 'news' | 'members' | 'gallery';

type Props = {
  section: Section;
  setSection: (s: Section) => void;
  onLogout: () => void;
};


export default function MobileNav({ section, setSection, onLogout }: Props) {

  const btnClass = (active: boolean) =>
    `flex-1 py-3 font-semibold transition ${active
      ? 'bg-amber-500 text-white'
      : 'hover:bg-slate-200 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="pt-20 md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex">

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
      <button
        onClick={onLogout}
        className="md:hidden fixed bottom-4 left-4 bg-red-500 hover:bg-red-600 transition text-white font-bold py-3 px-6 rounded-xl shadow-lg z-50"
      >
        Cerrar sesión
      </button>
    </div>
  );
}