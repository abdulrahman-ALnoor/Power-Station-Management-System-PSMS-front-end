import React from 'react'
import { useTranslation } from 'react-i18next'
import { Building2 } from 'lucide-react'
import { CompanyProfile } from '../types'
import { CompanyLogoUpload } from './CompanyLogoUpload'

interface CompanyInformationSectionProps {
 data: CompanyProfile
 logoPreview: string | null
 onChange: (field: keyof CompanyProfile, value: any) => void
 onLogoChange: (file: File | null, previewUrl: string | null) => void
}

export function CompanyInformationSection({
 data,
 logoPreview,
 onChange,
 onLogoChange
}: CompanyInformationSectionProps) {
 const { t } = useTranslation('settings')

 return (
 <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-border">
 <div className="flex items-center gap-3 mb-8">
 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary ">
 <Building2 size={22} />
 </div>
 <h3 className="font-headline-sm font-bold text-text-primary ">
 {t('sections.companyInfo')}
 </h3>
 </div>

 <div className="space-y-8">
 <CompanyLogoUpload
 logoUrl={logoPreview ?? data.logo}
 onChange={onLogoChange}
 />

 <hr className="border-border" />

 <div className="grid grid-cols-1 gap-6">
 <div className="space-y-2">
 <label htmlFor="company_name" className="block text-label-md font-bold text-text-primary ">
 {t('fields.companyName')} <span className="text-error">*</span>
 </label>
 <input
 id="company_name"
 type="text"
 value={data.company_name}
 onChange={(e) => onChange('company_name', e.target.value)}
 placeholder={t('placeholders.companyName')}
 maxLength={200}
 className="w-full px-4 py-3 rounded-xl border border-border bg-surface-low text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow placeholder:text-text-muted"
 />
 </div>

 <div className="space-y-2">
 <label htmlFor="address" className="block text-label-md font-bold text-text-primary ">
 {t('fields.address')}
 </label>
 <textarea
 id="address"
 value={data.address || ''}
 onChange={(e) => onChange('address', e.target.value)}
 placeholder={t('placeholders.address')}
 rows={3}
 className="w-full px-4 py-3 rounded-xl border border-border bg-surface-low text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow placeholder:text-text-muted resize-none"
 />
 </div>
 </div>
 </div>
 </div>
 )
}
