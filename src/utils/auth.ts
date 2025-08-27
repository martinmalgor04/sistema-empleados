// Authentication utilities
export interface GeneratedPassword {
  password: string
  strength: 'weak' | 'medium' | 'strong'
}

// Generate a secure password for employee registration
export const generateSecurePassword = (length: number = 12): GeneratedPassword => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  const allChars = uppercase + lowercase + numbers + symbols
  
  let password = ''
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Shuffle the password
  const passwordArray = password.split('')
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]]
  }
  
  const finalPassword = passwordArray.join('')
  
  return {
    password: finalPassword,
    strength: getPasswordStrength(finalPassword)
  }
}

// Evaluate password strength
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)
  const isLongEnough = password.length >= 12
  
  const criteriaCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols, isLongEnough].filter(Boolean).length
  
  if (criteriaCount >= 4) return 'strong'
  if (criteriaCount >= 2) return 'medium'
  return 'weak'
}

// Simulate email sending (in a real app, this would integrate with an email service)
export interface EmailResult {
  success: boolean
  message: string
}

export const sendEmployeeCredentials = async (
  email: string,
  employeeName: string,
  password: string
): Promise<EmailResult> => {
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real implementation, you would integrate with an email service like SendGrid, AWS SES, etc.
  console.log(`Email sent to ${email}`)
  console.log(`Subject: ElderCare - Credenciales de Acceso`)
  console.log(`Body: 
    Hola ${employeeName},
    
    Te damos la bienvenida al sistema ElderCare.
    
    Tus credenciales de acceso son:
    Email: ${email}
    Contraseña temporal: ${password}
    
    Por favor, inicia sesión y cambia tu contraseña en tu primer acceso.
    
    Saludos,
    Equipo ElderCare
  `)
  
  // Simulate 95% success rate
  const success = Math.random() > 0.05
  
  return {
    success,
    message: success 
      ? `Credenciales enviadas exitosamente a ${email}`
      : 'Error al enviar el email. Por favor, intenta nuevamente.'
  }
}

// Hash password for storage (basic implementation)
export const hashPassword = (password: string): string => {
  // In a real app, use bcrypt or similar secure hashing
  // This is just for development/prototype purposes
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString()
}

// Verify password (basic implementation)
export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash
}