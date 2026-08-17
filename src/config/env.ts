export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined

if (!API_BASE_URL) {
  console.warn('[PSMS] VITE_API_BASE_URL is not defined in .env — API calls will fail.')
}
