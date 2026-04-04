<template>
  <nav class="navbar">
    <div class="container navbar__container">
      <router-link to="/" class="navbar__brand">
        <span class="navbar__logo">🕌</span>
        <span class="navbar__title">Santri Connect</span>
      </router-link>

      <button class="navbar__toggle" @click="isOpen = !isOpen" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>

      <div class="navbar__menu" :class="{ 'navbar__menu--open': isOpen }">
        <router-link to="/pesantren" class="navbar__link" @click="isOpen = false">Pesantren</router-link>
        <router-link to="/rekomendasi" class="navbar__link" @click="isOpen = false">Rekomendasi</router-link>
        <router-link to="/compare" class="navbar__link" @click="isOpen = false">Bandingkan</router-link>
        <router-link to="/track" class="navbar__link" @click="isOpen = false">Cek Status</router-link>

        <template v-if="authStore.isAuthenticated">
          <router-link to="/dashboard" class="navbar__link navbar__link--accent" @click="isOpen = false">Dashboard</router-link>
          <button class="navbar__link navbar__link--logout" @click="handleLogout">Keluar</button>
        </template>
        <template v-else>
          <router-link to="/login" class="navbar__link navbar__link--btn" @click="isOpen = false">Masuk</router-link>
          <router-link to="/register" class="navbar__link navbar__link--btn navbar__link--primary" @click="isOpen = false">Daftar</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const isOpen = ref(false)

async function handleLogout() {
  await authStore.logout()
  router.push('/')
  isOpen.value = false
}
</script>

<style scoped>
.navbar {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  height: var(--navbar-height);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-text-primary);
}

.navbar__logo { font-size: 1.5rem; }

.navbar__menu {
  display: none;
  align-items: center;
  gap: 1.5rem;
}

.navbar__menu--open { display: flex; }

.navbar__link {
  color: var(--color-text-secondary);
  font-weight: 500;
  font-size: 0.9375rem;
  transition: color var(--transition-fast);
}

.navbar__link:hover,
.navbar__link.router-link-active { color: var(--color-primary); }

.navbar__link--accent { color: var(--color-primary); font-weight: 600; }
.navbar__link--logout { color: var(--color-error); }

.navbar__link--btn {
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.navbar__link--primary {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.navbar__link--primary:hover { background: var(--color-primary-dark); }

.navbar__toggle {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0.5rem;
}

.navbar__toggle span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-text-primary);
  border-radius: 2px;
}

@media (min-width: 768px) {
  .navbar__toggle { display: none; }
  .navbar__menu { display: flex; }
}
</style>
