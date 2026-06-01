'use client';

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Inicio", href: "/" },
    { name: "Noticias", href: "/noticias" },
    { name: "Galería", href: "/galeria" },
    { name: "Folclore", href: "/historia" },
    { name: "Conócenos", href: "/conocenos" },
    { name: "Contacto", href: "/contacto" },
  ];

  return (
    <header className="fixed top-0 left-0 z-[9999] w-full border-b border-white/10 bg-[oklch(44.3%_0.11_240.79_/_0.7)]">

      <div className=" flex h-20  items-center justify-between px-6 relative">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
            <Image
              src="/logo/logosintitulo.png"
              alt="Llanuras Nueva Generación"
              width={70}
              height={70}
              className="object-contain"
            />
          </div>

          <div className="flex flex-col justify-center leading-tight">
            <h1 className="text-white font-bold text-base sm:text-xl md:text-2xl">
              Llanuras Nueva Generación
            </h1>

            <p className="text-xs sm:text-sm text-blue-200 tracking-[0.25em] uppercase font-bold">
              Danza Folklórica
            </p>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <nav className=" group hidden md:flex gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-white text-sm hover:text-orange-300 transition"
            >
              {link.name}
              <span className="absolute left-0 -bottom-2 h-[2px] w-0 bg-blue-400 transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white z-10000"
        >
          {open ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 12h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>


      {/* MOBILE MENU */}
      {open ? (
        <div
          className="md:hidden fixed inset-0 z-[9999] bg-black/95 border-t border-white/10"
        >
          <nav className="flex flex-col px-6 py-6 gap-4 mt-20">

            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-white py-3 border-b border-white/10 hover:text-blue-300"
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/contacto"
              onClick={() => setOpen(false)}
              className="mt-4 text-center bg-[oklch(58.8%_0.158_241.966_/_0.7)] py-3 rounded-full font-semibold text-white"
            >
              ¡Contáctanos ya!
            </Link>

          </nav>
        </div>
      ) : null}
    </header>
  );
}