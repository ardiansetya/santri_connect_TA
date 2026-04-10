import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL
})

// Helper function to construct full URL for uploaded images
// During development, uses relative path (proxied by Vite)
// In production, uses full backend URL
export function getUploadUrl(filename) {
  if (!filename) return ''
  // During development with Vite dev server, use relative path (proxied)
  if (import.meta.env.DEV) {
    return `/uploads/pesantrenImages/${filename}`
  }
  // In production, construct full URL from API base URL
  const baseUrl = API_BASE_URL.replace('/api', '')
  return `${baseUrl}/uploads/pesantrenImages/${filename}`
}

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // If the data is FormData, delete Content-Type header
  // to let the browser set the correct multipart boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
