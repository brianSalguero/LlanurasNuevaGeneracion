'use client';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white py-14 px-6 mt-20">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* BLOQUE PRINCIPAL: LOGO + TEXTO (FULL WIDTH) */}
        <div className="flex flex-row items-center gap-6 max-w-5xl mx-auto w-full px-4">
          <img
            src="/logo/logo.PNG"
            alt="Logo"
            className="w-28 h-28 object-contain flex-shrink-0"
          />

          <p className="text-gray-300 leading-relaxed text-base md:text-lg">
            Nuestro compromiso es mantener viva la tradición y compartir la
            alegría de la danza ecuatoriana con el mundo. Ven y sé parte de
            esta experiencia.
          </p>
        </div>
        <div className="w-full border-t border-white/10" />
        {/* TARJETAS IGUALES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CONTACTO */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-amber-300 mb-4 border-b border-amber-400/30 pb-2">
              Contacto
            </h3>

            <p className="text-amber-400 font-semibold hover:text-amber-300 transition">
              📧 llanurasnuevageneracion@gmail.com
            </p>

            <p className="text-amber-400 font-semibold mt-2 hover:text-amber-300 transition">
              📞 +34 631 67 49 09
            </p>
          </div>

          {/* AVISO LEGAL */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-amber-300 mb-4 border-b border-amber-400/30 pb-2">
              Legal
            </h3>

            <a
              href="/aviso-legal"
              className="text-gray-300 hover:text-amber-400 transition mb-2"
            >
              Aviso legal
            </a>

            <a
              href="/politica-privacidad"
              className="text-gray-300 hover:text-amber-400 transition mb-2"
            >
              Política de privacidad
            </a>
            <a
              href="/creditos"
              className="text-gray-300 hover:text-amber-400 transition"
            >
              Créditos
            </a>
          </div>

          {/* REDES SOCIALES */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-amber-300 mb-4 border-b border-amber-400/30 pb-2">
              Síguenos
            </h3>

            <div className="flex gap-4">
              {[
                { src: "/icons/facebook.png", alt: "Facebook", href: "https://www.facebook.com/profile.php?id=61574222012871" },
                { src: "/icons/instagram.png", alt: "Instagram", href: "https://www.instagram.com/llanurasnuevageneracion/?hl=es" },
                { src: "/icons/youtube.png", alt: "YouTube" },
                { src: "/icons/tik-tok.png", alt: "TikTok", href: "https://www.tiktok.com/@llanurasnuevageneracion?is_from_webapp=1&sender_device=pc" },
              ].map((icon, i) => (
                <a
                  key={i}
                  href={icon.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition flex items-center justify-center"
                >
                  <img
                    src={icon.src}
                    alt={icon.alt}
                    className="w-6 h-6 object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
        {/* COPYRIGHT */}
        <div className="border-t border-white/10 pt-6 text-center text-sm text-gray-400">
          © 2026 Grupo de Danza Ecuatoriana — Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}