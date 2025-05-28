'use client'

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon, MailIcon, CheckCircle2Icon, KeyIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function OlvideContrasenaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<'email' | 'success' | 'reset'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")

  // Simulamos usuarios registrados
  const getRegisteredUsers = () => {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const defaultUsers = [
      { email: "test@example.com", nombre: "Usuario Test", password: "password" },
      { email: "supervisor@eldercare.com", nombre: "Ana García", password: "123456" },
      { email: "enfermero@eldercare.com", nombre: "Carlos López", password: "123456" }
    ]
    return [...defaultUsers, ...registeredUsers]
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email) {
      setError("El email es requerido")
      setIsLoading(false)
      return
    }

    // Simular verificación de email
    await new Promise(resolve => setTimeout(resolve, 1500))

    const users = getRegisteredUsers()
    const userExists = users.find(user => user.email === email)

    if (userExists) {
      // Simular envío de código
      console.log("Código de verificación para", email, ": 123456")
      setStep('success')
      toast({
        title: "Código enviado",
        description: "Hemos enviado un código de verificación a tu email",
      })
    } else {
      setError("No existe una cuenta asociada a este email")
    }
    
    setIsLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!verificationCode || !newPassword || !confirmPassword) {
      setError("Todos los campos son requeridos")
      setIsLoading(false)
      return
    }

    if (verificationCode !== "123456") {
      setError("Código de verificación incorrecto. Usa: 123456")
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    // Simular actualización de contraseña
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Actualizar la contraseña en los datos ficticios
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const updatedUsers = registeredUsers.map((user: any) => {
      if (user.email === email) {
        return { ...user, password: newPassword }
      }
      return user
    })
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))

    setIsLoading(false)
    toast({
      title: "Contraseña actualizada",
      description: "Tu contraseña ha sido cambiada exitosamente",
    })

    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      router.push("/login")
    }, 2000)
  }

  if (step === 'success') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <MailIcon className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Código Enviado</CardTitle>
            <CardDescription>
              Hemos enviado un código de verificación a <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código de verificación</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Ingresa el código de 6 dígitos"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Ingresa tu nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirma tu nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Actualizando..." : "Cambiar Contraseña"}
              </Button>
            </form>

            <div className="text-center">
              <Button variant="outline" onClick={() => setStep('email')}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <KeyIcon className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">¿Olvidaste tu contraseña?</CardTitle>
          <CardDescription>
            Ingresa tu email y te enviaremos un código para restablecer tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar Código"}
            </Button>
          </form>

          <div className="text-center">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Volver al Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 