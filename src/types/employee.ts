import { BaseEntity, Status } from './common'

export type EmployeeRole = 'supervisor' | 'enfermero' | 'medico' | 'cuidadora'
export type WorkShift = 'mañana' | 'tarde' | 'noche'

export interface Employee extends BaseEntity {
  id: string
  nombre: string
  apellido: string
  dni: string
  email?: string
  telefono?: string
  fechaNacimiento: string
  rol: EmployeeRole
  turno?: WorkShift
  estado: 'Activo' | 'Suspendido' | 'Inactivo'
  avatar?: string
}

export interface AttendanceRecord {
  id: string
  empleadoId: string
  fecha: string
  hora_entrada?: string
  hora_salida?: string
  estado: 'presente' | 'ausente' | 'tardanza' | 'justificado'
  observaciones?: string
}

export interface EmployeeTask {
  id: string
  empleadoId: string
  tarea: string
  fecha: string
  estado: 'pendiente' | 'completa' | 'cancelada'
}

export interface EmployeeStatistics {
  empleadoId: string
  semana: string
  diasTrabajados: number
  ausencias: number
  presentismo: number
}

// Formularios
export interface CreateEmployeeData {
  nombre: string
  apellido: string
  dni: string
  email?: string
  telefono?: string
  fechaNacimiento: string
  rol: EmployeeRole
  turno?: WorkShift
}

export interface UpdateEmployeeData extends Partial<CreateEmployeeData> {
  id: string
  estado?: Employee['estado']
} 