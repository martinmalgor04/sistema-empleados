'use client'

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeftIcon, 
  ShareIcon, 
  TrashIcon, 
  PillIcon, 
  CameraIcon,
  UserIcon,
  PhoneIcon,
  MailIcon
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import medicamentosData from "@/data/medicamentos.json"

interface Medicamento {
  id: number
  nombre: string
  descripcion: string
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
  prospecto: string
  frecuencia_uso: number
}

export default function MedicamentoDetallePage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [medicamento, setMedicamento] = useState<Medicamento | null>(null)
  const [activeTab, setActiveTab] = useState("uso")
  const [showIngresoDialog, setShowIngresoDialog] = useState(false)
  const [tipoAjuste, setTipoAjuste] = useState("")
  const [cantidadAjuste, setCantidadAjuste] = useState("")

  useEffect(() => {
    const medicamentoId = parseInt(params.id as string)
    const med = medicamentosData.find(m => m.id === medicamentoId)
    if (med) {
      setMedicamento(med as Medicamento)
      // Debug: verificar que los datos estén llegando
      console.log('Medicamento cargado:', med.nombre)
      console.log('Uso mensual:', med.uso_mensual)
      console.log('Uso semanal:', med.uso_semanal)
    }
  }, [params.id])

  if (!medicamento) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">Medicamento no encontrado</h2>
          <Button variant="outline" onClick={() => router.back()} className="mt-4">
            Volver
          </Button>
        </div>
      </div>
    )
  }

  const getStatusBadge = () => {
    if (medicamento.cantidad === 0) {
      return <Badge variant="destructive">Sin stock</Badge>
    }
    if (medicamento.cantidad <= medicamento.stock_minimo) {
      return <Badge variant="secondary">Stock bajo</Badge>
    }
    if (medicamento.estado === "pedido") {
      return <Badge variant="outline">En pedido</Badge>
    }
    return <Badge variant="default">En stock</Badge>
  }


  const handleRegistrarIngreso = () => {
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
    setShowIngresoDialog(false)
    setTipoAjuste("")
    setCantidadAjuste("")
  }

  const handleRealizarPedido = () => {
    // Crear un nuevo pedido (simulado)
    const nuevoPedido = {
      id: Date.now(),
      medicamento_id: medicamento.id,
      medicamento_nombre: medicamento.nombre,
      cantidad_solicitada: medicamento.stock_minimo * 2,
      fecha_pedido: new Date().toISOString().split('T')[0],
      fecha_estimada_entrega: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estado: "pendiente",
      proveedor: medicamento.proveedor_principal,
      costo_total: medicamento.costo * medicamento.stock_minimo * 2,
      observaciones: "Pedido realizado desde detalle de medicamento"
    }

    toast({
      title: "Pedido realizado",
      description: `Se ha realizado un pedido de ${nuevoPedido.cantidad_solicitada} unidades al proveedor ${medicamento.proveedor_principal.nombre}`,
    })
  }

  const semanas = ["L", "M", "M", "J", "V", "S", "D"]
  const meses = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Mes 5"]

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
          <Button variant="ghost" size="sm" className="text-destructive">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Información del medicamento */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <div className="h-20 w-20 bg-primary/10 rounded-lg flex items-center justify-center">
                <PillIcon className="h-8 w-8 text-primary" />
              </div>
              <Button size="sm" variant="ghost" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                <CameraIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{medicamento.nombre}</h1>
                  <p className="text-muted-foreground">{medicamento.cantidad}/{medicamento.stock_minimo + medicamento.cantidad} unidades</p>
                </div>
                {getStatusBadge()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="uso">Uso</TabsTrigger>
          <TabsTrigger value="info">+Info</TabsTrigger>
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
        </TabsList>

        {/* Tab de Uso */}
        <TabsContent value="uso" className="space-y-6">
          {/* Gráfico de uso mensual */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Uso mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chart-container flex items-end justify-between h-32 mb-4 bg-muted/30 rounded p-3">
                {medicamento.uso_mensual.map((valor, index) => {
                  const altura = Math.max((valor / Math.max(...medicamento.uso_mensual)) * 80, 6)
                  return (
                    <div key={index} className="flex flex-col items-center space-y-1">
                      <div className="text-xs font-medium mb-1">{valor}</div>
                      <div 
                        className="chart-bar bg-blue-500 w-6 rounded-t"
                        style={{ 
                          height: `${altura}px`,
                          minHeight: '6px'
                        }}
                        title={`${meses[index]}: ${valor} unidades`}
                      />
                      <span className="text-xs mt-1 text-center">{meses[index]}</span>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground text-center">📊 Unidades dispensadas</p>
            </CardContent>
          </Card>

          {/* Gráfico de uso semanal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Uso semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chart-container flex items-end justify-between h-32 mb-4 bg-muted/30 rounded p-3">
                {medicamento.uso_semanal.map((valor, index) => {
                  const altura = Math.max((valor / Math.max(...medicamento.uso_semanal)) * 80, 6)
                  return (
                    <div key={index} className="flex flex-col items-center space-y-1">
                      <div className="text-xs font-medium mb-1">{valor}</div>
                      <div 
                        className="chart-bar bg-green-500 w-6 rounded-t"
                        style={{ 
                          height: `${altura}px`,
                          minHeight: '6px'
                        }}
                        title={`${semanas[index]}: ${valor} unidades`}
                      />
                      <span className="text-xs mt-1 text-center">{semanas[index]}</span>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground text-center">📊 Uso por día de la semana</p>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={handleRealizarPedido}>
              Agregar Lista Necesidad
            </Button>
            <Dialog open={showIngresoDialog} onOpenChange={setShowIngresoDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Ajuste Stock
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajuste Stock</DialogTitle>
                  <DialogDescription>
                    Ingresa los detalles del ajuste de stock.
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
                    <Button className="flex-1" onClick={handleRegistrarIngreso}>
                      Registrar
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => setShowIngresoDialog(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>

        {/* Tab de Información */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{medicamento.nombre}</CardTitle>
              <CardDescription>{medicamento.cantidad}/{medicamento.stock_minimo + medicamento.cantidad} unidades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="whitespace-pre-wrap text-sm">
                  {medicamento.prospecto}
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    Importar prospecto
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Proveedores */}
        <TabsContent value="proveedores" className="space-y-4">
          <div className="space-y-3">
            {medicamento.proveedores.map((proveedor) => (
              <Card key={proveedor.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{proveedor.nombre}</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center space-x-2">
                            <PhoneIcon className="h-3 w-3" />
                            <span>{proveedor.telefono}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MailIcon className="h-3 w-3" />
                            <span>{proveedor.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 