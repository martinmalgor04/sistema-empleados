'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation" // Corregido para app router
import React, { useState, useEffect } from "react"
import usuariosData from "@/data/usuarios.json"; // Importar usuarios del JSON

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  // Estado para almacenar todos los usuarios disponibles para login
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  useEffect(() => {
    // Cargar usuarios iniciales del JSON y combinar con los de localStorage
    const registeredUsersFromStorage = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    
    // Crear un mapa de usuarios del JSON para fácil acceso y evitar duplicados por email
    const usersFromJsonMap = new Map();
    usuariosData.forEach(user => usersFromJsonMap.set(user.email, user));

    // Sobrescribir usuarios de localStorage si el email existe en JSON, sino añadir
    const combinedUsers = [...registeredUsersFromStorage];
    usersFromJsonMap.forEach((jsonUser, email) => {
      const existingUserIndex = combinedUsers.findIndex(u => u.email === email);
      if (existingUserIndex > -1) {
        combinedUsers[existingUserIndex] = { ...combinedUsers[existingUserIndex], ...jsonUser }; // Mantener datos extra de localStorage si los hay, pero JSON tiene prioridad para rol/nombre
      } else {
        combinedUsers.push(jsonUser);
      }
    });
    
    setAvailableUsers(combinedUsers);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("") // Reset error

    // Buscar usuario en la lista combinada (JSON + localStorage)
    const foundUser = availableUsers.find((user: any) => user.email === email);

    if (foundUser) {
      if (foundUser.password === password) {
        console.log("Login exitoso:", foundUser);
        localStorage.setItem("loggedInUser", JSON.stringify({ 
          email: foundUser.email, 
          nombre: foundUser.nombre || "Usuario", // Usar nombre del JSON/registro o un default
          rol: foundUser.rol || "usuario" // Usar rol del JSON/registro o un default
        }));
        router.push("/menu-principal");
      } else {
        setError("Contraseña incorrecta");
      }
    } else {
      setError("Usuario no registrado");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center space-y-4">
          <img src="/logo-eldercare-full.png" alt="ElderCare Logo" className="w-48 mx-auto" />
          <CardDescription>Bienvenido a ElderCare. Ingresa tus credenciales.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email o Usuario</Label>
                <Input
                  id="email"
                  type="email" // Cambiado a email para validación básica
                  placeholder="tu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push("/registro-empleados")}> {/* Asumiendo /registro-empleados para la página de registro */}
                Registrarse
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col text-sm">
          <Link href="/olvide-contrasena" className="underline mb-2">
            ¿Olvidaste tu contraseña?
          </Link>
          <Link href="/terminos-y-condiciones" className="underline text-xs text-muted-foreground">
            Términos y condiciones
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

// Páginas placeholder para que los links no fallen (crear archivos si es necesario)
// Si ya existen o las crearás con contenido, puedes omitir esto.
export function OlvideContrasenaPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1>Página de Olvidé Contraseña (En construcción)</h1>
      <Link href="/login">Volver a Login</Link>
    </div>
  )
}

export function TerminosCondicionesPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1>Página de Términos y Condiciones (En construcción)</h1>
      <Link href="/login">Volver a Login</Link>
    </div>
  )
} 