'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MenuMedicamentosPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-6">Menú de Medicamentos</h1>
      <p className="mb-8 text-center max-w-md">
        Página en construcción. Aquí se gestionará la lista de medicamentos (stock, faltantes, pedidos)
        y se podrá acceder al ranking de medicamentos más consumidos.
      </p>
      <Link href="/menu-principal">
        <Button variant="outline">Volver al Menú Principal</Button>
      </Link>
    </div>
  )
} 