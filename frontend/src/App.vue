<script setup>
import AppNavbar from './components/common/AppNavbar.vue'
import AppFooter from './components/common/AppFooter.vue'
</script>

<template>
  <AppNavbar />
  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <AppFooter />
</template>

<style>
.page-placeholder {
  min-height: calc(100vh - var(--navbar-height) - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
}

.page-placeholder h1 {
  font-size: 1.875rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
}
</style>
