'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Clock, LogIn, LogOut, User, Calendar, AlertCircle } from "lucide-react"

interface AttendanceRecord {
  id: string
  employeeName: string
  employeeId: string
  date: string
  clockIn?: string
  clockOut?: string
  status: 'clocked-in' | 'clocked-out' | 'completed'
  totalHours?: number
}

export default function RegistroAsistenciaPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [attendanceStatus, setAttendanceStatus] = useState<'not-started' | 'clocked-in' | 'clocked-out'>('not-started')
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Load current user and today's attendance on mount
  useEffect(() => {
    const loggedInUserString = localStorage.getItem("loggedInUser")
    if (loggedInUserString) {
      try {
        const user = JSON.parse(loggedInUserString)
        setCurrentUser(user)
        loadTodayAttendance(user.dni || user.email)
      } catch (error) {
        console.error("Error parsing logged in user:", error)
        setError("Error al cargar los datos del usuario")
      }
    } else {
      setError("No se encontró usuario logueado")
    }
  }, [])

  const loadTodayAttendance = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0]
    const attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]")
    
    const todayRecord = attendanceRecords.find(
      (record: AttendanceRecord) => record.employeeId === employeeId && record.date === today
    )

    if (todayRecord) {
      setTodayAttendance(todayRecord)
      if (todayRecord.clockIn && !todayRecord.clockOut) {
        setAttendanceStatus('clocked-in')
      } else if (todayRecord.clockOut) {
        setAttendanceStatus('clocked-out')
      }
    }
  }

  const handleClockIn = async () => {
    if (!currentUser) {
      setError("No se encontró usuario logueado")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const now = new Date()
      const today = now.toISOString().split('T')[0]
      const timeString = now.toTimeString().split(' ')[0]

      const newRecord: AttendanceRecord = {
        id: `${currentUser.dni || currentUser.email}_${today}`,
        employeeName: currentUser.nombre,
        employeeId: currentUser.dni || currentUser.email,
        date: today,
        clockIn: timeString,
        status: 'clocked-in'
      }

      const attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]")
      attendanceRecords.push(newRecord)
      localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords))

      setTodayAttendance(newRecord)
      setAttendanceStatus('clocked-in')
      
      toast({
        title: "¡Entrada registrada!",
        description: `Hora de entrada: ${timeString}`,
      })
    } catch (error) {
      console.error("Error registrando entrada:", error)
      setError("Error al registrar la entrada")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClockOut = async () => {
    if (!currentUser || !todayAttendance) {
      setError("No se encontró registro de entrada para hoy")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const now = new Date()
      const timeString = now.toTimeString().split(' ')[0]

      // Calculate total hours
      const clockInTime = new Date(`${todayAttendance.date}T${todayAttendance.clockIn}`)
      const clockOutTime = new Date(`${todayAttendance.date}T${timeString}`)
      const totalHours = Math.round(((clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60)) * 100) / 100

      const updatedRecord: AttendanceRecord = {
        ...todayAttendance,
        clockOut: timeString,
        status: 'completed',
        totalHours
      }

      const attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]")
      const recordIndex = attendanceRecords.findIndex(
        (record: AttendanceRecord) => record.id === todayAttendance.id
      )

      if (recordIndex !== -1) {
        attendanceRecords[recordIndex] = updatedRecord
      } else {
        attendanceRecords.push(updatedRecord)
      }

      localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords))

      setTodayAttendance(updatedRecord)
      setAttendanceStatus('clocked-out')
      
      toast({
        title: "¡Salida registrada!",
        description: `Hora de salida: ${timeString} (Total: ${totalHours}h)`,
      })
    } catch (error) {
      console.error("Error registrando salida:", error)
      setError("Error al registrar la salida")
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!currentUser) {
    return (
      <>
        <Toaster />
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-6">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">Error</CardTitle>
              <CardDescription className="mb-4">
                {error || "No se pudo cargar la información del usuario"}
              </CardDescription>
              <Button onClick={() => router.push("/login")} className="w-full">
                Ir al Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Clock className="h-6 w-6" />
              Registro de Asistencia
            </CardTitle>
            <CardDescription className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <User className="h-4 w-4" />
                Bienvenido, {currentUser.nombre}
              </div>
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(currentTime)}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Time Display */}
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-primary mb-2">
                {formatTime(currentTime)}
              </div>
              <Badge variant="outline" className="text-sm">
                Hora actual
              </Badge>
            </div>

            {/* Today's Attendance Status */}
            {todayAttendance && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-center">Registro de Hoy</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-green-600">Entrada</div>
                    <div className="font-mono">
                      {todayAttendance.clockIn || '-'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-red-600">Salida</div>
                    <div className="font-mono">
                      {todayAttendance.clockOut || '-'}
                    </div>
                  </div>
                </div>
                {todayAttendance.totalHours && (
                  <div className="text-center pt-2 border-t">
                    <Badge variant="secondary">
                      Total trabajado: {todayAttendance.totalHours}h
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {attendanceStatus === 'not-started' && (
                <Button 
                  onClick={handleClockIn}
                  disabled={isLoading}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  {isLoading ? "Registrando..." : "Marcar Entrada"}
                </Button>
              )}

              {attendanceStatus === 'clocked-in' && (
                <Button 
                  onClick={handleClockOut}
                  disabled={isLoading}
                  className="w-full h-12 text-lg"
                  variant="destructive"
                  size="lg"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  {isLoading ? "Registrando..." : "Marcar Salida"}
                </Button>
              )}

              {attendanceStatus === 'clocked-out' && (
                <div className="text-center space-y-3">
                  <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
                  <div>
                    <CardTitle className="text-xl mb-2">¡Jornada Completada!</CardTitle>
                    <CardDescription>
                      Has completado tu jornada laboral de hoy
                    </CardDescription>
                  </div>
                </div>
              )}

              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => router.push("/menu-principal")}
                disabled={isLoading}
              >
                Volver al Menú Principal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// Ícono de ejemplo (puedes usar lucide-react o similar)
function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
} 