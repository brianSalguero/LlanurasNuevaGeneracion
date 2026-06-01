'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Footer from "@/components/Footer/Footer";

export default function Noticias() {
  const [abierta, setAbierta] = useState<number | null>(null);

  const [noticias, setNoticias] = useState<
    {
      id: number;
      titulo: string;
      descripcion: string;
      imagen: string;
      created_at: string;
    }[]
  >([]);

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {

    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .eq('publicado', true)
      .order('id', { ascending: false });

    if (data) {
      setNoticias(data);
    }

    if (error) {
      console.log(error);
    }

  };

  const toggleNoticia = (id: number) => {
    setAbierta(abierta === id ? null : id);
  };

  return (
    <main className="overflow-x-hidden bg-white dark:bg-slate-950 pt-15 min-h-screen">

      {/* HERO */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-amber-500">
          NOTICIAS
        </h1>

        <p className="text-slate-600 dark:text-gray-300 mt-4">
          Eventos, anuncios y novedades del grupo
        </p>
      </section>

      {/* LISTA DE NOTICIAS */}
      <section className="max-w-7xl mx-auto px-6 pb-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {noticias.map((item) => {
          const isOpen = abierta === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >

              {/* CABECERA */}
              <button
                onClick={() => toggleNoticia(item.id)}
                className="w-full text-left"
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={item.imagen || "/logo/logosintitulo.png"}
                    alt={item.titulo}
                    className="w-full h-full object-cover hover:scale-105 transition duration-700"
                  />
                </div>

                <div className="p-6 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {item.titulo}
                    </h2>

                    <p className="text-amber-500 mt-2">
                      {new Date(item.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>

                    <p
                      className={`whitespace-pre-line text-slate-600 dark:text-gray-300 mt-3 transition-all duration-300 ${isOpen ? "max-h-none" : "line-clamp-3"
                        }`}
                    >
                      {item.descripcion}
                    </p>

                  </div>

                  <span className="text-3xl text-amber-500 ml-4">
                    {isOpen ? "−" : "+"}
                  </span>
                </div>
              </button>

            </motion.div>
          );
        })}
      </section>

      <Footer />
    </main>
  );
}