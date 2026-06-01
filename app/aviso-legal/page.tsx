'use client';

import Footer from "@/components/Footer/Footer";

export default function AvisoLegal() {
  return (
    <main className="pt-20 min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">

      <section className="max-w-4xl mx-auto px-6 py-16">

        <h1 className="text-4xl md:text-5xl font-extrabold text-amber-500 mb-8">
          Aviso Legal
        </h1>

        <p className="mb-4">
          En cumplimiento con el deber de información establecido en la normativa vigente,
          se facilita la siguiente información general del sitio web.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">
          Titular del sitio web
        </h2>
        <p className="mb-2"><strong>Nombre:</strong> Llanuras Nueva Generación</p>
        <p className="mb-2"><strong>Correo electrónico:</strong> llanurasnuevageneracion@gmail.com</p>
        <p className="mb-2">
          <strong>Teléfono:</strong>{" "}
          <span>+34 631 67 49 09</span>
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">
          Objeto del sitio web
        </h2>
        <p className="mb-4">
          Este sitio web tiene finalidad educativa y cultural, orientada a la difusión
          de la danza tradicional ecuatoriana, su historia y expresiones artísticas.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">
          Condiciones de uso
        </h2>
        <p className="mb-4">
          El acceso y uso de este sitio web atribuye la condición de usuario, quien acepta
          las condiciones aquí establecidas. El usuario se compromete a hacer un uso adecuado
          del contenido, evitando actividades ilícitas o contrarias a la buena fe.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">
          Propiedad intelectual
        </h2>
        <p className="mb-4">
          Los contenidos (textos, imágenes, vídeos y material audiovisual) son propiedad del
          titular del sitio o cuentan con autorización para su uso. Queda prohibida su
          reproducción total o parcial sin consentimiento expreso.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">
          Responsabilidad del contenido
        </h2>
        <p className="mb-4">
          El titular no se hace responsable del mal uso de la información publicada ni de los
          daños derivados del acceso o uso del sitio web.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">
          Enlaces externos
        </h2>
        <p className="mb-4">
          Este sitio puede contener enlaces a sitios de terceros. No se asume responsabilidad
          sobre sus contenidos o políticas.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">
          Contacto
        </h2>
        <p>
          Para cualquier consulta relacionada con este aviso legal:
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