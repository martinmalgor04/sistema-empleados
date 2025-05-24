// Rutas principales de la aplicación
export const ROUTES = {
  // Autenticación
  LOGIN: '/login',
  FORGOT_PASSWORD: '/olvide-contrasena',
  TERMS: '/terminos-y-condiciones',
  
  // Dashboard
  DASHBOARD: '/menu-principal',
  
  // Empleados
  EMPLOYEES: '/empleados',
  EMPLOYEE_DETAIL: (id: string) => `/empleado/${id}`,
  EMPLOYEE_REGISTER: '/registro-empleados',
  ATTENDANCE: '/registro-asistencia',
  ATTENDANCE_REPORT: '/informe-presentismo',
  
  // Medicamentos
  MEDICATIONS: '/menu-medicamentos',
  MEDICATION_DETAIL: (id: string) => `/menu-medicamentos/${id}`,
  
  // Compras
  PURCHASES: '/compras',
  PURCHASE_DETAIL: (id: string) => `/compras/${id}`,
  PURCHASE_NEEDS: '/compras/necesidades',
  PURCHASE_REGISTER: '/compras/registrar',
  PURCHASE_HISTORY: '/compras/historial',
  PURCHASE_ORDERS: '/compras/pedidos',
  
  // Perfil
  PROFILE: '/perfil',
} as const

// Rutas que requieren autenticación
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.EMPLOYEES,
  ROUTES.MEDICATIONS,
  ROUTES.PURCHASES,
  ROUTES.PROFILE,
  ROUTES.ATTENDANCE,
] as const

// Rutas públicas
export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.TERMS,
] as const

// Rutas por roles
export const SUPERVISOR_ROUTES = [
  ROUTES.EMPLOYEES,
  ROUTES.EMPLOYEE_REGISTER,
  ROUTES.PURCHASES,
  ROUTES.ATTENDANCE_REPORT,
] as const

export const EMPLOYEE_ROUTES = [
  ROUTES.MEDICATIONS,
  ROUTES.ATTENDANCE,
] as const 