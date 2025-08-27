"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Download, Search, Filter, Calendar, CalendarDays } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, subDays, subWeeks, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns"
import { es } from "date-fns/locale"

// Datos de ejemplo para el prototipo
const informeData = [
  { empleado: "Carlos Pérez", cargo: "Enfermero", diasTrabajados: 5, ausencias: 0, presentismo: 100 },
  { empleado: "Ana García", cargo: "Médico", diasTrabajados: 5, ausencias: 0, presentismo: 100 },
  { empleado: "Juan López", cargo: "Cuidador", diasTrabajados: 5, ausencias: 1, presentismo: 80 },
  { empleado: "Laura Torres", cargo: "Terapeuta", diasTrabajados: 5, ausencias: 1, presentismo: 80 },
  { empleado: "David Ramos", cargo: "Enfermero", diasTrabajados: 5, ausencias: 2, presentismo: 60 },
  { empleado: "María Rodríguez", cargo: "Médico", diasTrabajados: 4, ausencias: 1, presentismo: 75 },
  { empleado: "Javier Gómez", cargo: "Cuidador", diasTrabajados: 5, ausencias: 0, presentismo: 100 },
]

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

interface DatePreset {
  label: string
  range: DateRange
}

export default function InformePresentismoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilter, setShowFilter] = useState(false)
  const [filteredData, setFilteredData] = useState(informeData)
  const [filtroActivo, setFiltroActivo] = useState("todos")
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("semanal")
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date()
  })
  const [showStartCalendar, setShowStartCalendar] = useState(false)
  const [showEndCalendar, setShowEndCalendar] = useState(false)

  // Función para filtrar los datos según la búsqueda
  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredData(informeData)
    } else {
      const filtered = informeData.filter((item) => item.empleado.toLowerCase().includes(term.toLowerCase()))
      setFilteredData(filtered)
    }
  }

  // Función para aplicar filtros avanzados
  const applyFilters = (cargo, turnos, estado) => {
    let filtered = [...informeData]

    if (cargo) {
      filtered = filtered.filter((item) => item.cargo === cargo)
    }

    // Aquí se aplicarían más filtros si tuviéramos los datos correspondientes

    setFilteredData(filtered)
    setShowFilter(false)
  }

  // Función para resetear filtros
  const resetFilters = () => {
    setFilteredData(informeData)
    setShowFilter(false)
  }

  // Date range presets
  const datePresets: DatePreset[] = [
    {
      label: "Últimos 7 días",
      range: {
        from: subDays(new Date(), 7),
        to: new Date()
      }
    },
    {
      label: "Últimos 15 días",
      range: {
        from: subDays(new Date(), 15),
        to: new Date()
      }
    },
    {
      label: "Últimos 30 días",
      range: {
        from: subDays(new Date(), 30),
        to: new Date()
      }
    },
    {
      label: "Esta semana",
      range: {
        from: startOfWeek(new Date(), { weekStartsOn: 1 }),
        to: endOfWeek(new Date(), { weekStartsOn: 1 })
      }
    },
    {
      label: "Este mes",
      range: {
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date())
      }
    }
  ]

  const formatDateRange = () => {
    if (!dateRange.from) return "Seleccionar fechas"
    if (!dateRange.to) return format(dateRange.from, "dd/MM/yyyy", { locale: es })
    return `${format(dateRange.from, "dd/MM/yyyy", { locale: es })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: es })}`
  }

  const applyDatePreset = (preset: DatePreset) => {
    setDateRange(preset.range)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-center items-center relative mb-6">
        <Link href="/" className="absolute left-0">
          <Button variant="ghost" className="p-0 h-auto">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-4xl font-bold">Informe de presentismo</h1>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          {/* Buscador y filtros mejorados */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre de empleado..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <Popover open={showFilter} onOpenChange={setShowFilter}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
                    <Filter className="h-4 w-4" />
                    Filtro avanzado
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <h3 className="font-medium text-lg">Filtro avanzado</h3>

                    <div className="grid gap-2">
                      <Label htmlFor="rol">Rol</Label>
                      <Select>
                        <SelectTrigger id="rol">
                          <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enfermero">Enfermero</SelectItem>
                          <SelectItem value="medico">Médico</SelectItem>
                          <SelectItem value="cuidador">Cuidador</SelectItem>
                          <SelectItem value="terapeuta">Terapeuta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Turno</Label>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="turno-dia" />
                          <label
                            htmlFor="turno-dia"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Día
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="turno-tarde" />
                          <label
                            htmlFor="turno-tarde"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Tarde
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="turno-noche" />
                          <label
                            htmlFor="turno-noche"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Noche
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Estado</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="estado-vigente" defaultChecked />
                        <label
                          htmlFor="estado-vigente"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Vigente
                        </label>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="fecha">Fecha</Label>
                      <Input id="fecha" type="date" />
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={resetFilters}>
                        Borrar
                      </Button>
                      <Button size="sm" onClick={() => applyFilters(null, null, null)}>
                        Aplicar
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                className={
                  filtroActivo === "todos"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }
                onClick={() => {
                  setFiltroActivo("todos")
                  setFilteredData(informeData)
                }}
              >
                Todos
              </Button>
              <Button
                className={
                  filtroActivo === "100"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }
                onClick={() => {
                  setFiltroActivo("100")
                  setFilteredData(informeData.filter((item) => item.presentismo === 100))
                }}
              >
                Presentismo 100%
              </Button>
              <Button
                className={
                  filtroActivo === "ausencias"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }
                onClick={() => {
                  setFiltroActivo("ausencias")
                  setFilteredData(informeData.filter((item) => item.ausencias > 0))
                }}
              >
                Con ausencias
              </Button>
            </div>
          </div>

          {/* Selector de fechas mejorado */}
          <div className="space-y-4 mb-6">
            {/* Date Range Selector */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">Rango de fechas</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {formatDateRange()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="flex">
                      {/* Date Presets */}
                      <div className="border-r p-3 space-y-2">
                        <h4 className="font-medium text-sm mb-2">Períodos</h4>
                        {datePresets.map((preset, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            className="w-full justify-start text-sm"
                            onClick={() => applyDatePreset(preset)}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                      {/* Calendar */}
                      <div className="p-3">
                        <CalendarComponent
                          mode="range"
                          defaultMonth={dateRange?.from}
                          selected={dateRange}
                          onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                          numberOfMonths={2}
                          locale={es}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="md:w-auto w-full">
                <Label className="text-sm font-medium mb-2 block invisible">Acciones</Label>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Descargar
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6 items-center">
            <div className="flex items-center gap-6 bg-gray-50 p-3 rounded-md">
              <RadioGroup
                value={periodoSeleccionado}
                onValueChange={setPeriodoSeleccionado}
                className="flex items-center gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="semanal" id="semanal" />
                  <Label htmlFor="semanal" className="cursor-pointer">
                    Semanal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mensual" id="mensual" />
                  <Label htmlFor="mensual" className="cursor-pointer">
                    Mensual
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="anual" id="anual" />
                  <Label htmlFor="anual" className="cursor-pointer">
                    Anual
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700">Generar</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Empleado</th>
                  <th className="text-left py-3 px-4 font-medium">Cargo</th>
                  <th className="text-left py-3 px-4 font-medium">Días trabajados</th>
                  <th className="text-left py-3 px-4 font-medium">Ausencias</th>
                  <th className="text-left py-3 px-4 font-medium">% Presentismo</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{item.empleado}</td>
                    <td className="py-3 px-4">{item.cargo}</td>
                    <td className="py-3 px-4">{item.diasTrabajados}</td>
                    <td className="py-3 px-4">{item.ausencias}</td>
                    <td className="py-3 px-4">{item.presentismo}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">No se encontraron resultados para la búsqueda.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
