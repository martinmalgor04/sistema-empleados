// Tipos básicos comunes
export interface BaseEntity {
  id: string | number
  created_at?: string
  updated_at?: string
}

// Estados comunes
export type Status = 'active' | 'inactive' | 'pending' | 'suspended'
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Filtros y paginación
export interface FilterParams {
  search?: string
  status?: Status
  category?: string
  page?: number
  limit?: number
}

export interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

// Respuestas de API
export interface ApiResponse<T> {
  data: T
  message?: string
  pagination?: PaginationInfo
}

export interface ApiError {
  message: string
  code?: string | number
  details?: unknown
}

// Props comunes para componentes
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Tipos para formularios
export interface FormFieldError {
  field: string
  message: string
}

export interface FormState<T> {
  data: T
  errors: FormFieldError[]
  isSubmitting: boolean
  isDirty: boolean
} 