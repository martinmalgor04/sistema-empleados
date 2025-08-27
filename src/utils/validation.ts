import { FORM_VALIDATION } from '@/src/constants/ui'

// Validaciones básicas
export const isRequired = (value: unknown): boolean => {
  if (typeof value === 'string') return value.trim().length > 0
  return value !== null && value !== undefined
}

export const isEmail = (email: string): boolean => {
  return FORM_VALIDATION.EMAIL_PATTERN.test(email)
}

export const isPhone = (phone: string): boolean => {
  return FORM_VALIDATION.PHONE_PATTERN.test(phone)
}

export const isDNI = (dni: string): boolean => {
  // Allow 7-8 digits for DNI (without letter validation for now)
  const dniPattern = /^\d{7,8}$/
  return dniPattern.test(dni.trim())
}

export const isMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength
}

export const isMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength
}

export const isPasswordValid = (password: string): boolean => {
  return password.length >= FORM_VALIDATION.MIN_PASSWORD_LENGTH
}

// Validaciones compuestas
export const validateEmail = (email: string): string | null => {
  if (!isRequired(email)) return 'El email es requerido'
  if (!isEmail(email)) return 'Formato de email inválido'
  if (email.length > 100) return 'El email no puede exceder 100 caracteres'
  return null
}

export const validatePhone = (phone: string): string | null => {
  if (!isRequired(phone)) return 'El teléfono es requerido'
  if (!isPhone(phone)) return 'Formato de teléfono inválido'
  return null
}

export const validateDNI = (dni: string): string | null => {
  if (!isRequired(dni)) return 'El DNI es requerido'
  if (!isDNI(dni)) return 'El DNI debe tener entre 7 y 8 dígitos'
  return null
}

// Validate that email and DNI are different formats
export const validateEmailAndDNI = (email: string, dni: string): string | null => {
  const emailError = validateEmail(email)
  if (emailError) return emailError
  
  const dniError = validateDNI(dni)
  if (dniError) return dniError
  
  // Ensure email is not just DNI + domain
  if (email.startsWith(dni)) {
    return 'El email no puede comenzar con el número de DNI'
  }
  
  return null
}

export const validatePassword = (password: string): string | null => {
  if (!isRequired(password)) return 'La contraseña es requerida'
  if (!isPasswordValid(password)) {
    return `La contraseña debe tener al menos ${FORM_VALIDATION.MIN_PASSWORD_LENGTH} caracteres`
  }
  return null
}

export const validateRequired = (value: unknown, fieldName: string): string | null => {
  if (!isRequired(value)) return `${fieldName} es requerido`
  return null
}

export const validateText = (value: string, fieldName: string, maxLength?: number): string | null => {
  if (!isRequired(value)) return `${fieldName} es requerido`
  if (maxLength && !isMaxLength(value, maxLength)) {
    return `${fieldName} no puede exceder ${maxLength} caracteres`
  }
  return null
}

// Validación de formularios completos
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export const validateForm = (data: Record<string, unknown>, rules: Record<string, (value: unknown) => string | null>): ValidationResult => {
  const errors: Record<string, string> = {}
  
  Object.entries(rules).forEach(([field, validator]) => {
    const error = validator(data[field])
    if (error) {
      errors[field] = error
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Validaciones específicas del dominio
export const validateEmployeeData = (data: any): ValidationResult => {
  const rules = {
    nombre: (value: unknown) => validateText(value as string, 'Nombre'),
    apellido: (value: unknown) => validateText(value as string, 'Apellido'),
    dni: (value: unknown) => validateDNI(value as string),
    email: (value: unknown) => value ? validateEmail(value as string) : null,
    telefono: (value: unknown) => value ? validatePhone(value as string) : null,
    fechaNacimiento: (value: unknown) => validateRequired(value, 'Fecha de nacimiento'),
    rol: (value: unknown) => validateRequired(value, 'Rol'),
  }
  
  return validateForm(data, rules)
} 