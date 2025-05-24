'use client'

import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CalendarIcon, 
  PackageIcon, 
  UserIcon, 
  PhoneIcon, 
  MailIcon, 
  DollarSignIcon,
  ClockIcon,
  AlertCircleIcon
} from "lucide-react"

interface Pedido {
  id: number
  medicamento_id: number
  medicamento_nombre: string
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

interface PedidoDetailModalProps {
  pedido: Pedido | null
  isOpen: boolean
  onClose: () => void
}

export default function PedidoDetailModal({ pedido, isOpen, onClose }: PedidoDetailModalProps) {
  if (!pedido) return null

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case "en_transito":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">En tránsito</Badge>
      case "recibido":
        return <Badge variant="default" className="bg-green-100 text-green-800">Recibido</Badge>
      case "cancelado":
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <PackageIcon className="h-5 w-5" />
            <span>Detalle del Pedido #{pedido.id}</span>
          </DialogTitle>
          <DialogDescription>
            Información completa del pedido de medicamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Estado y medicamento */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{pedido.medicamento_nombre}</CardTitle>
                {getEstadoBadge(pedido.estado)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cantidad solicitada:</span>
                <span className="font-medium">{pedido.cantidad_solicitada} unidades</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Costo total:</span>
                <span className="font-medium text-green-600">{formatCurrency(pedido.costo_total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Fechas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Fechas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center space-x-1">
                  <ClockIcon className="h-3 w-3" />
                  <span>Fecha de pedido:</span>
                </span>
                <span className="text-sm font-medium">{formatDate(pedido.fecha_pedido)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center space-x-1">
                  <CalendarIcon className="h-3 w-3" />
                  <span>Entrega estimada:</span>
                </span>
                <span className="text-sm font-medium">{formatDate(pedido.fecha_estimada_entrega)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Proveedor */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <UserIcon className="h-4 w-4" />
                <span>Proveedor</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{pedido.proveedor.nombre}</p>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-3 w-3" />
                  <span>{pedido.proveedor.telefono}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MailIcon className="h-3 w-3" />
                  <span>{pedido.proveedor.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observaciones */}
          {pedido.observaciones && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <AlertCircleIcon className="h-4 w-4" />
                  <span>Observaciones</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{pedido.observaciones}</p>
              </CardContent>
            </Card>
          )}

          {/* Botones de acción */}
          <div className="flex space-x-2 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Cerrar
            </Button>
            {pedido.estado === "pendiente" && (
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => {
                  // Aquí se podría implementar cancelar pedido
                  onClose()
                }}
              >
                Cancelar pedido
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 