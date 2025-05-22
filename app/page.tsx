"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { LineChart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import React from "react"

// Datos de ejemplo para el prototipo
const empleadosVigentes = [
  {
    id: 1,
    nombre: "Carmen Ruiz",
    cargo: "Enfermera",
    turno: "Noche",
    estado: "Activo",
    ultimoAcceso: "Hoy",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    nombre: "María Morales",
    cargo: "Cuidadora",
    turno: "Día",
    estado: "Activo",
    ultimoAcceso: "Ayer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    nombre: "Javier Torres",
    cargo: "Médico",
    turno: "Noche",
    estado: "Activo",
    ultimoAcceso: "Ayer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    nombre: "Laura Ramos",
    cargo: "Terapeuta",
    turno: "Día",
    estado: "15/04/2024",
    ultimoAcceso: "15/04/2024",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const empleadosSuspendidos = [
  {
    id: 5,
    nombre: "Roberto Gómez",
    cargo: "Enfermero",
    turno: "Día",
    estado: "Suspendido",
    ultimoAcceso: "10/04/2024",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    nombre: "Ana Martínez",
    cargo: "Médico",
    turno: "Noche",
    estado: "Suspendido",
    ultimoAcceso: "05/04/2024",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const empleadosFueraServicio = [
  {
    id: 7,
    nombre: "Carlos López",
    cargo: "Cuidador",
    turno: "Día",
    estado: "Licencia",
    ultimoAcceso: "01/03/2024",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 8,
    nombre: "Elena Díaz",
    cargo: "Terapeuta",
    turno: "Noche",
    estado: "Vacaciones",
    ultimoAcceso: "15/03/2024",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function Home() {
  // Estado inicial para mostrar empleados vigentes
  const [empleadosMostrados, setEmpleadosMostrados] = React.useState(empleadosVigentes)
  const [filtroActivo, setFiltroActivo] = React.useState("vigentes")

  // Función para cambiar entre categorías
  const cambiarCategoria = (categoria) => {
    setFiltroActivo(categoria)
    if (categoria === "vigentes") {
      setEmpleadosMostrados(empleadosVigentes)
    } else if (categoria === "suspendidos") {
      setEmpleadosMostrados(empleadosSuspendidos)
    } else if (categoria === "fuera") {
      setEmpleadosMostrados(empleadosFueraServicio)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-4xl font-bold mb-4">Empleados</h1>
        <Link href="/informe-presentismo">
          <Button variant="outline" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Informe de presentismo
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-md">
              <Input type="text" placeholder="Buscar por nombre, DNI..." className="pl-10" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <Button variant="outline" className="ml-2">
              Filtro
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </div>

          <div className="flex gap-2 mb-6">
            <Button
              className={
                filtroActivo === "vigentes"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }
              onClick={() => cambiarCategoria("vigentes")}
            >
              Vigentes
            </Button>
            <Button
              className={
                filtroActivo === "suspendidos"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }
              onClick={() => cambiarCategoria("suspendidos")}
            >
              Suspendidos
            </Button>
            <Button
              className={
                filtroActivo === "fuera"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }
              onClick={() => cambiarCategoria("fuera")}
            >
              Fuera de servicio
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Nombre</th>
                  <th className="text-left py-3 px-4 font-medium">Cargo</th>
                  <th className="text-left py-3 px-4 font-medium">Turno</th>
                  <th className="text-left py-3 px-4 font-medium">Estado Actual</th>
                  <th className="text-left py-3 px-4 font-medium">Último Acceso</th>
                  <th className="text-left py-3 px-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {empleadosMostrados.map((empleado) => (
                  <tr key={empleado.id} className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={empleado.avatar || "/placeholder.svg"} alt={empleado.nombre} />
                          <AvatarFallback>{empleado.nombre.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{empleado.nombre}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{empleado.cargo}</td>
                    <td className="py-3 px-4">{empleado.turno}</td>
                    <td className="py-3 px-4">
                      {empleado.estado === "Activo" ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{empleado.estado}</Badge>
                      ) : empleado.estado === "Suspendido" ? (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{empleado.estado}</Badge>
                      ) : empleado.estado === "Licencia" || empleado.estado === "Vacaciones" ? (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{empleado.estado}</Badge>
                      ) : (
                        <span>{empleado.estado}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{empleado.ultimoAcceso}</td>
                    <td className="py-3 px-4">
                      <Link href={`/empleado/${empleado.id}`}>
                        <Button className="bg-blue-600 hover:bg-blue-700">Ver perfil</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtroActivo === "vigentes" && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Nota:</span> El estado "Activo" indica que el empleado está actualmente
                trabajando. Un empleado solo puede estar activo en turno de día o noche, nunca en ambos simultáneamente.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {empleadosMostrados.length} de{" "}
              {filtroActivo === "vigentes"
                ? empleadosVigentes.length
                : filtroActivo === "suspendidos"
                  ? empleadosSuspendidos.length
                  : empleadosFueraServicio.length}{" "}
              empleados
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </Button>
              <Button variant="outline" size="sm" className="w-10">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Siguiente
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
