import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Save, X } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { CompanyProfile } from './types'
import { MOCK_COMPANY_PROFILE } from './data/mockData'
import { CompanyInformationSection } from './components/CompanyInformationSection'
import { CompanyContactSection } from './components/CompanyContactSection'
import { CompanyBillingSection } from './components/CompanyBillingSection'

export function CompanyProfilePage() {
 const { t } = useTranslation('settings')
 const { isRTL } = useLanguage()

 const [formData, setFormData] = useState<CompanyProfile>(MOCK_COMPANY_PROFILE)
 const [logoFile, setLogoFile] = useState<File | null>(null)
 const [logoPreview, setLogoPreview] = useState<string | null>(null)
 const [isSaving, setIsSaving] = useState(false)
 const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

 const handleFieldChange = (field: keyof CompanyProfile, value: any) => {
 setFormData((prev) => ({ ...prev, [field]: value }))
 }

 const handleLogoChange = (file: File | null, previewUrl: string | null) => {
 setLogoFile(file)
 setLogoPreview(previewUrl)
 if (!file && !previewUrl) {
 // Removing logo
 setFormData((prev) => ({ ...prev, logo: null }))
 setNotification({ type: 'success', message: t('notifications.logoRemoved') })
 }
 }

 const handleSave = async () => {
 if (!formData.company_name || !formData.currency || formData.price_per_kwh === undefined) {
 setNotification({ type: 'error', message: t('notifications.saveError') })
 return
 }

 setIsSaving(true)
 setNotification(null)

 try {
 // Mock API call
 await new Promise(resolve => setTimeout(resolve, 1000))
 
 // In a real app, send formData and logoFile to Laravel API
 // Then update local state with response.
 setNotification({ type: 'success', message: t('notifications.saveSuccess') })
 } catch (error) {
 setNotification({ type: 'error', message: t('notifications.saveError') })
 } finally {
 setIsSaving(false)
 }
 }

 const handleCancel = () => {
 // Reset form to original mock data
 setFormData(MOCK_COMPANY_PROFILE)
 setLogoFile(null)
 setLogoPreview(null)
 setNotification(null)
 }

 // Clear notification after 3 seconds
 useEffect(() => {
 if (notification) {
 const timer = setTimeout(() => setNotification(null), 3000)
 return () => clearTimeout(timer)
 }
 }, [notification])

 return (
 <div className="space-y-6 max-w-[1200px] mx-auto pb-12">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="text-start">
 <h1 className="font-headline-md text-headline-md font-bold text-primary ">
 {t('pageTitle')}
 </h1>
 <p className="text-label-md text-text-muted mt-1">
 {t('pageSubtitle')}
 </p>

 <nav 
 className="flex gap-2 text-label-sm text-text-muted mt-2"
 dir={isRTL ? 'rtl' : 'ltr'}
 aria-label={t('breadcrumb.settings')}
 >
 <span>{t('breadcrumb.home')}</span>
 <span>/</span>
 <span>{t('breadcrumb.settings')}</span>
 </nav>
 </div>
 </div>

 {/* Notification Toast */}
 {notification && (
 <div className={`p-4 rounded-xl flex items-center justify-between shadow-sm border ${
 notification.type === 'success' 
 ? 'bg-success/10 border-success/20 text-success' 
 : 'bg-error/10 border-error/20 text-error'
 }`}>
 <p className="font-bold text-label-md">{notification.message}</p>
 <button onClick={() => setNotification(null)} className="opacity-70 hover:opacity-100">
 <X size={18} />
 </button>
 </div>
 )}

 {/* Main Content Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 
 {/* Left Column (Desktop) */}
 <div className="space-y-6">
 <CompanyInformationSection 
 data={formData} 
 logoPreview={logoPreview}
 onChange={handleFieldChange} 
 onLogoChange={handleLogoChange}
 />
 </div>

 {/* Right Column (Desktop) */}
 <div className="space-y-6">
 <CompanyContactSection 
 data={formData} 
 onChange={handleFieldChange} 
 />
 <CompanyBillingSection 
 data={formData} 
 onChange={handleFieldChange} 
 />
 </div>

 </div>

 {/* Action Buttons */}
 <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
 <button
 onClick={handleCancel}
 disabled={isSaving}
 className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border text-text-primary font-bold hover:bg-surface-container :bg-surface-container-high transition-colors disabled:opacity-50"
 >
 {t('actions.cancel')}
 </button>
 <button
 onClick={handleSave}
 disabled={isSaving}
 className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
 >
 {isSaving ? (
 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
 ) : (
 <Save size={20} />
 )}
 {t('actions.save')}
 </button>
 </div>
 </div>
 )
}
