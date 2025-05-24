import { BaseEntity } from './common'

export type PurchaseArea = 'farmacia' | 'cocina' | 'limpieza' | 'administracion' | 'mantenimiento'
export type PurchaseCategory = 'Medicamentos' | 'Alimentos' | 'Lácteos' | 'Limpieza' | 'Oficina' | 'Mantenimiento'
export type PurchasePriority = 'baja' | 'media' | 'alta' | 'urgente'

export interface PurchaseProduct {
  id: number
  nombre: string
  categoria: PurchaseCategory
  cantidad: number
  precio_unitario: number
  precio_total: number
}

export interface Purchase extends BaseEntity {
  id: number
  fecha: string
  hora: string
  area: PurchaseArea
  local_vendedor: string
  productos: PurchaseProduct[]
  categoria_predominante: PurchaseCategory
  total: number
  comprobante?: string
  estado: 'recibida' | 'pendiente' | 'cancelada'
  observaciones?: string
}

export interface PurchaseNeed extends BaseEntity {
  id: number
  producto: string
  categoria: PurchaseCategory
  cantidad_necesaria: number
  cantidad_disponible: number
  area: PurchaseArea
  prioridad: PurchasePriority
  estado: 'pendiente' | 'comprado' | 'cancelado'
  fecha_solicitud: string
  observaciones?: string
}

export interface PurchaseOrder {
  id: number
  productos_ids: number[]
  fecha_pedido: string
  fecha_estimada: string
  estado: 'pendiente' | 'en_transito' | 'recibido' | 'cancelado'
  proveedor: string
  total_estimado: number
}

export interface PurchaseStatistics {
  area: PurchaseArea
  gasto_mensual: number
  cantidad_compras: number
  productos_mas_comprados: Array<{
    producto: string
    cantidad: number
    total_gastado: number
  }>
  tendencia_gasto: 'ascendente' | 'descendente' | 'estable'
}

// Formularios
export interface CreatePurchaseData {
  area: PurchaseArea
  local_vendedor: string
  productos: Array<{
    nombre: string
    categoria: PurchaseCategory
    cantidad: number
    precio_unitario: number
  }>
  fecha: string
  hora: string
  comprobante?: string
  observaciones?: string
}

export interface PurchaseFilter {
  area?: PurchaseArea
  categoria?: PurchaseCategory
  fecha_desde?: string
  fecha_hasta?: string
  estado?: Purchase['estado']
  search?: string
} 