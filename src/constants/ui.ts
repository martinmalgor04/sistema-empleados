// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
  MAX_PAGE_SIZE: 100,
} as const

// Estados y badges
export const STATUS_VARIANTS = {
  ACTIVE: 'default',
  INACTIVE: 'secondary', 
  PENDING: 'outline',
  ERROR: 'destructive',
  SUCCESS: 'default',
} as const

export const PRIORITY_COLORS = {
  baja: 'bg-blue-100 text-blue-800 border-blue-300',
  media: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  alta: 'bg-orange-100 text-orange-800 border-orange-300',
  urgente: 'bg-red-100 text-red-800 border-red-300',
} as const

export const CATEGORY_COLORS = {
  Medicamentos: 'bg-blue-100 text-blue-800 border-blue-300',
  Alimentos: 'bg-green-100 text-green-800 border-green-300',
  Lácteos: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Limpieza: 'bg-purple-100 text-purple-800 border-purple-300',
  Oficina: 'bg-gray-100 text-gray-800 border-gray-300',
  Mantenimiento: 'bg-orange-100 text-orange-800 border-orange-300',
} as const

// Configuración de formularios
export const FORM_VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_TEXT_LENGTH: 255,
  MAX_TEXTAREA_LENGTH: 1000,
  PHONE_PATTERN: /^\+?[1-9]\d{1,14}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  DNI_PATTERN: /^\d{8}[A-Z]?$/,
} as const

// Mensajes de la aplicación
export const MESSAGES = {
  ERRORS: {
    GENERIC: 'Ha ocurrido un error inesperado',
    NETWORK: 'Error de conexión. Por favor intenta de nuevo',
    NOT_FOUND: 'El recurso solicitado no fue encontrado',
    UNAUTHORIZED: 'No tienes permisos para realizar esta acción',
    VALIDATION: 'Por favor revisa los datos ingresados',
  },
  SUCCESS: {
    CREATED: 'Creado exitosamente',
    UPDATED: 'Actualizado exitosamente', 
    DELETED: 'Eliminado exitosamente',
    SAVED: 'Guardado exitosamente',
  },
  LOADING: {
    DEFAULT: 'Cargando...',
    SAVING: 'Guardando...',
    DELETING: 'Eliminando...',
  },
} as const

// Configuración de notificaciones
export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
} as const 