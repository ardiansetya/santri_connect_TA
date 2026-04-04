<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-card__title">Daftar Akun Baru</h1>
      <p class="auth-card__subtitle">Pilih role dan isi data Anda</p>

      <form class="auth-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label class="form-label" for="username">Username</label>
          <input class="form-input" id="username" v-model="form.username" required placeholder="Username Anda" />
        </div>

        <div class="form-group">
          <label class="form-label" for="email">Email</label>
          <input class="form-input" id="email" type="email" v-model="form.email" required placeholder="email@contoh.com" />
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <input class="form-input" id="password" type="password" v-model="form.password" required minlength="6" placeholder="Minimal 6 karakter" />
        </div>

        <div class="form-group">
          <label class="form-label" for="role">Role</label>
          <select class="form-input" id="role" v-model="form.role">
            <option value="pendaftar">Pendaftar (Calon Santri)</option>
            <option value="pemilik">Pemilik Pesantren</option>
          </select>
        </div>

        <div v-if="error" class="alert alert--error">{{ error }}</div>
        <div v-if="success" class="alert alert--success">{{ success }}</div>

        <button type="submit" class="btn btn--primary btn--full" :disabled="loading">
          <span v-if="loading">Memproses...</span>
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
import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const form = reactive({ username: '', email: '', password: '', role: 'pendaftar' })
const error = ref('')
const success = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    await authStore.register(form)
    success.value = 'Registrasi berhasil! Silakan login.'
    setTimeout(() => router.push('/login'), 1500)
  } catch (e) {
    error.value = e.response?.data?.error || 'Registrasi gagal'
  } finally {
    loading.value = false
  }
}
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

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-bg);
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
