'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeftIcon, 
  SearchIcon, 
  FilterIcon, 
  PrinterIcon,
  SortAscIcon,
  AlertTriangleIcon,
  PlusIcon
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import comprasData from "@/data/compras.json"

export default function NecesidadesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todas")
  const [filtroPrioridad, setFiltroPrioridad] = useState("todas")
  const [filtroArea, setFiltroArea] = useState("todas")
  const [isAddingNeed, setIsAddingNeed] = useState(false)
  const [newNeed, setNewNeed] = useState({
    producto: "",
    cantidad_solicitada: "",
    unidad: "",
    categoria: "",
    area: "",
    prioridad: "media",
    observaciones: ""
  })

  const { necesidades } = comprasData

  // Filtrar necesidades
  const necesidadesFiltradas = necesidades.filter(necesidad => {
    const matchesSearch = necesidad.producto.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = filtroCategoria === "todas" || necesidad.categoria === filtroCategoria
    const matchesPrioridad = filtroPrioridad === "todas" || necesidad.prioridad === filtroPrioridad
    const matchesArea = filtroArea === "todas" || necesidad.area === filtroArea
    
    return matchesSearch && matchesCategoria && matchesPrioridad && matchesArea
  })

  const getPrioridadBadge = (prioridad: string) => {
    switch (prioridad) {
      case "alta":
        return <Badge variant="destructive" className="text-xs">Alta</Badge>
      case "media":
        return <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-700">Media</Badge>
      case "baja":
        return <Badge variant="secondary" className="text-xs">Baja</Badge>
      default:
        return <Badge variant="outline" className="text-xs">{prioridad}</Badge>
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "faltante":
        return <Badge variant="destructive" className="text-xs">Faltante</Badge>
      case "pendiente":
        return <Badge variant="outline" className="text-xs border-orange-500 text-orange-700">Pendiente</Badge>
      default:
        return <Badge variant="outline" className="text-xs">{estado}</Badge>
    }
  }

  const handleImprimir = () => {
    toast({
      title: "Impresión iniciada",
      description: "Se está generando el reporte de necesidades",
    })
  }

  const handleAddNeed = () => {
    if (!newNeed.producto || !newNeed.cantidad_solicitada || !newNeed.unidad || !newNeed.categoria || !newNeed.area) {
      toast({
        title: "Error de validación",
        description: "Todos los campos marcados con * son obligatorios",
        variant: "destructive"
      })
      return
    }

    const cantidad = parseInt(newNeed.cantidad_solicitada)
    if (isNaN(cantidad) || cantidad <= 0) {
      toast({
        title: "Error de validación",
        description: "La cantidad debe ser un número válido mayor a 0",
        variant: "destructive"
      })
      return
    }

    // In a real app, this would save to a database
    toast({
      title: "Necesidad agregada",
      description: `${newNeed.producto} ha sido agregado a la lista de necesidades`,
    })

    // Reset form
    setNewNeed({
      producto: "",
      cantidad_solicitada: "",
      unidad: "",
      categoria: "",
      area: "",
      prioridad: "media",
      observaciones: ""
    })
    setIsAddingNeed(false)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Lista de necesidades</h1>
            <p className="text-muted-foreground">
              {necesidadesFiltradas.length} productos encontrados
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddingNeed} onOpenChange={setIsAddingNeed}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Agregar Necesidad
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Nueva Necesidad</DialogTitle>
                <DialogDescription>
                  Complete los datos del producto necesario
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="producto">Producto *</Label>
                  <Input
                    id="producto"
                    placeholder="Nombre del producto"
                    value={newNeed.producto}
                    onChange={(e) => setNewNeed({...newNeed, producto: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cantidad">Cantidad *</Label>
                    <Input
                      id="cantidad"
                      type="number"
                      min="1"
                      placeholder="0"
                      value={newNeed.cantidad_solicitada}
                      onChange={(e) => setNewNeed({...newNeed, cantidad_solicitada: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unidad">Unidad *</Label>
                    <Select value={newNeed.unidad} onValueChange={(value) => setNewNeed({...newNeed, unidad: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="uds">Unidades</SelectItem>
                        <SelectItem value="kg">Kilogramos</SelectItem>
                        <SelectItem value="grs">Gramos</SelectItem>
                        <SelectItem value="litros">Litros</SelectItem>
                        <SelectItem value="ml">Mililitros</SelectItem>
                        <SelectItem value="cajas">Cajas</SelectItem>
                        <SelectItem value="paquetes">Paquetes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría *</Label>
                  <Select value={newNeed.categoria} onValueChange={(value) => setNewNeed({...newNeed, categoria: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Medicamentos">Medicamentos</SelectItem>
                      <SelectItem value="Alimentos">Alimentos</SelectItem>
                      <SelectItem value="Lácteos">Lácteos</SelectItem>
                      <SelectItem value="Limpieza">Limpieza</SelectItem>
                      <SelectItem value="Oficina">Oficina</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area *</Label>
                  <Select value={newNeed.area} onValueChange={(value) => setNewNeed({...newNeed, area: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Enfermería">Enfermería</SelectItem>
                      <SelectItem value="Cocina">Cocina</SelectItem>
                      <SelectItem value="Limpieza">Limpieza</SelectItem>
                      <SelectItem value="Administración">Administración</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prioridad">Prioridad</Label>
                  <Select value={newNeed.prioridad} onValueChange={(value) => setNewNeed({...newNeed, prioridad: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    placeholder="Observaciones adicionales (opcional)"
                    value={newNeed.observaciones}
                    onChange={(e) => setNewNeed({...newNeed, observaciones: e.target.value})}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingNeed(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddNeed}>
                    Agregar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={handleImprimir}>
            <FilterIcon className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm" onClick={handleImprimir}>
            <PrinterIcon className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar en lista..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro por categoría */}
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las categorías</SelectItem>
                <SelectItem value="Medicamentos">Medicamentos</SelectItem>
                <SelectItem value="Lácteos">Lácteos</SelectItem>
                <SelectItem value="Limpieza">Limpieza</SelectItem>
                <SelectItem value="Alimentos">Alimentos</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por prioridad */}
            <Select value={filtroPrioridad} onValueChange={setFiltroPrioridad}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las prioridades</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por área */}
            <Select value={filtroArea} onValueChange={setFiltroArea}>
              <SelectTrigger>
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las áreas</SelectItem>
                <SelectItem value="Enfermería">Enfermería</SelectItem>
                <SelectItem value="Cocina">Cocina</SelectItem>
                <SelectItem value="Limpieza">Limpieza</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de necesidades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Productos faltantes</span>
            <Button variant="outline" size="sm">
              <SortAscIcon className="h-4 w-4 mr-2" />
              Ordenar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {necesidadesFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangleIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No se encontraron necesidades</h3>
              <p className="text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Producto</th>
                    <th className="text-left p-3 font-medium">Cantidad</th>
                    <th className="text-left p-3 font-medium">Categoría</th>
                    <th className="text-left p-3 font-medium">Área</th>
                    <th className="text-left p-3 font-medium">Prioridad</th>
                    <th className="text-left p-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {necesidadesFiltradas.map((necesidad, index) => (
                    <tr 
                      key={necesidad.id} 
                      className={`border-b hover:bg-muted/50 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                    >
                      <td className="p-3">
                        <div className="font-medium">{necesidad.producto}</div>
                        <div className="text-sm text-muted-foreground">
                          Solicitado: {new Date(necesidad.fecha_solicitud).toLocaleDateString('es-ES')}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-medium">
                          {necesidad.cantidad_solicitada} {necesidad.unidad}
                        </span>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs">
                          {necesidad.categoria}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <span className="text-sm">{necesidad.area}</span>
                      </td>
                      <td className="p-3">
                        {getPrioridadBadge(necesidad.prioridad)}
                      </td>
                      <td className="p-3">
                        {getEstadoBadge(necesidad.estado)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen de necesidades urgentes */}
      {necesidades.filter(n => n.prioridad === "alta").length > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangleIcon className="h-5 w-5" />
              <span>Necesidades urgentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {necesidades.filter(n => n.prioridad === "alta").map((necesidad) => (
                <div key={necesidad.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <span className="font-medium">{necesidad.producto}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      - {necesidad.cantidad_solicitada} {necesidad.unidad}
                    </span>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {necesidad.area}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 