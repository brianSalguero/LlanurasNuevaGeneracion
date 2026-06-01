"use client";

import Link from "next/link";

export default function WhatsAppButton() {
    return (
        <Link
            href="https://wa.me/34631674909?text=👋%20¡Hola!%20Me%20gustaría%20recibir%20más%20información%20sobre%20el%20grupo%20de%20danza%20ecuatoriana%20Llanuras%20Nueva%20Generación.%20💃🎶🇪🇨"
            target="_blank"
            aria-label="Contactar por WhatsApp"
            className="
                fixed
                bottom-5
                right-5
                z-50
                flex
                items-center
                justify-center
                w-14
                h-14
                rounded-full
                bg-green-500
                text-white
                shadow-lg
                hover:bg-green-600
                transition
                md:hidden
                z-[99999]
      "
        >
            <img
                src="/icons/whatsapp.png"
                alt="WhatsApp"
                className="w-14 h-14 object-contain"
            />
        </Link>
    );
}