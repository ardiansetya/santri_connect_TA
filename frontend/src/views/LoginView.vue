<template>
  <div class="auth-page paper-texture">
    <div class="auth-wrapper animate-scale-in">
      <!-- Decorative side -->
      <div class="auth-side">
        <div class="pattern-overlay"></div>
        <div class="auth-side-content">
          <div class="auth-side-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <h2 class="auth-side-title">Santri<span>Connect</span></h2>
          <p class="auth-side-desc">Platform pencarian dan pendaftaran pesantren terlengkap di Indonesia</p>
          <div class="auth-side-stats">
            <div class="auth-side-stat">
              <div class="auth-side-stat-num">22+</div>
              <div class="auth-side-stat-label">Pesantren</div>
            </div>
            <div class="auth-side-stat">
              <div class="auth-side-stat-num">3</div>
              <div class="auth-side-stat-label">Provinsi</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form side -->
      <div class="auth-card">
        <div class="auth-card-header">
          <h1 class="auth-card__title">Selamat Datang</h1>
          <p class="auth-card__subtitle">Masukkan email dan password Anda</p>
        </div>

        <form class="auth-form" @submit="onSubmit">
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

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input
              id="password"
              type="password"
              v-model="password"
              v-bind="passwordProps"
              class="form-input"
              :class="{ 'form-input--error': errors.password }"
              placeholder="Masukkan password"
            />
            <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
          </div>

          <div v-if="serverError" class="alert--error">{{ serverError }}</div>

          <button type="submit" class="auth-submit" :disabled="isSubmitting || !meta.valid">
            <span v-if="isSubmitting" class="auth-submit-loading">
              <span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              Memproses...
            </span>
            <span v-else>Masuk →</span>
          </button>
        </form>

        <p class="auth-card__footer">
          Belum punya akun? <router-link to="/register" class="auth-link">Daftar sekarang</router-link>
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

const schema = yup.object({
  email: yup.string().required('Email harus diisi').email('Format email tidak valid'),
  password: yup.string().required('Password harus diisi').min(6, 'Password minimal 6 karakter')
})

const { defineField, handleSubmit, errors, meta, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    password: ''
  }
})

const [email, emailProps] = defineField('email')
const [password, passwordProps] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  try {
    await authStore.login(values.email, values.password)
    router.push('/dashboard')
  } catch (e) {
    serverError.value = e.response?.data?.error || 'Email atau password salah'
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
  max-width: 880px;
  width: 100%;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 60px -15px rgb(13 79 79 / 0.12);
  border: 1px solid hsl(35 18% 85%);
}

.auth-side {
  width: 380px;
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
  .auth-wrapper { max-width: 440px; }
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

.auth-side-title span {
  color: hsl(40 65% 65%);
}

.auth-side-desc {
  color: rgba(255,255,255,0.6);
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-top: 0.75rem;
}

.auth-side-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.auth-side-stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: hsl(40 65% 65%);
}

.auth-side-stat-label {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
  margin-top: 0.125rem;
}

.auth-card {
  flex: 1;
  background: hsl(38 30% 99%);
  padding: 3rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-card-header {
  margin-bottom: 2rem;
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

.auth-form { display: flex; flex-direction: column; gap: 1.25rem; }

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

.auth-card__footer {
  text-align: center;
  margin-top: 2rem;
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
