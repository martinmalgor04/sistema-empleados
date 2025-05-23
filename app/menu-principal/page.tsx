'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"
import React, { useState, useEffect } from "react"

export default function MenuPrincipalPage() {
  const router = useRouter()
  const [nombreUsuario, setNombreUsuario] = useState("Usuario")

  useEffect(() => {
    const loggedInUserString = localStorage.getItem("loggedInUser");
    if (loggedInUserString) {
      try {
        const loggedInUser = JSON.parse(loggedInUserString);
        if (loggedInUser && loggedInUser.nombre) {
          setNombreUsuario(loggedInUser.nombre);
        }
      } catch (error) {
        console.error("Error parsing loggedInUser from localStorage:", error);
      }
    }
  }, []);

  // TODO: Implementar lógica de logout si es necesario
  // const handleLogout = () => {
  //   // Limpiar estado de sesión
  //   router.push("/login")
  // }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Hola, {nombreUsuario}!</CardTitle>
          <CardDescription>¿Qué quieres hacer hoy?</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={() => router.push("/empleados")} className="w-full" size="lg">
            Menú Empleados
          </Button>
          <Button onClick={() => router.push("/registro-asistencia")} className="w-full" size="lg">
            Registro de Asistencia
          </Button>
          <Button onClick={() => router.push("/menu-compras")} className="w-full" size="lg" variant="outline">
            Menú de Compras
          </Button>
          <Button onClick={() => router.push("/menu-medicamentos")} className="w-full" size="lg" variant="outline">
            Menú de Medicamentos
          </Button>
          {/* <Button onClick={handleLogout} className="w-full mt-4" variant="destructive">
            Cerrar Sesión
          </Button> */}
        </CardContent>
      </Card>
    </div>
  )
} 