"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { LineChart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import React, { useEffect } from "react"
import { useRouter } from 'next/navigation'

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
  const router = useRouter()

  useEffect(() => {
    // Simulación de verificación de sesión
    // En una app real, esto sería más robusto (ej. checkear un token, un estado global, etc.)
    const loggedInUser = localStorage.getItem("loggedInUser") // Asumimos que guardas algo aquí al loguear

    if (loggedInUser) {
      router.replace("/menu-principal")
    } else {
      router.replace("/login")
    }
  }, [router])

  // Puedes mostrar un spinner de carga o un mensaje mientras se redirige
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Cargando...</p>
      {/* O un componente Spinner más elaborado */}
    </div>
  )
}
