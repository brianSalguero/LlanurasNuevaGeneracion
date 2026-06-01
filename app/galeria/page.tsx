'use client';

import { useState, useEffect } from "react";
import Footer from "@/components/Footer/Footer";
import { supabase } from "@/lib/supabase";

/* =========================
   IMÁGENES PROGRESIVAS
========================= */
function ImageGrid({ images }: { images: string[] }) {
  const [count, setCount] = useState(8);
  const [imagenActiva, setImagenActiva] = useState<string | null>(null);

  const visible = images.slice(0, count);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {visible.map((img, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden cursor-pointer"
            onClick={() => setImagenActiva(img)}
          >
            <img
              src={img}
              alt={`Imagen ${i + 1}`}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className="w-full h-28 sm:h-36 md:h-40 object-cover bg-slate-100 dark:bg-slate-800"
            />
          </div>
        ))}
      </div>

      {count < images.length && (
        <div className="text-center mt-4">
          <button
            onClick={() => setCount((c) => c + 8)}
            className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition"
          >
            Cargar más
          </button>
        </div>
      )}
      {/* LIGHTBOX */}
      {imagenActiva && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setImagenActiva(null)}
        >
          <img
            src={imagenActiva}
            alt="Imagen ampliada"
            className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </>
  );
}

/* =========================
   MAIN
========================= */
export default function Galeria() {
  const [abierto, setAbierto] = useState<number | null>(null);
  const [galerias, setGalerias] = useState<any[]>([]);

  const toggleGaleria = (index: number) => {
    setAbierto((prev) => (prev === index ? null : index));
  };

  const getYouTubeThumbnail = (url?: string) => {
    if (!url) return "";

    try {
      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith("http")) cleanUrl = "https://" + cleanUrl;

      const parsed = new URL(cleanUrl);
      let id = "";

      if (parsed.hostname.includes("youtu.be")) {
        id = parsed.pathname.replace("/", "");
      }

      if (parsed.hostname.includes("youtube.com")) {
        id = parsed.searchParams.get("v") || "";
      }

      if (parsed.pathname.includes("/embed/")) {
        id = parsed.pathname.split("/embed/")[1];
      }

      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
    } catch {
      return "";
    }
  };

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      const { data } = await supabase
        .from("galerias")
        .select("*")
        .order("created_at", { ascending: false });

      if (ignore) return;

      const formatted = await Promise.all(
        (data || []).map(async (g) => {
          const { data: imagenes } = await supabase
            .from("galeria_imagenes")
            .select("url")
            .eq("galeria_id", g.id);

          const { data: videos } = await supabase
            .from("galeria_videos")
            .select("url")
            .eq("galeria_id", g.id);

          return {
            ...g,
            imagenes: imagenes?.map((i) => i.url) || [],
            videos: videos?.map((v) => v.url) || [],
          };
        })
      );

      if (!ignore) setGalerias(formatted);
    };

    load();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="overflow-x-hidden bg-white dark:bg-slate-950 pt-20 min-h-screen">

      {/* HERO */}
      <section className="text-center py-6 md:py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-amber-500 dark:text-white">
          GALERÍA
        </h1>
      </section>

      {/* LISTA */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">

        {galerias.map((evento, index) => {
          const isOpen = abierto === index;

          return (
            <div
              key={evento.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden"
            >

              {/* HEADER */}
              <button
                onClick={() => toggleGaleria(index)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                {/* 👇 BLOQUE IZQUIERDA */}
                <div className="text-left">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white text-left">
                    {evento.lugar}
                  </h2>

                  <p className="text-amber-500 text-sm text-left">
                    {evento.fecha}
                  </p>
                </div>

                {/* BOTÓN + / - */}
                <span className="text-2xl text-amber-500 ml-4 shrink-0">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {/* CONTENT */}
              {isOpen && (
                <div className="px-6 pb-6">

                  {/* VIDEOS */}
                  {evento.videos?.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">
                        Videos
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {evento.videos.map((video: string, i: number) => {
                          const thumb = getYouTubeThumbnail(video);

                          return (
                            <a
                              key={i}
                              href={video}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative aspect-video rounded-xl overflow-hidden group block"
                            >
                              {thumb && (
                                <img
                                  src={thumb}
                                  alt="video"
                                  loading="lazy"
                                  className="w-full h-full object-cover"
                                />
                              )}

                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-3xl">
                                ▶
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* IMÁGENES (🔥 PROGRESIVO) */}
                  {evento.imagenes?.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">
                        Fotografías
                      </h3>

                      <ImageGrid images={evento.imagenes} />
                    </div>
                  ) : (
                    <p className="text-slate-400 text-center py-6">
                      No hay imágenes disponibles
                    </p>
                  )}

                </div>
              )}

            </div>
          );
        })}

      </section>

      <div className="mt-10 md:mt-16">
        <Footer />
      </div>
    </main>
  );
}