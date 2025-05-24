'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeftIcon, 
  PillIcon, 
  TrendingUpIcon,
  CalendarIcon,
  BarChartIcon
} from "lucide-react"
import medicamentosData from "@/data/medicamentos.json"

interface MedicamentoRanking {
  id: number
  nombre: string
  descripcion: string
  cantidad: number
  frecuencia_uso: number
  uso_mensual: number[]
  uso_semanal: number[]
  estado: string
}

export default function RankingMedicamentosPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("mensual")

  // Ordenar medicamentos por frecuencia de uso
  const medicamentosRanking: MedicamentoRanking[] = [...medicamentosData]
    .sort((a, b) => b.frecuencia_uso - a.frecuencia_uso)

  const getStatusBadge = (medicamento: MedicamentoRanking) => {
    if (medicamento.cantidad === 0) {
      return <Badge variant="destructive">Sin stock</Badge>
    }
    if (medicamento.cantidad <= 20) { // Asumiendo stock mínimo de 20
      return <Badge variant="secondary">Stock bajo</Badge>
    }
    if (medicamento.estado === "pedido") {
      return <Badge variant="outline">En pedido</Badge>
    }
    return <Badge variant="default">En stock</Badge>
  }

  const getRankingIcon = (position: number) => {
    switch (position) {
      case 1:
        return "🥇"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return `#${position}`
    }
  }

  const handleMedicamentoClick = (id: number) => {
    router.push(`/menu-medicamentos/${id}`)
  }

  // Calcular total de uso mensual
  const calcularTotalMensual = (uso_mensual: number[]) => {
    return uso_mensual.reduce((total, mes) => total + mes, 0)
  }

  // Calcular total de uso semanal
  const calcularTotalSemanal = (uso_semanal: number[]) => {
    return uso_semanal.reduce((total, dia) => total + dia, 0)
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
          <TrendingUpIcon className="h-5 w-5 text-primary" />
          <span className="font-medium">Ranking de Medicamentos</span>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PillIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total medicamentos</p>
                <p className="text-2xl font-bold">{medicamentosRanking.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Uso total mensual</p>
                <p className="text-2xl font-bold">
                  {medicamentosRanking.reduce((total, med) => total + calcularTotalMensual(med.uso_mensual), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChartIcon className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Más utilizado</p>
                <p className="text-lg font-bold">{medicamentosRanking[0]?.nombre.slice(0, 12)}...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de períodos */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mensual">Ranking Mensual</TabsTrigger>
          <TabsTrigger value="semanal">Ranking Semanal</TabsTrigger>
        </TabsList>

        {/* Ranking Mensual */}
        <TabsContent value="mensual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUpIcon className="h-5 w-5" />
                <span>Medicamentos más utilizados - Mensual</span>
              </CardTitle>
              <CardDescription>
                Ranking basado en el uso total de los últimos 5 períodos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {medicamentosRanking.map((medicamento, index) => (
                  <Card 
                    key={medicamento.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleMedicamentoClick(medicamento.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-lg font-bold">
                            {getRankingIcon(index + 1)}
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <PillIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{medicamento.nombre}</h3>
                              <p className="text-sm text-muted-foreground">
                                Total mensual: {calcularTotalMensual(medicamento.uso_mensual)} unidades
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">{medicamento.frecuencia_uso}</p>
                            <p className="text-xs text-muted-foreground">uso frecuente</p>
                          </div>
                          {getStatusBadge(medicamento)}
                        </div>
                      </div>
                      
                      {/* Mini gráfico de barras */}
                      <div className="mt-4">
                        <div className="flex items-end justify-between h-16 bg-muted/30 rounded p-2">
                          {medicamento.uso_mensual.map((valor, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                              <div 
                                className="bg-primary w-3 rounded-t mb-1"
                                style={{ 
                                  height: `${(valor / Math.max(...medicamento.uso_mensual)) * 40}px`,
                                  minHeight: '4px'
                                }}
                              />
                              <span className="text-xs text-muted-foreground">{valor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ranking Semanal */}
        <TabsContent value="semanal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Medicamentos más utilizados - Semanal</span>
              </CardTitle>
              <CardDescription>
                Ranking basado en el uso de la última semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...medicamentosRanking]
                  .sort((a, b) => calcularTotalSemanal(b.uso_semanal) - calcularTotalSemanal(a.uso_semanal))
                  .map((medicamento, index) => (
                  <Card 
                    key={medicamento.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleMedicamentoClick(medicamento.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-lg font-bold text-green-700">
                            {getRankingIcon(index + 1)}
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <PillIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{medicamento.nombre}</h3>
                              <p className="text-sm text-muted-foreground">
                                Total semanal: {calcularTotalSemanal(medicamento.uso_semanal)} unidades
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">{calcularTotalSemanal(medicamento.uso_semanal)}</p>
                            <p className="text-xs text-muted-foreground">esta semana</p>
                          </div>
                          {getStatusBadge(medicamento)}
                        </div>
                      </div>
                      
                      {/* Mini gráfico de barras semanal */}
                      <div className="mt-4">
                        <div className="flex items-end justify-between h-16 bg-muted/30 rounded p-2">
                          {medicamento.uso_semanal.map((valor, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                              <div 
                                className="bg-green-500 w-3 rounded-t mb-1"
                                style={{ 
                                  height: `${(valor / Math.max(...medicamento.uso_semanal)) * 40}px`,
                                  minHeight: '4px'
                                }}
                              />
                              <span className="text-xs text-muted-foreground">{valor}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 