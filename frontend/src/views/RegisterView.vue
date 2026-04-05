<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-card__title">Daftar Akun Baru</h1>
      <p class="auth-card__subtitle">Pilih role dan isi data Anda</p>

      <form class="auth-form" @submit="onSubmit">
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

        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            v-bind="passwordProps"
            class="form-input"
            :class="{ 'form-input--error': errors.password }"
            placeholder="Minimal 6 karakter"
          />
          <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="confirmPassword">Konfirmasi Password</label>
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

        <div class="form-group">
          <label class="form-label" for="role">Role</label>
          <select
            id="role"
            v-model="role"
            v-bind="roleProps"
            class="form-input"
            :class="{ 'form-input--error': errors.role }"
          >
            <option value="pendaftar">Pendaftar (Calon Santri)</option>
            <option value="pemilik">Pemilik Pesantren</option>
          </select>
          <span v-if="errors.role" class="form-error">{{ errors.role }}</span>
        </div>

        <div v-if="serverError" class="alert alert--error">{{ serverError }}</div>
        <div v-if="success" class="alert alert--success">{{ success }}</div>

        <button type="submit" class="btn btn--primary btn--full" :disabled="isSubmitting || !meta.valid">
          <span v-if="isSubmitting">Memproses...</span>
          <span v-else>Daftar</span>
        </button>
      </form>

      <p class="auth-card__footer">
        Sudah punya akun? <router-link to="/login">Masuk di sini</router-link>
      </p>
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
  padding: 2rem 1.5rem;
  background: var(--color-background);
}

.auth-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow-md);
}

.auth-card__title {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
}

.auth-card__subtitle {
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: 2rem;
}

.auth-form { display: flex; flex-direction: column; gap: 1.25rem; }

.form-group { display: flex; flex-direction: column; gap: 0.375rem; }

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  transition: border-color var(--transition-fast);
  background: var(--color-surface);
}

.form-input--error {
  border-color: var(--color-error);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-bg);
}

.form-input--error:focus {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px var(--color-error-bg);
}

.form-error {
  font-size: 0.75rem;
  color: var(--color-error);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 1rem;
  transition: all var(--transition-base);
  cursor: pointer;
}

.btn--primary { background: var(--color-primary); color: white; }
.btn--primary:hover:not(:disabled) { background: var(--color-primary-dark); }
.btn--primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn--full { width: 100%; }

.alert {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
}

.alert--error { background: var(--color-error-bg); color: var(--color-error); }
.alert--success { background: var(--color-success-bg); color: var(--color-success); }

.auth-card__footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
}
</style>
