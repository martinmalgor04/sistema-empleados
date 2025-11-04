'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchIcon, PlusIcon, PackageIcon, TrendingUpIcon, EditIcon, TrashIcon, ChevronRightIcon, AlertTriangleIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import productosData from "@/data/productos.json"
import pedidosProductosData from "@/data/pedidos-productos.json"
import estadisticasProductosData from "@/data/estadisticas-productos.json"
import PedidoProductoModal from "@/components/pedido-producto-modal"
import EstadisticasProductos from "@/components/estadisticas-productos"

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

interface PedidoProducto {
  id: number
  producto_id: number
  producto_nombre: string
  cantidad_solicitada: number
  fecha_pedido: string
  fecha_estimada_entrega: string
  estado: string
  proveedor: {
    id: number
    nombre: string
    telefono: string
    email: string
  }
  costo_total: number
  observaciones: string
}

interface EstadisticaProductoData {
  producto_id: number
  nombre: string
  total_dispensado: number
  promedio_mensual: number
  variacion_porcentual: number
  consumo_mensual: Array<{
    mes: string
    cantidad: number
  }>
  tendencia: 'ascendente' | 'descendente' | 'estable'
}

export default function MenuProductosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [productos, setProductos] = useState<Producto[]>(productosData)
  const [pedidosProductos, setPedidosProductos] = useState<PedidoProducto[]>(pedidosProductosData)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("stock")
  const [selectedPedidoProducto, setSelectedPedidoProducto] = useState<PedidoProducto | null>(null)
  const [showPedidoProductoModal, setShowPedidoProductoModal] = useState(false)

  // Transformar datos de estadísticas
  const estadisticasTransformadas: EstadisticaProductoData[] = productos.map(producto => {
    const consumoMensual = estadisticasProductosData.consumo_mensual_total.map(mes => ({
      mes: mes.mes,
      cantidad: mes.productos[producto.id] || 0
    }))

    const totalDispensado = consumoMensual.reduce((sum, mes) => sum + mes.cantidad, 0)
    const promedioMensual = totalDispensado / consumoMensual.length

    // Calcular tendencia simple
    const ultimosMeses = consumoMensual.slice(-2)
    const variacion = ultimosMeses.length === 2 ?
      ((ultimosMeses[1].cantidad - ultimosMeses[0].cantidad) / ultimosMeses[0].cantidad) * 100 : 0

    let tendencia: 'ascendente' | 'descendente' | 'estable' = 'estable'
    if (variacion > 5) tendencia = 'ascendente'
    else if (variacion < -5) tendencia = 'descendente'

    return {
      producto_id: producto.id,
      nombre: producto.nombre,
      total_dispensado: totalDispensado,
      promedio_mensual: Math.round(promedioMensual),
      variacion_porcentual: Number(variacion.toFixed(1)),
      consumo_mensual: consumoMensual,
      tendencia: tendencia
    }
  })

  // Obtener productos más frecuentes (ordenados por frecuencia_uso)
  const productosFrecuentes = [...productos]
    .sort((a, b) => b.frecuencia_uso - a.frecuencia_uso)
    .slice(0, 5) // Mostramos 5 en lugar de 3 para la sección superior

  // Filtrar productos según el estado
  const filteredProductos = productos.filter(prod => {
    const matchesSearch = prod.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prod.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prod.categoria.toLowerCase().includes(searchTerm.toLowerCase())

    switch (activeTab) {
      case "stock":
        return matchesSearch && prod.estado === "stock" && prod.cantidad > prod.stock_minimo
      case "faltantes":
        return matchesSearch && (prod.estado === "faltante" || prod.cantidad <= prod.stock_minimo)
      case "pedidos":
        return matchesSearch && prod.estado === "pedido"
      case "frecuentes":
        return matchesSearch
      default:
        return matchesSearch
    }
  })

  // Obtener pedidos para mostrar en la pestaña de pedidos
  const getPedidosProductosForMostrar = () => {
    return pedidosProductos.filter(pedido =>
      pedido.estado === "pendiente" || pedido.estado === "en_transito"
    )
  }

  const getStatusBadge = (producto: Producto) => {
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

  const getCompactStatusBadge = (producto: Producto) => {
    if (producto.cantidad === 0) {
      return <div className="w-2 h-2 rounded-full bg-red-500"></div>
    }
    if (producto.cantidad <= producto.stock_minimo) {
      return <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
    }
    if (producto.estado === "pedido") {
      return <div className="w-2 h-2 rounded-full bg-blue-500"></div>
    }
    return <div className="w-2 h-2 rounded-full bg-green-500"></div>
  }

  const handleProductoClick = (id: number) => {
    try {
      // Validar que el ID sea válido antes de navegar
      if (!id || typeof id !== 'number') {
        console.error('ID de producto inválido:', id)
        toast({
          title: "Error",
          description: "ID de producto inválido",
          variant: "destructive"
        })
        return
      }
      router.push(`/menu-productos/${id}`)
    } catch (error) {
      console.error('Error al navegar al producto:', error)
      toast({
        title: "Error de navegación",
        description: "No se pudo cargar la página del producto",
        variant: "destructive"
      })
    }
  }

  const handleVerPedidoProducto = (pedido: PedidoProducto) => {
    setSelectedPedidoProducto(pedido)
    setShowPedidoProductoModal(true)
  }

  const handleRealizarPedidoProducto = (producto: Producto) => {
    // Crear un nuevo pedido
    const nuevoPedidoProducto: PedidoProducto = {
      id: pedidosProductos.length + 1,
      producto_id: producto.id,
      producto_nombre: producto.nombre,
      cantidad_solicitada: producto.stock_minimo * 2, // Solicitar el doble del stock mínimo
      fecha_pedido: new Date().toISOString().split('T')[0],
      fecha_estimada_entrega: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 días
      estado: "pendiente",
      proveedor: producto.proveedor_principal,
      costo_total: producto.costo * producto.stock_minimo * 2,
      observaciones: "Pedido automático por stock bajo"
    }

    setPedidosProductos([...pedidosProductos, nuevoPedidoProducto])

    // Actualizar estado del producto
    const productosActualizados = productos.map(prod =>
      prod.id === producto.id ? { ...prod, estado: "pedido" } : prod
    )
    setProductos(productosActualizados)

    toast({
      title: "Pedido realizado",
      description: `Se ha realizado un pedido de ${nuevoPedidoProducto.cantidad_solicitada} unidades de ${producto.nombre}`,
    })
  }

  const handleVerRanking = () => {
    try {
      router.push("/menu-productos/ranking")
    } catch (error) {
      console.error('Error al navegar al ranking:', error)
      toast({
        title: "Error de navegación",
        description: "No se pudo cargar la página de ranking",
        variant: "destructive"
      })
    }
  }

  const [error, setError] = useState<string | null>(null)

  // Manejo de errores del componente
  useEffect(() => {
    try {
      // Validar que los datos necesarios estén disponibles
      if (!productosData || !Array.isArray(productosData)) {
        throw new Error('Datos de productos no válidos')
      }
      if (!estadisticasProductosData) {
        throw new Error('Datos de estadísticas no válidos')
      }
    } catch (err) {
      console.error('Error al inicializar datos:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      toast({
        title: "Error al cargar datos",
        description: "Hubo un problema al cargar la información de productos",
        variant: "destructive"
      })
    }
  }, [toast])

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <AlertTriangleIcon className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Error al cargar productos</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Recargar página
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Productos</h1>
          <p className="text-muted-foreground">Gestión de inventario de alimentos y productos</p>
        </div>
        <Button
          onClick={() => router.push("/menu-productos/agregar")}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Agregar Producto
        </Button>
      </div>

      {/* Sección Más Frecuentes - Fija en la parte superior */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUpIcon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Más frecuentes</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVerRanking}
            className="text-primary hover:text-primary/80"
          >
            Ver todo
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Carousel horizontal de productos frecuentes */}
        <div className="relative">
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {productosFrecuentes && productosFrecuentes.length > 0 ? (
              productosFrecuentes.map((producto) => {
                // Validaciones defensivas
                if (!producto || !producto.id || !producto.nombre) {
                  console.warn('Producto inválido encontrado:', producto)
                  return null
                }

                return (
                  <Card
                    key={`frequent-${producto.id}`}
                    className="flex-shrink-0 w-48 cursor-pointer hover:shadow-md transition-shadow border-primary/20"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleProductoClick(producto.id)
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <PackageIcon className="h-4 w-4 text-primary" />
                          </div>
                          {getCompactStatusBadge(producto)}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                            {producto.nombre || 'Producto sin nombre'}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {producto.cantidad || 0} unidades
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {producto.categoria}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Uso:</span>
                          <span className="font-medium text-primary">{producto.frecuencia_uso || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="flex items-center justify-center w-full py-8">
                <div className="text-center">
                  <PackageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No hay productos frecuentes disponibles</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar productos, categorías o proveedores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs de navegación */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stock">En stock</TabsTrigger>
          <TabsTrigger value="faltantes">Faltantes</TabsTrigger>
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
          <TabsTrigger value="frecuentes">Más frecuentes</TabsTrigger>
        </TabsList>

        {/* Contenido de Más frecuentes */}
        <TabsContent value="frecuentes" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Estadísticas y análisis</h2>
            <Button variant="outline" onClick={handleVerRanking}>
              <TrendingUpIcon className="h-4 w-4 mr-2" />
              Ver ranking completo
            </Button>
          </div>
          <EstadisticasProductos estadisticas={estadisticasTransformadas} />
        </TabsContent>

        {/* Contenido de En stock */}
        <TabsContent value="stock" className="space-y-4">
          <h2 className="text-xl font-semibold">Productos en stock</h2>
          {filteredProductos.length === 0 ? (
            <div className="text-center py-12">
              <PackageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
              <p className="text-muted-foreground">Intenta con otros términos de búsqueda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProductos.map((producto) => (
                <Card
                  key={producto.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleProductoClick(producto.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <PackageIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{producto.nombre}</h3>
                          <p className="text-sm text-muted-foreground">{producto.cantidad} unidades - {producto.categoria}</p>
                          <p className="text-xs text-muted-foreground">{producto.descripcion}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(producto)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Contenido de Faltantes */}
        <TabsContent value="faltantes" className="space-y-4">
          <h2 className="text-xl font-semibold">Productos faltantes</h2>
          {filteredProductos.length === 0 ? (
            <div className="text-center py-12">
              <PackageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay productos faltantes</h3>
              <p className="text-muted-foreground">Todos los productos tienen stock suficiente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProductos.map((producto) => (
                <Card key={producto.id} className="border-destructive/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                          <PackageIcon className="h-6 w-6 text-destructive" />
                        </div>
                        <div>
                          <h3 className="font-medium">{producto.nombre}</h3>
                          <p className="text-sm text-destructive">
                            {producto.cantidad === 0 ? "00" : producto.cantidad.toString().padStart(2, '0')}/
                            {producto.stock_minimo.toString().padStart(2, '0')} unidades
                          </p>
                          <p className="text-xs text-muted-foreground">{producto.categoria}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRealizarPedidoProducto(producto)}
                        >
                          Realizar pedido
                        </Button>
                        <Button variant="outline" size="sm">
                          Registrar ingreso
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Contenido de Pedidos */}
        <TabsContent value="pedidos" className="space-y-4">
          <h2 className="text-xl font-semibold">Pedidos pendientes</h2>
          {getPedidosProductosForMostrar().length === 0 ? (
            <div className="text-center py-12">
              <PackageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay pedidos pendientes</h3>
              <p className="text-muted-foreground">Todos los pedidos han sido procesados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getPedidosProductosForMostrar().map((pedido) => (
                <Card key={pedido.id} className="border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <PackageIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{pedido.producto_nombre}</h3>
                          <p className="text-sm text-muted-foreground">
                            {pedido.cantidad_solicitada} unidades -
                            Entrega: {new Date(pedido.fecha_estimada_entrega).toLocaleDateString('es-ES')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Proveedor: {pedido.proveedor.nombre}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={pedido.estado === "pendiente" ? "secondary" : "default"}
                          className={pedido.estado === "pendiente" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}
                        >
                          {pedido.estado === "pendiente" ? "Pendiente" : "En tránsito"}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerPedidoProducto(pedido)}
                        >
                          Ver pedido
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de detalle de pedido de producto */}
      <PedidoProductoModal
        pedido={selectedPedidoProducto}
        isOpen={showPedidoProductoModal}
        onClose={() => {
          setShowPedidoProductoModal(false)
          setSelectedPedidoProducto(null)
        }}
      />
    </div>
  )
}
