'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { useToast } from "@/components/ui/use-toast" // Asumiendo que tienes useToast de shadcn/ui
import { Toaster } from "@/components/ui/toaster"

// Asumimos que obtienes el nombre del usuario de alguna parte.
const nombreUsuario = "Usuario Ejemplo" // Placeholder

export default function RegistroAsistenciaPage() {
  const [horaEntrada, setHoraEntrada] = useState("")
  const [horaSalida, setHoraSalida] = useState("")
  const [error, setError] = useState("")
  const [isExito, setIsExito] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleConfirmar = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsExito(false)

    if (!horaEntrada || !horaSalida) {
      setError("Debes ingresar tanto la hora de entrada como la de salida.")
      return
    }

    // Aquí iría la lógica de validación de horas si es necesario
    // Ejemplo: que horaSalida sea posterior a horaEntrada

    console.log("Asistencia registrada:", { nombreUsuario, horaEntrada, horaSalida })
    // Simulación de guardado
    setIsExito(true)
    toast({
      title: "¡Éxito!",
      description: "Asistencia confirmada correctamente.",
    })

    // Opcional: redirigir después de un tiempo o dejar que el usuario cierre el toast/mensaje
    setTimeout(() => {
      router.push("/menu-principal")
    }, 2000) // Redirige al menú principal después de 2 segundos
  }

  const handleCancelar = () => {
    router.push("/menu-principal")
  }

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center min-h-screen bg-background">
        {!isExito ? (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Registro de Asistencia</CardTitle>
              <CardDescription>Bienvenido, {nombreUsuario}. Registra tus horas.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleConfirmar}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="horaEntrada">Hora de Entrada</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="horaEntrada"
                        type="time"
                        required
                        value={horaEntrada}
                        onChange={(e) => setHoraEntrada(e.target.value)}
                        className="w-full"
                      />
                      {/* Podrías agregar un Popover aquí para el ícono de ayuda */}
                      {/* <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="icon"><QuestionMarkIcon className="h-4 w-4" /></Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto">
                          <p>Ingresa la hora en que comenzaste tu turno.</p>
                        </PopoverContent>
                      </Popover> */}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="horaSalida">Hora de Salida</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="horaSalida"
                        type="time"
                        required
                        value={horaSalida}
                        onChange={(e) => setHoraSalida(e.target.value)}
                        className="w-full"
                      />
                      {/* <Popover>...</Popover> */}
                    </div>
                  </div>
                  {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button type="submit" className="w-full">
                      Confirmar
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleCancelar}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-md text-center p-8">
            <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <CardTitle className="text-3xl mb-4">¡ÉXITO!</CardTitle>
            <CardDescription className="text-lg mb-6">
              Asistencia confirmada correctamente.
            </CardDescription>
            <Button onClick={() => router.push("/menu-principal")} className="w-full">
              Volver al Menú Principal
            </Button>
          </Card>
        )}
      </div>
    </>
  )
}

// Ícono de ejemplo (puedes usar lucide-react o similar)
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