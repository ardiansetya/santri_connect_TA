<template>
  <div class="auth-page paper-texture">
    <div class="auth-wrapper animate-scale-in">
      <!-- Decorative side -->
      <div class="auth-side">
        <div class="pattern-overlay"></div>
        <div class="auth-side-content">
          <div class="auth-side-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h2 class="auth-side-title">Bergabunglah</h2>
          <p class="auth-side-desc">Daftarkan diri Anda dan mulai mencari pesantren terbaik atau kelola pesantren Anda</p>
          <div class="auth-side-features">
            <div class="auth-side-feature">
              <span class="feature-check">✓</span>
              <span>Pencarian pesantren gratis</span>
            </div>
            <div class="auth-side-feature">
              <span class="feature-check">✓</span>
              <span>Pendaftaran online mudah</span>
            </div>
            <div class="auth-side-feature">
              <span class="feature-check">✓</span>
              <span>Kelola pesantren Anda</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Form side -->
      <div class="auth-card">
        <div class="auth-card-header">
          <h1 class="auth-card__title">Daftar Akun Baru</h1>
          <p class="auth-card__subtitle">Pilih role dan isi data Anda</p>
        </div>

        <form class="auth-form" @submit="onSubmit">
          <!-- Role Selection -->
          <div class="role-selection">
            <label
              v-for="r in roles"
              :key="r.value"
              class="role-option"
              :class="{ 'role-option-active': role === r.value }"
            >
              <input type="radio" :value="r.value" v-model="role" class="hidden" />
              <span class="role-icon">{{ r.icon }}</span>
              <div>
                <div class="role-name">{{ r.label }}</div>
                <div class="role-desc">{{ r.desc }}</div>
              </div>
            </label>
          </div>

          <div class="form-group">
            <label class="form-label" for="username">Username</label>
            <input
              id="username"
              type="text"
              v-model="username"
              v-bind="usernameProps"
              class="form-input"
              :class="{ 'form-input--error': errors.username }"
              placeholder="Username Anda"
            />
            <span v-if="errors.username" class="form-error">{{ errors.username }}</span>
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input
              id="email"
              type="email"
              v-model="email"
              v-bind="emailProps"
              class="form-input"
              :class="{ 'form-input--error': errors.email }"
              placeholder="email@contoh.com"
            />
            <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input
                id="password"
                type="password"
                v-model="password"
                v-bind="passwordProps"
                class="form-input"
                :class="{ 'form-input--error': errors.password }"
                placeholder="Min. 6 karakter"
              />
              <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
            </div>
            <div class="form-group">
              <label class="form-label" for="confirmPassword">Konfirmasi</label>
              <input
                id="confirmPassword"
                type="password"
                v-model="confirmPassword"
                v-bind="confirmPasswordProps"
                class="form-input"
                :class="{ 'form-input--error': errors.confirmPassword }"
                placeholder="Ulangi password"
              />
              <span v-if="errors.confirmPassword" class="form-error">{{ errors.confirmPassword }}</span>
            </div>
          </div>

          <div v-if="serverError" class="alert--error">{{ serverError }}</div>
          <div v-if="success" class="alert--success">{{ success }}</div>

          <button type="submit" class="auth-submit" :disabled="isSubmitting || !meta.valid">
            <span v-if="isSubmitting" class="auth-submit-loading">
              <span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              Memproses...
            </span>
            <span v-else>Daftar Sekarang →</span>
          </button>
        </form>

        <p class="auth-card__footer">
          Sudah punya akun? <router-link to="/login" class="auth-link">Masuk di sini</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const serverError = ref('')
const success = ref('')

const roles = [
  { value: 'pendaftar', label: 'Pendaftar', desc: 'Calon santri', icon: '📚' },
  { value: 'pemilik', label: 'Pemilik', desc: 'Kelola pesantren', icon: '🕌' },
]

const schema = yup.object({
  username: yup.string()
    .required('Username harus diisi')
    .min(3, 'Username minimal 3 karakter')
    .max(30, 'Username maksimal 30 karakter')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh berisi huruf, angka, dan underscore'),
  email: yup.string()
    .required('Email harus diisi')
    .email('Format email tidak valid'),
  password: yup.string()
    .required('Password harus diisi')
    .min(6, 'Password minimal 6 karakter'),
  confirmPassword: yup.string()
    .required('Konfirmasi password harus diisi')
    .oneOf([yup.ref('password')], 'Password tidak cocok'),
  role: yup.string()
    .required('Role harus dipilih')
    .oneOf(['pendaftar', 'pemilik'], 'Role tidak valid')
})

const { defineField, handleSubmit, errors, meta, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'pendaftar'
  }
})

const [username, usernameProps] = defineField('username')
const [email, emailProps] = defineField('email')
const [password, passwordProps] = defineField('password')
const [confirmPassword, confirmPasswordProps] = defineField('confirmPassword')
const [role, roleProps] = defineField('role')

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  success.value = ''
  try {
    await authStore.register({
      username: values.username,
      email: values.email,
      password: values.password,
      role: values.role
    })
    success.value = 'Registrasi berhasil! Silakan login.'
    setTimeout(() => router.push('/login'), 1500)
  } catch (e) {
    serverError.value = e.response?.data?.error || 'Registrasi gagal'
  }
})
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - var(--navbar-height));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem;
}

.auth-wrapper {
  display: flex;
  max-width: 920px;
  width: 100%;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 60px -15px rgb(13 79 79 / 0.12);
  border: 1px solid hsl(35 18% 85%);
}

.auth-side {
  width: 340px;
  background: linear-gradient(135deg, hsl(173 78% 18%), hsl(173 78% 14%) 60%, hsl(40 50% 30%));
  padding: 3rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

@media (max-width: 768px) {
  .auth-side { display: none; }
  .auth-wrapper { max-width: 480px; }
}

.auth-side-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.auth-side-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  background: rgba(255,255,255,0.1);
  color: hsl(40 65% 65%);
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255,255,255,0.1);
}

.auth-side-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
}

.auth-side-desc {
  color: rgba(255,255,255,0.6);
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-top: 0.75rem;
}

.auth-side-features {
  margin-top: 2rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.auth-side-feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255,255,255,0.7);
  font-size: 0.875rem;
}

.feature-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: hsl(40 65% 52% / 0.2);
  color: hsl(40 65% 65%);
  font-size: 0.625rem;
  font-weight: 700;
  flex-shrink: 0;
}

.auth-card {
  flex: 1;
  background: hsl(38 30% 99%);
  padding: 2.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-card-header {
  margin-bottom: 1.5rem;
}

.auth-card__title {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: hsl(25 25% 15%);
  margin-bottom: 0.375rem;
}

.auth-card__subtitle {
  color: hsl(30 10% 45%);
  font-size: 0.9375rem;
}

.auth-form { display: flex; flex-direction: column; gap: 1rem; }

.role-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.role-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border: 1.5px solid hsl(35 18% 85%);
  border-radius: 0.625rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.role-option:hover {
  border-color: hsl(173 78% 18% / 0.3);
}

.role-option-active {
  border-color: hsl(173 78% 18%);
  background: hsl(173 78% 18% / 0.04);
  box-shadow: 0 0 0 3px hsl(173 78% 18% / 0.08);
}

.role-icon {
  font-size: 1.25rem;
}

.role-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: hsl(25 25% 15%);
  font-family: 'DM Sans', sans-serif;
}

.role-desc {
  font-size: 0.6875rem;
  color: hsl(30 10% 45%);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

@media (max-width: 480px) {
  .form-row { grid-template-columns: 1fr; }
}

.form-group { display: flex; flex-direction: column; gap: 0.375rem; }

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: hsl(25 25% 15%);
  font-family: 'DM Sans', sans-serif;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1.5px solid hsl(35 18% 85%);
  border-radius: 0.625rem;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  background: white;
  color: hsl(25 25% 15%);
  font-family: 'DM Sans', sans-serif;
}

.form-input--error {
  border-color: hsl(0 65% 50%);
}

.form-input:focus {
  outline: none;
  border-color: hsl(173 78% 18%);
  box-shadow: 0 0 0 3px hsl(173 78% 18% / 0.1);
}

.form-error {
  font-size: 0.75rem;
  color: hsl(0 65% 50%);
  font-weight: 500;
}

.auth-submit {
  width: 100%;
  padding: 0.875rem 1.75rem;
  border-radius: 0.625rem;
  font-weight: 700;
  font-size: 0.9375rem;
  background: hsl(173 78% 18%);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'DM Sans', sans-serif;
  box-shadow: 0 2px 8px hsl(173 78% 18% / 0.2);
  margin-top: 0.5rem;
}

.auth-submit:hover:not(:disabled) {
  background: hsl(173 78% 14%);
  box-shadow: 0 4px 16px hsl(173 78% 18% / 0.3);
  transform: translateY(-1px);
}

.auth-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-submit-loading {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.alert--error {
  background: hsl(0 65% 50% / 0.08);
  color: hsl(0 65% 50%);
  padding: 0.75rem 1rem;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid hsl(0 65% 50% / 0.15);
}

.alert--success {
  background: hsl(160 60% 35% / 0.08);
  color: hsl(160 60% 35%);
  padding: 0.75rem 1rem;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid hsl(160 60% 35% / 0.15);
}

.auth-card__footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9375rem;
  color: hsl(30 10% 45%);
}

.auth-link {
  color: hsl(173 78% 18%);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.auth-link:hover {
  color: hsl(40 65% 48%);
}
</style>
