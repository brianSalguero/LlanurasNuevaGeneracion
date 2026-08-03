"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [recordarme, setRecordarme] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      console.log("Haciendo fetch...");
      const res = await fetch("/api/loginIntegrantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario,
          password,
          recordarme,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Ha ocurrido un error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-5">
          <img
            src="/logo/logosintitulo.png"
            alt="Llanuras"
            className="w-35 mx-auto mb-4"
          />

          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Llanuras Nueva Generación
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Área privada del grupo
          </p>
        </div>

          <form
            onSubmit={handleLogin}
            className="w-full max-w-md bg-slate-100 dark:bg-slate-900 rounded-3xl p-8 shadow-xl space-y-6"
          >
            {/* Usuario */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Usuario
              </label>

              <input
                type="text"
                placeholder="Introduce tu usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-700
                  bg-white
                  dark:bg-slate-800
                  py-3
                  px-4
                  outline-none
                  focus:border-amber-500
                  focus:ring-2
                  focus:ring-amber-500/20
                  transition
                "
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Contraseña
              </label>

              <input
                type="password"
                placeholder="Introduce tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-700
                  bg-white
                  dark:bg-slate-800
                  py-3
                  px-4
                  outline-none
                  focus:border-amber-500
                  focus:ring-2
                  focus:ring-amber-500/20
                  transition
                "
              />
            </div>

            {/* Recordarme */}
            <div className="flex items-center gap-2">
              <input
                id="recordarme"
                type="checkbox"
                checked={recordarme}
                onChange={(e) => setRecordarme(e.target.checked)}
                className="accent-amber-500 w-4 h-4"
              />

              <label
                htmlFor="recordarme"
                className="text-sm text-slate-600 dark:text-slate-300"
              >
                Recordarme
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-100 text-red-700 border border-red-300 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-amber-500
                hover:bg-amber-600
                disabled:bg-amber-300
                text-white
                font-bold
                py-3
                rounded-xl
                transition
                shadow-lg
                hover:shadow-xl
              "
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
    </main>
  );
}