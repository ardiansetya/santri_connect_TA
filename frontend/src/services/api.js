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
  // If the filename is an absolute URL (like placeholder images), return it as is
  if (filename.startsWith('http')) return filename
  
  if (import.meta.env.DEV) {
    return `/uploads/pesantrenImages/${filename}`
  }
  const baseUrl = API_BASE_URL.replace('/api', '')
  return `${baseUrl}/uploads/pesantrenImages/${filename}`
}

export function getPendaftaranUploadUrl(filename) {
  if (!filename) return ''
  if (import.meta.env.DEV) {
    return `/uploads/pendaftaran/${filename}`
  }
  const baseUrl = API_BASE_URL.replace('/api', '')
  return `${baseUrl}/uploads/pendaftaran/${filename}`
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

export const publicApi = {
  getStats() {
    return api.get('/public/stats')
  },
  getPesantren(params) {
    return api.get('/pesantren', { params })
  },
  getFeatured() {
    return api.get('/pesantren', { params: { limit: 4 } })
  }
}

export default api
