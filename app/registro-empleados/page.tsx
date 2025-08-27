'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { generateSecurePassword, sendEmployeeCredentials } from "@/src/utils/auth"
import { validateEmailAndDNI } from "@/src/utils/validation"

// Opciones para el Rol, podrían venir de una constante o API en una app real
const rolesDisponibles = [
  { id: "supervisor", nombre: "Supervisor" },
  { id: "enfermero", nombre: "Enfermero" },
  { id: "medico", nombre: "Médico" },
  { id: "cuidador", nombre: "Cuidador" },
  { id: "terapeuta", nombre: "Terapeuta" },
]

export default function RegistroEmpleadosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [fechaNacimiento, setFechaNacimiento] = useState("")
  const [dni, setDni] = useState("")
  const [rol, setRol] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isExito, setIsExito] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsExito(false)

    if (!nombre || !apellido || !fechaNacimiento || !dni || !rol || !email) {
      setError("Todos los campos son obligatorios.")
      return
    }

    // Validate email and DNI with improved logic
    const validationError = validateEmailAndDNI(email, dni)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    
    // En una aplicación real, aquí harías validaciones más robustas y llamadas a API
    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const userExists = existingUsers.find((user: any) => user.email === email || user.dni === dni)

    if (userExists) {
      setError("El email o DNI ya está registrado.")
      return
    }

    try {
      // Generate secure password
      const { password: generatedPassword } = generateSecurePassword(12)
      
      // Crear el nombre completo para consistencia
      const nombreCompleto = `${nombre} ${apellido}`

      const newUser = { 
        nombre: nombreCompleto,
        fechaNacimiento, 
        dni, 
        rol,
        email, 
        password: generatedPassword,
        createdAt: new Date().toISOString(),
        mustChangePassword: true
      }
      
      existingUsers.push(newUser)
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers))

      // Send credentials via email
      const emailResult = await sendEmployeeCredentials(email, nombreCompleto, generatedPassword)
      
      if (emailResult.success) {
        setEmailSent(true)
        setIsExito(true)
        toast({
          title: "¡Empleado registrado exitosamente!",
          description: "Las credenciales han sido enviadas al email proporcionado.",
        })
      } else {
        setError("Usuario creado pero no se pudo enviar el email. Contacta al administrador.")
        toast({
          title: "Advertencia",
          description: emailResult.message,
          variant: "destructive",
        })
      }
      
      setTimeout(() => {
        router.push("/empleados")
      }, 3000)
      
    } catch (error) {
      console.error("Error registrando empleado:", error)
      setError("Error al registrar el empleado. Por favor, intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isExito) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Toaster />
        <Card className="w-full max-w-md text-center p-8">
          <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <CardTitle className="text-3xl mb-4">¡ÉXITO!</CardTitle>
          <CardDescription className="text-lg mb-6">
            {emailSent 
              ? "Empleado registrado exitosamente. Las credenciales han sido enviadas por email."
              : "Empleado registrado. Contacta al administrador para obtener las credenciales."
            }
          </CardDescription>
          <Button onClick={() => router.push("/empleados")} className="w-full">
            Volver a Empleados
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center min-h-screen bg-background py-8">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Registrar Nuevo Empleado</CardTitle>
            <CardDescription>Completa el formulario para crear una cuenta.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegistro}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" placeholder="Juan" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input id="apellido" placeholder="Pérez" required value={apellido} onChange={(e) => setApellido(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                  <Input id="fechaNacimiento" type="date" required value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dni">DNI</Label>
                  <Input id="dni" placeholder="12345678" type="number" required value={dni} onChange={(e) => setDni(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rol">Rol</Label>
                  <Select onValueChange={setRol} value={rol} required>
                    <SelectTrigger id="rol">
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {rolesDisponibles.map((r) => (
                        <SelectItem key={r.id} value={r.id}>{r.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mb-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email (para iniciar sesión)</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">📧 Credenciales por Email</h4>
                  <p className="text-sm text-blue-700">
                    Se generará una contraseña segura automáticamente y se enviará junto con las credenciales de acceso al email proporcionado.
                  </p>
                </div>
              </div>

              {error && <p className="text-sm text-red-600 text-center mb-4">{error}</p>}

              <div className="grid grid-cols-2 gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registrando..." : "Registrar Empleado"}
                </Button>
                <Button variant="outline" className="w-full" type="button" onClick={() => router.push("/empleados")} disabled={isLoading}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm mt-4">
            <p>¿Necesitas ver la lista de empleados? <Link href="/empleados" className="underline">Ver Empleados</Link></p>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

// Ícono de ejemplo (reutilizado de RegistroAsistenciaPage)
function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
} 