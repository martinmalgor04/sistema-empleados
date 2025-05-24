'use client'

import React from 'react';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { MoreHorizontal, UserPlus, Search, Filter, LineChart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils";

// Datos de ejemplo, reemplazar con datos reales o fetch a API
const empleados = [
  {
    id: "1",
    nombre: "Carmen Ruiz",
    apellido: "González",
    fechaNacimiento: "1985-03-12",
    dni: "12345678A",
    rol: "Enfermera",
    estado: "Activo",
    avatar: "/placeholder-user.jpg", // Usar un placeholder general
  },
  {
    id: "2",
    nombre: "Luis Martínez",
    apellido: "Pérez",
    fechaNacimiento: "1990-07-21",
    dni: "87654321B",
    rol: "Médico",
    estado: "Activo",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "3",
    nombre: "Ana García",
    apellido: "López",
    fechaNacimiento: "1992-11-02",
    dni: "11223344C",
    rol: "Cuidadora",
    estado: "Suspendido",
    avatar: "/placeholder-user.jpg",
  },
];

export default function EmpleadosPage() {
  const router = useRouter();
  
  const handleVerPerfil = (empleadoId: string) => {
    router.push(`/empleado/${empleadoId}`);
  };
  
  const handleEditarEmpleado = (empleadoId: string) => {
    // TODO: Implementar navegación a página de edición
    console.log("Editar empleado", empleadoId);
  };
  
  const handleSuspenderEmpleado = (empleadoId: string) => {
    // TODO: Implementar lógica de suspensión
    console.log("Suspender empleado", empleadoId);
  };

  // TODO: Implementar estados para filtros, búsqueda, paginación, etc.

  return (
    <div className="space-y-6">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <CardTitle className="text-3xl">Gestión de Empleados</CardTitle>
                <CardDescription>
                    Aquí puedes ver, agregar y administrar los empleados de ElderCare.
                </CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Link href="/informe-presentismo">
                    <Button variant="outline" className="flex items-center gap-2">
                        <LineChart className="h-4 w-4" />
                        Informe de Presentismo
                    </Button>
                </Link>
                <Link href="/registro-empleados"> {/* Asumiendo que esta es la página para agregar nuevos */}
                    <Button className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Agregar Empleado
                    </Button>
                </Link>
            </div>
        </div>
      </CardHeader>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Buscar por nombre, DNI..." className="pl-10" />
            </div>
            <Button variant="outline" className="ml-4">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Avatar</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha de Nacimiento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empleados.map((empleado) => (
                  <TableRow key={empleado.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={empleado.avatar} alt={empleado.nombre} />
                        <AvatarFallback>{empleado.nombre.charAt(0)}{empleado.apellido.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{empleado.nombre} {empleado.apellido}</TableCell>
                    <TableCell>{empleado.dni}</TableCell>
                    <TableCell>{empleado.rol}</TableCell>
                    <TableCell>{new Date(empleado.fechaNacimiento).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={empleado.estado === "Activo" ? "default" : "destructive"}
                             className={cn(empleado.estado === "Activo" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600", "text-white")}>
                        {empleado.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleVerPerfil(empleado.id)}>Ver Perfil</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditarEmpleado(empleado.id)}>Editar Empleado</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 hover:!text-red-600 hover:!bg-red-100" onClick={() => handleSuspenderEmpleado(empleado.id)}>
                            Suspender Empleado
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* TODO: Añadir paginación si es necesario */}
        </CardContent>
      </Card>
    </div>
  );
} 