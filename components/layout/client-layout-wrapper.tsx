'use client'

import React, { useState } from "react"
import { CustomSidebar } from "@/components/layout/custom-sidebar"
import { ThemeSwitcher } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleMainSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className="flex min-h-screen flex-col">
      <CustomSidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleMainSidebar}
      />
      <main
        className={cn(
          "flex-1 pt-14 md:pt-0 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "md:pl-20" : "md:pl-64"
        )}
      >
        <div className="fixed top-3 right-4 z-50 hidden md:block">
          <ThemeSwitcher />
        </div>
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
} 