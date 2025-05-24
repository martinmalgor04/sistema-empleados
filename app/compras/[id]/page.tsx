'use client'

import React from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeftIcon, 
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  ShoppingBagIcon,
  DownloadIcon,
  PrinterIcon,
  MapPinIcon,
  ReceiptIcon
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import comprasData from "@/data/compras.json"

export default function DetalleCompraPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  
  const compraId = parseInt(params.id as string)
  const compra = comprasData.historial_compras.find(c => c.id === compraId)

  if (!compra) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">Compra no encontrada</h2>
          <Button variant="outline" onClick={() => router.back()} className="mt-4">
            Volver
          </Button>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "recibida":
        return <Badge variant="default" className="text-sm">Recibida</Badge>
      case "pendiente":
        return <Badge variant="outline" className="text-sm border-orange-500 text-orange-700">Pendiente</Badge>
      default:
        return <Badge variant="outline" className="text-sm">{estado}</Badge>
    }
  }

  const getCategoriaColor = (categoria: string) => {
    const colors: { [key: string]: string } = {
      "Medicamentos": "bg-blue-100 text-blue-800 border-blue-300",
      "Lácteos": "bg-yellow-100 text-yellow-800 border-yellow-300", 
      "Limpieza": "bg-green-100 text-green-800 border-green-300",
      "Alimentos": "bg-purple-100 text-purple-800 border-purple-300"
    }
    return colors[categoria] || "bg-gray-100 text-gray-800 border-gray-300"
  }

  const handleDescargar = () => {
    toast({
      title: "Descarga iniciada",
      description: `Descargando comprobante: ${compra.comprobante}`,
    })
  }

  const handleImprimir = () => {
    toast({
      title: "Impresión iniciada",
      description: "Se está generando el reporte de la compra",
    })
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
          <h1 className="text-2xl font-bold">Detalle de compra #{compra.id}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleImprimir}>
            <PrinterIcon className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" onClick={handleDescargar}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Comprobante
          </Button>
        </div>
      </div>

      {/* Información general de la compra */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingBagIcon className="h-6 w-6" />
              <span>{compra.local_vendedor}</span>
            </div>
            {getEstadoBadge(compra.estado)}
          </CardTitle>
          <CardDescription>
            Compra realizada el {formatDate(compra.fecha)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-sm">Fecha</span>
              </div>
              <p className="font-medium">{formatDate(compra.fecha)}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <ClockIcon className="h-4 w-4" />
                <span className="text-sm">Hora</span>
              </div>
              <p className="font-medium">{compra.hora}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPinIcon className="h-4 w-4" />
                <span className="text-sm">Área</span>
              </div>
              <p className="font-medium">{compra.area}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <DollarSignIcon className="h-4 w-4" />
                <span className="text-sm">Total</span>
              </div>
              <p className="font-bold text-lg">{formatCurrency(compra.total)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categoría predominante */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Categoría predominante</p>
              <Badge variant="outline" className={`text-sm ${getCategoriaColor(compra.categoria_predominante)}`}>
                {compra.categoria_predominante}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Productos comprados</p>
              <p className="text-lg font-semibold">{compra.productos.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalle de productos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ReceiptIcon className="h-5 w-5" />
            <span>Productos comprados</span>
          </CardTitle>
          <CardDescription>
            Detalle de todos los productos incluidos en esta compra
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Producto</th>
                  <th className="text-left p-3 font-medium">Categoría</th>
                  <th className="text-center p-3 font-medium">Cantidad</th>
                  <th className="text-right p-3 font-medium">Precio unitario</th>
                  <th className="text-right p-3 font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {compra.productos.map((producto, index) => (
                  <tr key={index} className={`border-b hover:bg-muted/50 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                    <td className="p-3">
                      <div className="font-medium">{producto.nombre}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className={`text-xs ${getCategoriaColor(producto.categoria)}`}>
                        {producto.categoria}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-medium">
                        {producto.cantidad_comprada} {producto.unidad}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="font-mono">
                        {formatCurrency(producto.precio_unitario)}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="font-mono font-semibold">
                        {formatCurrency(producto.subtotal)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 bg-muted/30">
                  <td className="p-3 font-semibold" colSpan={4}>
                    Total de la compra
                  </td>
                  <td className="p-3 text-right">
                    <span className="font-bold text-lg font-mono">
                      {formatCurrency(compra.total)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resumen estadístico */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumen estadístico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Productos únicos:</span>
              <span className="font-semibold">{compra.productos.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Unidades totales:</span>
              <span className="font-semibold">
                {compra.productos.reduce((total, p) => total + p.cantidad_comprada, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Precio promedio:</span>
              <span className="font-semibold">
                {formatCurrency(compra.total / compra.productos.reduce((total, p) => total + p.cantidad_comprada, 0))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Categorías diferentes:</span>
              <span className="font-semibold">
                {new Set(compra.productos.map(p => p.categoria)).size}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Información del comprobante */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Comprobante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Archivo:</span>
              <span className="font-semibold">{compra.comprobante}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Estado:</span>
              {getEstadoBadge(compra.estado)}
            </div>
            <div className="pt-2">
              <Button variant="outline" onClick={handleDescargar} className="w-full">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Descargar comprobante
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones disponibles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Acciones disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleImprimir}>
              <PrinterIcon className="h-4 w-4 mr-2" />
              Imprimir detalle
            </Button>
            <Button variant="outline" onClick={handleDescargar}>
              <DownloadIcon className="h-4 w-4 mr-2" />
              Descargar comprobante
            </Button>
            <Button variant="outline" onClick={() => router.push("/compras/registrar")}>
              <ShoppingBagIcon className="h-4 w-4 mr-2" />
              Nueva compra similar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 