'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

const imagesDesktop = [
  "/images/image1.jpg",
  "/images/image2.jpg",
  "/images/image3.JPG",
];

const imagesMobile = [
  "/images/mobile1.jpg",
  "/images/mobile2.jpg",
  "/images/mobile3.jpg",
];

export default function ImagesSlide() {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  const images = isMobile ? imagesMobile : imagesDesktop;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000); // cambia cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden z-0">

      {/* IMAGENES */}
      {images.map((img, i) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"
            }`}
        >
          <img
            src={img}
            alt="hero"
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* OVERLAY MÁS CINEMATOGRÁFICO */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* CONTENIDO */}
      <div className="relative flex h-full items-end md:items-end justify-start text-left text-white px-6 pb-18 md:p-16">

        {/* BLOQUE */}
        <div className="max-w-3xl space-y-5">

          {/* BADGE */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs tracking-[0.3em] uppercase text-orange-200 border border-white/10 ">
            Cultura · Tradición · Identidad
          </div>

          {/* TITULO PRINCIPAL */}
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-2xl ">
            Preservamos la tradición
          </h1>

          {/* SUBTITULO */}
          <p className="text-lg md:text-2xl text-white/80 font-light leading-relaxed max-w-xl">
            Vivimos la cultura, honramos nuestras raíces y llevamos el folklóre ecuatoriano a cada escenario.
          </p>

          {/* SEPARADOR */}
          <div className="h-[3px] w-28 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full" />

          <div className="pt-3 flex gap-4">
            <Link
              href="/noticias"
              className="cursor-pointer rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Ver eventos
            </Link>

            <Link
              href="/conocenos"
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm text-white hover:bg-white/10 transition"
            >
              Conócenos
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}