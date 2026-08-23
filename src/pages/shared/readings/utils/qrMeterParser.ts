/**
 * qrMeterParser.ts
 * 
 * Utility for parsing a scanned QR code string into a standardized format.
 * This abstracts the exact QR format (plain text, prefixed text, JSON) away from the UI,
 * allowing future backend changes without touching the scanner component.
 */

export interface ParsedMeterInfo {
 meterId?: number
 meterNumber?: string
}

export function parseMeterQrData(scannedText: string): ParsedMeterInfo | null {
 if (!scannedText) return null
 
 const text = scannedText.trim()

 // 1. Try parsing as JSON first
 try {
 const data = JSON.parse(text)
 if (data.meter_id) {
 return { meterId: Number(data.meter_id) }
 }
 if (data.meter_number) {
 return { meterNumber: String(data.meter_number) }
 }
 } catch (e) {
 // Not valid JSON, continue with text parsing
 }

 // 2. Parse common string patterns
 // Pattern: "MET-10001" or "MTR-10001" or "10001"
 if (/^MET-\d+$/i.test(text) || /^MTR-\d+$/i.test(text)) {
 return { meterNumber: text.toUpperCase() }
 }

 // 3. Fallback: assume the raw text is the meter number if it looks reasonable
 if (text.length > 0 && text.length < 50) {
 return { meterNumber: text }
 }

 return null
}
