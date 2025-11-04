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
import { MenuIcon, HomeIcon, UserPlusIcon, ShoppingCartIcon, PillIcon, PackageIcon, LogOutIcon, UserCogIcon, ChevronsLeftIcon, ChevronsRightIcon, UserIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react"
import React, { useEffect, useState } from "react"

// Definición base de los items de navegación
interface NavItem {
  href?: string;
  label: string;
  icon: any;
  roles: string[];
  children?: NavItem[];
  isSection?: boolean;
  defaultExpanded?: boolean;
}

const baseNavItems: NavItem[] = [
  {
    href: "/menu-principal",
    label: "Inicio",
    icon: HomeIcon,
    roles: ["supervisor", "enfermero"]
  },
  {
    href: "/empleados",
    label: "Empleados",
    icon: UserCogIcon,
    roles: ["supervisor"]
  },
  {
    href: "/registro-asistencia",
    label: "Reg. Asistencia",
    icon: UserPlusIcon,
    roles: ["supervisor", "enfermero"]
  },
  {
    href: "/compras",
    label: "Compras",
    icon: ShoppingCartIcon,
    roles: ["supervisor"]
  },
  // Sección Inventario con medicamentos y productos
  {
    label: "Inventario",
    icon: PackageIcon,
    roles: ["supervisor", "enfermero"],
    isSection: true,
    defaultExpanded: true,
    children: [
      {
        href: "/menu-medicamentos",
        label: "Medicamentos",
        icon: PillIcon,
        roles: ["supervisor", "enfermero"]
      },
      {
        href: "/menu-productos",
        label: "Productos",
        icon: PackageIcon,
        roles: ["supervisor", "enfermero"]
      }
    ]
  },
  {
    href: "/perfil",
    label: "Mi Perfil",
    icon: UserIcon,
    roles: ["supervisor", "enfermero"]
  }
]

interface CustomSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function CustomSidebar({ isCollapsed, toggleSidebar }: CustomSidebarProps) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [currentNavItems, setCurrentNavItems] = useState(baseNavItems); // Inicia con todos, luego filtra
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const loggedInUserString = localStorage.getItem("loggedInUser");
    if (loggedInUserString) {
      try {
        const loggedInUser = JSON.parse(loggedInUserString);
        const role = loggedInUser?.rol || null;
        setUserRole(role);

        if (role) {
          // Filtrar items por rol
          const filteredItems = baseNavItems.filter(item => item.roles.includes(role));

          setCurrentNavItems(filteredItems);

          // Inicializar estado de secciones expandidas
          const initialExpanded: Record<string, boolean> = {};
          filteredItems.forEach(item => {
            if (item.isSection) {
              const stored = localStorage.getItem(`sidebar-section-${item.label}`);
              if (stored !== null) {
                initialExpanded[item.label] = JSON.parse(stored);
              } else {
                initialExpanded[item.label] = item.defaultExpanded || false;
              }
            }
          });

          // Auto-expandir sección que contiene la ruta activa (solo secciones sin href directo)
          filteredItems.forEach(item => {
            if (item.isSection && item.children && !item.href) {
              const hasActiveChild = item.children.some(child => {
                if (child.href && (pathname === child.href || pathname.startsWith(child.href + '/'))) {
                  return true;
                }
                if (child.children) {
                  return child.children.some(grandChild =>
                    grandChild.href && (pathname === grandChild.href || pathname.startsWith(grandChild.href + '/'))
                  );
                }
                return false;
              });

              if (hasActiveChild) {
                initialExpanded[item.label] = true;
              }
            }
          });

          setExpandedSections(initialExpanded);
        } else {
          setCurrentNavItems([]);
          setExpandedSections({});
        }

      } catch (error) {
        console.error("Error parsing loggedInUser from localStorage:", error);
        setUserRole(null);
        setCurrentNavItems([]);
        setExpandedSections({});
      }
    } else {
      setUserRole(null);
      setCurrentNavItems([]);
      setExpandedSections({});
    }
  }, [pathname]);

  const toggleSection = (sectionLabel: string) => {
    const newExpanded = !expandedSections[sectionLabel];
    setExpandedSections(prev => ({
      ...prev,
      [sectionLabel]: newExpanded
    }));
    localStorage.setItem(`sidebar-section-${sectionLabel}`, JSON.stringify(newExpanded));
  };

  const isActiveRoute = (item: NavItem): boolean => {
    // Exact match
    if (item.href && pathname === item.href) return true;

    // Check if current path is a child route
    if (!item.children) return false;

    return item.children.some((child: NavItem) => {
      if (child.href && (pathname === child.href || pathname.startsWith(child.href + '/'))) return true;
      if (child.children) {
        return child.children.some((grandChild: NavItem) =>
          grandChild.href && (pathname === grandChild.href || pathname.startsWith(grandChild.href + '/'))
        );
      }
      return false;
    });
  };

  const renderNavItem = (item: NavItem, isMobile = false, level = 0): React.ReactNode => {
    const isActive = isActiveRoute(item);

    // Si es un item simple (sin hijos) o es una sección sin hijos
    if (!item.children) {
      return (
        <Link key={item.label} href={item.href || '#'} legacyBehavior passHref>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start transition-colors relative hover:bg-accent hover:text-accent-foreground",
              isMobile && "text-lg py-3",
              !isMobile && isCollapsed && "justify-center px-2",
              !isMobile && !isCollapsed && "px-3",
              isActive && "bg-primary/10 text-primary font-medium border-r-2 border-primary",
              level === 1 && !isMobile && !isCollapsed && "ml-2 pl-5",
              level === 2 && !isMobile && !isCollapsed && "ml-8 pl-11",
              level > 0 && "text-xs font-normal"
            )}
          >
            {item.icon && (
              <item.icon className={cn(
                level > 0 ? "h-3 w-3" : "h-4 w-4",
                isMobile && (level > 0 ? "h-4 w-4 mr-2" : "h-5 w-5 mr-3"),
                !isMobile && isCollapsed && "mr-0",
                !isMobile && !isCollapsed && (level > 0 ? "mr-1.5" : "mr-2"),
                isActive && "text-primary"
              )} />
            )}
            {!isMobile && !isCollapsed && (
              <span className={cn(level > 0 && "text-xs")}>
                {level === 0 ? item.label : item.label}
              </span>
            )}
            {isMobile && (
              <span className={cn(level > 0 && "text-xs")}>
                {item.label}
              </span>
            )}
          </Button>
        </Link>
      );
    }

    // Si es una sección con children
    const isExpanded = expandedSections[item.label] || false;
    const ChevronIcon = isExpanded ? ChevronDownIcon : ChevronRightIcon;

    // Si la sección tiene href, es clicable (sin mostrar chevron)
    if (item.href) {
      return (
        <div key={item.label} className="space-y-0.5">
          {/* Header de la sección con enlace */}
          <Link href={item.href} legacyBehavior passHref>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start transition-colors relative hover:bg-accent hover:text-accent-foreground",
                isMobile && "text-lg py-3",
                !isMobile && isCollapsed && "justify-center px-2",
                !isMobile && !isCollapsed && "px-3",
                isActive && "bg-primary/10 text-primary font-medium border-r-2 border-primary",
                level === 1 && !isMobile && !isCollapsed && "ml-2 pl-5",
                level > 0 && "text-xs font-normal"
              )}
            >
              {item.icon && (
                <item.icon className={cn(
                  level > 0 ? "h-3 w-3" : "h-4 w-4",
                  isMobile && (level > 0 ? "h-4 w-4 mr-2" : "h-5 w-5 mr-3"),
                  !isMobile && isCollapsed && "mr-0",
                  !isMobile && !isCollapsed && (level > 0 ? "mr-1.5" : "mr-2"),
                  isActive && "text-primary"
                )} />
              )}
              {!isMobile && !isCollapsed && (
                <span className={cn("flex-1 text-left", level > 0 && "text-xs")}>{item.label}</span>
              )}
              {isMobile && (
                <span className={cn("flex-1 text-left", level > 0 && "text-xs")}>{item.label}</span>
              )}
            </Button>
          </Link>

          {/* Items hijos de la sección - siempre expandidos para estos items */}
          {(!isCollapsed || isMobile) && (
            <div className={cn(!isMobile && !isCollapsed && "ml-6 space-y-0.5")}>
              {item.children.map((child) => renderNavItem(child, isMobile, level + 1))}
            </div>
          )}
        </div>
      );
    }

    // Sección sin href (como la sección "Inventario" padre)
    return (
      <div key={item.label} className="space-y-0.5">
        {/* Header de la sección */}
        <Button
          variant="ghost"
          onClick={() => toggleSection(item.label)}
          className={cn(
            "w-full justify-start transition-colors relative hover:bg-accent hover:text-accent-foreground",
            isMobile && "text-lg py-3",
            !isMobile && isCollapsed && "justify-center px-2",
            !isMobile && !isCollapsed && "px-3",
            isActive && "text-primary font-medium"
          )}
        >
          <item.icon className={cn(
            "h-4 w-4",
            isMobile && "h-5 w-5 mr-3",
            !isMobile && isCollapsed && "mr-0",
            !isMobile && !isCollapsed && "mr-2",
            isActive && "text-primary"
          )} />
          {!isMobile && !isCollapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronIcon className="h-4 w-4 ml-auto transition-transform duration-200" />
            </>
          )}
          {isMobile && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronIcon className="h-5 w-5 ml-auto transition-transform duration-200" />
            </>
          )}
        </Button>

        {/* Items hijos de la sección */}
        {isExpanded && (!isCollapsed || isMobile) && (
          <div className={cn(!isMobile && !isCollapsed && "ml-6 space-y-0.5")}>
            {item.children.map((child) => renderNavItem(child, isMobile, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderNavLinks = (isMobile = false) =>
    currentNavItems.map((item) => renderNavItem(item, isMobile))

  return (
    <>
      {/* Sidebar para Desktop */}
      <aside className={cn(
          "hidden md:flex md:flex-col bg-card border-r fixed h-full z-40 transition-all duration-300 ease-in-out",
          isCollapsed ? "md:w-20" : "md:w-64"
        )}>
        <div className={cn(
            "flex items-center h-20 border-b px-5",
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
        <nav className={cn("flex-grow p-4 space-y-1.5", isCollapsed && "overflow-x-hidden")}>
          {renderNavLinks()} 
        </nav>
        <div className={cn("p-4 border-t mt-auto")}>
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