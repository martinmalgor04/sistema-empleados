'use client'

import Link from "next/link"

export default function OlvideContrasenaPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-6">Restablecer Contraseña</h1>
      <p className="mb-4 text-center">Página en construcción. Aquí iría el formulario para restablecer la contraseña.</p>
      <Link href="/login">
        <span className="text-blue-600 hover:underline cursor-pointer">Volver a Iniciar Sesión</span>
      </Link>
    </div>
  )
} 