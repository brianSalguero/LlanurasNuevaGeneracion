
'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Footer from "@/components/Footer/Footer";

export default function Conocenos() {

  const [integrantes, setIntegrantes] = useState<
    {
      id: number;
      nombre: string;
      apellido: string;
      rol: string;
      imagen: string;
      instagram: string;
      facebook: string;
      tiktok: string;
    }[]
  >([]);

  useEffect(() => {

    fetchIntegrantes();

  }, []);

  const fetchIntegrantes = async () => {

    const { data, error } = await supabase
      .from('integrantes')
      .select('*')
      .order('created_at', { ascending: true });

    if (data) {
      setIntegrantes(data);
    }

    if (error) {
      console.log(error);
    }

  };

  return (
    <main className="pt-22">

      {/* Sección principal */}
      <section className="max-w-6xl md:mx-auto mx-4 bg-white rounded-3xl shadow-xl overflow-hidden px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center p-6">

          {/* Texto */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-amber-500 mb-6 text-center">
              ¿QUIÉNES SOMOS?
            </h1>

            <p className="text-gray-700 text-base leading-relaxed">
              Somos un grupo de jóvenes apasionados por la danza tradicional
              ecuatoriana, dedicados a preservar y compartir la riqueza cultural
              de nuestro país.
            </p>

            <p className="text-gray-700 text-base leading-relaxed mt-4">
              Cada uno de nosotros aporta su energía, creatividad y amor por la
              cultura en cada ensayo y presentación. Nuestro objetivo es
              fusionar el arte y la tradición, dándole un toque moderno, sin
              perder la esencia de nuestras raíces.
            </p>

            <p className="text-gray-700 text-base leading-relaxed mt-4">
              Creemos que la danza es más que un simple movimiento; es una forma
              de contar historias, de conectar con nuestras raíces y de unir a
              nuestra comunidad.
            </p>

            <p className="text-amber-500 font-semibold text-base mt-4">
              ¡Aquí lo que más importa es el amor por la danza y la cultura
              ecuatoriana!
            </p>
          </div>

          {/* Imagen principal */}
          <div>
            <img
              src="/images/image1.jpg"
              alt="Grupo de danza ecuatoriana"
              className="w-full h-[250px] object-cover rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Integrantes */}
      <section className="max-w-6xl md:mx-auto mx-4 mt-20">
        <h2 className="text-3xl font-bold text-center text-amber-500 mb-12">
          INTEGRANTES
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {integrantes.map((persona) => (
            <div
              key={persona.id}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:scale-105 transition duration-300"
            >
              <img
                src={persona.imagen || "/logo/logosintitulo.png"}
                alt={persona.nombre}
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-yellow-400 mb-4"
              />

              <h3 className="text-xl font-bold text-gray-800">
                {persona.nombre} {persona.apellido}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {persona.rol}
              </p>

              {/* Redes sociales */}
              <div className="flex justify-center gap-4 mt-5">

                {persona.facebook && (
                  <a
                    href={persona.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-slate-100 hover:bg-amber-500/20 hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-md"
                  >
                    <img
                      src="/icons/facebook.png"
                      alt="Facebook"
                      className="w-6 h-6 object-contain"
                    />
                  </a>
                )}

                {persona.instagram && (
                  <a
                    href={persona.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-slate-100 hover:bg-amber-500/20 hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-md"
                  >
                    <img
                      src="/icons/instagram.png"
                      alt="Instagram"
                      className="w-6 h-6 object-contain"
                    />
                  </a>
                )}

                {persona.tiktok && (
                  <a
                    href={persona.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-slate-100 hover:bg-amber-500/20 hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-md"
                  >
                    <img
                      src="/icons/tik-tok.png"
                      alt="TikTok"
                      className="w-6 h-6 object-contain"
                    />
                  </a>
                )}

              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>

  );
}