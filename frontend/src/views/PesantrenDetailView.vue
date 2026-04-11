<template>
  <div class="detail-page paper-texture min-h-screen pb-20 pt-24 bg-background">
    <div class="pattern-overlay"></div>
    <div class="container relative z-10 mx-auto px-4">
      
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 animate-fade-in">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
        <p class="mt-6 text-muted-foreground font-medium text-lg">Memuat data profil pesantren...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-32 card flex flex-col items-center animate-fade-in mx-auto max-w-xl">
        <div class="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-6">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h1 class="font-heading text-3xl font-bold mb-3 text-foreground">Pesantren Tidak Ditemukan</h1>
        <p class="text-muted-foreground mb-8">{{ error }}</p>
        <router-link to="/pesantren" class="btn btn-primary">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Kembali ke Daftar Pesantren
        </router-link>
      </div>

      <!-- Detail Content -->
      <template v-else-if="pesantren">
        <!-- Breadcrumb / Back Link -->
        <nav class="mb-8 flex items-center gap-2 text-sm text-muted-foreground animate-slide-up">
          <router-link to="/" class="hover:text-primary transition-colors">Beranda</router-link>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          <router-link to="/pesantren" class="hover:text-primary transition-colors">Pesantren</router-link>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          <span class="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs">{{ pesantren.nama }}</span>
        </nav>

        <div class="grid gap-8 lg:grid-cols-3">
          <!-- Main content -->
          <div class="lg:col-span-2 space-y-8 animate-slide-up delay-1">
            
            <!-- Elegant Photo Gallery -->
            <div class="card overflow-hidden p-2 group bg-white shadow-xl ring-1 ring-border/50">
              <div class="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  v-if="currentImage"
                  :src="currentImage"
                  :alt="pesantren.nama"
                  class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div v-else class="w-full h-full flex flex-col items-center justify-center bg-primary/5">
                  <div class="text-7xl mb-4 opacity-50">🕌</div>
                  <p class="text-muted-foreground font-medium">Foto Belum Tersedia</p>
                </div>

                <!-- Navigation Overlays -->
                <button
                  v-if="allImages.length > 1"
                  @click.stop="prevImage"
                  class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  v-if="allImages.length > 1"
                  @click.stop="nextImage"
                  class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                
                <!-- Bottom Gradient & Indication -->
                <div v-if="allImages.length > 1" class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                <div v-if="allImages.length > 1" class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                  <button
                    v-for="(img, idx) in allImages"
                    :key="idx"
                    @click="currentIndex = idx"
                    class="w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-sm"
                    :class="currentIndex === idx ? 'bg-accent w-6' : 'bg-white/70 hover:bg-white'"
                  />
                </div>
              </div>
            </div>

            <!-- Header Section -->
            <div class="border-b border-border pb-6">
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div class="flex-1">
                  <div class="flex flex-wrap items-center gap-3 mb-3">
                    <span class="badge badge-primary px-3 py-1 uppercase tracking-wider text-xs shadow-sm bg-primary text-white">
                      {{ pesantren.kurikulum || 'Umum' }}
                    </span>
                    <span v-if="pesantren.tahun_berdiri" class="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      Est. {{ pesantren.tahun_berdiri }}
                    </span>
                  </div>
                  <h1 class="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight text-primary-dark">
                    {{ pesantren.nama }}
                  </h1>
                  <p class="flex items-start gap-2 text-muted-foreground text-lg">
                    <svg class="h-6 w-6 mt-0.5 shrink-0 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>
                      <span v-if="pesantren.alamat">{{ pesantren.alamat }}, </span>
                      <strong class="text-foreground">{{ pesantren.kota }}</strong>, {{ pesantren.province }}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <!-- About Section -->
            <div class="prose prose-lg max-w-none text-muted-foreground">
              <h2 class="font-heading text-2xl font-bold text-foreground mb-4 text-primary">Tentang Pesantren</h2>
              <p class="leading-relaxed">
                <template v-if="pesantren.deskripsi">{{ pesantren.deskripsi }}</template>
                <template v-else>
                  {{ pesantren.nama }} adalah salah satu pondok pesantren terkemuka di {{ pesantren.province }} yang menerapkan metode pendidikan terpadu dengan kurikulum {{ pesantren.kurikulum || 'umum' }}. 
                  Berdedikasi untuk mencetak generasi Qur'ani yang berakhlak mulia dan unggul dalam ilmu pengetahuan agama maupun umum.
                </template>
              </p>
            </div>

            <!-- Feature Grid -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4">
              <div class="card p-4 text-center group hover:bg-primary/5 transition-colors border-l-4 border-l-primary cursor-default">
                <div class="w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
                <p class="text-2xl font-bold font-heading text-foreground mb-1">{{ formatNumber(pesantren.jumlah_santri) }}</p>
                <p class="text-xs text-muted-foreground uppercase tracking-widest">Santri Aktif</p>
              </div>
              
              <div class="card p-4 text-center group hover:bg-accent/5 transition-colors border-l-4 border-l-accent cursor-default">
                <div class="w-12 h-12 mx-auto rounded-full bg-accent/10 text-accent flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                </div>
                <p class="text-2xl font-bold font-heading text-foreground mb-1">{{ pesantren.kurikulum ? capitalize(pesantren.kurikulum) : 'Umum' }}</p>
                <p class="text-xs text-muted-foreground uppercase tracking-widest">Sistem Ajar</p>
              </div>
              
              <div class="card p-4 text-center group hover:bg-success/5 transition-colors border-l-4 border-l-success cursor-default">
                <div class="w-12 h-12 mx-auto rounded-full bg-success/10 text-success flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
                <p class="text-2xl font-bold font-heading text-foreground mb-1">{{ pesantren.fasilitas?.length || 0 }}</p>
                <p class="text-xs text-muted-foreground uppercase tracking-widest">Fasilitas</p>
              </div>
              
              <div class="card p-4 text-center group hover:bg-primary/5 transition-colors border-l-4 border-l-primary cursor-default relative overflow-hidden">
                <div class="w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p class="text-lg font-bold font-heading text-primary mb-1">{{ formatCurrencyShort(pesantren.biaya_bulanan) }}</p>
                <p class="text-xs text-muted-foreground uppercase tracking-widest">SPP per Bulan</p>
              </div>
            </div>

            <!-- Facilities -->
            <div v-if="pesantren.fasilitas && pesantren.fasilitas.length">
              <h2 class="font-heading text-2xl font-bold text-foreground mb-5 text-primary flex items-center gap-2">
                Fasilitas Unggulan
              </h2>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div v-for="f in pesantren.fasilitas" :key="f" class="flex items-center gap-3 p-3 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span class="font-medium text-sm">{{ f }}</span>
                </div>
              </div>
            </div>

            <!-- Bank Information (If available) -->
            <div v-if="pesantren.rekening && (pesantren.rekening.nama_bank || pesantren.rekening.nomor_rekening)" class="mt-8 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/20">
              <h2 class="font-heading text-xl font-bold flex items-center gap-2 mb-4 text-primary">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                Informasi Rekening Resmi
              </h2>
              <div class="grid sm:grid-cols-3 gap-4">
                <div class="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white">
                  <p class="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Bank</p>
                  <p class="font-bold text-lg text-foreground">{{ pesantren.rekening.nama_bank || '-' }}</p>
                </div>
                <div class="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white">
                  <p class="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Nomor Rekening</p>
                  <div class="flex items-center gap-2">
                    <p class="font-bold text-lg text-foreground font-mono tracking-wider">{{ pesantren.rekening.nomor_rekening || '-' }}</p>
                  </div>
                </div>
                <div class="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white">
                  <p class="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Atas Nama</p>
                  <p class="font-bold text-lg text-foreground">{{ pesantren.rekening.atas_nama || '-' }}</p>
                </div>
              </div>
              <p class="text-xs text-muted-foreground mt-4 flex items-center gap-1.5"><svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Pastikan transfer hanya ke rekening resmi di atas untuk pendaftaran.</p>
            </div>
          </div>

          <!-- Sticky Sidebar -->
          <div class="lg:col-span-1">
            <div class="sticky top-24 space-y-6 animate-slide-up delay-2">
              
              <!-- Main Action Card -->
              <div class="card overflow-hidden shadow-xl border-border">
                <div class="bg-gradient-to-r from-primary to-primary-dark p-6 text-white text-center rounded-t-xl relative overflow-hidden">
                  <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz4KPC9zdmc+')] opacity-50"></div>
                  <p class="text-sm text-primary-foreground/80 uppercase tracking-widest font-semibold mb-2 relative z-10">Pendaftaran Santri Baru</p>
                  <p class="font-heading text-4xl font-bold text-accent-light relative z-10 pt-2 border-t border-white/20">
                    {{ pesantren.biaya_pendaftaran ? formatCurrency(pesantren.biaya_pendaftaran) : 'Gratis' }}
                  </p>
                  <p class="text-xs mt-2 relative z-10">Biaya Administrasi Pendaftaran Penuh</p>
                </div>
                
                <div class="p-6 bg-card space-y-4">
                  <router-link :to="`/pesantren/${pesantren.id}/daftar`" class="block">
                    <button class="btn btn-primary w-full py-3.5 text-base shadow-lg shadow-primary/30 flex items-center justify-center gap-2 group">
                      <svg class="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      Daftar Sekarang
                    </button>
                  </router-link>
                  
                  <button 
                    class="btn w-full py-3.5 flex items-center justify-center gap-2 border-2 transition-all font-semibold"
                    @click="toggleCompare"
                    :class="compareStore.isSelected(pesantren.id) 
                      ? 'bg-accent/10 border-accent text-accent hover:bg-accent/20' 
                      : 'bg-transparent border-input text-foreground hover:border-accent hover:text-accent'"
                  >
                    <svg v-if="compareStore.isSelected(pesantren.id)" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    {{ compareStore.isSelected(pesantren.id) ? 'Di Perbandingan' : 'Bandingkan' }}
                  </button>
                </div>
              </div>

              <!-- Contact Card -->
              <div class="card p-6 border-t-4 border-t-accent shadow-md">
                <h3 class="font-heading font-bold text-xl mb-5 flex items-center gap-2 text-foreground">
                  Hubungi Pesantren
                </h3>
                <div class="space-y-4">
                  <a v-if="pesantren.telepon" :href="`tel:${pesantren.telepon}`" class="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group">
                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground uppercase font-bold tracking-wider">Telepon</p>
                      <p class="font-medium text-foreground">{{ pesantren.telepon }}</p>
                    </div>
                  </a>
                  
                  <a v-if="pesantren.email" :href="`mailto:${pesantren.email}`" class="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group">
                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email</p>
                      <p class="font-medium text-foreground truncate w-40" :title="pesantren.email">{{ pesantren.email }}</p>
                    </div>
                  </a>
                  
                  <a v-if="pesantren.website" :href="pesantren.website" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group">
                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground uppercase font-bold tracking-wider">Website</p>
                      <p class="font-medium text-foreground truncate w-40" :title="pesantren.website">{{ pesantren.website.replace(/^https?:\/\//, '') }}</p>
                    </div>
                  </a>

                  <div v-if="!pesantren.telepon && !pesantren.email && !pesantren.website" class="text-center py-6">
                    <p class="text-muted-foreground text-sm italic">Informasi kontak belum disediakan oleh pengelola.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCompareStore } from '@/stores/compare'
import { pesantren as pesantrenService } from '@/services'
import { getUploadUrl } from '@/services/api'

const route = useRoute()
const compareStore = useCompareStore()

const pesantren = ref(null)
const loading = ref(true)
const error = ref('')
const currentIndex = ref(0)

// Carousel images
const allImages = computed(() => {
  if (!pesantren.value) return []
  const images = []
  if (pesantren.value.foto_utama) {
    images.push(getUploadUrl(pesantren.value.foto_utama))
  }
  if (pesantren.value.foto_galeri && Array.isArray(pesantren.value.foto_galeri)) {
    pesantren.value.foto_galeri.forEach(f => {
      images.push(getUploadUrl(f))
    })
  }
  return images
})

const currentImage = computed(() => {
  if (allImages.value.length === 0) return ''
  return allImages.value[currentIndex.value] || ''
})

function nextImage() {
  if (allImages.value.length <= 1) return
  currentIndex.value = (currentIndex.value + 1) % allImages.value.length
}

function prevImage() {
  if (allImages.value.length <= 1) return
  currentIndex.value = (currentIndex.value - 1 + allImages.value.length) % allImages.value.length
}

function formatNumber(num) {
  if (!num) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
}

function formatCurrency(amount) {
  if (!amount) return '-'
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(amount)
}

function formatCurrencyShort(amount) {
  if (!amount) return 'Hubungi'
  if (amount >= 1000000) {
    return 'Rp ' + (amount / 1000000).toFixed(1).replace('.0', '') + 'jt'
  }
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(amount)
}

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function toggleCompare() {
  if (compareStore.isSelected(pesantren.value.id)) {
    compareStore.remove(pesantren.value.id)
  } else {
    compareStore.add(pesantren.value.id)
  }
}

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const id = route.params.id
    const { data } = await pesantrenService.getById(id)
    pesantren.value = data.data
    if (!pesantren.value) {
      error.value = 'Data profil pesantren belum lengkap atau tidak ditemukan pada sistem.'
    }
  } catch (e) {
    error.value = 'Gangguan koneksi: Gagal memuat data dari server.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Reset scroll position on mount
  window.scrollTo(0, 0)
  await fetchData()
})
</script>
