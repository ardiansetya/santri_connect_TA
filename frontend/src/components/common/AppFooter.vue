<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__content">
        <div class="footer__brand">
          <span class="footer__logo">🕌</span>
          <span class="footer__name">Santri Connect</span>
        </div>
        <p class="footer__text">Platform informasi dan pendaftaran pesantren terpercaya di Indonesia.</p>
        <p class="footer__copy">&copy; {{ new Date().getFullYear() }} Santri Connect. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: 2.5rem 0;
  margin-top: auto;
}

.footer__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.footer__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.125rem;
}

.footer__logo { font-size: 1.5rem; }
.footer__text { color: var(--color-text-secondary); font-size: 0.9375rem; }
.footer__copy { color: var(--color-text-muted); font-size: 0.875rem; }
</style>
