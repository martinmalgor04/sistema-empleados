'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowLeftIcon, 
  PlusIcon,
  EditIcon,
  TrashIcon,
  SettingsIcon,
  TagIcon,
  MapPinIcon
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Category {
  id: number
  name: string
  color: string
  description: string
}

interface Area {
  id: number
  name: string
  description: string
  manager: string
}

export default function ConfiguracionComprasPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Medicamentos", color: "bg-blue-100 text-blue-800", description: "Productos farmacéuticos" },
    { id: 2, name: "Alimentos", color: "bg-green-100 text-green-800", description: "Productos alimentarios" },
    { id: 3, name: "Lácteos", color: "bg-yellow-100 text-yellow-800", description: "Productos lácteos" },
    { id: 4, name: "Limpieza", color: "bg-purple-100 text-purple-800", description: "Productos de limpieza" },
    { id: 5, name: "Oficina", color: "bg-gray-100 text-gray-800", description: "Material de oficina" },
  ])

  const [areas, setAreas] = useState<Area[]>([
    { id: 1, name: "Enfermería", description: "Área de enfermería y cuidados médicos", manager: "Ana García" },
    { id: 2, name: "Cocina", description: "Área de preparación de alimentos", manager: "Carlos López" },
    { id: 3, name: "Limpieza", description: "Área de mantenimiento y limpieza", manager: "María Rodríguez" },
    { id: 4, name: "Administración", description: "Área administrativa", manager: "Juan Pérez" },
  ])

  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isAddingArea, setIsAddingArea] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", color: "bg-blue-100 text-blue-800", description: "" })
  const [newArea, setNewArea] = useState({ name: "", description: "", manager: "" })

  const colorOptions = [
    { value: "bg-blue-100 text-blue-800", label: "Azul" },
    { value: "bg-green-100 text-green-800", label: "Verde" },
    { value: "bg-yellow-100 text-yellow-800", label: "Amarillo" },
    { value: "bg-purple-100 text-purple-800", label: "Morado" },
    { value: "bg-red-100 text-red-800", label: "Rojo" },
    { value: "bg-gray-100 text-gray-800", label: "Gris" },
  ]

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({
        title: "Error",
        description: "El nombre de la categoría es requerido",
        variant: "destructive"
      })
      return
    }

    const category: Category = {
      id: categories.length + 1,
      ...newCategory
    }

    setCategories([...categories, category])
    setNewCategory({ name: "", color: "bg-blue-100 text-blue-800", description: "" })
    setIsAddingCategory(false)
    
    toast({
      title: "Categoría agregada",
      description: `La categoría "${category.name}" ha sido creada exitosamente`,
    })
  }

  const handleAddArea = () => {
    if (!newArea.name) {
      toast({
        title: "Error",
        description: "El nombre del área es requerido",
        variant: "destructive"
      })
      return
    }

    const area: Area = {
      id: areas.length + 1,
      ...newArea
    }

    setAreas([...areas, area])
    setNewArea({ name: "", description: "", manager: "" })
    setIsAddingArea(false)
    
    toast({
      title: "Área agregada",
      description: `El área "${area.name}" ha sido creada exitosamente`,
    })
  }

  const handleDeleteCategory = (id: number) => {
    const categoryName = categories.find(c => c.id === id)?.name
    setCategories(categories.filter(c => c.id !== id))
    toast({
      title: "Categoría eliminada",
      description: `La categoría "${categoryName}" ha sido eliminada`,
    })
  }

  const handleDeleteArea = (id: number) => {
    const areaName = areas.find(a => a.id === id)?.name
    setAreas(areas.filter(a => a.id !== id))
    toast({
      title: "Área eliminada",
      description: `El área "${areaName}" ha sido eliminada`,
    })
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
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <SettingsIcon className="h-6 w-6" />
              Configuración de Compras
            </h1>
            <p className="text-muted-foreground">
              Gestión de categorías y áreas para el sistema de compras
            </p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TagIcon className="h-5 w-5" />
                Categorías de Productos
              </CardTitle>
              <CardDescription>
                Administra las categorías para clasificar los productos
              </CardDescription>
            </div>
            <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Agregar Categoría
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nueva Categoría</DialogTitle>
                  <DialogDescription>
                    Crea una nueva categoría para clasificar productos
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Nombre</Label>
                    <Input
                      id="categoryName"
                      placeholder="Nombre de la categoría"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryColor">Color</Label>
                    <Select value={newCategory.color} onValueChange={(value) => setNewCategory({...newCategory, color: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded ${option.value.split(' ')[0]}`}></div>
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryDescription">Descripción</Label>
                    <Input
                      id="categoryDescription"
                      placeholder="Descripción de la categoría"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddCategory}>
                      Agregar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={category.color}>
                      {category.name}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Areas Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                Áreas de Trabajo
              </CardTitle>
              <CardDescription>
                Administra las áreas donde se utilizan los productos
              </CardDescription>
            </div>
            <Dialog open={isAddingArea} onOpenChange={setIsAddingArea}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Agregar Área
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nueva Área</DialogTitle>
                  <DialogDescription>
                    Crea una nueva área de trabajo
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="areaName">Nombre</Label>
                    <Input
                      id="areaName"
                      placeholder="Nombre del área"
                      value={newArea.name}
                      onChange={(e) => setNewArea({...newArea, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="areaDescription">Descripción</Label>
                    <Input
                      id="areaDescription"
                      placeholder="Descripción del área"
                      value={newArea.description}
                      onChange={(e) => setNewArea({...newArea, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="areaManager">Responsable</Label>
                    <Input
                      id="areaManager"
                      placeholder="Nombre del responsable"
                      value={newArea.manager}
                      onChange={(e) => setNewArea({...newArea, manager: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingArea(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddArea}>
                      Agregar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {areas.map((area) => (
              <Card key={area.id} className="border-l-4 border-l-secondary">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{area.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteArea(area.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{area.description}</p>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Responsable: </span>
                    {area.manager}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}