'use client'

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ShoppingCartIcon, 
  ListIcon, 
  ClockIcon, 
  HistoryIcon,
  PlusIcon,
  TrendingUpIcon,
  DollarSignIcon,
  BuildingIcon,
  SettingsIcon
} from "lucide-react"
import comprasData from "@/data/compras.json"

export default function ComprasPage() {
  const router = useRouter()
  const { historial_compras, necesidades, resumen_areas } = comprasData

  // Calcular estadísticas rápidas
  const totalNecesidades = necesidades.length
  const necesidadesUrgentes = necesidades.filter(n => n.prioridad === "alta").length
  const gastoTotalMensual = resumen_areas.reduce((total, area) => total + area.gasto_mensual, 0)
  const ultimaCompra = historial_compras[0]

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

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Compras</h1>
        <p className="text-muted-foreground">Sistema de gestión de compras y necesidades</p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ListIcon className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Necesidades</p>
                <p className="text-xl font-bold">{totalNecesidades}</p>
                {necesidadesUrgentes > 0 && (
                  <p className="text-xs text-red-600">{necesidadesUrgentes} urgentes</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSignIcon className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Gasto mensual</p>
                <p className="text-lg font-bold">{formatCurrency(gastoTotalMensual)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Última compra</p>
                <p className="text-sm font-medium">{formatDate(ultimaCompra.fecha)}</p>
                <p className="text-xs text-muted-foreground">{ultimaCompra.area}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <HistoryIcon className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Compras registradas</p>
                <p className="text-xl font-bold">{historial_compras.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botones principales del menú */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {/* Lista de necesidades */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent 
            className="p-6 text-center space-y-4"
            onClick={() => router.push("/compras/necesidades")}
          >
            <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <ListIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Lista de necesidades</h3>
              <p className="text-sm text-muted-foreground">
                Ver productos faltantes por área
              </p>
              {necesidadesUrgentes > 0 && (
                <Badge variant="destructive" className="mt-2">
                  {necesidadesUrgentes} urgentes
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Registrar compra */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent 
            className="p-6 text-center space-y-4"
            onClick={() => router.push("/compras/registrar")}
          >
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <ShoppingCartIcon className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Registrar compra</h3>
              <p className="text-sm text-muted-foreground">
                Agregar nueva compra realizada
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pedidos pendientes */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent 
            className="p-6 text-center space-y-4"
            onClick={() => router.push("/compras/pedidos")}
          >
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Pedidos pendientes</h3>
              <p className="text-sm text-muted-foreground">
                Seguimiento de compras en proceso
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Historial de compras */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent 
            className="p-6 text-center space-y-4"
            onClick={() => router.push("/compras/historial")}
          >
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <HistoryIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Historial de compras</h3>
              <p className="text-sm text-muted-foreground">
                Ver todas las compras anteriores
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Gestión de proveedores */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent 
            className="p-6 text-center space-y-4"
            onClick={() => router.push("/compras/proveedores")}
          >
            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
              <BuildingIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Proveedores</h3>
              <p className="text-sm text-muted-foreground">
                Gestionar proveedores del sistema
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Configuración */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent 
            className="p-6 text-center space-y-4"
            onClick={() => router.push("/compras/configuracion")}
          >
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <SettingsIcon className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Configuración</h3>
              <p className="text-sm text-muted-foreground">
                Gestionar categorías y áreas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen por áreas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUpIcon className="h-5 w-5" />
            <span>Resumen por áreas</span>
          </CardTitle>
          <CardDescription>
            Gasto mensual y actividad por área
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resumen_areas.map((area, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">{area.area}</h4>
                    <p className="text-sm text-muted-foreground">
                      {area.productos_principales.join(", ")}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Gasto mensual:</span>
                      <span className="font-medium">{formatCurrency(area.gasto_mensual)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Última compra:</span>
                      <span className="text-sm">{formatDate(area.ultima_compra)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 