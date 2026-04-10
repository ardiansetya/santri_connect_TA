const fs = require('fs')
const path = require('path')
const { MAX_GALLERY_FILES } = require('../config/upload-config')

const UPLOAD_DIR = path.join(__dirname, '../../uploads/pesantrenImages')
const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

const UploadService = {
  /**
   * Validate file size and extension (for Fastify file stream objects - DEPRECATED)
   * @param {Object} file - Fastify file object
   * @param {string} fieldName - Name of the field for error messages
   * @returns {Object} - { valid: boolean, message: string }
   */
  validateFile(file, fieldName = 'File') {
    if (!file) {
      return { valid: false, message: `${fieldName} wajib diisi` }
    }

    // Check file size
    if (file.data && file.data.length > MAX_FILE_SIZE) {
      return {
        valid: false,
        message: `${fieldName} terlalu besar. Maksimal ukuran adalah 1MB`
      }
    }

    // Check file extension
    const ext = path.extname(file.filename).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return {
        valid: false,
        message: `Format ${fieldName} tidak didukung. Gunakan jpg, jpeg, png, atau webp`
      }
    }

    return { valid: true, message: '' }
  },

  /**
   * Validate file that has already been saved to disk by controller
   * @param {Object} fileInfo - Object with { filename, size, mimetype }
   * @param {string} fieldName - Name of the field for error messages
   * @returns {Object} - { valid: boolean, message: string }
   */
  validateUploadedFile(fileInfo, fieldName = 'File') {
    if (!fileInfo) {
      return { valid: false, message: `${fieldName} wajib diisi` }
    }

    // Check file size
    if (fileInfo.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        message: `${fieldName} terlalu besar. Maksimal ukuran adalah 1MB`
      }
    }

    // Check file extension
    const ext = path.extname(fileInfo.filename).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return {
        valid: false,
        message: `Format ${fieldName} tidak didukung. Gunakan jpg, jpeg, png, atau webp`
      }
    }

    // Check mimetype
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedMimeTypes.includes(fileInfo.mimetype)) {
      return {
        valid: false,
        message: `Format ${fieldName} tidak didukung. Gunakan jpg, jpeg, png, atau webp`
      }
    }

    return { valid: true, message: '' }
  },

  /**
   * Save file to upload directory
   * @param {Object} file - Fastify file object
   * @param {string} fieldName - Field name for filename prefix
   * @returns {string} - Saved filename
   */
  async saveFile(file, fieldName) {
    const ext = path.extname(file.filename) || '.jpg'
    const filename = `${fieldName}-${Date.now()}${ext}`
    const filePath = path.join(UPLOAD_DIR, filename)
    
    // Convert to buffer and save (synchronously wait)
    const buffer = await file.toBuffer()
    fs.writeFileSync(filePath, buffer)
    
    return filename
  },

  /**
   * Save multiple files (for gallery)
   * @param {Array} files - Array of Fastify file objects
   * @param {string} fieldName - Field name for filename prefix
   * @returns {Array} - Array of saved filenames
   */
  async saveMultipleFiles(files, fieldName) {
    if (!files || files.length === 0) return []
    
    // Validate each file
    for (let i = 0; i < files.length; i++) {
      const validation = this.validateFile(files[i], `${fieldName} ${i + 1}`)
      if (!validation.valid) {
        throw new Error(validation.message)
      }
    }
    
    // Save all files
    const savedFiles = []
    for (let i = 0; i < files.length; i++) {
      const ext = path.extname(files[i].filename) || '.jpg'
      const filename = `${fieldName}-${Date.now()}-${i}${ext}`
      const filePath = path.join(UPLOAD_DIR, filename)
      
      const buffer = await files[i].toBuffer()
      fs.writeFileSync(filePath, buffer)
      
      savedFiles.push(filename)
    }
    
    return savedFiles
  },

  /**
   * Delete file from upload directory
   * @param {string} filename - Filename to delete
   * @returns {boolean} - True if deleted
   */
  deleteFile(filename) {
    if (!filename) return false

    // Sanitize filename to prevent path traversal attacks
    // Only allow valid filename patterns: {fieldName}-{timestamp}[-{index}].{ext}
    const sanitizedFilename = path.basename(filename)
    const validFilenameRegex = /^(foto_utama|foto_galeri)-\d+(-\d+)?\.(jpg|jpeg|png|webp)$/i

    if (!validFilenameRegex.test(sanitizedFilename)) {
      console.error('Invalid filename format:', filename)
      return false
    }

    const filePath = path.join(UPLOAD_DIR, sanitizedFilename)

    // Verify the resolved path is still within UPLOAD_DIR
    const resolvedPath = path.resolve(filePath)
    const resolvedUploadDir = path.resolve(UPLOAD_DIR)
    if (!resolvedPath.startsWith(resolvedUploadDir)) {
      console.error('Path traversal attempt blocked:', filename)
      return false
    }

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        return true
      }
    } catch (error) {
      console.error('Error deleting file:', error)
    }
    return false
  }
}

module.exports = UploadService