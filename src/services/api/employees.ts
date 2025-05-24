import { Employee, CreateEmployeeData, UpdateEmployeeData, AttendanceRecord } from '@/src/types'

// Simulación de API - en un proyecto real esto sería llamadas HTTP
const STORAGE_KEY = 'eldercare-employees'

// Datos ficticios para development
const defaultEmployees: Employee[] = [
  {
    id: "1",
    nombre: "Carmen Ruiz",
    apellido: "González",
    fechaNacimiento: "1985-03-12",
    dni: "12345678A",
    email: "carmen.ruiz@eldercare.com",
    telefono: "+54 9 11 1234-5678",
    rol: "enfermero",
    turno: "mañana",
    estado: "Activo",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "2",
    nombre: "Luis Martínez",
    apellido: "Pérez",
    fechaNacimiento: "1990-07-21",
    dni: "87654321B",
    email: "luis.martinez@eldercare.com", 
    telefono: "+54 9 11 9876-5432",
    rol: "medico",
    turno: "tarde",
    estado: "Activo",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "3",
    nombre: "Ana García",
    apellido: "López",
    fechaNacimiento: "1992-11-02",
    dni: "11223344C",
    email: "ana.garcia@eldercare.com",
    telefono: "+54 9 11 5555-6666",
    rol: "cuidadora",
    turno: "noche",
    estado: "Suspendido",
    avatar: "/placeholder-user.jpg",
  },
]

// Simulación de almacenamiento local
const getStoredEmployees = (): Employee[] => {
  if (typeof window === 'undefined') return defaultEmployees
  
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : defaultEmployees
}

const setStoredEmployees = (employees: Employee[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees))
  }
}

// Servicios de empleados
export const employeeService = {
  // Obtener todos los empleados
  async getAll(): Promise<Employee[]> {
    await new Promise(resolve => setTimeout(resolve, 300)) // Simular delay de API
    return getStoredEmployees()
  },

  // Obtener empleado por ID
  async getById(id: string): Promise<Employee | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const employees = getStoredEmployees()
    return employees.find(emp => emp.id === id) || null
  },

  // Crear nuevo empleado
  async create(data: CreateEmployeeData): Promise<Employee> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const employees = getStoredEmployees()
    const newEmployee: Employee = {
      ...data,
      id: Date.now().toString(),
      estado: "Activo",
      avatar: "/placeholder-user.jpg",
      created_at: new Date().toISOString(),
    }
    
    const updatedEmployees = [...employees, newEmployee]
    setStoredEmployees(updatedEmployees)
    
    return newEmployee
  },

  // Actualizar empleado
  async update(id: string, data: UpdateEmployeeData): Promise<Employee> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const employees = getStoredEmployees()
    const index = employees.findIndex(emp => emp.id === id)
    
    if (index === -1) {
      throw new Error('Empleado no encontrado')
    }

    const updatedEmployee = {
      ...employees[index],
      ...data,
      updated_at: new Date().toISOString(),
    }
    
    employees[index] = updatedEmployee
    setStoredEmployees(employees)
    
    return updatedEmployee
  },

  // Eliminar empleado
  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const employees = getStoredEmployees()
    const filteredEmployees = employees.filter(emp => emp.id !== id)
    setStoredEmployees(filteredEmployees)
  },

  // Suspender/reactivar empleado
  async toggleStatus(id: string): Promise<Employee> {
    const employees = getStoredEmployees()
    const employee = employees.find(emp => emp.id === id)
    
    if (!employee) {
      throw new Error('Empleado no encontrado')
    }

    const newStatus = employee.estado === 'Activo' ? 'Suspendido' : 'Activo'
    return this.update(id, { id, estado: newStatus })
  },

  // Buscar empleados
  async search(query: string): Promise<Employee[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const employees = getStoredEmployees()
    const lowercaseQuery = query.toLowerCase()
    
    return employees.filter(emp => 
      emp.nombre.toLowerCase().includes(lowercaseQuery) ||
      emp.apellido.toLowerCase().includes(lowercaseQuery) ||
      emp.dni.toLowerCase().includes(lowercaseQuery) ||
      emp.email?.toLowerCase().includes(lowercaseQuery)
    )
  },

  // Filtrar por rol
  async filterByRole(role: string): Promise<Employee[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const employees = getStoredEmployees()
    return employees.filter(emp => emp.rol === role)
  }
} 