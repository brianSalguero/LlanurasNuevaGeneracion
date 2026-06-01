'use client';

import Footer from "@/components/Footer/Footer";

export default function PoliticaPrivacidad() {
  const phone = "+34631674909";
  return (
    <main className="pt-20 min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">

      <section className="max-w-4xl mx-auto px-6 py-16">

        <h1 className="text-4xl font-extrabold text-amber-500 mb-8">
          Política de Privacidad
        </h1>

        <p className="mb-4">
          Esta política de privacidad describe cómo se gestiona la información personal
          recopilada a través de este sitio web, en cumplimiento con la normativa vigente
          en materia de protección de datos.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">
          Responsable del tratamiento
        </h2>
        <p className="mb-2"><strong>Nombre:</strong> Brian Aaron Salguero Estrella</p>
        <p className="mb-2"><strong>Correo electrónico:</strong> llanurasnuevageneracion@gmail.com</p>
        <p className="mb-2">
          <strong>Teléfono:</strong>{" "}
          <span>+34 631 67 49 09</span>
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">
          Datos personales que se recogen
        </h2>
        <p className="mb-4">
          Este sitio puede recoger datos personales proporcionados voluntariamente por los usuarios,
          tales como nombre, correo electrónico o número de teléfono a través de formularios de contacto.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">
          Imágenes y vídeos (incluyendo menores de edad)
        </h2>
        <p className="mb-4">
          Este sitio web contiene imágenes y vídeos del grupo cultural, incluyendo la posible
          aparición de menores de edad. Dicho material se publica exclusivamente con fines
          educativos, culturales y de difusión artística.
        </p>

        <p className="mb-4 font-semibold">
          El uso, reproducción o distribución de estas imágenes sin autorización expresa queda
          estrictamente prohibido.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">
          Base legal del tratamiento
        </h2>
        <p className="mb-4">
          El tratamiento de datos personales se basa en el consentimiento del usuario y/o en el
          interés legítimo de difusión cultural del proyecto.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">
          Conservación de datos
        </h2>
        <p className="mb-4">
          Los datos personales se conservarán únicamente durante el tiempo necesario para cumplir
          con la finalidad para la que fueron recopilados.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">
          Derechos de los usuarios
        </h2>
        <p className="mb-4">
          Los usuarios pueden ejercer sus derechos de acceso, rectificación, cancelación y oposición
          contactando con el responsable del sitio web.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">
          Seguridad de los datos
        </h2>
        <p className="mb-4">
          Se aplican medidas técnicas y organizativas razonables para proteger la información personal,
          aunque no se puede garantizar una seguridad absoluta en Internet.

          Este sitio utiliza Cloudflare Turnstile, un servicio de Cloudflare, Inc. para proteger los formularios contra spam y abusos. Turnstile puede recopilar y procesar datos según lo descrito en la política de privacidad de Cloudflare.

          Más información en el Addendum de privacidad de Turnstile.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">
          Contacto
        </h2>
        <p>
          Para cualquier consulta relacionada con esta política:
          <br />
          <span className="font-semibold text-amber-500">
            llanurasnuevageneracion@gmail.com
          </span>
        </p>

      </section>

      <Footer />
    </main>
  );
}