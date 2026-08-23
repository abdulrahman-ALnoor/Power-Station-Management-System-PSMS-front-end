export type EmployeeStatus = 'active' | 'inactive'

export interface Employee {
 id: string
 name: string
 email: string
 phone: string
 status: EmployeeStatus
 roles?: string[]
 permissions?: EmployeePermission[]
 equipment?: EmployeeEquipment[]
}

export interface EmployeePermission {
 id: string
 nameKey: string // for i18n
 active: boolean
}

export interface EmployeeEquipment {
 id: string
 type: 'laptop' | 'smartphone' | 'car_repair' | string
 nameKey: string // for i18n
}

export interface EmployeeStat {
 id: string
 labelKey: string
 value: string | number
 subtextKey: string
 icon: string
 variant: 'primary' | 'steel-blue' | 'bright-gold' | 'secondary-container' | 'primary-container'
 trend?: {
 value: number | string
 type: 'up' | 'down' | 'neutral'
 labelKey?: string
 }
}

export interface PermissionGroup {
 id: string
 titleKey: string
 icon: string
 items: PermissionItem[]
}

export interface PermissionItem {
 id: string
 textKey: string
 granted: boolean
}
