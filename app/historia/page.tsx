'use client';

import { motion } from "framer-motion";
import Footer from "@/components/Footer/Footer";
import HistoriaMapClient from "@/components/HistoriaMap/HistoriaMapClient";

export default function Folclore() {
  return (
    <main className="pt-15 bg-white dark:bg-slate-950 min-h-screen">

      {/* TITULO */}
      <section className="text-center py-10">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-amber-500"
        >
          FOLCLORE
        </motion.h1>

        <p className="text-slate-600 dark:text-gray-300 mt-4">
          Explora las danzas más importantes de nuestra cultura ecuatoriana
        </p>
      </section>

      {/* MAPA */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <HistoriaMapClient />
      </section>

      <Footer />
    </main>
  );
}