import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({ 
  title, 
  description, 
  icon, 
  actionLabel, 
  onAction, 
  className 
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-600 max-w-md mb-6">
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export function EmptySearchResults({ 
  searchTerm, 
  onClearSearch 
}: { 
  searchTerm: string
  onClearSearch?: () => void 
}) {
  return (
    <EmptyState
      title="No se encontraron resultados"
      description={`No se encontraron elementos que coincidan con "${searchTerm}"`}
      actionLabel={onClearSearch ? "Limpiar búsqueda" : undefined}
      onAction={onClearSearch}
    />
  )
}

export function EmptyList({ 
  entityName, 
  onCreateNew 
}: { 
  entityName: string
  onCreateNew?: () => void 
}) {
  return (
    <EmptyState
      title={`No hay ${entityName.toLowerCase()} registrados`}
      description={`Comienza creando tu primer ${entityName.toLowerCase()}`}
      actionLabel={onCreateNew ? `Crear ${entityName}` : undefined}
      onAction={onCreateNew}
    />
  )
} 