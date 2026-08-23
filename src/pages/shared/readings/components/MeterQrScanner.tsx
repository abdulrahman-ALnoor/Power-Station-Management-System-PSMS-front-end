import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Camera, AlertCircle } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import { useLanguage } from '@/hooks/useLanguage'
import { useTranslation } from 'react-i18next'

interface MeterQrScannerProps {
 isOpen: boolean
 onClose: () => void
 onScanSuccess: (decodedText: string) => void
}

export function MeterQrScanner({ isOpen, onClose, onScanSuccess }: MeterQrScannerProps) {
 const { isRTL } = useLanguage()
 const { t } = useTranslation()
 const scannerRef = useRef<Html5Qrcode | null>(null)
 const [error, setError] = useState<string | null>(null)

 useEffect(() => {
 if (!isOpen) return

 const qrCodeRegionId = "qr-reader-container"
 
 // Initialize scanner
 const html5QrCode = new Html5Qrcode(qrCodeRegionId)
 scannerRef.current = html5QrCode

 // Request camera and start
 html5QrCode.start(
 { facingMode: "environment" },
 {
 fps: 10,
 qrbox: { width: 250, height: 250 }
 },
 (decodedText) => {
 // Success
 html5QrCode.stop().then(() => {
 onScanSuccess(decodedText)
 }).catch(err => {
 console.error("Failed to stop scanner", err)
 onScanSuccess(decodedText)
 })
 },
 (errorMessage) => {
 // Ignored, continuous scanning
 }
 ).catch((err) => {
 console.error(err)
 setError(isRTL ? "تعذر الوصول إلى الكاميرا. يرجى السماح باستخدام الكاميرا من إعدادات المتصفح." : "Camera access denied. Please allow camera permissions in your browser.")
 })

 return () => {
 if (scannerRef.current && scannerRef.current.isScanning) {
 scannerRef.current.stop().catch(console.error)
 }
 }
 }, [isOpen, isRTL, onScanSuccess])

 if (!isOpen) return null

 return createPortal(
 <div style={{ position: 'fixed', inset: 0, zIndex: 10000 }}>
 {/* BACKDROP */}
 <div 
 onClick={onClose}
 style={{
 position: 'absolute',
 inset: 0,
 backgroundColor: 'rgba(0,0,0,0.8)',
 zIndex: 0,
 }}
 />
 
 {/* MODAL */}
 <aside 
 className="absolute inset-0 flex items-center justify-center p-4 sm:p-6"
 style={{ zIndex: 1 }}
 dir={isRTL ? 'rtl' : 'ltr'}
 >
 <div 
 className="w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden"
 style={{
 backgroundColor: '#ffffff',
 opacity: 1,
 filter: 'none'
 }}
 >
 <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
 <h2 className="font-headline-sm text-lg font-semibold text-text-primary flex items-center gap-2">
 <Camera size={20} className="text-primary" />
 {isRTL ? 'مسح QR للعداد' : 'Scan Meter QR'}
 </h2>
 <button 
 onClick={onClose}
 className="p-2 rounded-full hover:bg-surface-container transition-colors text-text-muted"
 >
 <X size={20} />
 </button>
 </div>

 <div className="p-6 bg-surface-low flex flex-col items-center justify-center min-h-[300px]">
 {error ? (
 <div className="text-center space-y-4">
 <AlertCircle size={48} className="text-error mx-auto" />
 <p className="text-error font-medium">{error}</p>
 <button
 onClick={onClose}
 className="px-6 py-2.5 rounded-lg border border-border hover:bg-surface-container transition-colors"
 >
 {isRTL ? 'إغلاق' : 'Close'}
 </button>
 </div>
 ) : (
 <>
 <div id="qr-reader-container" className="w-full max-w-[300px] aspect-square rounded-xl overflow-hidden bg-black relative shadow-inner">
 {/* html5-qrcode will mount here */}
 </div>
 <p className="mt-6 text-center text-text-primary font-medium">
 {isRTL ? 'وجّه الكاميرا نحو رمز QR الخاص بالعداد' : 'Point camera at the meter QR code'}
 </p>
 </>
 )}
 </div>
 
 <div className="p-4 border-t border-border bg-surface flex justify-center shrink-0">
 <button
 onClick={onClose}
 className="w-full sm:w-auto px-8 py-2.5 rounded-lg border border-border hover:bg-surface-container font-semibold transition-colors"
 >
 {isRTL ? 'إلغاء' : 'Cancel'}
 </button>
 </div>
 </div>
 </aside>
 </div>,
 document.body
 )
}
