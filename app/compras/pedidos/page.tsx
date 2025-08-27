'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeftIcon, 
  ClockIcon,
  AlertCircleIcon,
  TruckIcon,
  CheckCircleIcon,
  DollarSignIcon,
  CreditCardIcon,
  FileTextIcon
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import pedidosData from "@/data/pedidos.json"

interface UpdateStatusData {
  newStatus: string
  paymentStatus?: string
  observations?: string
  receivedQuantity?: number
}

export default function PedidosPendientesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedPedido, setSelectedPedido] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [updateData, setUpdateData] = useState<UpdateStatusData>({ newStatus: "" })

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
      case "pendiente":
        return <Badge variant="outline" className="text-xs border-orange-500 text-orange-700">Pendiente</Badge>
      case "en_transito":
        return <Badge variant="outline" className="text-xs border-blue-500 text-blue-700">En tránsito</Badge>
      case "recibido":
        return <Badge variant="default" className="text-xs">Recibido</Badge>
      case "cancelado":
        return <Badge variant="destructive" className="text-xs">Cancelado</Badge>
      case "parcial":
        return <Badge variant="outline" className="text-xs border-purple-500 text-purple-700">Parcial</Badge>
      default:
        return <Badge variant="outline" className="text-xs">{estado}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "pendiente":
        return <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-700">Pago Pendiente</Badge>
      case "pagado":
        return <Badge variant="default" className="text-xs bg-green-100 text-green-800">Pagado</Badge>
      case "parcial":
        return <Badge variant="outline" className="text-xs border-blue-500 text-blue-700">Pago Parcial</Badge>
      default:
        return null
    }
  }

  const getIconForEstado = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <ClockIcon className="h-4 w-4 text-orange-500" />
      case "en_transito":
        return <TruckIcon className="h-4 w-4 text-blue-500" />
      case "recibido":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case "cancelado":
        return <AlertCircleIcon className="h-4 w-4 text-red-500" />
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const handleOpenStatusDialog = (pedido: any, action: 'receive' | 'cancel' | 'update') => {
    setSelectedPedido(pedido)
    const defaultStatus = action === 'receive' ? 'recibido' : action === 'cancel' ? 'cancelado' : ''
    setUpdateData({ 
      newStatus: defaultStatus,
      paymentStatus: pedido.payment_status || 'pendiente',
      observations: '',
      receivedQuantity: pedido.cantidad_solicitada
    })
    setIsDialogOpen(true)
  }

  const handleUpdateStatus = () => {
    if (!selectedPedido || !updateData.newStatus) return

    const statusMessages = {
      recibido: "El pedido ha sido marcado como recibido",
      cancelado: "El pedido ha sido cancelado",
      en_transito: "El pedido está en tránsito",
      parcial: "Se ha registrado una recepción parcial"
    }

    toast({
      title: "Pedido actualizado",
      description: `Pedido #${selectedPedido.id}: ${statusMessages[updateData.newStatus as keyof typeof statusMessages]}`,
      variant: updateData.newStatus === 'cancelado' ? 'destructive' : 'default'
    })

    setIsDialogOpen(false)
    setSelectedPedido(null)
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
            <h1 className="text-2xl font-bold">Pedidos pendientes</h1>
            <p className="text-muted-foreground">
              Seguimiento de compras en proceso
            </p>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-xl font-bold">
                  {pedidosData.filter(p => p.estado === "pendiente").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TruckIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">En tránsito</p>
                <p className="text-xl font-bold">
                  {pedidosData.filter(p => p.estado === "en_transito").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Recibidos</p>
                <p className="text-xl font-bold">
                  {pedidosData.filter(p => p.estado === "recibido").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircleIcon className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Cancelados</p>
                <p className="text-xl font-bold">
                  {pedidosData.filter(p => p.estado === "cancelado").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Todos los pedidos</CardTitle>
          <CardDescription>
            Estado actual de todos los pedidos realizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pedidosData.length === 0 ? (
            <div className="text-center py-12">
              <ClockIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay pedidos</h3>
              <p className="text-muted-foreground">Aún no se han realizado pedidos</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pedidosData.map((pedido) => (
                <Card key={pedido.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          {getIconForEstado(pedido.estado)}
                          <h3 className="font-semibold text-lg">
                            Pedido #{pedido.id} - {pedido.medicamento_nombre}
                          </h3>
                          {getEstadoBadge(pedido.estado)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Proveedor:</span>
                            <p>{pedido.proveedor.nombre}</p>
                          </div>
                          <div>
                            <span className="font-medium">Cantidad:</span>
                            <p>{pedido.cantidad_solicitada} unidades</p>
                          </div>
                          <div>
                            <span className="font-medium">Fecha pedido:</span>
                            <p>{formatDate(pedido.fecha_pedido)}</p>
                          </div>
                          <div>
                            <span className="font-medium">Entrega estimada:</span>
                            <p>{formatDate(pedido.fecha_estimada_entrega)}</p>
                          </div>
                        </div>

                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-muted-foreground">Total: </span>
                              <span className="font-semibold">{formatCurrency(pedido.costo_total)}</span>
                            </div>
                            {getPaymentStatusBadge(pedido.payment_status || 'pendiente')}
                          </div>
                          {pedido.observaciones && (
                            <div className="text-xs text-muted-foreground max-w-md">
                              {pedido.observaciones}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {pedido.estado === "pendiente" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenStatusDialog(pedido, 'receive')}
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Recibir
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenStatusDialog(pedido, 'cancel')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <AlertCircleIcon className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          </>
                        )}
                        {pedido.estado === "en_transito" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenStatusDialog(pedido, 'receive')}
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Recibir
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenStatusDialog(pedido, 'update')}
                            >
                              <FileTextIcon className="h-4 w-4 mr-1" />
                              Actualizar
                            </Button>
                          </>
                        )}
                        {(pedido.estado === "recibido" || pedido.estado === "cancelado") && (
                          <Button variant="outline" size="sm" disabled>
                            {pedido.estado === "recibido" ? "Completado" : "Cancelado"}
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

      {/* Acciones rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => router.push("/compras/registrar")}>
              Nueva compra
            </Button>
            <Button variant="outline" onClick={() => router.push("/compras/necesidades")}>
              Ver necesidades
            </Button>
            <Button variant="outline" onClick={() => router.push("/menu-medicamentos")}>
              Gestionar medicamentos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Actualizar Estado del Pedido</DialogTitle>
            <DialogDescription>
              Pedido #{selectedPedido?.id} - {selectedPedido?.medicamento_nombre}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={updateData.newStatus} onValueChange={(value) => setUpdateData({...updateData, newStatus: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en_transito">En tránsito</SelectItem>
                  <SelectItem value="recibido">Recibido completo</SelectItem>
                  <SelectItem value="parcial">Recibido parcial</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment">Estado de Pago</Label>
              <Select value={updateData.paymentStatus} onValueChange={(value) => setUpdateData({...updateData, paymentStatus: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="parcial">Pago parcial</SelectItem>
                  <SelectItem value="pagado">Pagado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {updateData.newStatus === 'parcial' && (
              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad recibida</Label>
                <input
                  id="quantity"
                  type="number"
                  className="w-full p-2 border rounded"
                  value={updateData.receivedQuantity || ''}
                  onChange={(e) => setUpdateData({...updateData, receivedQuantity: parseInt(e.target.value)})}
                  max={selectedPedido?.cantidad_solicitada}
                />
                <p className="text-sm text-muted-foreground">
                  Solicitado: {selectedPedido?.cantidad_solicitada} unidades
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea
                id="observations"
                placeholder="Notas adicionales (opcional)"
                value={updateData.observations}
                onChange={(e) => setUpdateData({...updateData, observations: e.target.value})}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateStatus}>
                Actualizar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 