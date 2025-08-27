'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeftIcon, 
  ChevronRightIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
  CalendarIcon,
  ClockIcon,
  UploadIcon,
  SearchIcon,
  XIcon,
  PlusIcon,
  BuildingIcon
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import comprasData from "@/data/compras.json"
import proveedoresData from "@/data/proveedores.json"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ProductoSeleccionado {
  id: number
  nombre: string
  categoria: string
  area: string
  prioridad: string
  cantidad_solicitada: number
  unidad: string
  cantidad_comprada?: number
  precio_unitario?: number
  subtotal?: number
}

interface Provider {
  id: number
  cuit: string
  nombre: string
  telefono: string
  direccion: string
  status: 'active' | 'inactive'
  createdAt?: string
}

export default function RegistrarCompraPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [paso, setPaso] = useState(1) // Start at 1 for product selection
  const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([])
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [isCreatingProvider, setIsCreatingProvider] = useState(false)
  const [newProvider, setNewProvider] = useState({ cuit: "", nombre: "", telefono: "", direccion: "" })
  const [providerSearch, setProviderSearch] = useState("")
  const [cancelDialog, setCancelDialog] = useState(false)
  const [datosGenerales, setDatosGenerales] = useState({
    localVendedor: "",
    fecha: "",
    hora: "",
    estado: "recibida" as "recibida" | "pendiente",
    fechaEntrega: "",
    comprobante: null as File | null
  })

  // Filter states
  const [filtroCategoria, setFiltroCategoria] = useState("todas")
  const [filtroArea, setFiltroArea] = useState("todas")
  const [filtroPrioridad, setFiltroPrioridad] = useState("todas")
  const [ordenarPor, setOrdenarPor] = useState("nombre") // nombre, cantidad, prioridad
  const [searchTerm, setSearchTerm] = useState("")

  const { necesidades } = comprasData

  // Filter and sort necesidades
  const necesidadesFiltradas = necesidades
    .filter(necesidad => {
      const matchesSearch = necesidad.producto.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategoria = filtroCategoria === "todas" || necesidad.categoria === filtroCategoria
      const matchesArea = filtroArea === "todas" || necesidad.area === filtroArea
      const matchesPrioridad = filtroPrioridad === "todas" || necesidad.prioridad === filtroPrioridad
      
      return matchesSearch && matchesCategoria && matchesArea && matchesPrioridad
    })
    .sort((a, b) => {
      switch (ordenarPor) {
        case "cantidad":
          return b.cantidad_solicitada - a.cantidad_solicitada
        case "prioridad":
          const prioridadOrder = { "alta": 3, "media": 2, "baja": 1 }
          return (prioridadOrder[b.prioridad as keyof typeof prioridadOrder] || 0) - 
                 (prioridadOrder[a.prioridad as keyof typeof prioridadOrder] || 0)
        case "nombre":
        default:
          return a.producto.localeCompare(b.producto)
      }
    })

  const toggleProducto = (necesidad: any, isSelected: boolean) => {
    if (isSelected) {
      setProductosSeleccionados([...productosSeleccionados, {
        id: necesidad.id,
        nombre: necesidad.producto,
        categoria: necesidad.categoria,
        area: necesidad.area,
        prioridad: necesidad.prioridad,
        cantidad_solicitada: necesidad.cantidad_solicitada,
        unidad: necesidad.unidad
      }])
    } else {
      setProductosSeleccionados(productosSeleccionados.filter(p => p.id !== necesidad.id))
    }
  }

  const resetFilters = () => {
    setFiltroCategoria("todas")
    setFiltroArea("todas")
    setFiltroPrioridad("todas")
    setOrdenarPor("nombre")
    setSearchTerm("")
  }

  // Get unique values for filter options
  const categorias = [...new Set(necesidades.map(n => n.categoria))]
  const areas = [...new Set(necesidades.map(n => n.area))]
  const prioridades = ["alta", "media", "baja"]

  // Filter providers based on search
  const providers = proveedoresData.filter(p => p.status === 'active') as Provider[]
  const filteredProviders = providers.filter(provider => 
    provider.nombre.toLowerCase().includes(providerSearch.toLowerCase()) ||
    provider.cuit.includes(providerSearch)
  )

  const updateProductoCantidadYPrecio = (id: number, cantidad: number, precio: number) => {
    setProductosSeleccionados(productos => 
      productos.map(p => 
        p.id === id 
          ? { ...p, cantidad_comprada: cantidad, precio_unitario: precio, subtotal: cantidad * precio }
          : p
      )
    )
  }

  const calcularTotal = () => {
    return productosSeleccionados.reduce((total, p) => total + (p.subtotal || 0), 0)
  }

  const handleSiguiente = () => {
    if (paso === 1 && productosSeleccionados.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos un producto para continuar",
        variant: "destructive"
      })
      return
    }
    if (paso === 2 && productosSeleccionados.some(p => !p.cantidad_comprada || !p.precio_unitario)) {
      toast({
        title: "Error", 
        description: "Completa cantidad y precio para todos los productos",
        variant: "destructive"
      })
      return
    }
    if (paso === 3 && (!selectedProvider || !datosGenerales.fecha)) {
      toast({
        title: "Error",
        description: "Selecciona un proveedor y completa la fecha",
        variant: "destructive"
      })
      return
    }
    setPaso(paso + 1)
  }

  const handleCancelOrder = () => {
    setCancelDialog(true)
  }

  const confirmCancelOrder = () => {
    toast({
      title: "Pedido cancelado",
      description: "El registro de compra ha sido cancelado",
      variant: "destructive"
    })
    router.push("/compras")
  }

  const validateCUIT = (cuit: string): boolean => {
    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/
    return cuitRegex.test(cuit)
  }

  const handleCreateProvider = () => {
    if (!newProvider.cuit || !newProvider.nombre || !newProvider.telefono || !newProvider.direccion) {
      toast({
        title: "Error",
        description: "Todos los campos del proveedor son obligatorios",
        variant: "destructive"
      })
      return
    }

    if (!validateCUIT(newProvider.cuit)) {
      toast({
        title: "Error",
        description: "El CUIT debe tener el formato XX-XXXXXXXX-X",
        variant: "destructive"
      })
      return
    }

    const provider: Provider = {
      id: Math.max(...providers.map(p => p.id), 0) + 1,
      ...newProvider,
      status: 'active'
    }

    setSelectedProvider(provider)
    setIsCreatingProvider(false)
    setNewProvider({ cuit: "", nombre: "", telefono: "", direccion: "" })
    
    toast({
      title: "Proveedor creado",
      description: `${provider.nombre} ha sido seleccionado`,
    })
  }

  const handleRegistrar = () => {
    toast({
      title: "¡Compra registrada exitosamente!",
      description: `Se registraron ${productosSeleccionados.length} productos por un total de ${formatCurrency(calcularTotal())}`,
    })
    setPaso(5)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const handleComprobanteUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setDatosGenerales({ ...datosGenerales, comprobante: file })
    }
  }

  if (paso === 5) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-6">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircleIcon className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">¡Compra registrada exitosamente!</h2>
              <p className="text-muted-foreground">
                Se registraron {productosSeleccionados.length} productos por un total de {formatCurrency(calcularTotal())}
              </p>
            </div>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => {
                // Reset form
                setPaso(1)
                setProductosSeleccionados([])
                setSelectedProvider(null)
                setIsCreatingProvider(false)
                setProviderSearch("")
                setNewProvider({ cuit: "", nombre: "", telefono: "", direccion: "" })
                setDatosGenerales({
                  localVendedor: "",
                  fecha: "",
                  hora: "",
                  estado: "recibida",
                  fechaEntrega: "",
                  comprobante: null
                })
              }}>
                Registrar otra compra
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push("/compras")}>
                Volver al Menú de Compras
              </Button>
            </div>
          </CardContent>
        </Card>
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
          <h1 className="text-2xl font-bold">Registro de compra</h1>
          <p className="text-muted-foreground">Paso {paso} de 4</p>
        </div>
        <div className="w-20" />
      </div>

      {/* Indicador de progreso */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              stepNumber === paso 
                ? 'bg-primary text-primary-foreground' 
                : stepNumber < paso 
                  ? 'bg-green-500 text-white' 
                  : 'bg-muted text-muted-foreground'
            }`}>
              {stepNumber < paso ? <CheckCircleIcon className="h-5 w-5" /> : stepNumber}
            </div>
            {stepNumber < 4 && (
              <div className={`w-8 h-1 mx-2 ${stepNumber < paso ? 'bg-green-500' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>


      {/* Paso 1: Selección de Productos */}
      {paso === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Paso 1: Selección de Productos</CardTitle>
            <CardDescription>
              Seleccione las necesidades en estado faltante correspondientes a la compra a registrar. 
              Use los filtros para encontrar productos específicos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filtros */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Búsqueda */}
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar producto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Filtro por categoría */}
                  <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas las categorías</SelectItem>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Filtro por área */}
                  <Select value={filtroArea} onValueChange={setFiltroArea}>
                    <SelectTrigger>
                      <SelectValue placeholder="Área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas las áreas</SelectItem>
                      {areas.map((area) => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Filtro por prioridad */}
                  <Select value={filtroPrioridad} onValueChange={setFiltroPrioridad}>
                    <SelectTrigger>
                      <SelectValue placeholder="Prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas las prioridades</SelectItem>
                      {prioridades.map((prioridad) => (
                        <SelectItem key={prioridad} value={prioridad}>
                          {prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Ordenar por */}
                  <Select value={ordenarPor} onValueChange={setOrdenarPor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nombre">Nombre</SelectItem>
                      <SelectItem value="cantidad">Cantidad (mayor a menor)</SelectItem>
                      <SelectItem value="prioridad">Prioridad (alta a baja)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {necesidadesFiltradas.length} de {necesidades.length} productos
                    {productosSeleccionados.length > 0 && (
                      <span className="ml-2 font-medium text-primary">
                        • {productosSeleccionados.length} seleccionados
                      </span>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    Limpiar filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de productos */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 w-12">
                      <Checkbox
                        checked={necesidadesFiltradas.length > 0 && necesidadesFiltradas.every(n => productosSeleccionados.some(p => p.id === n.id))}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            // Seleccionar todos los filtrados que no estén ya seleccionados
                            const nuevosSeleccionados = necesidadesFiltradas.filter(n => 
                              !productosSeleccionados.some(p => p.id === n.id)
                            ).map(n => ({
                              id: n.id,
                              nombre: n.producto,
                              categoria: n.categoria,
                              area: n.area,
                              prioridad: n.prioridad,
                              cantidad_solicitada: n.cantidad_solicitada,
                              unidad: n.unidad
                            }))
                            setProductosSeleccionados([...productosSeleccionados, ...nuevosSeleccionados])
                          } else {
                            // Deseleccionar todos los filtrados
                            const idsADeseleccionar = necesidadesFiltradas.map(n => n.id)
                            setProductosSeleccionados(productosSeleccionados.filter(p => !idsADeseleccionar.includes(p.id)))
                          }
                        }}
                      />
                    </th>
                    <th className="text-left p-3 font-medium">Producto</th>
                    <th className="text-left p-3 font-medium">Cant. solicitada</th>
                    <th className="text-left p-3 font-medium">Categoría</th>
                    <th className="text-left p-3 font-medium">Área</th>
                    <th className="text-left p-3 font-medium">Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  {necesidadesFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-muted-foreground">
                        No se encontraron productos con los filtros aplicados
                      </td>
                    </tr>
                  ) : (
                    necesidadesFiltradas.map((necesidad) => (
                      <tr key={necesidad.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <Checkbox
                            checked={productosSeleccionados.some(p => p.id === necesidad.id)}
                            onCheckedChange={(checked) => toggleProducto(necesidad, checked as boolean)}
                          />
                        </td>
                        <td className="p-3 font-medium">{necesidad.producto}</td>
                        <td className="p-3">
                          <div className="font-medium">
                            {necesidad.cantidad_solicitada} {necesidad.unidad}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">
                            {necesidad.categoria}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <span className="text-sm">{necesidad.area}</span>
                        </td>
                        <td className="p-3">
                          <Badge 
                            variant={necesidad.prioridad === 'alta' ? 'destructive' : 
                                   necesidad.prioridad === 'media' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {necesidad.prioridad.charAt(0).toUpperCase() + necesidad.prioridad.slice(1)}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6">
              <Button 
                variant="destructive" 
                onClick={handleCancelOrder}
                className="bg-red-600 hover:bg-red-700"
              >
                <XIcon className="h-4 w-4 mr-2" />
                Cancelar Compra
              </Button>
              <Button onClick={handleSiguiente} disabled={productosSeleccionados.length === 0}>
                Siguiente ({productosSeleccionados.length} productos)
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paso 2: Montos y cantidades */}
      {paso === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Paso 2: Montos y cantidades</CardTitle>
            <CardDescription>
              Para cada producto, ingrese la cantidad comprada y el subtotal correspondiente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Producto</th>
                    <th className="text-left p-3 font-medium">Cant. comprada / Cant. solicitada</th>
                    <th className="text-left p-3 font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {productosSeleccionados.map((producto) => (
                    <tr key={producto.id} className="border-b">
                      <td className="p-3 font-medium">{producto.nombre}</td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            placeholder="0"
                            className="w-20"
                            value={producto.cantidad_comprada || ""}
                            onChange={(e) => {
                              const cantidad = parseFloat(e.target.value) || 0
                              updateProductoCantidadYPrecio(producto.id, cantidad, producto.precio_unitario || 0)
                            }}
                          />
                          <span className="text-sm text-muted-foreground">
                            {producto.unidad} / {producto.cantidad_solicitada} {producto.unidad}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <span>$</span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            className="w-32"
                            value={producto.subtotal || ""}
                            onChange={(e) => {
                              const subtotal = parseFloat(e.target.value) || 0
                              const cantidad = producto.cantidad_comprada || 1
                              const precio = cantidad > 0 ? subtotal / cantidad : 0
                              updateProductoCantidadYPrecio(producto.id, cantidad, precio)
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-6">
              <Button variant="outline" onClick={() => setPaso(paso - 1)}>
                Volver
              </Button>
              <div className="text-lg font-semibold">
                Total: {formatCurrency(calcularTotal())}
              </div>
              <Button onClick={handleSiguiente}>
                Siguiente
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paso 3: Datos generales */}
      {paso === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Paso 3: Datos generales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label>Proveedor:</Label>
                
                {/* Selected Provider Display */}
                {selectedProvider ? (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <BuildingIcon className="h-4 w-4 text-green-600" />
                            <h4 className="font-medium text-green-800">{selectedProvider.nombre}</h4>
                          </div>
                          <p className="text-xs text-green-600">CUIT: {selectedProvider.cuit}</p>
                          <p className="text-xs text-green-600">{selectedProvider.telefono}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedProvider(null)}>
                          Cambiar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {/* Toggle buttons */}
                    <div className="flex items-center justify-center space-x-2">
                      <Button 
                        variant={!isCreatingProvider ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsCreatingProvider(false)}
                      >
                        Seleccionar Existente
                      </Button>
                      <span className="text-muted-foreground text-sm">o</span>
                      <Button 
                        variant={isCreatingProvider ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsCreatingProvider(true)}
                      >
                        <PlusIcon className="h-3 w-3 mr-1" />
                        Crear Nuevo
                      </Button>
                    </div>

                    {/* Select Existing Provider */}
                    {!isCreatingProvider && (
                      <div className="space-y-2">
                        <div className="relative">
                          <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                          <Input
                            placeholder="Buscar proveedor..."
                            value={providerSearch}
                            onChange={(e) => setProviderSearch(e.target.value)}
                            className="pl-7 text-sm"
                            size="sm"
                          />
                        </div>
                        
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {filteredProviders.length === 0 ? (
                            <div className="text-center py-4 text-muted-foreground text-xs">
                              {providerSearch ? "No se encontraron proveedores" : "No hay proveedores disponibles"}
                            </div>
                          ) : (
                            filteredProviders.map((provider) => (
                              <div 
                                key={provider.id} 
                                className="p-2 border rounded cursor-pointer hover:bg-muted/50 transition-colors" 
                                onClick={() => setSelectedProvider(provider)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h5 className="font-medium text-sm">{provider.nombre}</h5>
                                    <p className="text-xs text-muted-foreground">CUIT: {provider.cuit}</p>
                                  </div>
                                  <Button size="sm" variant="ghost">
                                    Seleccionar
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {/* Create New Provider */}
                    {isCreatingProvider && (
                      <div className="p-3 border rounded-lg space-y-3">
                        <h5 className="font-medium text-sm">Nuevo Proveedor</h5>
                        <div className="grid grid-cols-1 gap-3">
                          <Input
                            placeholder="CUIT (XX-XXXXXXXX-X)"
                            value={newProvider.cuit}
                            onChange={(e) => setNewProvider({...newProvider, cuit: e.target.value})}
                            className="text-sm"
                          />
                          <Input
                            placeholder="Nombre del proveedor"
                            value={newProvider.nombre}
                            onChange={(e) => setNewProvider({...newProvider, nombre: e.target.value})}
                            className="text-sm"
                          />
                          <Input
                            placeholder="Teléfono"
                            value={newProvider.telefono}
                            onChange={(e) => setNewProvider({...newProvider, telefono: e.target.value})}
                            className="text-sm"
                          />
                          <Input
                            placeholder="Dirección"
                            value={newProvider.direccion}
                            onChange={(e) => setNewProvider({...newProvider, direccion: e.target.value})}
                            className="text-sm"
                          />
                        </div>
                        <Button onClick={handleCreateProvider} size="sm" className="w-full">
                          <PlusIcon className="h-3 w-3 mr-1" />
                          Crear y Seleccionar
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha de la compra:</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="fecha"
                    type="date"
                    value={datosGenerales.fecha}
                    onChange={(e) => setDatosGenerales({...datosGenerales, fecha: e.target.value})}
                  />
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora">Hora (aprox.):</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="hora"
                    type="time"
                    value={datosGenerales.hora}
                    onChange={(e) => setDatosGenerales({...datosGenerales, hora: e.target.value})}
                  />
                  <ClockIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Estado:</Label>
              <RadioGroup 
                value={datosGenerales.estado} 
                onValueChange={(value: "recibida" | "pendiente") => setDatosGenerales({...datosGenerales, estado: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recibida" id="recibida" />
                  <Label htmlFor="recibida">Recibida</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pendiente" id="pendiente" />
                  <Label htmlFor="pendiente">Pendiente</Label>
                </div>
              </RadioGroup>

              {datosGenerales.estado === "pendiente" && (
                <div className="space-y-2">
                  <Label htmlFor="fechaEntrega">Entrega estimada:</Label>
                  <Input
                    id="fechaEntrega"
                    type="date"
                    value={datosGenerales.fechaEntrega}
                    onChange={(e) => setDatosGenerales({...datosGenerales, fechaEntrega: e.target.value})}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Comprobante de compra:</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleComprobanteUpload}
                  className="hidden"
                  id="comprobante"
                />
                <label htmlFor="comprobante" className="cursor-pointer">
                  <UploadIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {datosGenerales.comprobante 
                      ? `Archivo: ${datosGenerales.comprobante.name}`
                      : "Haz clic para subir comprobante"
                    }
                  </p>
                </label>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setPaso(paso - 1)}>
                Volver
              </Button>
              <Button onClick={handleSiguiente}>
                Siguiente
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paso 4: Confirmar registro */}
      {paso === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Paso 4: Confirmar registro</CardTitle>
            <CardDescription>
              A continuación se muestra un resumen de la compra. Revise los detalles y seleccione 
              <span className="text-red-600 font-medium"> Registrar</span> para registrarla
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">
                Compra en {datosGenerales.localVendedor}, del día {new Date(datosGenerales.fecha).toLocaleDateString('es-ES')} a las {datosGenerales.hora}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Producto</th>
                    <th className="text-left p-3 font-medium">Cantidad</th>
                    <th className="text-left p-3 font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {productosSeleccionados.map((producto) => (
                    <tr key={producto.id} className="border-b">
                      <td className="p-3">{producto.nombre}</td>
                      <td className="p-3">{producto.cantidad_comprada} {producto.unidad}</td>
                      <td className="p-3">{formatCurrency(producto.subtotal || 0)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 font-semibold">
                    <td className="p-3" colSpan={2}>Total</td>
                    <td className="p-3">{formatCurrency(calcularTotal())}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setPaso(paso - 1)}>
                Volver
              </Button>
              <Button onClick={handleRegistrar} className="bg-green-600 hover:bg-green-700">
                Registrar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancel Order Dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XIcon className="h-5 w-5 text-red-500" />
              Cancelar Registro de Compra
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cancelar el registro de esta compra?
              Perderás todos los datos ingresados y volverás al menú principal de compras.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setCancelDialog(false)}>
              No, continuar registro
            </Button>
            <Button variant="destructive" onClick={confirmCancelOrder}>
              Sí, cancelar registro
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 