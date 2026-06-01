'use client';

import { motion } from "framer-motion";
import Footer from "@/components/Footer/Footer";
import EmailForm from "@/components/Email/Email";

export default function Contacto() {
  return (
    <main className="overflow-x-hidden bg-white dark:bg-slate-950 pt-15 min-h-screen">

      {/* HERO */}
      <section className="text-center py-12 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-amber-500"
        >
          CONTACTO
        </motion.h1>

        <p className="text-slate-600 dark:text-gray-300 mt-4">
          ¿Quieres unirte o visitarnos? Aquí tienes toda la información
        </p>
      </section>

      {/* CONTENIDO */}
      <section className="max-w-7xl mx-auto px-6 pb-20 grid lg:grid-cols-2 gap-12">

        {/* INFO */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="order-2 lg:order-1 space-y-8"
        >

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Horario de ensayo
            </h2>

            <p className="text-slate-700 dark:text-gray-300 text-lg">
              🗓️ Viernes <br />
              🕢 19:30
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Ubicación
            </h2>

            <p className="text-slate-700 dark:text-gray-300">
              C. Santo Domingo de Guzmán, 27, Jesús, 46017 Valencia
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Contacto
            </h2>

            <div className="text-slate-700 dark:text-gray-300 space-y-2">
              <p>📧 llanurasnuevageneracion@gmail.com</p>
              <p>📞 631 67 49 09</p>
            </div>
          </div>

        </motion.div>

        {/* MAPA */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="order-1 lg:order-2 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
        >
          <iframe
            src="https://www.google.com/maps?q=Parking%20Cementerio%20Valencia&output=embed"
            width="100%"
            height="450"
            loading="lazy"
            className="w-full h-[450px]"
          ></iframe>
        </motion.div>
      </section>
      <section className="py-10 px-6 bg-slate-100 dark:bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold text-center text-slate-900 dark:text-white mb-10"
          >
            Contáctanos
          </motion.h2>

          <EmailForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}