'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  ArrowLeftIcon, 
  SearchIcon, 
  FilterIcon, 
  EyeIcon,
  DownloadIcon,
  CalendarIcon,
  DollarSignIcon,
  ShoppingBagIcon,
  XIcon,
  AlertCircleIcon
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import comprasData from "@/data/compras.json"

export default function HistorialComprasPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroMes, setFiltroMes] = useState("todos")
  const [filtroArea, setFiltroArea] = useState("todas")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [cancelDialog, setCancelDialog] = useState<{open: boolean, compraId: number | null}>({open: false, compraId: null})

  const { historial_compras } = comprasData

  // Filtrar compras (removed categoria filter)
  const comprasFiltradas = historial_compras.filter(compra => {
    const matchesSearch = compra.local_vendedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         compra.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         compra.productos.some(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const fechaCompra = new Date(compra.fecha)
    const mesCompra = fechaCompra.getMonth() + 1 // getMonth() returns 0-11
    const matchesMes = filtroMes === "todos" || parseInt(filtroMes) === mesCompra
    
    const matchesArea = filtroArea === "todas" || compra.area === filtroArea
    const matchesEstado = filtroEstado === "todos" || compra.estado === filtroEstado
    
    return matchesSearch && matchesMes && matchesArea && matchesEstado
  })

  // Calcular estadísticas del historial filtrado
  const totalGastado = comprasFiltradas.reduce((total, compra) => total + compra.total, 0)
  const promedioCompra = comprasFiltradas.length > 0 ? totalGastado / comprasFiltradas.length : 0
  const totalProductos = comprasFiltradas.reduce((total, compra) => total + compra.productos.length, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "recibida":
        return <Badge variant="default" className="text-xs">Recibida</Badge>
      case "pendiente":
        return <Badge variant="outline" className="text-xs border-orange-500 text-orange-700">Pendiente</Badge>
      default:
        return <Badge variant="outline" className="text-xs">{estado}</Badge>
    }
  }

  const handleCancelPurchase = (compraId: number) => {
    setCancelDialog({open: true, compraId})
  }

  const confirmCancelPurchase = () => {
    if (!cancelDialog.compraId) return
    
    toast({
      title: "Compra cancelada",
      description: `La compra #${cancelDialog.compraId} ha sido cancelada`,
      variant: "destructive"
    })
    
    setCancelDialog({open: false, compraId: null})
  }

  const handleVerDetalle = (compraId: number) => {
    router.push(`/compras/${compraId}`)
  }

  const handleDescargar = (comprobante: string) => {
    toast({
      title: "Descarga iniciada",
      description: `Descargando comprobante: ${comprobante}`,
    })
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
            <h1 className="text-2xl font-bold">Historial de compras</h1>
            <p className="text-muted-foreground">
              {comprasFiltradas.length} compras encontradas
            </p>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSignIcon className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total gastado</p>
                <p className="text-lg font-bold">{formatCurrency(totalGastado)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingBagIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Compras</p>
                <p className="text-xl font-bold">{comprasFiltradas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSignIcon className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Promedio</p>
                <p className="text-lg font-bold">{formatCurrency(promedioCompra)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingBagIcon className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Productos</p>
                <p className="text-xl font-bold">{totalProductos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar compras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro por mes */}
            <Select value={filtroMes} onValueChange={setFiltroMes}>
              <SelectTrigger>
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los meses</SelectItem>
                <SelectItem value="1">Enero</SelectItem>
                <SelectItem value="2">Febrero</SelectItem>
                <SelectItem value="3">Marzo</SelectItem>
                <SelectItem value="4">Abril</SelectItem>
                <SelectItem value="5">Mayo</SelectItem>
                <SelectItem value="6">Junio</SelectItem>
                <SelectItem value="7">Julio</SelectItem>
                <SelectItem value="8">Agosto</SelectItem>
                <SelectItem value="9">Septiembre</SelectItem>
                <SelectItem value="10">Octubre</SelectItem>
                <SelectItem value="11">Noviembre</SelectItem>
                <SelectItem value="12">Diciembre</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por área */}
            <Select value={filtroArea} onValueChange={setFiltroArea}>
              <SelectTrigger>
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las áreas</SelectItem>
                <SelectItem value="Enfermería">Enfermería</SelectItem>
                <SelectItem value="Cocina">Cocina</SelectItem>
                <SelectItem value="Limpieza">Limpieza</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por estado */}
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="recibida">Recibida</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de compras */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de compras</CardTitle>
          <CardDescription>
            Registro completo de todas las compras realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {comprasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBagIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No se encontraron compras</h3>
              <p className="text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comprasFiltradas.map((compra) => (
                <Card key={compra.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="font-semibold text-lg">{compra.local_vendedor}</h3>
                          {getEstadoBadge(compra.estado)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{formatDate(compra.fecha)} - {compra.hora}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ShoppingBagIcon className="h-4 w-4" />
                            <span>{compra.area}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>{compra.productos.length} productos</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSignIcon className="h-4 w-4" />
                            <span className="font-semibold text-foreground">{formatCurrency(compra.total)}</span>
                          </div>
                        </div>

                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">
                            Productos: {compra.productos.map(p => p.nombre).join(", ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleVerDetalle(compra.id)}
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          Ver detalle
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDescargar(compra.comprobante)}
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                        {compra.estado === "pendiente" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCancelPurchase(compra.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XIcon className="h-4 w-4 mr-1" />
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Purchase Dialog */}
      <Dialog open={cancelDialog.open} onOpenChange={(open) => setCancelDialog({open, compraId: null})}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircleIcon className="h-5 w-5 text-red-500" />
              Cancelar Compra
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cancelar la compra #{cancelDialog.compraId}?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setCancelDialog({open: false, compraId: null})}
            >
              No, mantener compra
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmCancelPurchase}
            >
              Sí, cancelar compra
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 