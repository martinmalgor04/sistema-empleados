'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeftIcon, 
  ShareIcon, 
  EditIcon, 
  TrashIcon, 
  PillIcon, 
  CameraIcon,
  UserIcon,
  SearchIcon
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

const proveedoresDisponibles = [
  {
    id: 1,
    nombre: "Farmacéutica San Juan",
    telefono: "9999999999",
    email: "contacto@farmasanjuan.com"
  },
  {
    id: 2,
    nombre: "Distribuidora Med Plus",
    telefono: "8888888888", 
    email: "ventas@medplus.com"
  },
  {
    id: 3,
    nombre: "Pharma Distributors",
    telefono: "7777777777",
    email: "info@pharmadist.com"
  }
]

export default function AgregarMedicamentoPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [nombre, setNombre] = useState("")
  const [cantidad, setCantidad] = useState("")
  const [costo, setCosto] = useState("")
  const [stockMinimo, setStockMinimo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<typeof proveedoresDisponibles[0] | null>(null)
  const [busquedaProveedor, setBusquedaProveedor] = useState("")
  const [showProveedorDialog, setShowProveedorDialog] = useState(false)

  const proveedoresFiltrados = proveedoresDisponibles.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(busquedaProveedor.toLowerCase())
  )

  const handleSeleccionarProveedor = (proveedor: typeof proveedoresDisponibles[0]) => {
    setProveedorSeleccionado(proveedor)
    setShowProveedorDialog(false)
    setBusquedaProveedor("")
  }

  const handleImportarProspecto = () => {
    toast({
      title: "Función en desarrollo",
      description: "La importación de prospectos estará disponible próximamente.",
    })
  }

  const handleGuardar = () => {
    if (!nombre || !cantidad || !costo || !proveedorSeleccionado) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Medicamento agregado",
      description: `${nombre} se ha agregado correctamente al inventario.`,
    })
    
    // Redirigir a la lista de medicamentos
    router.push("/menu-medicamentos")
  }

  const handleCancelar = () => {
    router.back()
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <ShareIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <EditIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle>Añadir medicamento</CardTitle>
          <CardDescription>Completa la información del nuevo medicamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Imagen del medicamento */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
                <PillIcon className="h-12 w-12 text-primary" />
              </div>
              <Button size="sm" variant="ghost" className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full">
                <CameraIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Nombre del farmaco"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          {/* Cantidad y Costo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                placeholder="99999"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costo">Costo</Label>
              <Input
                id="costo"
                placeholder="99999"
                type="number"
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
              />
            </div>
          </div>

          {/* Stock mínimo */}
          <div className="space-y-2">
            <Label htmlFor="stock-minimo">Stock mínimo</Label>
            <Input
              id="stock-minimo"
              placeholder="20"
              type="number"
              value={stockMinimo}
              onChange={(e) => setStockMinimo(e.target.value)}
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Descripción del medicamento..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
            />
          </div>

          {/* Proveedor */}
          <div className="space-y-2">
            <Label>Proveedor</Label>
            <Dialog open={showProveedorDialog} onOpenChange={setShowProveedorDialog}>
              <DialogTrigger asChild>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar proveedor"
                    value={proveedorSeleccionado?.nombre || ""}
                    readOnly
                    className="pl-10 cursor-pointer"
                  />
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Seleccionar proveedor</DialogTitle>
                  <DialogDescription>
                    Busca y selecciona un proveedor de la lista.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar proveedores..."
                      value={busquedaProveedor}
                      onChange={(e) => setBusquedaProveedor(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {proveedoresFiltrados.map((proveedor) => (
                      <div
                        key={proveedor.id}
                        className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSeleccionarProveedor(proveedor)}
                      >
                        <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                          <UserIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{proveedor.nombre}</p>
                          <p className="text-sm text-muted-foreground">{proveedor.email}</p>
                        </div>
                      </div>
                    ))}
                    {proveedoresFiltrados.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        No se encontraron proveedores
                      </p>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Proveedor seleccionado */}
          {proveedorSeleccionado && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{proveedorSeleccionado.nombre}</p>
                    <p className="text-sm text-muted-foreground">{proveedorSeleccionado.telefono}</p>
                    <p className="text-sm text-muted-foreground">{proveedorSeleccionado.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de acción */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={handleImportarProspecto}>
              Importar prospecto
            </Button>
            <Button className="w-full" onClick={handleGuardar}>
              Guardar
            </Button>
            <Button variant="outline" className="w-full text-destructive" onClick={handleCancelar}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 