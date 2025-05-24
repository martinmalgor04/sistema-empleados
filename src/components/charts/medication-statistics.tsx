'use client'

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUpIcon, 
  TrendingDownIcon, 
  BarChartIcon, 
  PillIcon,
  ActivityIcon
} from "lucide-react"
import estadisticasData from "@/data/estadisticas-medicamentos.json"

interface EstadisticasMedicamentosProps {
  className?: string
}

export default function EstadisticasMedicamentos({ className }: EstadisticasMedicamentosProps) {
  const { consumo_mensual_total, tendencias } = estadisticasData

  // Obtener datos del último mes
  const ultimoMes = consumo_mensual_total[consumo_mensual_total.length - 1]
  const penultimoMes = consumo_mensual_total[consumo_mensual_total.length - 2]

  // Calcular variación mensual
  const variacionMensual = ((ultimoMes.total - penultimoMes.total) / penultimoMes.total) * 100

  // Obtener máximo valor para normalizar las barras
  const maxConsumo = Math.max(...consumo_mensual_total.map(mes => mes.total))

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-AR').format(num)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ActivityIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total dispensado</p>
                <p className="text-2xl font-bold">{formatNumber(tendencias.total_medicamentos_dispensados)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChartIcon className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Promedio mensual</p>
                <p className="text-2xl font-bold">{formatNumber(tendencias.promedio_mensual)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              {variacionMensual >= 0 ? (
                <TrendingUpIcon className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDownIcon className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="text-sm text-muted-foreground">Variación mensual</p>
                <p className={`text-2xl font-bold ${variacionMensual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {variacionMensual >= 0 ? '+' : ''}{variacionMensual.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de consumo mensual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChartIcon className="h-5 w-5" />
            <span>Consumo mensual total</span>
          </CardTitle>
          <CardDescription>
            Últimos 5 meses de consumo de medicamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Gráfico de barras */}
            <div className="flex items-end justify-between h-40 bg-muted/30 rounded p-4">
              {consumo_mensual_total.map((mes, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="text-sm font-medium text-center">
                    {formatNumber(mes.total)}
                  </div>
                  <div 
                    className="bg-primary rounded-t transition-all duration-300 hover:bg-primary/80"
                    style={{ 
                      height: `${Math.max((mes.total / maxConsumo) * 120, 8)}px`,
                      width: '32px',
                      minHeight: '8px'
                    }}
                  />
                  <div className="text-xs text-muted-foreground text-center">
                    {mes.mes.slice(0, 3)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Leyenda */}
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span>Unidades dispensadas</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top medicamentos del último mes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUpIcon className="h-5 w-5" />
            <span>Medicamentos más dispensados - {ultimoMes.mes}</span>
          </CardTitle>
          <CardDescription>
            Ranking de medicamentos por cantidad dispensada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ultimoMes.medicamentos.map((medicamento, index) => (
              <div key={medicamento.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-sm font-bold">
                  #{index + 1}
                </div>
                <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <PillIcon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{medicamento.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatNumber(medicamento.cantidad)} unidades
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    {((medicamento.cantidad / ultimoMes.total) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tendencias destacadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ActivityIcon className="h-5 w-5" />
            <span>Tendencias destacadas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center space-x-2">
                <PillIcon className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Más utilizado</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                {tendencias.medicamento_mas_usado.nombre}
              </p>
              <p className="text-xs text-blue-600">
                Crecimiento: +{tendencias.medicamento_mas_usado.crecimiento_porcentual}%
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center space-x-2">
                <TrendingUpIcon className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Mayor crecimiento</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                {tendencias.mayor_crecimiento.nombre}
              </p>
              <p className="text-xs text-green-600">
                Crecimiento: +{tendencias.mayor_crecimiento.crecimiento_porcentual}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 