import React, { useState } from 'react'
import { cn } from '@/utils/cn'

export const ALBARQ_LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC-iuv__1A5HSnrlzChp-IHLKLzCAYPD01Py9MbSOGlKeaysnwOYWFuEZ921HsuhH-kZRvZaTBSiDgWXxC_xgHDsBzilwXAN4be03cy-wwJZ5PidbexAf8C679d4_94Jpo7SWpo7sCR2NIgn3rQHfbALyo1IIwublPdnRy7q4Zg4Sx6suim-gN6qeAdR0FnQkBxfDj4FpzNfCCPeg2ddV5C_YGMBJmgv1hi6W3eOT7Ab70PLOoZLH8JWERCGTiEqeFy0SvlPHwrnQ'

export const ALBARQ_LOGO_FALLBACK = '/albarq-logo.jpg'

export interface BrandLogoProps {
  /** Optional subtitle below system name (e.g. "لوحة التحكم", "لوحة المهندس") */
  subtitle?: string
  /** Whether the parent sidebar is collapsed */
  collapsed?: boolean
  /** Size variant for image logo */
  size?: 'sm' | 'md' | 'lg'
  /** Custom container class */
  className?: string
  /** Text orientation / RTL override */
  isRTL?: boolean
  /** Dark mode / Light mode text color variant */
  variant?: 'light' | 'dark'
}

export function BrandLogo({
  subtitle,
  collapsed = false,
  size = 'md',
  className,
  isRTL = true,
  variant = 'light',
}: BrandLogoProps) {
  const [imgSrc, setImgSrc] = useState<string>(ALBARQ_LOGO_URL)

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  const handleImageError = () => {
    if (imgSrc !== ALBARQ_LOGO_FALLBACK) {
      setImgSrc(ALBARQ_LOGO_FALLBACK)
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 shrink-0 select-none',
        collapsed ? 'justify-center' : isRTL ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      {/* Official Al-Barq Image Logo */}
      <div
        className={cn(
          'rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-white/95 p-1 shadow-sm border border-white/20',
          sizeClasses[size]
        )}
      >
        <img
          src={imgSrc}
          alt="شعار نظام البرق"
          onError={handleImageError}
          className="w-full h-full object-contain"
        />
      </div>

      {/* System Name & Subtitle */}
      {!collapsed && (
        <div className={cn('min-w-0', isRTL ? 'text-right' : 'text-left')}>
          <p
            className={cn(
              'font-extrabold text-sm leading-tight truncate',
              variant === 'light' ? 'text-white' : 'text-primary'
            )}
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            نظام البرق
          </p>
          {subtitle && (
            <p
              className={cn(
                'text-xs leading-tight truncate mt-0.5 font-medium',
                variant === 'light' ? 'text-white/70' : 'text-text-muted'
              )}
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
