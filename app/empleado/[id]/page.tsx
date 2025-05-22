import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Datos de ejemplo para el prototipo
const empleado = {
  id: 1,
  nombre: "Cecilia Ramos",
  dni: "12345678",
  telefono: "+54 9 11 1234-5678",
  email: "cecilia.ramos@email.com",
  cargo: "Enfermera",
  turno: "Mañana",
  avatar: "/placeholder.svg?height=200&width=200",
}

// Datos de ejemplo para el presentismo del empleado actual
const presentismoData = [
  { semana: "01/04/2024 - 07/04/2024", diasTrabajados: 5, ausencias: 0, presentismo: 100 },
  { semana: "08/04/2024 - 14/04/2024", diasTrabajados: 5, ausencias: 1, presentismo: 80 },
  { semana: "15/04/2024 - 21/04/2024", diasTrabajados: 5, ausencias: 0, presentismo: 100 },
  { semana: "22/04/2024 - 28/04/2024", diasTrabajados: 4, ausencias: 1, presentismo: 80 },
  { semana: "29/04/2024 - 05/05/2024", diasTrabajados: 5, ausencias: 2, presentismo: 60 },
]

export default function EmpleadoPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-center items-center relative mb-6">
        <Link href="/" className="absolute left-0">
          <Button variant="ghost" className="p-0 h-auto">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      <div className="flex flex-col items-center mb-6">
        <Avatar className="h-40 w-40 mb-4">
          <AvatarImage src={empleado.avatar || "/placeholder.svg"} alt={empleado.nombre} />
          <AvatarFallback className="text-4xl">{empleado.nombre.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="text-4xl font-bold mb-6">{empleado.nombre}</h1>
      </div>

      <Tabs defaultValue="informacion" className="max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="informacion" className="text-base">
            Información
          </TabsTrigger>
          <TabsTrigger value="historial" className="text-base">
            Historial de tareas
          </TabsTrigger>
          <TabsTrigger value="presentismo" className="text-base">
            Presentismo
          </TabsTrigger>
        </TabsList>
        <TabsContent value="informacion">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Información Personal</h2>
              <div className="grid gap-6 border-b pb-6 mb-6">
                <div className="grid grid-cols-[1fr_2fr] gap-4">
                  <div className="font-medium">DNI</div>
                  <div>{empleado.dni}</div>
                </div>
                <div className="grid grid-cols-[1fr_2fr] gap-4">
                  <div className="font-medium">Teléfono</div>
                  <div>{empleado.telefono}</div>
                </div>
                <div className="grid grid-cols-[1fr_2fr] gap-4">
                  <div className="font-medium">Correo electrónico</div>
                  <div>{empleado.email}</div>
                </div>
                <div className="grid grid-cols-[1fr_2fr] gap-4">
                  <div className="font-medium">Cargo</div>
                  <div>{empleado.cargo}</div>
                </div>
                <div className="grid grid-cols-[1fr_2fr] gap-4">
                  <div className="font-medium">Turno</div>
                  <div>{empleado.turno}</div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline">Editar</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Suspender</Button>
                <Button variant="outline" className="text-blue-600 border-blue-600">
                  Reactivar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="historial">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Historial de tareas</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Tarea</th>
                      <th className="text-left py-3 px-4 font-medium">Fecha</th>
                      <th className="text-left py-3 px-4 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">Administrar medicación</td>
                      <td className="py-3 px-4">16/04/2024</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Asistir con el desayuno</td>
                      <td className="py-3 px-4">14/04/2024</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completa</Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Control de signos vitales</td>
                      <td className="py-3 px-4">12/04/2024</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completa</Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Supervisar paseo</td>
                      <td className="py-3 px-4">16/04/2024</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completa</Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Ayudar con la cena</td>
                      <td className="py-3 px-4">11/04/2024</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completa</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="presentismo">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Informe de presentismo</h2>

              <div className="grid md:grid-cols-[2fr_1fr] gap-4 mb-6">
                <div>
                  <Input type="text" value="01/04/2024 – 31/05/2024" readOnly />
                </div>
                <div>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Descargar
                  </Button>
                </div>
              </div>

              <RadioGroup defaultValue="mensual" className="flex gap-6 mb-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="semanal" id="semanal-perfil" />
                  <Label htmlFor="semanal-perfil">Semanal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mensual" id="mensual-perfil" />
                  <Label htmlFor="mensual-perfil">Mensual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="anual" id="anual-perfil" />
                  <Label htmlFor="anual-perfil">Anual</Label>
                </div>
              </RadioGroup>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Semana</th>
                      <th className="text-left py-3 px-4 font-medium">Días trabajados</th>
                      <th className="text-left py-3 px-4 font-medium">Ausencias</th>
                      <th className="text-left py-3 px-4 font-medium">% Presentismo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {presentismoData.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">{item.semana}</td>
                        <td className="py-3 px-4">{item.diasTrabajados}</td>
                        <td className="py-3 px-4">{item.ausencias}</td>
                        <td className="py-3 px-4">{item.presentismo}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 h-40 relative">
                {/* Gráfico simplificado */}
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center h-full">
                  {presentismoData.map((item, index) => (
                    <div
                      key={index}
                      className="w-12 bg-blue-500 mx-1 rounded-t-sm"
                      style={{
                        height: `${item.presentismo}%`,
                        opacity: item.presentismo === 100 ? 1 : item.presentismo / 100 + 0.3,
                      }}
                    />
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                  <div className="flex w-[calc(16rem)] justify-between text-xs text-muted-foreground">
                    <span>Sem 1</span>
                    <span>Sem 2</span>
                    <span>Sem 3</span>
                    <span>Sem 4</span>
                    <span>Sem 5</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
