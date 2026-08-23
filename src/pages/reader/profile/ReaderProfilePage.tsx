import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { User, Mail, Shield, Key } from 'lucide-react'

export function ReaderProfilePage() {
  const { user } = useAuth()
  const { isRTL } = useLanguage()

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto pb-12 animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text mb-1">الملف الشخصي للقارئ</h1>
        <p className="text-sm text-text-muted">معلومات الحساب والصلاحيات الخاصة بك</p>
      </div>

      {/* User Info Card */}
      <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() ?? 'R'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">{user?.name || 'قارئ العدادات'}</h2>
            <p className="text-sm text-text-muted mt-1">{user?.email || 'reader@system.com'}</p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mt-2">
              <Shield size={14} />
              {user?.role ? `الدور: ${user.role}` : 'دور القارئ (Reader)'}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 p-4 bg-surface-container/30 rounded-xl border border-border/50">
            <User className="text-primary shrink-0" size={20} />
            <div>
              <p className="text-xs text-text-muted">الاسم الكامل</p>
              <p className="text-sm font-semibold text-text mt-0.5">{user?.name || 'قارئ العدادات'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-surface-container/30 rounded-xl border border-border/50">
            <Mail className="text-primary shrink-0" size={20} />
            <div>
              <p className="text-xs text-text-muted">البريد الإلكتروني</p>
              <p className="text-sm font-semibold text-text mt-0.5">{user?.email || 'reader@system.com'}</p>
            </div>
          </div>
        </div>

        {/* Permissions List */}
        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-bold text-text mb-3 flex items-center gap-2">
            <Key size={18} className="text-primary" />
            الصلاحيات المعينة للحساب (Spatie Permissions)
          </h3>
          <div className="flex flex-wrap gap-2">
            {(user?.permissions && user.permissions.length > 0
              ? user.permissions
              : ['meter_readings.view', 'meter_readings.create', 'meters.view', 'equipment.view', 'service_requests.view', 'service_requests.create']
            ).map((perm, idx) => (
              <span key={idx} className="px-3 py-1 bg-surface-container text-text-muted rounded-lg text-xs font-mono border border-border/40">
                {perm}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
