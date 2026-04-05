<template>
  <div class="py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-6">
          <h1 class="fw-bold mb-4">Profil Saya</h1>

          <div class="card shadow-sm mb-4">
            <div class="card-header bg-white py-3">
              <h5 class="fw-semibold mb-0">Informasi Akun</h5>
            </div>
            <div class="card-body p-4">
              <form @submit="onSubmit">
                <div class="mb-3">
                  <label class="form-label fw-medium">Username</label>
                  <input v-model="username" v-bind="usernameProps" type="text" class="form-control" :class="{ 'is-invalid': errors.username }" />
                  <div class="invalid-feedback" v-if="errors.username">{{ errors.username }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-medium">Email</label>
                  <input v-model="email" v-bind="emailProps" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" />
                  <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-medium">Role</label>
                  <input type="text" class="form-control" :value="roleLabel" disabled />
                </div>

                <div v-if="serverError" class="alert alert-danger">{{ serverError }}</div>
                <div v-if="success" class="alert alert-success">{{ success }}</div>

                <button type="submit" class="btn btn-primary" :disabled="isSubmitting || !meta.dirty">
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
              </form>
            </div>
          </div>

          <div class="card shadow-sm">
            <div class="card-header bg-white py-3">
              <h5 class="fw-semibold mb-0">Ubah Password</h5>
            </div>
            <div class="card-body p-4">
              <form @submit="onPasswordSubmit">
                <div class="mb-3">
                  <label class="form-label fw-medium">Password Saat Ini</label>
                  <input v-model="currentPassword" v-bind="currentPasswordProps" type="password" class="form-control" :class="{ 'is-invalid': passwordErrors.currentPassword }" />
                  <div class="invalid-feedback" v-if="passwordErrors.currentPassword">{{ passwordErrors.currentPassword }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-medium">Password Baru</label>
                  <input v-model="newPassword" v-bind="newPasswordProps" type="password" class="form-control" :class="{ 'is-invalid': passwordErrors.newPassword }" />
                  <div class="invalid-feedback" v-if="passwordErrors.newPassword">{{ passwordErrors.newPassword }}</div>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-medium">Konfirmasi Password Baru</label>
                  <input v-model="confirmPassword" v-bind="confirmPasswordProps" type="password" class="form-control" :class="{ 'is-invalid': passwordErrors.confirmPassword }" />
                  <div class="invalid-feedback" v-if="passwordErrors.confirmPassword">{{ passwordErrors.confirmPassword }}</div>
                </div>

                <div v-if="passwordServerError" class="alert alert-danger">{{ passwordServerError }}</div>
                <div v-if="passwordSuccess" class="alert alert-success">{{ passwordSuccess }}</div>

                <button type="submit" class="btn btn-warning" :disabled="isPasswordSubmitting || !passwordMeta.valid">
                  <span v-if="isPasswordSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isPasswordSubmitting ? 'Mengubah...' : 'Ubah Password' }}
                </button>
              </form>
            </div>
          </div>
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
