import React from 'react'
import { useTranslation } from 'react-i18next'
import { Phone } from 'lucide-react'
import { CompanyProfile } from '../types'

interface CompanyContactSectionProps {
 data: CompanyProfile
 onChange: (field: keyof CompanyProfile, value: any) => void
}

export function CompanyContactSection({ data, onChange }: CompanyContactSectionProps) {
 const { t } = useTranslation('settings')

 return (
 <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-border">
 <div className="flex items-center gap-3 mb-8">
 <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
 <Phone size={22} />
 </div>
 <h3 className="font-headline-sm font-bold text-text-primary ">
 {t('sections.contactInfo')}
 </h3>
 </div>

 <div className="grid grid-cols-1 gap-6">
 <div className="space-y-2">
 <label htmlFor="whatsapp_number" className="block text-label-md font-bold text-text-primary ">
 {t('fields.whatsappNumber')}
 </label>
 <input
 id="whatsapp_number"
 type="tel"
 value={data.whatsapp_number || ''}
 onChange={(e) => onChange('whatsapp_number', e.target.value)}
 placeholder={t('placeholders.whatsappNumber')}
 maxLength={30}
 dir="ltr"
 className="w-full px-4 py-3 rounded-xl border border-border bg-surface-low text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow placeholder:text-text-muted text-start"
 />
 </div>

 <div className="space-y-2">
 <label htmlFor="support_number" className="block text-label-md font-bold text-text-primary ">
 {t('fields.supportNumber')}
 </label>
 <input
 id="support_number"
 type="tel"
 value={data.support_number || ''}
 onChange={(e) => onChange('support_number', e.target.value)}
 placeholder={t('placeholders.supportNumber')}
 maxLength={30}
 dir="ltr"
 className="w-full px-4 py-3 rounded-xl border border-border bg-surface-low text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow placeholder:text-text-muted text-start"
 />
 </div>
 </div>
 </div>
 )
}
