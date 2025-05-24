import { BaseEntity } from './common'

export interface Supplier {
  id: number
  nombre: string
  telefono: string
  email: string
}

export interface Medication extends BaseEntity {
  id: number
  nombre: string
  descripcion: string
  cantidad: number
  stock_minimo: number
  costo: number
  estado: 'en_stock' | 'sin_stock' | 'stock_bajo' | 'pedido'
  imagen?: string
  proveedor_principal: Supplier
  proveedores: Supplier[]
  uso_mensual: number[]
  uso_semanal: number[]
  prospecto?: string
  frecuencia_uso: number
}

export interface MedicationOrder {
  id: number
  medicamento_id: number
  medicamento_nombre: string
  cantidad_solicitada: number
  fecha_pedido: string
  fecha_estimada_entrega: string
  estado: 'pendiente' | 'en_transito' | 'recibido' | 'cancelado'
  proveedor: Supplier
  costo_total: number
  observaciones?: string
}

export interface MedicationStatistics {
  medicamento_id: number
  nombre: string
  total_dispensado: number
  promedio_mensual: number
  variacion_porcentual: number
  consumo_mensual: Array<{
    mes: string
    cantidad: number
  }>
  tendencia: 'ascendente' | 'descendente' | 'estable'
}

// Formularios
export interface CreateMedicationData {
  nombre: string
  descripcion: string
  cantidad: number
  stock_minimo: number
  costo: number
  proveedor_principal_id: number
  proveedores_ids: number[]
}

export interface UpdateMedicationData extends Partial<CreateMedicationData> {
  id: number
  estado?: Medication['estado']
}

export interface MedicationFilter {
  search?: string
  estado?: Medication['estado']
  proveedor_id?: number
  stock_bajo?: boolean
} 