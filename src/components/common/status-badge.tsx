import React from 'react'
import { Badge } from '@/components/ui/badge'
import { PRIORITY_COLORS, CATEGORY_COLORS } from '@/src/constants/ui'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  type?: 'status' | 'priority' | 'category'
  className?: string
}

export function StatusBadge({ status, variant, type = 'status', className }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (type) {
      case 'priority':
        return PRIORITY_COLORS[status as keyof typeof PRIORITY_COLORS] || 'bg-gray-100 text-gray-800 border-gray-300'
      case 'category':
        return CATEGORY_COLORS[status as keyof typeof CATEGORY_COLORS] || 'bg-gray-100 text-gray-800 border-gray-300'
      case 'status':
      default:
        switch (status.toLowerCase()) {
          case 'activo':
          case 'en_stock':
          case 'recibida':
          case 'completa':
            return 'bg-green-500 hover:bg-green-600 text-white'
          case 'suspendido':
          case 'sin_stock':
          case 'cancelada':
          case 'cancelado':
            return 'bg-red-500 hover:bg-red-600 text-white'
          case 'stock_bajo':
          case 'pendiente':
            return 'bg-yellow-500 hover:bg-yellow-600 text-white'
          case 'en_transito':
          case 'pedido':
            return 'bg-blue-500 hover:bg-blue-600 text-white'
          default:
            return 'bg-gray-500 hover:bg-gray-600 text-white'
        }
    }
  }

  const formatStatus = (status: string) => {
    return status
      .replace('_', ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (type === 'priority' || type === 'category') {
    return (
      <Badge variant="outline" className={cn(getStatusColor(), className)}>
        {formatStatus(status)}
      </Badge>
    )
  }

  return (
    <Badge 
      variant={variant} 
      className={cn(getStatusColor(), className)}
    >
      {formatStatus(status)}
    </Badge>
  )
} 