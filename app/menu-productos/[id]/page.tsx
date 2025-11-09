'use client'

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeftIcon,
  PackageIcon,
  TrendingUpIcon,
  CalendarIcon,
  EditIcon,
  TrashIcon,
  AlertTriangleIcon,
  ThermometerIcon,
  ClockIcon
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import productosData from "@/data/productos.json"
import estadisticasProductosData from "@/data/estadisticas-productos.json"

interface Producto {
  id: number
  nombre: string
  descripcion: string
  categoria: string
  tipo: string
  cantidad: number
  stock_minimo: number
  costo: number
  estado: string
  imagen: string
  proveedor_principal: {
    id: number
    nombre: string
    telefono: string
    email: string
  }
  proveedores: Array<{
    id: number
    nombre: string
    telefono: string
    email: string
  }>
  uso_mensual: number[]
  uso_semanal: number[]
  frecuencia_uso: number
  perecedero: boolean
  fecha_caducidad_dias: number
  temperatura_almacenamiento: string
  nutricion?: {
    calorias?: number
    proteinas?: number
    grasas?: number
    carbohidratos?: number
    fibra?: number
    calcio?: number
    unidad_medida: string
  }
  codigo_barras: string
}

export default function DetalleProductoPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [producto, setProducto] = useState<Producto | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("informacion")
  const [showAjusteDialog, setShowAjusteDialog] = useState(false)
  const [tipoAjuste, setTipoAjuste] = useState("")
  const [cantidadAjuste, setCantidadAjuste] = useState("")

  useEffect(() => {
    const productId = parseInt(params.id as string)

    if (isNaN(productId)) {
      toast({
        title: "Error",
        description: "ID de producto inválido",
        variant: "destructive"
      })
      router.push("/menu-productos")
      return
    }

    const foundProduct = productosData.find(p => p.id === productId)

    if (!foundProduct) {
      toast({
        title: "Producto no encontrado",
        description: "El producto solicitado no existe",
        variant: "destructive"
      })
      router.push("/menu-productos")
      return
    }

    setProducto(foundProduct)
    setLoading(false)
  }, [params.id, router, toast])

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <PackageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (!producto) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <AlertTriangleIcon className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Producto no encontrado</h3>
          <p className="text-muted-foreground mb-4">El producto solicitado no existe o ha sido eliminado.</p>
          <Button onClick={() => router.push("/menu-productos")}>
            Volver a productos
          </Button>
        </div>
      </div>
    )
  }

  const getStatusBadge = () => {
    if (producto.cantidad === 0) {
      return <Badge variant="destructive">Sin stock</Badge>
    }
    if (producto.cantidad <= producto.stock_minimo) {
      return <Badge variant="secondary">Stock bajo</Badge>
    }
    if (producto.estado === "pedido") {
      return <Badge variant="outline">En pedido</Badge>
    }
    return <Badge variant="default">En stock</Badge>
  }

  const getStockLevel = () => {
    const percentage = (producto.cantidad / (producto.stock_minimo * 2)) * 100
    return Math.min(Math.max(percentage, 0), 100)
  }

  const getStockColor = () => {
    const level = getStockLevel()
    if (level < 25) return "bg-red-500"
    if (level < 50) return "bg-yellow-500"
    return "bg-green-500"
  }

  // Obtener estadísticas del producto
  const estadisticasProducto = estadisticasProductosData.consumo_mensual_total.map(mes => ({
    mes: mes.mes,
    cantidad: mes.productos[producto.id] || 0
  }))

  const totalConsumido = estadisticasProducto.reduce((sum, mes) => sum + mes.cantidad, 0)
  const promedioMensual = totalConsumido / estadisticasProducto.length

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="flex items-center space-x-2">
          <Dialog open={showAjusteDialog} onOpenChange={setShowAjusteDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Ajuste Stock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajuste Stock</DialogTitle>
                <DialogDescription>
                  Selecciona el tipo de ajuste para el stock del producto.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tipo-ajuste">Tipo de ajuste</Label>
                  <Select value={tipoAjuste} onValueChange={setTipoAjuste}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ingreso">Ingreso</SelectItem>
                      <SelectItem value="salida">Salida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cantidad">Cantidad</Label>
                  <Input
                    id="cantidad"
                    type="number"
                    placeholder="99999"
                    value={cantidadAjuste}
                    onChange={(e) => setCantidadAjuste(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      if (!tipoAjuste || !cantidadAjuste) {
                        toast({
                          title: "Error",
                          description: "Todos los campos son obligatorios.",
                          variant: "destructive"
                        })
                        return
                      }

                      const cantidad = parseInt(cantidadAjuste)
                      if (isNaN(cantidad) || cantidad <= 0) {
                        toast({
                          title: "Error",
                          description: "La cantidad debe ser un número mayor a cero.",
                          variant: "destructive"
                        })
                        return
                      }

                      toast({
                        title: "Ajuste registrado",
                        description: `Se registró el ajuste de ${cantidad} unidades de tipo "${tipoAjuste}" correctamente.`,
                      })
                      setShowAjusteDialog(false)
                      setTipoAjuste("")
                      setCantidadAjuste("")
                    }}
                  >
                    Registrar
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowAjusteDialog(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm">
            <EditIcon className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" size="sm" className="text-destructive">
            <TrashIcon className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Información principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Imagen y información básica */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <PackageIcon className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{producto.nombre}</h1>
                <p className="text-muted-foreground">{producto.descripcion}</p>
              </div>
              <div className="flex justify-center">
                {getStatusBadge()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas rápidas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Información del Inventario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{producto.cantidad}</p>
                <p className="text-sm text-muted-foreground">Unidades disponibles</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{producto.stock_minimo}</p>
                <p className="text-sm text-muted-foreground">Stock mínimo</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">${producto.costo.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Costo unitario</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{producto.frecuencia_uso}</p>
                <p className="text-sm text-muted-foreground">Frecuencia de uso</p>
              </div>
            </div>

            {/* Barra de stock */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nivel de stock</span>
                <span>{Math.round(getStockLevel())}%</span>
              </div>
              <Progress value={getStockLevel()} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de información detallada */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="informacion">Información</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        {/* Información general */}
        <TabsContent value="informacion" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Producto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Categoría:</span>
                  <Badge variant="outline">{producto.categoria}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <Badge variant="outline">{producto.tipo}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Código de barras:</span>
                  <span className="font-mono text-sm">{producto.codigo_barras}</span>
                </div>
                {producto.perecedero && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <ThermometerIcon className="h-4 w-4" />
                        Almacenamiento:
                      </span>
                      <span>{producto.temperatura_almacenamiento}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {producto.nutricion && (
              <Card>
                <CardHeader>
                  <CardTitle>Información Nutricional</CardTitle>
                  <CardDescription>Por {producto.nutricion.unidad_medida}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {producto.nutricion.calorias && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Calorías:</span>
                      <span>{producto.nutricion.calorias}</span>
                    </div>
                  )}
                  {producto.nutricion.proteinas && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Proteínas:</span>
                      <span>{producto.nutricion.proteinas}g</span>
                    </div>
                  )}
                  {producto.nutricion.grasas && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Grasas:</span>
                      <span>{producto.nutricion.grasas}g</span>
                    </div>
                  )}
                  {producto.nutricion.carbohidratos && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carbohidratos:</span>
                      <span>{producto.nutricion.carbohidratos}g</span>
                    </div>
                  )}
                  {producto.nutricion.fibra && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fibra:</span>
                      <span>{producto.nutricion.fibra}g</span>
                    </div>
                  )}
                  {producto.nutricion.calcio && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Calcio:</span>
                      <span>{producto.nutricion.calcio}mg</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Estadísticas */}
        <TabsContent value="estadisticas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUpIcon className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalConsumido}</p>
                <p className="text-sm text-muted-foreground">Total consumido</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CalendarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{Math.round(promedioMensual)}</p>
                <p className="text-sm text-muted-foreground">Promedio mensual</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <PackageIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{producto.frecuencia_uso}</p>
                <p className="text-sm text-muted-foreground">Frecuencia de uso</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de consumo mensual */}
          <Card>
            <CardHeader>
              <CardTitle>Consumo Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {estadisticasProducto.map((mes, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium w-20">{mes.mes}</span>
                    <div className="flex-1 mx-4">
                      <Progress
                        value={(mes.cantidad / Math.max(...estadisticasProducto.map(m => m.cantidad))) * 100}
                        className="h-2"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-16 text-right">
                      {mes.cantidad} unidades
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Proveedores */}
        <TabsContent value="proveedores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Proveedor Principal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{producto.proveedor_principal.nombre}</p>
                <p className="text-sm text-muted-foreground">{producto.proveedor_principal.telefono}</p>
                <p className="text-sm text-muted-foreground">{producto.proveedor_principal.email}</p>
              </div>
            </CardContent>
          </Card>

          {producto.proveedores.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Otros Proveedores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {producto.proveedores.slice(1).map((proveedor) => (
                  <div key={proveedor.id} className="border rounded-lg p-3">
                    <p className="font-medium">{proveedor.nombre}</p>
                    <p className="text-sm text-muted-foreground">{proveedor.telefono}</p>
                    <p className="text-sm text-muted-foreground">{proveedor.email}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Historial (placeholder) */}
        <TabsContent value="historial" className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Historial próximamente</h3>
              <p className="text-muted-foreground">
                El historial de movimientos estará disponible en una próxima actualización.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
