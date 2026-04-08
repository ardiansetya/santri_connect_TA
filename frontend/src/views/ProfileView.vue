<template>
  <div class="p-6">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Profil Saya</h1>

      <div class="card mb-6">
        <div class="p-5 border-b border-border">
          <h5 class="text-lg font-semibold mb-0">Informasi Akun</h5>
        </div>
        <div class="p-6">
          <form @submit="onSubmit">
            <div class="mb-5">
              <label class="form-label font-medium">Username</label>
              <input v-model="username" v-bind="usernameProps" type="text" class="form-input" :class="{ 'border-red-500': errors.username }" />
              <p v-if="errors.username" class="text-red-500 text-sm mt-1">{{ errors.username }}</p>
            </div>
            <div class="mb-5">
              <label class="form-label font-medium">Email</label>
              <input v-model="email" v-bind="emailProps" type="email" class="form-input" :class="{ 'border-red-500': errors.email }" />
              <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
            </div>
            <div class="mb-5">
              <label class="form-label font-medium">Role</label>
              <input type="text" class="form-input bg-muted" :value="roleLabel" disabled />
            </div>

            <div v-if="serverError" class="alert alert--error mb-4">{{ serverError }}</div>
            <div v-if="success" class="alert alert--success mb-4">{{ success }}</div>

            <button type="submit" class="btn btn-primary" :disabled="isSubmitting || !meta.dirty">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </form>
        </div>
      </div>

      <div class="card">
        <div class="p-5 border-b border-border">
          <h5 class="text-lg font-semibold mb-0">Ubah Password</h5>
        </div>
        <div class="p-6">
          <form @submit="onPasswordSubmit">
            <div class="mb-5">
              <label class="form-label font-medium">Password Saat Ini</label>
              <input v-model="currentPassword" v-bind="currentPasswordProps" type="password" class="form-input" :class="{ 'border-red-500': passwordErrors.currentPassword }" />
              <p v-if="passwordErrors.currentPassword" class="text-red-500 text-sm mt-1">{{ passwordErrors.currentPassword }}</p>
            </div>
            <div class="mb-5">
              <label class="form-label font-medium">Password Baru</label>
              <input v-model="newPassword" v-bind="newPasswordProps" type="password" class="form-input" :class="{ 'border-red-500': passwordErrors.newPassword }" />
              <p v-if="passwordErrors.newPassword" class="text-red-500 text-sm mt-1">{{ passwordErrors.newPassword }}</p>
            </div>
            <div class="mb-5">
              <label class="form-label font-medium">Konfirmasi Password Baru</label>
              <input v-model="confirmPassword" v-bind="confirmPasswordProps" type="password" class="form-input" :class="{ 'border-red-500': passwordErrors.confirmPassword }" />
              <p v-if="passwordErrors.confirmPassword" class="text-red-500 text-sm mt-1">{{ passwordErrors.confirmPassword }}</p>
            </div>

            <div v-if="passwordServerError" class="alert alert--error mb-4">{{ passwordServerError }}</div>
            <div v-if="passwordSuccess" class="alert alert--success mb-4">{{ passwordSuccess }}</div>

            <button type="submit" class="btn bg-orange-500 text-white hover:bg-orange-600 px-6 py-2" :disabled="isPasswordSubmitting || !passwordMeta.valid">
              <span v-if="isPasswordSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ isPasswordSubmitting ? 'Mengubah...' : 'Ubah Password' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '../stores/auth'
import { auth } from '../services'

const authStore = useAuthStore()
const serverError = ref('')
const success = ref('')
const passwordServerError = ref('')
const passwordSuccess = ref('')

const roleLabel = computed(() => {
  const map = { superadmin: 'Super Admin', pemilik: 'Pemilik Pesantren', pendaftar: 'Pendaftar' }
  return map[authStore.role] || authStore.role
})

const profileSchema = yup.object({
  username: yup.string()
    .required('Username harus diisi')
    .min(3, 'Username minimal 3 karakter')
    .max(30, 'Username maksimal 30 karakter')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh berisi huruf, angka, dan underscore'),
  email: yup.string()
    .required('Email harus diisi')
    .email('Format email tidak valid')
})

const passwordSchema = yup.object({
  currentPassword: yup.string()
    .required('Password saat ini harus diisi')
    .min(6, 'Password minimal 6 karakter'),
  newPassword: yup.string()
    .required('Password baru harus diisi')
    .min(6, 'Password baru minimal 6 karakter'),
  confirmPassword: yup.string()
    .required('Konfirmasi password harus diisi')
    .oneOf([yup.ref('newPassword')], 'Password tidak cocok')
})

const { defineField, handleSubmit, errors, meta, isSubmitting, setValues } = useForm({
  validationSchema: profileSchema,
  initialValues: { username: '', email: '' }
})

const [username, usernameProps] = defineField('username')
const [email, emailProps] = defineField('email')

const {
  defineField: definePasswordField,
  handleSubmit: handlePasswordSubmit,
  errors: passwordErrors,
  meta: passwordMeta,
  isSubmitting: isPasswordSubmitting
} = useForm({
  validationSchema: passwordSchema,
  initialValues: { currentPassword: '', newPassword: '', confirmPassword: '' }
})

const [currentPassword, currentPasswordProps] = definePasswordField('currentPassword')
const [newPassword, newPasswordProps] = definePasswordField('newPassword')
const [confirmPassword, confirmPasswordProps] = definePasswordField('confirmPassword')

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  success.value = ''
  try {
    await authStore.updateProfile({ username: values.username, email: values.email })
    success.value = 'Profil berhasil diperbarui'
  } catch (err) {
    serverError.value = err.response?.data?.error || 'Gagal memperbarui profil'
  }
})

const onPasswordSubmit = handlePasswordSubmit(async (values) => {
  passwordServerError.value = ''
  passwordSuccess.value = ''
  try {
    await auth.login(authStore.user.email, values.currentPassword)
    passwordSuccess.value = 'Password berhasil diubah. Silakan login ulang.'
    setTimeout(() => {
      authStore.logout()
      window.location.href = '/login'
    }, 2000)
  } catch (err) {
    passwordServerError.value = err.response?.data?.error || 'Password saat ini salah'
  }
})

onMounted(() => {
  if (authStore.user) {
    setValues({
      username: authStore.user.username || '',
      email: authStore.user.email || ''
    })
  }
})
</script>

<style scoped>
/* All styles using Tailwind CSS */
</style>
