'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = Cookies.get('cookie-consent')

    if (!consent) {
      setVisible(true)
    }
  }, [])

  const acceptCookies = () => {
    Cookies.set('cookie-consent', 'accepted', {
      expires: 365,
    })

    setVisible(false)
  }

  const rejectCookies = () => {
    Cookies.set('cookie-consent', 'rejected', {
      expires: 365,
    })

    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[95%] max-w-4xl -translate-x-1/2">
      <div className="rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl">
        
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          
          <div className="max-w-2xl">
            <h2 className="mb-2 text-lg font-semibold text-white">
              🍪 Configuración de cookies
            </h2>

            <p className="text-sm leading-relaxed text-zinc-300">
              Utilizamos cookies necesarias y analíticas para mejorar tu
              experiencia, analizar el tráfico y optimizar el rendimiento
              de la web.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            
            <button
              onClick={rejectCookies}
              className="rounded-xl border border-zinc-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Rechazar
            </button>

            <button
              onClick={acceptCookies}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-105"
            >
              Aceptar cookies
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}