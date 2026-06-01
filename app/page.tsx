'use client';

import { motion } from "framer-motion";
import ImagesSlide from "@/components/home/ImagesSlide";
import Footer from "@/components/Footer/Footer";
import EmailForm from "@/components/Email/Email";

const sections = [
  {
    title: "¡VEN A DISFRUTAR CON NOSOTROS!",
    text: `¿Te apasiona el arte, la cultura y el movimiento?    
    
    ¡Ven y descubre la magia de la danza ecuatoriana con nosotros! Nuestro grupo está dedicado a preservar y compartir nuestras raíces a través de la música, el ritmo y el baile. No importa si eres principiante o tienes experiencia, lo importante es que quieras vivir nuestra cultura al máximo.`,
    image: "/images/image2.jpg",
  },
  {
    title: "¿QUIÉNES SOMOS?",
    text: `Somos un grupo de jóvenes apasionados por la danza tradicional ecuatoriana, dedicados a preservar y compartir la riqueza cultural de nuestro país.`,
    image: "/images/image1.jpg",
  },
  {
    title: "PROGRAMACIONES",
    text: `Mantente al tanto de todos los bailes, noticias y eventos que se realizarán en Valencia y en otros lugares. Si quieres vernos en acción, no te pierdas nuestras actualizaciones. En este apartado iremos subiendo publicaciones periódicas con toda la información sobre nuestras próximas presentaciones, actividades culturales y cualquier novedad relacionada con la danza ecuatoriana.`,
    image: "/logo/logosintitulo.png",
  },
  {
    title: "NUESTRA GALERÍA",
    text: `En nuestra galería podrás encontrar una selección de fotos y videos que capturan lo mejor de nuestras presentaciones, ensayos y momentos especiales.`,
    image: "/images/image4.jpg",
  },
  {
    title: "HISTORIA",
    text: `¿Quieres saber más sobre nuestras danzas y cultura ecuatoriana?

¡Estás en el lugar indicado! En nuestra página encontrarás un apartado dedicado exclusivamente a las danzas ecuatorianas. Aquí podrás descubrir el significado profundo de cada uno de nuestros bailes, su origen y por qué seguimos bailando estas tradiciones hoy en día.`,
    image: "/images/image5.JPG",
  },
];

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <ImagesSlide />

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-10">
        {sections.map((section, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-16"
            >
              <div
                className={`flex flex-col lg:flex-row items-center gap-10 ${isReversed ? "lg:flex-row-reverse" : ""
                  }`}
              >
                {/* TEXTO */}
                <div className="w-full lg:w-1/2 order-1 lg:order-none">
                  <motion.h2
                    initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center text-3xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4"
                  >
                    {section.title}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-700 dark:text-gray-300 text-base lg:text-lg leading-relaxed whitespace-pre-line lg:max-w-xl font-light"
                  >
                    {section.text}
                  </motion.p>
                </div>

                {/* IMAGEN */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-80 lg:h-[420px] object-cover rounded-2xl shadow-lg ring-1 ring-slate-200 hover:scale-[1.03] transition-transform duration-700 order-2 lg:order-none"
                >
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-80 lg:h-[420px] object-cover rounded-2xl shadow-xl ring-1 ring-white/10 hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />
                </motion.div>
              </div>

              {/* separador animado */}
              {index !== sections.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="h-px w-full bg-slate-200/60 origin-left"
                />
              )}
            </motion.div>
          );
        })}
      </div>
      {/* CITAS SOBRE LA DANZA */}
      <section className="bg-slate-100 dark:bg-slate-900 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-12">
            Inspiración y Danza
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                quote:
                  "La danza es el lenguaje oculto del alma.",
                author: "Martha Graham",
              },
              {
                quote:
                  "Bailar es soñar con los pies.",
                author: "Constanze Mozart",
              },
              {
                quote:
                  "La cultura vive en cada paso que damos al bailar nuestras raíces.",
                author: "Ecuador",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700"
              >
                <p className="text-lg italic text-slate-700 dark:text-gray-300 leading-relaxed">
                  “{item.quote}”
                </p>

                <span className="block mt-4 text-sm font-semibold text-amber-600 dark:text-amber-400">
                  — {item.author}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
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
