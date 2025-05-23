'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MenuComprasPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-6">Menú de Compras</h1>
      <p className="mb-8 text-center max-w-md">
        Página en construcción. Aquí se gestionarán las listas de compras, se registrarán las compras realizadas
        y se podrá acceder al historial de compras.
      </p>
      <Link href="/menu-principal">
        <Button variant="outline">Volver al Menú Principal</Button>
      </Link>
    </div>
  )
} 