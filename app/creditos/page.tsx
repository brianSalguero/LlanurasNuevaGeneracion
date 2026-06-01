"use client";

import { motion } from "framer-motion";
import Footer from "@/components/Footer/Footer";

type Credito = {
  titulo: string;
  autor?: string;
  fuente?: string;
  licencia?: string;
  url: string;
  tipo: "imagen" | "icono" | "audio" | "otro";
};

const creditos: Credito[] = [
  {
    titulo: "Icono danza (Ballroom Dance)",
    fuente: "Icons8",
    licencia: "Link (CDN) gratuito con atribución requerida",
    url: "https://icons8.com/icon/49244/ballroom-dance",
    tipo: "icono",
  },
  {
    titulo: "Miami-Dade County Public Schools (Flickr / Knight Foundation)",
    autor: "Knight Foundation - Miami-Dade County Public Schools",
    fuente: "Wikimedia Commons",
    licencia: "CC BY-SA 2.0",
    url: "https://commons.wikimedia.org/w/index.php?curid=19522194",
    tipo: "imagen",
  },
  {
    titulo: "San Juanito",
    autor: "G. Garitan",
    fuente: "Wikimedia Commons",
    licencia: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/w/index.php?curid=133649365",
    tipo: "imagen",
  },

  {
    titulo: "Bomba del Chota",
    autor: "Donrembe",
    fuente: "Wikimedia Commons",
    licencia: "CC0",
    url: "https://commons.wikimedia.org/w/index.php?curid=154147565",
    tipo: "imagen",
  },

  {
    titulo: "Danzantes de Pujilí",
    autor: "Ministerio de Turismo Ecuador",
    fuente: "Flickr",
    licencia: "Uso institucional / atribución de autor",
    url: "https://www.flickr.com/photos/amalavidatv/35219585106/",
    tipo: "imagen",
  },

  {
    titulo: "Diablada de Píllaro",
    autor: "Agencia de Noticias ANDES",
    fuente: "Wikimedia Commons",
    licencia: "CC BY-SA 2.0",
    url: "https://commons.wikimedia.org/w/index.php?curid=68450517",
    tipo: "imagen",
  },

  {
    titulo: "Capishca",
    autor: "TupakAmaruIshkay",
    fuente: "Wikimedia Commons",
    licencia: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/w/index.php?curid=87551367",
    tipo: "imagen",
  },

  {
    titulo: "Amorfino (Baile Montubio)",
    autor: "Presidencia del Ecuador",
    fuente: "Flickr",
    licencia: "Dominio público",
    url: "https://commons.wikimedia.org/w/index.php?curid=143829750",
    tipo: "imagen",
  },

  {
    titulo: "Danza Shuar",
    autor: "Jlh249",
    fuente: "Wikimedia Commons",
    licencia: "CC BY-SA 3.0",
    url: "https://commons.wikimedia.org/w/index.php?curid=20307309",
    tipo: "imagen",
  },

  {
    titulo: "Danza Kichwa Amazónica",
    autor: "Sergio Carranza Basantes",
    fuente: "Wikimedia Commons",
    licencia: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/w/index.php?curid=128991391",
    tipo: "imagen",
  },

  {
    titulo: "Pasacalle Ecuatoriano",
    autor: "Hubertl",
    fuente: "Wikimedia Commons",
    licencia: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/w/index.php?curid=26609304",
    tipo: "imagen",
  },

  {
    titulo: "Diablo Huma",
    autor: "TupakAmaruIshkay",
    fuente: "Wikimedia Commons",
    licencia: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/w/index.php?curid=131671481",
    tipo: "imagen",
  },
];

export default function CreditosPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-6 py-20">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-amber-500">
          Créditos
        </h1>

        <p className="text-slate-500 mt-4">
          Recursos, imágenes e iconos utilizados en este proyecto
        </p>
      </motion.div>

      {/* LISTA */}
      <div className="max-w-4xl mx-auto space-y-4">

        {creditos.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:scale-[1.01] transition"
          >

            <div className="flex justify-between items-start gap-4">

              {/* INFO */}
              <div>
                <h2 className="font-bold text-lg">{c.titulo}</h2>

                <div className="text-sm text-slate-500 mt-1 space-y-1">
                  {c.autor && <p>Autor: {c.autor}</p>}
                  {c.fuente && <p>Fuente: {c.fuente}</p>}
                  {c.licencia && <p>Licencia: {c.licencia}</p>}
                </div>
              </div>

              {/* LINK */}
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition"
              >
                Ver
              </a>
            </div>

          </motion.div>
        ))}

      </div>

      {/* FOOT NOTE */}
      <div className="text-center text-xs text-slate-500 mt-16">
        Este proyecto utiliza recursos de terceros respetando sus licencias correspondientes.
      </div>
      <Footer />
    </main >
  );
}