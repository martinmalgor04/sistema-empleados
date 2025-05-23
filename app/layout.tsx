import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { ClientLayoutWrapper } from "@/components/layout/client-layout-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ElderCare - Gestión Geriátrica",
  description: "Sistema de gestión integral para el cuidado de adultos mayores - ElderCare",
  generator: "ElderCare App",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
