'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

interface BreadcrumbProps {
  className?: string
  customItems?: BreadcrumbItem[]
}

// Route mapping for better breadcrumb labels
const ROUTE_LABELS: Record<string, string> = {
  '/': 'Inicio',
  '/menu-principal': 'Menú Principal',
  '/empleados': 'Empleados',
  '/registro-empleados': 'Registrar Empleado',
  '/empleado': 'Detalle Empleado',
  '/registro-asistencia': 'Registro de Asistencia',
  '/informe-presentismo': 'Informe de Presentismo',
  '/compras': 'Compras',
  '/compras/necesidades': 'Lista de Necesidades',
  '/compras/registrar': 'Registrar Compra',
  '/compras/pedidos': 'Pedidos Pendientes',
  '/compras/historial': 'Historial de Compras',
  '/menu-medicamentos': 'Medicamentos',
  '/menu-medicamentos/agregar': 'Agregar Medicamento',
  '/menu-medicamentos/ranking': 'Ranking de Medicamentos',
  '/perfil': 'Mi Perfil',
  '/cambiar-contrasena': 'Cambiar Contraseña',
  '/login': 'Iniciar Sesión',
  '/olvide-contrasena': 'Olvidé mi Contraseña',
}

// Parent route mapping for hierarchical navigation
const ROUTE_PARENTS: Record<string, string> = {
  '/registro-empleados': '/empleados',
  '/empleado': '/empleados',
  '/compras/necesidades': '/compras',
  '/compras/registrar': '/compras',
  '/compras/pedidos': '/compras',
  '/compras/historial': '/compras',
  '/menu-medicamentos/agregar': '/menu-medicamentos',
  '/menu-medicamentos/ranking': '/menu-medicamentos',
  '/cambiar-contrasena': '/perfil',
}

export function Breadcrumb({ className, customItems }: BreadcrumbProps) {
  const pathname = usePathname()

  // If custom items are provided, use them
  if (customItems) {
    return (
      <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
        {customItems.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="h-4 w-4" />}
            {item.href && !item.isActive ? (
              <Link 
                href={item.href} 
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(item.isActive && 'text-foreground font-medium')}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    )
  }

  // Auto-generate breadcrumbs from current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    // Always start with Home if not on home page
    if (pathname !== '/') {
      breadcrumbs.push({
        label: 'Inicio',
        href: '/menu-principal'
      })
    }

    // Build breadcrumbs based on path segments
    let currentPath = ''
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1
      
      // Check if this path has a parent that should be included
      if (!breadcrumbs.some(b => b.href === ROUTE_PARENTS[currentPath]) && ROUTE_PARENTS[currentPath]) {
        const parentPath = ROUTE_PARENTS[currentPath]
        const parentLabel = ROUTE_LABELS[parentPath] || parentPath.split('/').pop() || ''
        
        if (!breadcrumbs.some(b => b.href === parentPath)) {
          breadcrumbs.push({
            label: parentLabel,
            href: parentPath
          })
        }
      }

      // Add current segment
      const label = ROUTE_LABELS[currentPath] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        isActive: isLast
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Don't show breadcrumbs on login or single-level pages
  if (pathname === '/login' || pathname === '/olvide-contrasena' || breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground mb-4', className)}>
      <Home className="h-4 w-4" />
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {item.href && !item.isActive ? (
            <Link 
              href={item.href} 
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(item.isActive && 'text-foreground font-medium')}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}