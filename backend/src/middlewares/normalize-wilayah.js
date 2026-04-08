/**
 * Normalizes request body to use consistent field names
 * Maps alternative field names to canonical database field names
 */
function normalizeWilayahData(data) {
  const normalized = { ...data }
  
  // Standardize province/provinsi to province (matches database column)
  if (normalized.provinsi && !normalized.province) {
    normalized.province = normalized.provinsi
    delete normalized.provinsi
  }
  
  return normalized
}

module.exports = { normalizeWilayahData }
