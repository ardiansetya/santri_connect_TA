<template>
  <nav
    class="sticky top-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'nav-scrolled' : 'nav-transparent'"
  >
    <div class="container flex items-center justify-between" style="height: var(--navbar-height)">
      <router-link to="/" class="flex items-center gap-2.5 group">
        <div class="nav-logo">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <span class="nav-brand">
          Santri<span class="nav-accent">Connect</span>
        </span>
      </router-link>
      <!-- Desktop Navigation - Left/Center Links -->
      <div class="desktop-nav-links items-center gap-4 lg:gap-6 ml-4">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link font-bold tracking-tight"
          :class="$route.path === link.to ? 'nav-link-active' : ''"
        >
          {{ link.label }}
        </router-link>
      </div>

      <!-- Desktop Auth Actions - Right -->
      <div class="desktop-nav-auth items-center gap-2">
        <template v-if="authStore.isAuthenticated">
          <!-- Profile Dropdown -->
          <div class="relative profile-dropdown-container">
            <button 
              @click.stop="showDropdown = !showDropdown" 
              class="flex items-center gap-2.5 p-1 rounded-full hover:bg-muted/50 transition-all border border-transparent hover:border-border/60 group"
              :class="{ 'bg-muted/80 border-border/60 shadow-sm': showDropdown }"
            >
              <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white group-hover:ring-primary/20 transition-all">
                {{ authStore.user?.username?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <div class="hidden sm:block text-left mr-1">
                <p class="text-[0.8125rem] font-bold text-foreground leading-tight">{{ authStore.user?.username }}</p>
                <p class="text-[0.6875rem] font-medium text-muted-foreground leading-tight">{{ roleLabel }}</p>
              </div>
              <svg 
                class="w-4 h-4 text-muted-foreground transition-transform duration-300" 
                :class="{ 'rotate-180': showDropdown }"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <transition name="dropdown-fade">
              <div 
                v-if="showDropdown" 
                class="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
              >
                <!-- User Header -->
                <div class="px-5 py-4 bg-gradient-to-br from-primary/10 to-transparent border-b border-border/60">
                  <p class="text-xs font-bold text-primary uppercase tracking-widest mb-1">Akun Terhubung</p>
                  <p class="text-sm font-bold text-foreground truncate">{{ authStore.user?.email }}</p>
                </div>

                <!-- Menu Items -->
                <div class="p-2">
                  <router-link 
                    to="/dashboard" 
                    @click="showDropdown = false"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all group"
                  >
                    <div class="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    </div>
                    Dashboard Panel
                  </router-link>
                  
                  <router-link 
                    to="/profile" 
                    @click="showDropdown = false"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:text-accent hover:bg-accent/5 transition-all group"
                  >
                    <div class="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    Pengaturan Profil
                  </router-link>

                  <div class="my-2 border-t border-border mx-2"></div>

                  <button 
                    @click="handleLogout"
                    class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/5 transition-all group"
                  >
                    <div class="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center group-hover:bg-destructive text-destructive group-hover:text-white transition-all">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </div>
                    Keluar Sesi
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">Masuk</router-link>
          <router-link to="/register" class="btn btn-primary btn-sm">Daftar</router-link>
        </template>
      </div>

      <!-- Mobile toggle -->
      <button class="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors" @click="isOpen = !isOpen">
        <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="isOpen" class="mobile-menu lg:hidden animate-fade-in">
      <div class="flex flex-col gap-1 p-4">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          @click="isOpen = false"
          class="mobile-link"
          :class="$route.path === link.to ? 'mobile-link-active' : ''"
        >
          {{ link.label }}
        </router-link>
        <div class="mt-3 flex gap-2 border-t border-border pt-3">
          <template v-if="authStore.isAuthenticated">
            <router-link to="/dashboard" class="btn btn-outline btn-sm flex-1" @click="isOpen = false">Dashboard</router-link>
            <button @click="handleLogout" class="btn btn-sm flex-1 nav-logout-btn">Keluar</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-outline btn-sm flex-1" @click="isOpen = false">Masuk</router-link>
            <router-link to="/register" class="btn btn-primary btn-sm flex-1" @click="isOpen = false">Daftar</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const isOpen = ref(false)
const isScrolled = ref(false)
const showDropdown = ref(false)

const roleLabel = computed(() => {
  const map = { superadmin: 'Admin', pemilik: 'Pemilik', pendaftar: 'Santri' }
  return map[authStore.role] || authStore.role
})

const toggleDropdown = (e) => {
  e.stopPropagation()
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/pesantren', label: 'Pesantren' },
  { to: '/rekomendasi', label: 'Rekomendasi' },
  { to: '/compare', label: 'Bandingkan' },
  { to: '/track', label: 'Cek Status' },
]

function handleScroll() {
  isScrolled.value = window.scrollY > 10
}

async function handleLogout() {
  await authStore.logout()
  router.push('/')
  isOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.nav-transparent {
  background: hsl(38 25% 97% / 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
}

.nav-scrolled {
  background: hsl(38 25% 97% / 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid hsl(35 18% 85%);
  box-shadow: 0 1px 12px -4px rgb(13 79 79 / 0.06);
}

.nav-logo {
  display: flex;
  height: 2.25rem;
  width: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, hsl(173 78% 18%), hsl(173 78% 24%));
  color: white;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.group:hover .nav-logo {
  transform: rotate(-6deg) scale(1.05);
}

.nav-brand {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: hsl(25 25% 15%);
  letter-spacing: -0.02em;
}

.nav-accent {
  color: hsl(40 65% 48%);
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  color: hsl(30 15% 35%);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  border: 1px solid transparent;
}

.nav-link:hover {
  color: hsl(25 25% 15%);
  background: hsl(35 20% 90% / 0.6);
}

.nav-link-active {
  color: hsl(173 78% 18%) !important;
  background: hsl(173 78% 18% / 0.06);
  font-weight: 600;
}

.nav-link-cta {
  color: hsl(173 78% 18%);
  font-weight: 600;
}

.nav-logout-btn {
  padding: 0.375rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border: 1.5px solid hsl(0 65% 50% / 0.2);
  background: hsl(0 65% 50% / 0.05);
  color: hsl(0 65% 50%);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'DM Sans', sans-serif;
}

.nav-logout-btn:hover {
  background: hsl(0 65% 50% / 0.1);
  border-color: hsl(0 65% 50% / 0.3);
}

/* Responsive Visibility Logic */
.desktop-nav-links,
.desktop-nav-auth {
  display: none;
}

@media (min-width: 1024px) {
  .desktop-nav-links,
  .desktop-nav-auth {
    display: flex !important;
  }
}

.mobile-menu {
  background: hsl(38 25% 97% / 0.97);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid hsl(35 18% 85%);
  box-shadow: 0 12px 32px -8px rgb(0 0 0 / 0.1);
}

.mobile-link {
  display: block;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  border-radius: 0.5rem;
  color: hsl(30 10% 45%);
  transition: all 0.2s ease;
  text-decoration: none;
}

.mobile-link:hover {
  background: hsl(35 20% 90% / 0.6);
  color: hsl(25 25% 15%);
}

.mobile-link-active {
  color: hsl(173 78% 18%) !important;
  background: hsl(173 78% 18% / 0.06);
  font-weight: 600;
}
</style>
