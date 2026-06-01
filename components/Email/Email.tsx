'use client';

import emailjs from "@emailjs/browser";
import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Turnstile = dynamic(
    () => import("@marsidev/react-turnstile").then(m => m.Turnstile),
    { ssr: false }
);

type Status = "idle" | "verifying" | "verified" | "error";

export default function EmailForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const turnstileRef = useRef<any>(null);
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [status, setStatus] = useState<Status>("idle");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const resetTurnstile = () => {
        setToken(null);
        setStatus("idle");
        turnstileRef.current?.reset?.();
    };

    const sendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        const form = formRef.current;
        if (!form) return;

        const honeypot = (form.elements.namedItem("website") as HTMLInputElement)?.value;
        if (honeypot) return;

        if (status !== "verified") {
            setError("Debes completar la verificación antes de enviar");
            return;
        }

        setLoading(true);

        try {
            await emailjs.sendForm(
                "service_ocy7pej",
                "template_d3r32rt",
                form,
                "cBOQdWEDn6MhU9l76"
            );

            setSuccess(true);

            setTimeout(() => {
                setSuccess(false);
            }, 4000);

            form.reset();
            resetTurnstile();

        } catch (err) {
            console.error(err);
            setError("Error al enviar el mensaje");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form
                ref={formRef}
                onSubmit={sendEmail}
                className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 space-y-6 border border-slate-200 dark:border-slate-700"
            >
                {/* HONEYPOT */}
                <input
                    type="text"
                    name="website"
                    className="hidden"
                    autoComplete="off"
                    tabIndex={-1}
                />

                {/* INPUTS */}
                <input name="nombre" placeholder="Nombre" className="w-full border p-3 rounded-xl" />
                <input name="email" placeholder="Email" className="w-full border p-3 rounded-xl" />
                <textarea name="mensaje" placeholder="Mensaje" rows={5} className="w-full border p-3 rounded-xl" />

                {/* CAPTCHA BLOQUE */}
                <div className="w-full flex flex-col gap-3">

                    {/* BOTÓN CHECK */}
                    {status === "idle" && (
                        <button
                            type="button"
                            onClick={() => setStatus("verifying")}
                            className="w-full flex items-center justify-between px-5 py-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-amber-500 transition group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-slate-400 rounded-sm group-hover:border-amber-500 transition" />
                                <span className="text-sm text-slate-700 dark:text-slate-200">
                                    Verificar que no eres un robot
                                </span>
                            </div>

                            <span className="text-xs text-slate-400">
                                requerido
                            </span>
                        </button>
                    )}

                    {/* VERIFYING */}
                    {status === "verifying" && (
                        <div className="w-full flex flex-col items-center gap-3 px-5 py-4 rounded-xl border border-amber-400 bg-amber-50 dark:bg-slate-900">
                            <p className="text-sm text-slate-600 animate-pulse">
                                Verificando seguridad...
                            </p>

                            <Turnstile
                                ref={turnstileRef}
                                siteKey="0x4AAAAAADbUd-rg3Bq1gwbK"
                                options={{
                                    action: "contact",
                                    size: "normal",
                                }}
                                onSuccess={(t) => {
                                    setToken(t);
                                    setStatus("verified");
                                }}
                                onExpire={resetTurnstile}
                                onError={() => {
                                    setStatus("error");
                                    resetTurnstile();
                                }}
                            />
                        </div>
                    )}

                    {/* VERIFIED */}
                    {status === "verified" && (
                        <div className="w-full flex items-center justify-between px-5 py-4 rounded-xl border border-green-500 bg-green-50 dark:bg-slate-900">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 bg-green-500 rounded-sm flex items-center justify-center text-white text-xs">
                                    ✓
                                </div>
                                <span className="text-sm text-green-700 dark:text-green-400">
                                    Verificación completada
                                </span>
                            </div>

                            <span className="text-xs text-green-500">
                                seguro
                            </span>
                        </div>
                    )}

                    {/* ERROR */}
                    {status === "error" && (
                        <button
                            type="button"
                            onClick={resetTurnstile}
                            className="w-full px-5 py-4 rounded-xl border border-red-300 bg-red-50 text-red-600 text-sm hover:border-red-500 transition"
                        >
                            Error en la verificación — Reintentar
                        </button>
                    )}

                </div>

                {/* BOTÓN */}
                <button
                    type="submit"
                    disabled={status !== "verified" || loading}
                    className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold disabled:opacity-50"
                >
                    {loading ? "Enviando..." : "Enviar mensaje"}
                </button>

                {/* ERROR */}
                {error && (
                    <p className="text-red-500 text-sm">
                        {error}
                    </p>
                )}
            </form>
            {
                success && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-in">
                        <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                            ✓
                        </span>

                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">
                                ¡Mensaje enviado!
                            </span>
                            <span className="text-xs text-gray-300">
                                Te responderé lo antes posible
                            </span>
                        </div>
                    </div>
                )
            }
        </>
    );
}