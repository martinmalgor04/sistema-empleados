'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowLeftIcon, 
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  BuildingIcon,
  PhoneIcon,
  MapPinIcon,
  FileTextIcon
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import proveedoresData from "@/data/proveedores.json"

interface Provider {
  id: number
  cuit: string
  nombre: string
  telefono: string
  direccion: string
  status: 'active' | 'inactive'
  createdAt: string
}

export default function ProveedoresPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [providers, setProviders] = useState<Provider[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddingProvider, setIsAddingProvider] = useState(false)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)
  const [newProvider, setNewProvider] = useState({
    cuit: "",
    nombre: "",
    telefono: "",
    direccion: ""
  })

  useEffect(() => {
    // Load providers from JSON data
    setProviders(proveedoresData as Provider[])
  }, [])

  // Filter providers based on search and status
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = 
      provider.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.cuit.includes(searchTerm) ||
      provider.telefono.includes(searchTerm)
    
    const matchesStatus = statusFilter === "all" || provider.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const validateCUIT = (cuit: string): boolean => {
    // Basic CUIT validation (should be XX-XXXXXXXX-X format)
    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/
    return cuitRegex.test(cuit)
  }

  const validateProvider = (provider: any): string | null => {
    if (!provider.cuit || !provider.nombre || !provider.telefono || !provider.direccion) {
      return "Todos los campos son obligatorios"
    }
    
    if (!validateCUIT(provider.cuit)) {
      return "El CUIT debe tener el formato XX-XXXXXXXX-X"
    }

    // Check for duplicate CUIT (excluding current provider when editing)
    const isDuplicate = providers.some(p => 
      p.cuit === provider.cuit && 
      (!editingProvider || p.id !== editingProvider.id)
    )
    
    if (isDuplicate) {
      return "Ya existe un proveedor con este CUIT"
    }

    return null
  }

  const handleAddProvider = () => {
    const error = validateProvider(newProvider)
    if (error) {
      toast({
        title: "Error de validación",
        description: error,
        variant: "destructive"
      })
      return
    }

    const provider: Provider = {
      id: Math.max(...providers.map(p => p.id), 0) + 1,
      ...newProvider,
      status: 'active',
      createdAt: new Date().toISOString()
    }

    setProviders([...providers, provider])
    setNewProvider({ cuit: "", nombre: "", telefono: "", direccion: "" })
    setIsAddingProvider(false)
    
    toast({
      title: "Proveedor agregado",
      description: `${provider.nombre} ha sido agregado exitosamente`,
    })
  }

  const handleEditProvider = (provider: Provider) => {
    setEditingProvider(provider)
    setNewProvider({
      cuit: provider.cuit,
      nombre: provider.nombre,
      telefono: provider.telefono,
      direccion: provider.direccion
    })
  }

  const handleUpdateProvider = () => {
    if (!editingProvider) return

    const error = validateProvider(newProvider)
    if (error) {
      toast({
        title: "Error de validación",
        description: error,
        variant: "destructive"
      })
      return
    }

    const updatedProviders = providers.map(p => 
      p.id === editingProvider.id 
        ? { ...p, ...newProvider }
        : p
    )

    setProviders(updatedProviders)
    setEditingProvider(null)
    setNewProvider({ cuit: "", nombre: "", telefono: "", direccion: "" })
    
    toast({
      title: "Proveedor actualizado",
      description: `${newProvider.nombre} ha sido actualizado exitosamente`,
    })
  }

  const handleDeleteProvider = (id: number) => {
    const provider = providers.find(p => p.id === id)
    if (!provider) return

    setProviders(providers.filter(p => p.id !== id))
    toast({
      title: "Proveedor eliminado",
      description: `${provider.nombre} ha sido eliminado`,
    })
  }

  const handleToggleStatus = (id: number) => {
    const updatedProviders = providers.map(p => 
      p.id === id 
        ? { ...p, status: p.status === 'active' ? 'inactive' as const : 'active' as const }
        : p
    )
    setProviders(updatedProviders)
    
    const provider = providers.find(p => p.id === id)
    const newStatus = provider?.status === 'active' ? 'inactivo' : 'activo'
    toast({
      title: "Estado actualizado",
      description: `${provider?.nombre} ahora está ${newStatus}`,
    })
  }

  const resetForm = () => {
    setNewProvider({ cuit: "", nombre: "", telefono: "", direccion: "" })
    setEditingProvider(null)
    setIsAddingProvider(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BuildingIcon className="h-6 w-6" />
              Gestión de Proveedores
            </h1>
            <p className="text-muted-foreground">
              Administra los proveedores del sistema de compras
            </p>
          </div>
        </div>
        <Dialog open={isAddingProvider} onOpenChange={setIsAddingProvider}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Agregar Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
              <DialogDescription>
                Complete los datos del proveedor
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cuit">CUIT *</Label>
                <Input
                  id="cuit"
                  placeholder="XX-XXXXXXXX-X"
                  value={newProvider.cuit}
                  onChange={(e) => setNewProvider({...newProvider, cuit: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  placeholder="Nombre del proveedor"
                  value={newProvider.nombre}
                  onChange={(e) => setNewProvider({...newProvider, nombre: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  placeholder="+54 11 1234-5678"
                  value={newProvider.telefono}
                  onChange={(e) => setNewProvider({...newProvider, telefono: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  placeholder="Dirección completa"
                  value={newProvider.direccion}
                  onChange={(e) => setNewProvider({...newProvider, direccion: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button onClick={handleAddProvider}>
                  Agregar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BuildingIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Proveedores</p>
                <p className="text-xl font-bold">{providers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-green-500 rounded"></div>
              <div>
                <p className="text-sm text-muted-foreground">Activos</p>
                <p className="text-xl font-bold">{providers.filter(p => p.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-gray-500 rounded"></div>
              <div>
                <p className="text-sm text-muted-foreground">Inactivos</p>
                <p className="text-xl font-bold">{providers.filter(p => p.status === 'inactive').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, CUIT o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Mostrando {filteredProviders.length} de {providers.length} proveedores
          </div>
        </CardContent>
      </Card>

      {/* Providers List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <CardDescription>
            Gestiona la información de todos los proveedores
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProviders.length === 0 ? (
            <div className="text-center py-12">
              <BuildingIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No se encontraron proveedores</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" 
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Comienza agregando tu primer proveedor"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProviders.map((provider) => (
                <Card key={provider.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="font-semibold text-lg">{provider.nombre}</h3>
                          <Badge 
                            variant={provider.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {provider.status === 'active' ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <FileTextIcon className="h-4 w-4" />
                            <span>CUIT: {provider.cuit}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <PhoneIcon className="h-4 w-4" />
                            <span>{provider.telefono}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPinIcon className="h-4 w-4" />
                            <span>{provider.direccion}</span>
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-muted-foreground">
                          Registrado: {formatDate(provider.createdAt)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleStatus(provider.id)}
                        >
                          {provider.status === 'active' ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditProvider(provider)}
                            >
                              <EditIcon className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Editar Proveedor</DialogTitle>
                              <DialogDescription>
                                Modifica los datos del proveedor
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-cuit">CUIT *</Label>
                                <Input
                                  id="edit-cuit"
                                  placeholder="XX-XXXXXXXX-X"
                                  value={newProvider.cuit}
                                  onChange={(e) => setNewProvider({...newProvider, cuit: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-nombre">Nombre *</Label>
                                <Input
                                  id="edit-nombre"
                                  placeholder="Nombre del proveedor"
                                  value={newProvider.nombre}
                                  onChange={(e) => setNewProvider({...newProvider, nombre: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-telefono">Teléfono *</Label>
                                <Input
                                  id="edit-telefono"
                                  placeholder="+54 11 1234-5678"
                                  value={newProvider.telefono}
                                  onChange={(e) => setNewProvider({...newProvider, telefono: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-direccion">Dirección *</Label>
                                <Input
                                  id="edit-direccion"
                                  placeholder="Dirección completa"
                                  value={newProvider.direccion}
                                  onChange={(e) => setNewProvider({...newProvider, direccion: e.target.value})}
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={resetForm}>
                                  Cancelar
                                </Button>
                                <Button onClick={handleUpdateProvider}>
                                  Actualizar
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteProvider(provider.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}