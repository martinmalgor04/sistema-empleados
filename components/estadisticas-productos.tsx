'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
  PackageIcon,
  AlertTriangleIcon,
  ShoppingCartIcon,
  DollarSignIcon
} from "lucide-react"

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

interface EstadisticasProductosProps {
  estadisticas: EstadisticaProductoData[]
  className?: string
}

const formatPercentage = (value: number) => {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}

const getTrendIcon = (tendencia: string) => {
  switch (tendencia) {
    case 'ascendente':
      return <TrendingUpIcon className="h-4 w-4 text-green-600" />
    case 'descendente':
      return <TrendingDownIcon className="h-4 w-4 text-red-600" />
    default:
      return <MinusIcon className="h-4 w-4 text-gray-600" />
  }
}

const getTrendColor = (tendencia: string) => {
  switch (tendencia) {
    case 'ascendente':
      return 'text-green-600 bg-green-50'
    case 'descendente':
      return 'text-red-600 bg-red-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export default function EstadisticasProductos({ estadisticas, className }: EstadisticasProductosProps) {
  // Calcular estadísticas generales
  const totalProductos = estadisticas.length
  const totalDispensado = estadisticas.reduce((sum, est) => sum + est.total_dispensado, 0)
  const promedioGeneral = estadisticas.reduce((sum, est) => sum + est.promedio_mensual, 0) / totalProductos

  // Productos con mayor variación
  const mayorVariacion = estadisticas
    .sort((a, b) => Math.abs(b.variacion_porcentual) - Math.abs(a.variacion_porcentual))
    .slice(0, 3)

  // Top 5 productos más usados
  const topProductos = estadisticas
    .sort((a, b) => b.total_dispensado - a.total_dispensado)
    .slice(0, 5)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PackageIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Productos</p>
                <p className="text-2xl font-bold">{totalProductos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingCartIcon className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Dispensado</p>
                <p className="text-2xl font-bold">{totalDispensado.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSignIcon className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Promedio Mensual</p>
                <p className="text-2xl font-bold">{Math.round(promedioGeneral)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Productos Más Usados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUpIcon className="h-5 w-5" />
            Productos Más Dispensados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProductos.map((producto, index) => (
              <div key={producto.producto_id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{producto.nombre}</p>
                    <p className="text-sm text-muted-foreground">
                      Promedio: {producto.promedio_mensual}/mes
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{producto.total_dispensado}</p>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(producto.tendencia)}
                    <span className={`text-xs px-2 py-1 rounded ${getTrendColor(producto.tendencia)}`}>
                      {formatPercentage(producto.variacion_porcentual)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Variaciones Significativas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangleIcon className="h-5 w-5" />
            Variaciones Significativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mayorVariacion.map((producto) => (
              <div key={producto.producto_id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{producto.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    Dispensado: {producto.total_dispensado} unidades
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(producto.tendencia)}
                  <Badge
                    variant={Math.abs(producto.variacion_porcentual) > 20 ? "destructive" : "secondary"}
                  >
                    {producto.variacion_porcentual > 0 ? '+' : ''}{formatPercentage(producto.variacion_porcentual)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico Simple de Barras de Consumo Mensual */}
      <Card>
        <CardHeader>
          <CardTitle>Consumo por Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {estadisticas.slice(0, 6).map((producto) => {
              const maxValue = Math.max(...estadisticas.map(p => p.total_dispensado))
              const percentage = (producto.total_dispensado / maxValue) * 100

              return (
                <div key={producto.producto_id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate flex-1">{producto.nombre}</span>
                    <span className="text-muted-foreground ml-2">{producto.total_dispensado}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Tendencias */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Tendencias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <TrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">
                {estadisticas.filter(e => e.tendencia === 'ascendente').length}
              </p>
              <p className="text-sm text-muted-foreground">En aumento</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <MinusIcon className="h-6 w-6 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-600">
                {estadisticas.filter(e => e.tendencia === 'estable').length}
              </p>
              <p className="text-sm text-muted-foreground">Estables</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <TrendingDownIcon className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">
                {estadisticas.filter(e => e.tendencia === 'descendente').length}
              </p>
              <p className="text-sm text-muted-foreground">En descenso</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
