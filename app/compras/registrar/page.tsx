'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeftIcon, 
  ChevronRightIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
  CalendarIcon,
  ClockIcon,
  UploadIcon
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import comprasData from "@/data/compras.json"

interface ProductoSeleccionado {
  id: number
  nombre: string
  categoria: string
  area: string
  prioridad: string
  cantidad_solicitada: number
  unidad: string
  cantidad_comprada?: number
  precio_unitario?: number
  subtotal?: number
}

export default function RegistrarCompraPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [paso, setPaso] = useState(1)
  const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([])
  const [datosGenerales, setDatosGenerales] = useState({
    localVendedor: "",
    fecha: "",
    hora: "",
    estado: "recibida" as "recibida" | "pendiente",
    fechaEntrega: "",
    comprobante: null as File | null
  })

  const { necesidades } = comprasData

  const toggleProducto = (necesidad: any, isSelected: boolean) => {
    if (isSelected) {
      setProductosSeleccionados([...productosSeleccionados, {
        id: necesidad.id,
        nombre: necesidad.producto,
        categoria: necesidad.categoria,
        area: necesidad.area,
        prioridad: necesidad.prioridad,
        cantidad_solicitada: necesidad.cantidad_solicitada,
        unidad: necesidad.unidad
      }])
    } else {
      setProductosSeleccionados(productosSeleccionados.filter(p => p.id !== necesidad.id))
    }
  }

  const updateProductoCantidadYPrecio = (id: number, cantidad: number, precio: number) => {
    setProductosSeleccionados(productos => 
      productos.map(p => 
        p.id === id 
          ? { ...p, cantidad_comprada: cantidad, precio_unitario: precio, subtotal: cantidad * precio }
          : p
      )
    )
  }

  const calcularTotal = () => {
    return productosSeleccionados.reduce((total, p) => total + (p.subtotal || 0), 0)
  }

  const handleSiguiente = () => {
    if (paso === 1 && productosSeleccionados.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos un producto para continuar",
        variant: "destructive"
      })
      return
    }
    if (paso === 2 && productosSeleccionados.some(p => !p.cantidad_comprada || !p.precio_unitario)) {
      toast({
        title: "Error", 
        description: "Completa cantidad y precio para todos los productos",
        variant: "destructive"
      })
      return
    }
    if (paso === 3 && (!datosGenerales.localVendedor || !datosGenerales.fecha)) {
      toast({
        title: "Error",
        description: "Completa los datos generales obligatorios",
        variant: "destructive"
      })
      return
    }
    setPaso(paso + 1)
  }

  const handleRegistrar = () => {
    toast({
      title: "¡Compra registrada exitosamente!",
      description: `Se registraron ${productosSeleccionados.length} productos por un total de ${formatCurrency(calcularTotal())}`,
    })
    setPaso(5)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const handleComprobanteUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setDatosGenerales({ ...datosGenerales, comprobante: file })
    }
  }

  if (paso === 5) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-6">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircleIcon className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">¡Compra registrada exitosamente!</h2>
              <p className="text-muted-foreground">
                Se registraron {productosSeleccionados.length} productos por un total de {formatCurrency(calcularTotal())}
              </p>
            </div>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => {
                // Reset form
                setPaso(1)
                setProductosSeleccionados([])
                setDatosGenerales({
                  localVendedor: "",
                  fecha: "",
                  hora: "",
                  estado: "recibida",
                  fechaEntrega: "",
                  comprobante: null
                })
              }}>
                Registrar otra compra
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push("/compras")}>
                Volver al Menú de Compras
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Registro de compra</h1>
          <p className="text-muted-foreground">Paso {paso} de 4</p>
        </div>
        <div className="w-20" />
      </div>

      {/* Indicador de progreso */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              stepNumber === paso 
                ? 'bg-primary text-primary-foreground' 
                : stepNumber < paso 
                  ? 'bg-green-500 text-white' 
                  : 'bg-muted text-muted-foreground'
            }`}>
              {stepNumber < paso ? <CheckCircleIcon className="h-5 w-5" /> : stepNumber}
            </div>
            {stepNumber < 4 && (
              <div className={`w-8 h-1 mx-2 ${stepNumber < paso ? 'bg-green-500' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Paso 1: Selección de Productos */}
      {paso === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Paso 1: Selección de Productos</CardTitle>
            <CardDescription>
              Seleccione las necesidades en estado faltante correspondientes a la compra a registrar. 
              Cuando hayas terminado, selecciona 'Siguiente'.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 w-12"></th>
                    <th className="text-left p-3 font-medium">Producto</th>
                    <th className="text-left p-3 font-medium">Cant. solicitada</th>
                    <th className="text-left p-3 font-medium">Categoría</th>
                    <th className="text-left p-3 font-medium">Área</th>
                    <th className="text-left p-3 font-medium">Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  {necesidades.map((necesidad) => (
                    <tr key={necesidad.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <Checkbox
                          checked={productosSeleccionados.some(p => p.id === necesidad.id)}
                          onCheckedChange={(checked) => toggleProducto(necesidad, checked as boolean)}
                        />
                      </td>
                      <td className="p-3 font-medium">{necesidad.producto}</td>
                      <td className="p-3">{necesidad.cantidad_solicitada} {necesidad.unidad}</td>
                      <td className="p-3">{necesidad.categoria}</td>
                      <td className="p-3">{necesidad.area}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          necesidad.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                          necesidad.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {necesidad.prioridad.charAt(0).toUpperCase() + necesidad.prioridad.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={handleSiguiente}>
                Siguiente
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paso 2: Montos y cantidades */}
      {paso === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Paso 2: Montos y cantidades</CardTitle>
            <CardDescription>
              Para cada producto, ingrese la cantidad comprada y el subtotal correspondiente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Producto</th>
                    <th className="text-left p-3 font-medium">Cant. comprada / Cant. solicitada</th>
                    <th className="text-left p-3 font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {productosSeleccionados.map((producto) => (
                    <tr key={producto.id} className="border-b">
                      <td className="p-3 font-medium">{producto.nombre}</td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            placeholder="0"
                            className="w-20"
                            value={producto.cantidad_comprada || ""}
                            onChange={(e) => {
                              const cantidad = parseFloat(e.target.value) || 0
                              updateProductoCantidadYPrecio(producto.id, cantidad, producto.precio_unitario || 0)
                            }}
                          />
                          <span className="text-sm text-muted-foreground">
                            {producto.unidad} / {producto.cantidad_solicitada} {producto.unidad}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <span>$</span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            className="w-32"
                            value={producto.subtotal || ""}
                            onChange={(e) => {
                              const subtotal = parseFloat(e.target.value) || 0
                              const cantidad = producto.cantidad_comprada || 1
                              const precio = cantidad > 0 ? subtotal / cantidad : 0
                              updateProductoCantidadYPrecio(producto.id, cantidad, precio)
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-6">
              <Button variant="outline" onClick={() => setPaso(paso - 1)}>
                Volver
              </Button>
              <div className="text-lg font-semibold">
                Total: {formatCurrency(calcularTotal())}
              </div>
              <Button onClick={handleSiguiente}>
                Siguiente
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paso 3: Datos generales */}
      {paso === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Paso 3: Datos generales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="local">Local/Vendedor:</Label>
                <Input
                  id="local"
                  placeholder="Nombre del vendedor..."
                  value={datosGenerales.localVendedor}
                  onChange={(e) => setDatosGenerales({...datosGenerales, localVendedor: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha de la compra:</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="fecha"
                    type="date"
                    value={datosGenerales.fecha}
                    onChange={(e) => setDatosGenerales({...datosGenerales, fecha: e.target.value})}
                  />
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora">Hora (aprox.):</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="hora"
                    type="time"
                    value={datosGenerales.hora}
                    onChange={(e) => setDatosGenerales({...datosGenerales, hora: e.target.value})}
                  />
                  <ClockIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Estado:</Label>
              <RadioGroup 
                value={datosGenerales.estado} 
                onValueChange={(value: "recibida" | "pendiente") => setDatosGenerales({...datosGenerales, estado: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recibida" id="recibida" />
                  <Label htmlFor="recibida">Recibida</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pendiente" id="pendiente" />
                  <Label htmlFor="pendiente">Pendiente</Label>
                </div>
              </RadioGroup>

              {datosGenerales.estado === "pendiente" && (
                <div className="space-y-2">
                  <Label htmlFor="fechaEntrega">Entrega estimada:</Label>
                  <Input
                    id="fechaEntrega"
                    type="date"
                    value={datosGenerales.fechaEntrega}
                    onChange={(e) => setDatosGenerales({...datosGenerales, fechaEntrega: e.target.value})}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Comprobante de compra:</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleComprobanteUpload}
                  className="hidden"
                  id="comprobante"
                />
                <label htmlFor="comprobante" className="cursor-pointer">
                  <UploadIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {datosGenerales.comprobante 
                      ? `Archivo: ${datosGenerales.comprobante.name}`
                      : "Haz clic para subir comprobante"
                    }
                  </p>
                </label>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setPaso(paso - 1)}>
                Volver
              </Button>
              <Button onClick={handleSiguiente}>
                Siguiente
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paso 4: Confirmar registro */}
      {paso === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Paso 4: Confirmar registro</CardTitle>
            <CardDescription>
              A continuación se muestra un resumen de la compra. Revise los detalles y seleccione 
              <span className="text-red-600 font-medium"> Registrar</span> para registrarla
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">
                Compra en {datosGenerales.localVendedor}, del día {new Date(datosGenerales.fecha).toLocaleDateString('es-ES')} a las {datosGenerales.hora}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Producto</th>
                    <th className="text-left p-3 font-medium">Cantidad</th>
                    <th className="text-left p-3 font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {productosSeleccionados.map((producto) => (
                    <tr key={producto.id} className="border-b">
                      <td className="p-3">{producto.nombre}</td>
                      <td className="p-3">{producto.cantidad_comprada} {producto.unidad}</td>
                      <td className="p-3">{formatCurrency(producto.subtotal || 0)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 font-semibold">
                    <td className="p-3" colSpan={2}>Total</td>
                    <td className="p-3">{formatCurrency(calcularTotal())}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setPaso(paso - 1)}>
                Volver
              </Button>
              <Button onClick={handleRegistrar} className="bg-green-600 hover:bg-green-700">
                Registrar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 