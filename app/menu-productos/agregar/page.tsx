'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeftIcon,
  ShareIcon,
  EditIcon,
  TrashIcon,
  PackageIcon,
  CameraIcon,
  UserIcon,
  SearchIcon
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

const proveedoresDisponibles = [
  {
    id: 1,
    nombre: "Distribuidora Láctea del Valle",
    telefono: "5555555555",
    email: "ventas@lacteavalley.com"
  },
  {
    id: 2,
    nombre: "Alimentos Frescos SA",
    telefono: "4444444444",
    email: "info@alimentosfrescos.com"
  },
  {
    id: 3,
    nombre: "Panadería Artesanal",
    telefono: "3333333333",
    email: "contacto@panartesanal.com"
  },
  {
    id: 4,
    nombre: "Productos de Limpieza SA",
    telefono: "2222222222",
    email: "ventas@limpiezasa.com"
  },
  {
    id: 5,
    nombre: "Productos Médicos Plus",
    telefono: "1111111111",
    email: "ventas@medplus.com"
  }
]

const categoriasProductos = [
  { value: "lacteos", label: "Lácteos" },
  { value: "panaderia", label: "Panadería" },
  { value: "carnes", label: "Carnes" },
  { value: "verduras", label: "Verduras" },
  { value: "frutas", label: "Frutas" },
  { value: "bebidas", label: "Bebidas" },
  { value: "higiene", label: "Higiene" },
  { value: "limpieza", label: "Limpieza" },
  { value: "despensa", label: "Despensa" },
  { value: "otros", label: "Otros" }
]

const tiposProductos = [
  { value: "alimento", label: "Alimento" },
  { value: "bebida", label: "Bebida" },
  { value: "higiene_personal", label: "Higiene Personal" },
  { value: "limpieza", label: "Producto de Limpieza" },
  { value: "insumo", label: "Insumo Médico" },
  { value: "otro", label: "Otro" }
]

export default function AgregarProductoPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [nombre, setNombre] = useState("")
  const [categoria, setCategoria] = useState("")
  const [tipo, setTipo] = useState("")
  const [cantidad, setCantidad] = useState("")
  const [costo, setCosto] = useState("")
  const [stockMinimo, setStockMinimo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<typeof proveedoresDisponibles[0] | null>(null)
  const [busquedaProveedor, setBusquedaProveedor] = useState("")
  const [showProveedorDialog, setShowProveedorDialog] = useState(false)
  const [perecedero, setPerecedero] = useState(false)
  const [fechaCaducidadDias, setFechaCaducidadDias] = useState("")
  const [temperaturaAlmacenamiento, setTemperaturaAlmacenamiento] = useState("ambiente")
  const [codigoBarras, setCodigoBarras] = useState("")

  const proveedoresFiltrados = proveedoresDisponibles.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(busquedaProveedor.toLowerCase())
  )

  const handleSeleccionarProveedor = (proveedor: typeof proveedoresDisponibles[0]) => {
    setProveedorSeleccionado(proveedor)
    setShowProveedorDialog(false)
    setBusquedaProveedor("")
  }

  const handleImportarInformacion = () => {
    toast({
      title: "Función en desarrollo",
      description: "La importación automática estará disponible próximamente.",
    })
  }

  const handleGuardar = () => {
    if (!nombre || !categoria || !tipo || !cantidad || !costo || !proveedorSeleccionado) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Producto agregado",
      description: `${nombre} se ha agregado correctamente al inventario.`,
    })

    // Redirigir a la lista de productos
    router.push("/menu-productos")
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
          <CardTitle>Añadir producto</CardTitle>
          <CardDescription>Completa la información del nuevo producto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Imagen del producto */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
                <PackageIcon className="h-12 w-12 text-primary" />
              </div>
              <Button size="sm" variant="ghost" className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full">
                <CameraIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              placeholder="Nombre del producto"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          {/* Categoría y Tipo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoría *</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasProductos.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo *</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposProductos.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cantidad y Costo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad inicial *</Label>
              <Input
                id="cantidad"
                placeholder="99999"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costo">Costo unitario *</Label>
              <Input
                id="costo"
                placeholder="99999.99"
                type="number"
                step="0.01"
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
              placeholder="Descripción del producto..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
            />
          </div>

          {/* Código de barras */}
          <div className="space-y-2">
            <Label htmlFor="codigo-barras">Código de barras</Label>
            <Input
              id="codigo-barras"
              placeholder="1234567890123"
              value={codigoBarras}
              onChange={(e) => setCodigoBarras(e.target.value)}
            />
          </div>

          {/* Perecedero */}
          <div className="flex items-center space-x-2">
            <Switch
              id="perecedero"
              checked={perecedero}
              onCheckedChange={setPerecedero}
            />
            <Label htmlFor="perecedero">Producto perecedero</Label>
          </div>

          {/* Campos específicos para perecederos */}
          {perecedero && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fecha-caducidad">Días para caducar</Label>
                <Input
                  id="fecha-caducidad"
                  placeholder="30"
                  type="number"
                  value={fechaCaducidadDias}
                  onChange={(e) => setFechaCaducidadDias(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperatura">Temperatura de almacenamiento</Label>
                <Select value={temperaturaAlmacenamiento} onValueChange={setTemperaturaAlmacenamiento}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar temperatura" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ambiente">Ambiente</SelectItem>
                    <SelectItem value="refrigerado">Refrigerado (2-6°C)</SelectItem>
                    <SelectItem value="congelado">Congelado (-18°C)</SelectItem>
                    <SelectItem value="fresco">Fresco (0-4°C)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Proveedor */}
          <div className="space-y-2">
            <Label>Proveedor *</Label>
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
            <Button variant="outline" className="w-full" onClick={handleImportarInformacion}>
              Importar información
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
