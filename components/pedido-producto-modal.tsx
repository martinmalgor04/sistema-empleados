'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, PhoneIcon, MailIcon, PackageIcon, DollarSignIcon } from "lucide-react"

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
  observaciones?: string
}

interface PedidoProductoModalProps {
  pedido: PedidoProducto | null
  isOpen: boolean
  onClose: () => void
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getStatusBadge = (estado: string) => {
  switch (estado.toLowerCase()) {
    case 'pendiente':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pendiente</Badge>
    case 'en_transito':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">En tránsito</Badge>
    case 'recibido':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Recibido</Badge>
    case 'cancelado':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Cancelado</Badge>
    default:
      return <Badge variant="outline">{estado}</Badge>
  }
}

export default function PedidoProductoModal({ pedido, isOpen, onClose }: PedidoProductoModalProps) {
  if (!pedido) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageIcon className="h-5 w-5" />
            Pedido de Producto #{pedido.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado y fechas */}
          <div className="flex items-center justify-between">
            {getStatusBadge(pedido.estado)}
            <div className="text-sm text-muted-foreground">
              Pedido: {formatDate(pedido.fecha_pedido)}
            </div>
          </div>

          {/* Información del producto */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">{pedido.producto_nombre}</span>
                <Badge variant="secondary">{pedido.cantidad_solicitada} unidades</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Costo total:</span>
                </div>
                <span className="font-medium text-lg">{formatCurrency(pedido.costo_total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Información del proveedor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Proveedor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium">{pedido.proveedor.nombre}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{pedido.proveedor.telefono}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MailIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{pedido.proveedor.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fechas importantes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cronograma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Fecha de pedido:</span>
                </div>
                <span>{formatDate(pedido.fecha_pedido)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Entrega estimada:</span>
                </div>
                <span>{formatDate(pedido.fecha_estimada_entrega)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Observaciones */}
          {pedido.observaciones && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{pedido.observaciones}</p>
              </CardContent>
            </Card>
          )}

          {/* Acciones */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            {pedido.estado === 'pendiente' && (
              <Button variant="destructive">
                Cancelar pedido
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
