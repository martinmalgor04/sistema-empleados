'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon, KeyIcon, EyeIcon, EyeOffIcon, CheckCircle2Icon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function CambiarContrasenaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    // Verificar que el usuario esté logueado
    const loggedInUserString = localStorage.getItem("loggedInUser")
    if (loggedInUserString) {
      try {
        const loggedInUser = JSON.parse(loggedInUserString)
        setUserEmail(loggedInUser.email)
      } catch (error) {
        console.error("Error parsing user data:", error)
        router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const getRegisteredUsers = () => {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const defaultUsers = [
      { email: "test@example.com", nombre: "Usuario Test", password: "password" },
      { email: "supervisor@eldercare.com", nombre: "Ana García", password: "123456" },
      { email: "enfermero@eldercare.com", nombre: "Carlos López", password: "123456" }
    ]
    return [...defaultUsers, ...registeredUsers]
  }

  const validatePassword = (password: string) => {
    const errors = []
    if (password.length < 6) {
      errors.push("La contraseña debe tener al menos 6 caracteres")
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Debe contener al menos una letra minúscula")
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Debe contener al menos una letra mayúscula")
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Debe contener al menos un número")
    }
    return errors
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos los campos son obligatorios")
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Las nuevas contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (currentPassword === newPassword) {
      setError("La nueva contraseña debe ser diferente a la actual")
      setIsLoading(false)
      return
    }

    // Validar fortaleza de la nueva contraseña
    const passwordErrors = validatePassword(newPassword)
    if (passwordErrors.length > 0) {
      setError(`La nueva contraseña no cumple con los requisitos: ${passwordErrors.join(", ")}`)
      setIsLoading(false)
      return
    }

    // Verificar contraseña actual
    const users = getRegisteredUsers()
    const currentUser = users.find(user => user.email === userEmail)

    if (!currentUser) {
      setError("Usuario no encontrado")
      setIsLoading(false)
      return
    }

    if (currentUser.password !== currentPassword) {
      setError("La contraseña actual es incorrecta")
      setIsLoading(false)
      return
    }

    // Simular proceso de cambio
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      // Actualizar la contraseña en localStorage
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const updatedUsers = registeredUsers.map((user: any) => {
        if (user.email === userEmail) {
          return { ...user, password: newPassword }
        }
        return user
      })
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))

      // También actualizar en los usuarios por defecto si aplica
      const defaultUserEmails = ["test@example.com", "supervisor@eldercare.com", "enfermero@eldercare.com"]
      if (defaultUserEmails.includes(userEmail)) {
        // En una aplicación real esto se manejaría de manera diferente
        console.log(`Contraseña actualizada para usuario por defecto: ${userEmail}`)
      }

      setIsLoading(false)
      
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente",
      })

      // Limpiar formulario
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      // Redirigir al perfil después de 2 segundos
      setTimeout(() => {
        router.push("/perfil")
      }, 2000)

    } catch (error) {
      setIsLoading(false)
      setError("Error al actualizar la contraseña. Intenta nuevamente.")
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" }
    
    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 8) score++
    if (/(?=.*[a-z])/.test(password)) score++
    if (/(?=.*[A-Z])/.test(password)) score++
    if (/(?=.*\d)/.test(password)) score++
    if (/(?=.*[!@#$%^&*])/.test(password)) score++

    if (score <= 2) return { strength: 1, label: "Débil", color: "bg-red-500" }
    if (score <= 4) return { strength: 2, label: "Media", color: "bg-yellow-500" }
    return { strength: 3, label: "Fuerte", color: "bg-green-500" }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  return (
    <div className="container mx-auto p-4 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>

      <Card>
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <KeyIcon className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Cambiar Contraseña</CardTitle>
          <CardDescription>
            Actualiza tu contraseña para mantener tu cuenta segura
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Contraseña actual */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña actual</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña actual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Nueva contraseña */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Ingresa tu nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Indicador de fortaleza */}
              {newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Fortaleza:</span>
                    <span className={`font-medium ${
                      passwordStrength.strength === 1 ? 'text-red-600' :
                      passwordStrength.strength === 2 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirmar nueva contraseña */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirma tu nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Verificación de coincidencia */}
              {confirmPassword && (
                <div className="flex items-center space-x-2 text-sm">
                  {newPassword === confirmPassword ? (
                    <>
                      <CheckCircle2Icon className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Las contraseñas coinciden</span>
                    </>
                  ) : (
                    <span className="text-red-600">Las contraseñas no coinciden</span>
                  )}
                </div>
              )}
            </div>

            {/* Requisitos de contraseña */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Requisitos de contraseña:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className={`flex items-center space-x-2 ${newPassword.length >= 6 ? 'text-green-600' : ''}`}>
                  <span>•</span><span>Al menos 6 caracteres</span>
                </li>
                <li className={`flex items-center space-x-2 ${/(?=.*[a-z])/.test(newPassword) ? 'text-green-600' : ''}`}>
                  <span>•</span><span>Una letra minúscula</span>
                </li>
                <li className={`flex items-center space-x-2 ${/(?=.*[A-Z])/.test(newPassword) ? 'text-green-600' : ''}`}>
                  <span>•</span><span>Una letra mayúscula</span>
                </li>
                <li className={`flex items-center space-x-2 ${/(?=.*\d)/.test(newPassword) ? 'text-green-600' : ''}`}>
                  <span>•</span><span>Un número</span>
                </li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Cambiando contraseña..." : "Cambiar Contraseña"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 