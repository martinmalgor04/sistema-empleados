'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { 
  ArrowLeftIcon, 
  UserIcon, 
  SettingsIcon, 
  BellIcon, 
  ShieldIcon,
  CameraIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  EditIcon,
  SaveIcon,
  XIcon
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface UserProfile {
  email: string
  nombre: string
  rol: string
  telefono?: string
  direccion?: string
  notificaciones?: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacidad?: {
    perfilPublico: boolean
    mostrarEmail: boolean
    mostrarTelefono: boolean
  }
}

export default function PerfilPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<UserProfile>({
    email: "",
    nombre: "",
    rol: "",
    telefono: "",
    direccion: "",
    notificaciones: {
      email: true,
      push: true,
      sms: false
    },
    privacidad: {
      perfilPublico: true,
      mostrarEmail: false,
      mostrarTelefono: false
    }
  })

  useEffect(() => {
    const loggedInUserString = localStorage.getItem("loggedInUser")
    if (loggedInUserString) {
      try {
        const loggedInUser = JSON.parse(loggedInUserString)
        
        // Cargar datos adicionales del perfil desde localStorage si existen
        const profileDataString = localStorage.getItem(`profile_${loggedInUser.email}`)
        const profileData = profileDataString ? JSON.parse(profileDataString) : {}
        
        const completeUserData = {
          email: loggedInUser.email,
          nombre: loggedInUser.nombre,
          rol: loggedInUser.rol,
          telefono: profileData.telefono || "",
          direccion: profileData.direccion || "",
          notificaciones: profileData.notificaciones || {
            email: true,
            push: true,
            sms: false
          },
          privacidad: profileData.privacidad || {
            perfilPublico: true,
            mostrarEmail: false,
            mostrarTelefono: false
          }
        }
        
        setUserData(completeUserData)
        setFormData(completeUserData)
      } catch (error) {
        console.error("Error parsing user data:", error)
        router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const handleSave = () => {
    if (!userData) return

    try {
      // Guardar datos del perfil en localStorage
      localStorage.setItem(`profile_${userData.email}`, JSON.stringify({
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        direccion: formData.direccion,
        biografia: formData.biografia,
        notificaciones: formData.notificaciones,
        privacidad: formData.privacidad
      }))

      // Actualizar datos del usuario logueado si cambió el nombre
      if (formData.nombre !== userData.nombre) {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}")
        loggedInUser.nombre = formData.nombre
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser))
      }

      setUserData(formData)
      setEditMode(false)
      
      toast({
        title: "Perfil actualizado",
        description: "Los cambios se han guardado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive"
      })
    }
  }

  const handleCancel = () => {
    if (userData) {
      setFormData(userData)
    }
    setEditMode(false)
  }

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNotificationChange = (field: 'email' | 'push' | 'sms', value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notificaciones: {
        ...prev.notificaciones!,
        [field]: value
      }
    }))
  }

  const handlePrivacyChange = (field: 'perfilPublico' | 'mostrarEmail' | 'mostrarTelefono', value: boolean) => {
    setFormData(prev => ({
      ...prev,
      privacidad: {
        ...prev.privacidad!,
        [field]: value
      }
    }))
  }

  const getRoleBadge = (rol: string) => {
    const roleConfig = {
      supervisor: { label: "Supervisor", color: "bg-purple-100 text-purple-800" },
      enfermero: { label: "Enfermero", color: "bg-blue-100 text-blue-800" },
      medico: { label: "Médico", color: "bg-green-100 text-green-800" },
      cuidador: { label: "Cuidador", color: "bg-orange-100 text-orange-800" },
      terapeuta: { label: "Terapeuta", color: "bg-pink-100 text-pink-800" }
    }
    
    const config = roleConfig[rol as keyof typeof roleConfig] || { label: rol, color: "bg-gray-100 text-gray-800" }
    
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificado"
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
        </div>
        <div className="w-20" />
      </div>

      {/* Información principal del usuario */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder-user.jpg" alt={userData.nombre} />
                <AvatarFallback className="text-2xl">
                  {userData.nombre.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
              >
                <CameraIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold">{userData.nombre}</h2>
                {getRoleBadge(userData.rol)}
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                <MailIcon className="h-4 w-4" />
                <span>{userData.email}</span>
              </div>
              {userData.telefono && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <PhoneIcon className="h-4 w-4" />
                  <span>{userData.telefono}</span>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              {editMode ? (
                <>
                  <Button onClick={handleSave} size="sm">
                    <SaveIcon className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <XIcon className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditMode(true)} variant="outline" size="sm">
                  <EditIcon className="h-4 w-4 mr-2" />
                  Editar perfil
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs del perfil */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Información Personal</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
        </TabsList>

        {/* Tab de Información Personal */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5" />
                <span>Datos Personales</span>
              </CardTitle>
              <CardDescription>
                Información básica de tu perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    disabled={!editMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    disabled={!editMode}
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                    disabled={!editMode}
                    placeholder="Calle 123, Ciudad, Provincia"
                  />
                </div>
              </div>



              <div className="space-y-2">
                <Label>Rol</Label>
                <div className="flex items-center space-x-2">
                  <ShieldIcon className="h-4 w-4 text-muted-foreground" />
                  {getRoleBadge(formData.rol)}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Configuración */}
        <TabsContent value="configuracion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BellIcon className="h-5 w-5" />
                <span>Notificaciones</span>
              </CardTitle>
              <CardDescription>
                Configura cómo quieres recibir las notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificaciones por email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe actualizaciones importantes por correo electrónico
                    </p>
                  </div>
                  <Switch
                    checked={formData.notificaciones?.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificaciones push</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe notificaciones en tiempo real en la aplicación
                    </p>
                  </div>
                  <Switch
                    checked={formData.notificaciones?.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificaciones SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe alertas importantes por mensaje de texto
                    </p>
                  </div>
                  <Switch
                    checked={formData.notificaciones?.sms}
                    onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="h-5 w-5" />
                <span>Privacidad</span>
              </CardTitle>
              <CardDescription>
                Controla qué información es visible para otros usuarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Perfil público</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que otros usuarios vean tu perfil básico
                    </p>
                  </div>
                  <Switch
                    checked={formData.privacidad?.perfilPublico}
                    onCheckedChange={(checked) => handlePrivacyChange('perfilPublico', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mostrar email</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que otros usuarios vean tu dirección de email
                    </p>
                  </div>
                  <Switch
                    checked={formData.privacidad?.mostrarEmail}
                    onCheckedChange={(checked) => handlePrivacyChange('mostrarEmail', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mostrar teléfono</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que otros usuarios vean tu número de teléfono
                    </p>
                  </div>
                  <Switch
                    checked={formData.privacidad?.mostrarTelefono}
                    onCheckedChange={(checked) => handlePrivacyChange('mostrarTelefono', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Seguridad */}
        <TabsContent value="seguridad" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShieldIcon className="h-5 w-5" />
                <span>Seguridad de la cuenta</span>
              </CardTitle>
              <CardDescription>
                Gestiona la seguridad de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Cambiar contraseña</Label>
                    <p className="text-sm text-muted-foreground">
                      Actualiza tu contraseña regularmente para mantener tu cuenta segura
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => router.push("/cambiar-contrasena")}>
                    Cambiar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Zona de peligro</CardTitle>
              <CardDescription>
                Acciones irreversibles para tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <Label className="text-red-600">Eliminar cuenta</Label>
                  <p className="text-sm text-red-600">
                    Esta acción no se puede deshacer. Se eliminarán todos tus datos permanentemente.
                  </p>
                </div>
                <Button variant="destructive">
                  Eliminar cuenta
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 