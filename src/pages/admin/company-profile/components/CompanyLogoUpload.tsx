import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Upload, X } from 'lucide-react'

interface CompanyLogoUploadProps {
 logoUrl: string | null
 onChange: (file: File | null, previewUrl: string | null) => void
}

export function CompanyLogoUpload({ logoUrl, onChange }: CompanyLogoUploadProps) {
 const { t } = useTranslation('settings')
 const fileInputRef = useRef<HTMLInputElement>(null)

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0]
 if (file) {
 // In a real app we'd upload the file to a server here.
 // For the mock UI, we just create a local object URL to preview it.
 const previewUrl = URL.createObjectURL(file)
 onChange(file, previewUrl)
 }
 }

 const handleRemove = () => {
 if (fileInputRef.current) {
 fileInputRef.current.value = ''
 }
 onChange(null, null)
 }

 return (
 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
 <div className="shrink-0 w-32 h-32 rounded-2xl border-2 border-dashed border-border bg-surface-container-low flex flex-col items-center justify-center relative overflow-hidden group">
 {logoUrl ? (
 <>
 <img 
 src={logoUrl} 
 alt={t('fields.companyLogo')} 
 className="w-full h-full object-contain p-2"
 />
 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
 <button
 type="button"
 onClick={handleRemove}
 className="p-2 bg-error/90 text-white rounded-full hover:bg-error transition-colors transform hover:scale-110 active:scale-95"
 title={t('logo.remove')}
 >
 <X size={20} />
 </button>
 </div>
 </>
 ) : (
 <div className="text-text-muted flex flex-col items-center gap-2">
 <Image size={32} strokeWidth={1.5} />
 <span className="text-[10px] font-medium uppercase tracking-wider">{t('logo.emptyState')}</span>
 </div>
 )}
 </div>

 <div className="flex-grow space-y-3">
 <div>
 <h4 className="font-title-md font-bold text-text-primary mb-1">
 {t('fields.companyLogo')}
 </h4>
 <p className="text-label-sm text-text-muted ">
 {t('logo.supportedFormats')}
 </p>
 </div>

 <div className="flex gap-3">
 <input 
 type="file" 
 ref={fileInputRef} 
 onChange={handleFileChange} 
 accept="image/png, image/jpeg" 
 className="hidden" 
 />
 <button
 type="button"
 onClick={() => fileInputRef.current?.click()}
 className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container text-text-primary-variant hover:bg-surface-container-high :bg-surface-container-high transition-colors font-label-md font-bold text-sm shadow-sm"
 >
 <Upload size={18} />
 {logoUrl ? t('logo.replace') : t('logo.upload')}
 </button>
 </div>
 </div>
 </div>
 )
}
