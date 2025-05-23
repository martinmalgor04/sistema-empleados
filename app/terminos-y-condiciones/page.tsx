'use client'

import Link from "next/link"

export default function TerminosCondicionesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>
      <div className="max-w-2xl text-center space-y-4">
        <p>Página en construcción.</p>
        <p>Aquí se mostraría el contenido completo de los términos y condiciones del servicio.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
      <Link href="/login" className="mt-6">
        <span className="text-blue-600 hover:underline cursor-pointer">Volver a Iniciar Sesión</span>
      </Link>
    </div>
  )
} 