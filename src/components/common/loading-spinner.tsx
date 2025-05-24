import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  message?: string
}

export function LoadingSpinner({ size = 'md', className, message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <div 
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
          sizeClasses[size]
        )}
      />
      {message && (
        <p className="text-sm text-gray-600">{message}</p>
      )}
    </div>
  )
}

export function LoadingState({ message = 'Cargando...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size="lg" message={message} />
    </div>
  )
}

export function LoadingOverlay({ message = 'Cargando...' }: { message?: string }) {
  return (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
      <LoadingSpinner size="lg" message={message} />
    </div>
  )
} 