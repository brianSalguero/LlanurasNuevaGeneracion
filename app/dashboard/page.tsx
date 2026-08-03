"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950 flex">

      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 bg-slate-900 flex-col">

        {/* Logo */}
        <div className="h-24 border-b border-slate-800 flex items-center justify-center">
          <img
            src="/logo/logosintitulo.png"
            alt="Logo"
            className="h-16"
          />
        </div>

        {/* Menú */}
        <nav className="flex-1 p-5 space-y-2">

          <Link
            href="/dashboard"
            className="block px-4 py-3 rounded-xl bg-amber-500 text-white font-semibold"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/finanzas"
            className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition"
          >
            Finanzas
          </Link>

          <Link
            href="/dashboard/integrantes"
            className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition"
          >
            Integrantes
          </Link>

          <Link
            href="/dashboard/eventos"
            className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition"
          >
            Eventos
          </Link>

          <Link
            href="/dashboard/inventario"
            className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition"
          >
            Inventario
          </Link>

          <Link
            href="/dashboard/configuracion"
            className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition"
          >
            Configuración
          </Link>

        </nav>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800">
          <button
            className="
              w-full
              bg-red-500
              hover:bg-red-600
              text-white
              rounded-xl
              py-3
              font-semibold
              transition
            "
          >
            Cerrar sesión
          </button>
        </div>

      </aside>

      {/* Contenido */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8">

          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Dashboard
          </h1>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-semibold text-slate-800 dark:text-white">
                Usuario
              </p>

              <p className="text-sm text-slate-500">
                Integrante
              </p>
            </div>
          </div>

        </header>

        {/* Zona donde irá el contenido */}
        <section className="flex-1 p-8">
          <div
            className="
              h-full
              rounded-2xl
              bg-white
              dark:bg-slate-900
              border
              border-slate-200
              dark:border-slate-800
            "
          />
        </section>

      </div>

    </main>
  );
}