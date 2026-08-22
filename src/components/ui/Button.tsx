// ============================================================
// Button — Primary shared button component
// Variants: primary | secondary | ghost | danger | accent
// ============================================================

import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import type { SizeVariant } from '@/types/common'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent' | 'outline'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: ButtonVariant
 size?: SizeVariant
 loading?: boolean
 iconStart?: ReactNode
 iconEnd?: ReactNode
 fullWidth?: boolean
 children?: ReactNode
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
 primary: [
 'text-white border-transparent',
 'hover:opacity-90 active:opacity-80',
 ].join(' '),
 secondary: [
 'border-transparent',
 'hover:opacity-90',
 ].join(' '),
 ghost: [
 'border-transparent bg-transparent',
 'hover:bg-gray-100 active:bg-gray-200',
 ].join(' '),
 outline: [
 'bg-transparent',
 'hover:bg-gray-50',
 ].join(' '),
 danger: [
 'text-white border-transparent',
 'hover:opacity-90',
 ].join(' '),
 accent: [
 'border-transparent',
 'hover:opacity-90',
 ].join(' '),
}

const SIZE_STYLES: Record<SizeVariant, string> = {
 sm: 'h-8 px-3 text-xs gap-1.5',
 md: 'h-10 px-4 text-sm gap-2',
 lg: 'h-12 px-6 text-base gap-2.5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
 (
 {
 variant = 'primary',
 size = 'md',
 loading = false,
 iconStart,
 iconEnd,
 fullWidth = false,
 className,
 children,
 disabled,
 ...rest
 },
 ref,
 ) => {
 const isDisabled = disabled || loading

 // Inline style map for color variants (uses CSS vars from design system)
 const inlineStyles: Record<ButtonVariant, React.CSSProperties> = {
 primary: { background: 'var(--color-primary)', color: 'white' },
 secondary: { background: 'var(--color-surface-container)', color: 'var(--color-text)' },
 ghost: { color: 'var(--color-text-muted)' },
 outline: { borderColor: 'var(--color-border)', color: 'var(--color-text)' },
 danger: { background: 'var(--color-danger)', color: 'white' },
 accent: { background: 'var(--color-accent)', color: 'var(--color-on-accent)' },
 }

 return (
 <button
 ref={ref}
 disabled={isDisabled}
 className={cn(
 // Base
 'inline-flex items-center justify-center font-semibold rounded-lg',
 'border transition-all duration-200 select-none whitespace-nowrap',
 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
 // Size
 SIZE_STYLES[size],
 // Variant
 VARIANT_STYLES[variant],
 // Full width
 fullWidth && 'w-full',
 // Disabled
 isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
 className,
 )}
 style={inlineStyles[variant]}
 aria-busy={loading}
 {...rest}
 >
 {/* Loading spinner */}
 {loading && (
 <span
 className="w-4 h-4 border-2 rounded-full animate-spin shrink-0"
 style={{ borderColor: 'currentColor transparent transparent transparent' }}
 aria-hidden="true"
 />
 )}

 {/* Icon start (hidden while loading) */}
 {!loading && iconStart && (
 <span className="shrink-0" aria-hidden="true">
 {iconStart}
 </span>
 )}

 {/* Label */}
 {children}

 {/* Icon end */}
 {iconEnd && (
 <span className="shrink-0" aria-hidden="true">
 {iconEnd}
 </span>
 )}
 </button>
 )
 },
)

Button.displayName = 'Button'
