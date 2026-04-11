<template>
  <footer class="footer">
    <div class="pattern-overlay"></div>
    <div class="container relative">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="flex items-center gap-2.5">
            <div class="footer-logo">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <span class="footer-title">
              Santri<span class="footer-accent">Connect</span>
            </span>
          </div>
          <p class="footer-desc">Platform informasi dan pendaftaran pesantren terpercaya di Indonesia.</p>
        </div>

        <div class="footer-links">
          <h4 class="footer-heading">Navigasi</h4>
          <router-link to="/pesantren" class="footer-link">Daftar Pesantren</router-link>
          <router-link to="/rekomendasi" class="footer-link">Rekomendasi</router-link>
          <router-link to="/compare" class="footer-link">Bandingkan</router-link>
          <router-link to="/track" class="footer-link">Cek Status</router-link>
        </div>

        <div class="footer-links">
          <h4 class="footer-heading">Akun</h4>
          <router-link to="/login" class="footer-link">Masuk</router-link>
          <router-link to="/register" class="footer-link">Daftar</router-link>
          <router-link to="/dashboard" class="footer-link">Dashboard</router-link>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">© {{ new Date().getFullYear() }} Santri Connect. All rights reserved.</p>
        <p class="footer-tagline">Menghubungkan santri dengan pesantren terbaik ✦</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  padding-bottom: 2rem;
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.footer-logo {
  display: flex;
  height: 2.25rem;
  width: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, hsl(173 78% 28%), hsl(40 65% 52%));
  color: white;
}

.footer-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.375rem;
  font-weight: 700;
  color: white;
}

.footer-accent {
  color: hsl(40 65% 65%);
}

.footer-desc {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-top: 0.75rem;
  max-width: 28rem;
}

.footer-heading {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: hsl(40 65% 65%);
  margin-bottom: 1rem;
}

.footer-link {
  display: block;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.9375rem;
  text-decoration: none;
  padding: 0.25rem 0;
  transition: color 0.2s ease, transform 0.2s ease;
}

.footer-link:hover {
  color: white;
  transform: translateX(3px);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

@media (max-width: 640px) {
  .footer-bottom {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

.footer-copyright {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8125rem;
}

.footer-tagline {
  color: hsl(40 65% 60%);
  font-size: 0.8125rem;
  font-weight: 500;
}
</style>
