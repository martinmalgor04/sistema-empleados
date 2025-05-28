'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { CustomSidebar } from '@/src/components/navigation/layout/custom-sidebar'
import { cn } from '@/lib/utils'

const PUBLIC_ROUTES = ['/login', '/olvide-contrasena', '/terminos-y-condiciones']

interface ClientLayoutWrapperProps {
  children: React.ReactNode
}

export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isPublicRoute, setIsPublicRoute] = useState(false)

  useEffect(() => {
    setIsPublicRoute(PUBLIC_ROUTES.includes(pathname))
  }, [pathname])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Si es una ruta pública, no mostrar sidebar
  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      {/* Contenido principal */}
      <main className={cn(
        "md:transition-all md:duration-300 md:ease-in-out",
        isCollapsed ? "md:pl-20" : "md:pl-64"
      )}>

        
        <div className="container mx-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  )
} 