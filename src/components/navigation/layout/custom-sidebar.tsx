'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MenuIcon, HomeIcon, UserPlusIcon, ShoppingCartIcon, PillIcon, LogOutIcon, UserCogIcon, ChevronsLeftIcon, ChevronsRightIcon, UserIcon } from "lucide-react"
import React, { useEffect, useState } from "react"

// Definición base de los items de navegación
const baseNavItems = [
  { href: "/menu-principal", label: "Inicio", icon: HomeIcon, roles: ["supervisor", "enfermero"] },
  { href: "/empleados", label: "Empleados", icon: UserCogIcon, roles: ["supervisor"] },
  { href: "/registro-asistencia", label: "Reg. Asistencia", icon: UserPlusIcon, roles: ["supervisor", "enfermero"] },
  { href: "/compras", label: "Compras", icon: ShoppingCartIcon, roles: ["supervisor"] }, // Solo supervisor por ahora
  { href: "/menu-medicamentos", label: "Medicamentos", icon: PillIcon, roles: ["supervisor", "enfermero"] },
  { href: "/perfil", label: "Mi Perfil", icon: UserIcon, roles: ["supervisor", "enfermero"] },
]

interface CustomSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function CustomSidebar({ isCollapsed, toggleSidebar }: CustomSidebarProps) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [currentNavItems, setCurrentNavItems] = useState(baseNavItems); // Inicia con todos, luego filtra

  useEffect(() => {
    const loggedInUserString = localStorage.getItem("loggedInUser");
    if (loggedInUserString) {
      try {
        const loggedInUser = JSON.parse(loggedInUserString);
        const role = loggedInUser?.rol || null;
        setUserRole(role);
        
        if (role) {
          const filteredItems = baseNavItems.filter(item => item.roles.includes(role));
          setCurrentNavItems(filteredItems);
        } else {
          // Si no hay rol, o es un rol no reconocido, mostrar solo inicio o ninguno (según se decida)
          // Por ahora, mostramos los que no requieren rol específico o son para todos (si los hubiera)
          // O, más simple, si no hay rol, no mostrar nada o solo el inicio si es público.
          // Aquí, si no hay rol, se podría mostrar un conjunto mínimo o vaciar currentNavItems.
          // Para este caso, si no hay rol, asumimos que no puede ver nada más que quizás inicio (si se marca así).
          // Por ahora, si no hay rol, filtramos para no mostrar nada de baseNavItems (ya que todos tienen roles definidos)
          setCurrentNavItems(baseNavItems.filter(item => item.roles.includes("none"))); // Asume que "none" es un rol que no existe
        }

      } catch (error) {
        console.error("Error parsing loggedInUser from localStorage:", error);
        setUserRole(null);
        setCurrentNavItems(baseNavItems.filter(item => item.roles.includes("none")));
      }
    } else {
      setUserRole(null); // No hay usuario logueado
      setCurrentNavItems(baseNavItems.filter(item => item.roles.includes("none")));
    }
  }, [pathname]); // Re-ejecutar si cambia la ruta para asegurar que el rol sigue siendo válido o refrescar si es necesario

  const renderNavLinks = (isMobile = false) =>
    currentNavItems.map((item) => (
      <Link key={item.label} href={item.href} legacyBehavior passHref>
        <Button
          variant={pathname === item.href ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start",
            isMobile && "text-lg py-3",
            !isMobile && isCollapsed && "justify-center px-2",
            !isMobile && !isCollapsed && "px-3"
          )}
        >
          <item.icon className={cn(
            "h-5 w-5",
            isMobile && "h-6 w-6 mr-4",
            !isMobile && isCollapsed && "mr-0",
            !isMobile && !isCollapsed && "mr-3"
            )} />
          {!isMobile && !isCollapsed && item.label}
          {isMobile && item.label}
        </Button>
      </Link>
    ))

  return (
    <>
      {/* Sidebar para Desktop */}
      <aside className={cn(
          "hidden md:flex md:flex-col bg-card border-r fixed h-full z-40 transition-all duration-300 ease-in-out",
          isCollapsed ? "md:w-20" : "md:w-64"
        )}>
        <div className={cn(
            "flex items-center h-20 border-b px-4",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
          {isCollapsed ? (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-10 w-10">
              <ChevronsRightIcon className="h-6 w-6" />
            </Button>
          ) : (
            <>
              <Link href="/menu-principal" className="flex items-center gap-3">
                <img src="/logo-eldercare-icon.png" alt="ElderCare Logo Icon" className="h-10 w-10" />
                <h1 className="text-2xl font-semibold">ElderCare</h1>
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
                <ChevronsLeftIcon className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
        <nav className={cn("flex-grow p-3 space-y-1.5", isCollapsed && "overflow-x-hidden")}>
          {renderNavLinks()} 
        </nav>
        <div className={cn("p-3 border-t mt-auto")}>
          <Link href="/login" legacyBehavior passHref>
            <Button asChild variant="outline" className={cn("w-full justify-start", isCollapsed && "justify-center px-2")} onClick={() => localStorage.removeItem('loggedInUser')}> 
              <a>
                <LogOutIcon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-3")} />
                {!isCollapsed && "Cerrar Sesión"}
              </a>
            </Button>
          </Link>
        </div>
      </aside>

      {/* Menú para Móvil (Header con Hamburguesa) */}
      <header className="md:hidden sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/menu-principal" className="flex items-center gap-2">
            <img src="/logo-eldercare-icon.png" alt="ElderCare Logo Icon Mobile" className="h-8 w-8" />
            <h1 className="text-xl font-semibold">ElderCare</h1>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 sm:w-80 pt-0 pr-0 pl-0 pb-0">
              <div className="flex items-center justify-start h-20 border-b mb-3 px-5">
                 <Link href="/menu-principal" className="flex items-center gap-3">
                    <img src="/logo-eldercare-icon.png" alt="ElderCare Logo Icon Sheet" className="h-10 w-10" />
                    <h1 className="text-2xl font-semibold">ElderCare</h1>
                 </Link>
              </div>
              <nav className="flex flex-col space-y-1.5 px-3">
                {renderNavLinks(true)}
                 <div className="pt-3 border-t mt-2">
                    <Link href="/login" legacyBehavior passHref>
                        <Button asChild variant="outline" className="w-full justify-start text-lg py-3" onClick={() => localStorage.removeItem('loggedInUser')}>
                          <a>
                            <LogOutIcon className="mr-4 h-6 w-6" />
                            Cerrar Sesión
                          </a>
                        </Button>
                    </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  )
} 