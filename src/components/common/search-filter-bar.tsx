import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, X } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
}

interface SearchFilterBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  filters?: Array<{
    key: string
    label: string
    value: string
    options: FilterOption[]
    onChange: (value: string) => void
  }>
  onClearFilters?: () => void
  showClearFilters?: boolean
  className?: string
}

export function SearchFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filters = [],
  onClearFilters,
  showClearFilters = false,
  className
}: SearchFilterBarProps) {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      {/* Barra de búsqueda */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtros */}
      {filters.map((filter) => (
        <Select
          key={filter.key}
          value={filter.value}
          onValueChange={filter.onChange}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {/* Botón para limpiar filtros */}
      {showClearFilters && onClearFilters && (
        <Button 
          variant="outline" 
          onClick={onClearFilters}
          className="whitespace-nowrap"
        >
          <X className="h-4 w-4 mr-2" />
          Limpiar
        </Button>
      )}
    </div>
  )
}

export function QuickSearchBar({
  value,
  onChange,
  placeholder = "Buscar...",
  className
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          onClick={() => onChange('')}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
} 