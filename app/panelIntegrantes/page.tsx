"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import IntegrantesLayout from "@/components/PanelIntegrantes/IntegrantesLayout";
import Sidebar from "@/components/PanelIntegrantes/Sidebar";
import MobileNav from "@/components/PanelIntegrantes/MobileNav";
import Dashboard from "@/components/PanelIntegrantes/Dashboard/Dashboard";

type Section = "Dashboard" | "members" | "gallery";

export default function DashboardPage() {
  const router = useRouter();

  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [recordarme, setRecordarme] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [section, setSection] = useState<Section>("Dashboard");

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
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

      setSession(data.user);

      router.refresh();
    } catch {
      setError("Ha ocurrido un error.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });

    setSession(null);

    router.refresh();
  };

  // =========================
  // COMPROBAR SESIÓN
  // =========================

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/session");

        const data = await res.json();

        if (data.logged) {
          setSession(data.user);
        } else {
          setSession(null);
        }
      } finally {
        setAuthLoading(false);
      }
    };

    checkSession();
  }, []);

  // =========================

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Cargando...
      </main>
    );
  }

  // =========================
  // LOGIN
  // =========================

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-6">
        <div className="w-full max-w-md">
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
            className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-8 shadow-xl space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold mb-2">
                Usuario
              </label>

              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 px-4"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Contraseña
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 px-4"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="recordarme"
                type="checkbox"
                checked={recordarme}
                onChange={(e) => setRecordarme(e.target.checked)}
                className="accent-amber-500"
              />

              <label htmlFor="recordarme">
                Recordarme
              </label>
            </div>

            {error && (
              <div className="rounded-xl bg-red-100 border border-red-300 text-red-700 px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-3 rounded-xl"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <IntegrantesLayout>
      <Sidebar
        section={section}
        setSection={setSection}
        onLogout={handleLogout}
      />

      <MobileNav
        section={section}
        setSection={setSection}
        onLogout={handleLogout}
      />
            <div className="flex-1 md:ml-72 p-6 overflow-x-hidden pt-10">
      
              {section === 'Dashboard' && <Dashboard session={session} />}
      
            </div>
    </IntegrantesLayout>
  );
}