// Cálculos financieros
export const calculateTotal = (items: Array<{ cantidad: number; precio_unitario: number }>): number => {
  return items.reduce((total, item) => total + (item.cantidad * item.precio_unitario), 0)
}

export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0
  return ((newValue - oldValue) / oldValue) * 100
}

export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

// Cálculos de estadísticas
export const calculateAttendancePercentage = (daysWorked: number, totalDays: number): number => {
  if (totalDays === 0) return 0
  return Math.round((daysWorked / totalDays) * 100)
}

export const calculateStockStatus = (currentStock: number, minStock: number): 'sin_stock' | 'stock_bajo' | 'en_stock' => {
  if (currentStock === 0) return 'sin_stock'
  if (currentStock <= minStock) return 'stock_bajo'
  return 'en_stock'
}

export const calculateVariation = (currentValue: number, previousValue: number): { value: number; trend: 'ascendente' | 'descendente' | 'estable' } => {
  const variation = calculatePercentageChange(previousValue, currentValue)
  let trend: 'ascendente' | 'descendente' | 'estable' = 'estable'
  
  if (Math.abs(variation) > 5) { // Consideramos cambio significativo > 5%
    trend = variation > 0 ? 'ascendente' : 'descendente'
  }
  
  return { value: variation, trend }
}

// Cálculos para gráficos
export const normalizeChartData = (data: number[], maxHeight: number = 100): number[] => {
  const max = Math.max(...data)
  if (max === 0) return data.map(() => 0)
  
  return data.map(value => Math.max((value / max) * maxHeight, 6)) // Mínimo 6px de altura
}

export const calculateChartDimensions = (containerWidth: number, dataPoints: number, padding: number = 20): { barWidth: number; spacing: number } => {
  const availableWidth = containerWidth - (padding * 2)
  const totalSpacing = (dataPoints - 1) * 4 // 4px entre barras
  const barWidth = Math.max((availableWidth - totalSpacing) / dataPoints, 8) // Mínimo 8px por barra
  
  return {
    barWidth: Math.floor(barWidth),
    spacing: 4
  }
}

// Cálculos de tiempo
export const calculateDaysBetween = (startDate: string | Date, endDate: string | Date): number => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const isOverdue = (dueDate: string | Date): boolean => {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  return due < new Date()
}

// Cálculos de inventario
export const calculateReorderPoint = (dailyUsage: number, leadTimeDays: number, safetyStock: number = 0): number => {
  return Math.ceil((dailyUsage * leadTimeDays) + safetyStock)
}

export const calculateMonthlyConsumption = (weeklyData: number[]): number => {
  return weeklyData.reduce((sum, week) => sum + week, 0) * 4.33 // Promedio de semanas por mes
}

// Funciones de agregación
export const groupBy = <T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const key = keyFn(item)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export const sumBy = <T>(array: T[], valueFn: (item: T) => number): number => {
  return array.reduce((sum, item) => sum + valueFn(item), 0)
}

export const countBy = <T>(array: T[], keyFn: (item: T) => string): Record<string, number> => {
  return array.reduce((counts, item) => {
    const key = keyFn(item)
    counts[key] = (counts[key] || 0) + 1
    return counts
  }, {} as Record<string, number>)
} 