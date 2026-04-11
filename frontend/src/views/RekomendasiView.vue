<template>
  <div class="rekomendasi-page paper-texture min-h-screen pb-20 overflow-hidden relative">
    <div class="pattern-overlay z-0"></div>
    
    <!-- Hero Header -->
    <section class="bg-hero-gradient relative pt-24 pb-16 mb-10 overflow-hidden">
      <div class="container relative z-10 text-center">
        <h1 class="font-heading text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
          Rekomendasi <span class="italic text-accent-light">Pesantren</span>
        </h1>
        <p class="text-white/80 max-w-2xl mx-auto text-lg animate-slide-up delay-1">
          Dapatkan rekomendasi pesantren terbaik yang secara cerdas dicocokkan dengan prioritas budget dan fasilitas impian Anda.
        </p>
      </div>
    </section>

    <div class="container relative z-10">
      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Left Sidebar - Form -->
        <div class="lg:col-span-1">
          <div class="space-y-6">
            <!-- Preferences Form -->
            <div class="card shadow-xl sticky z-20 animate-slide-up delay-2" style="top: 6rem;">
              <div class="p-6">
                <h3 class="font-heading text-xl font-bold flex items-center gap-2 mb-6 text-foreground">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                  Atur Preferensi
                </h3>
                
                <form @submit.prevent="cariRekomendasi" class="space-y-6">
                  <!-- Budget Input -->
                  <div>
                    <label class="form-label">Budget Bulanan (Maksimal)</label>
                    <div class="relative">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">Rp</span>
                      <input
                        v-model.number="form.budget"
                        type="number"
                        class="form-input pl-12 pr-4 bg-background border-2 focus:border-primary transition-all shadow-sm"
                        required
                        min="0"
                        placeholder="Contoh: 1500000"
                      />
                    </div>
                    <div v-if="form.budget" class="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20 flex justify-between items-center animate-fade-in">
                      <span class="text-xs text-primary font-bold uppercase tracking-wider">Batas Budget:</span>
                      <span class="font-bold text-primary">{{ formatCurrency(form.budget) }}</span>
                    </div>
                  </div>

                  <!-- Province Select -->
                  <div>
                    <label class="form-label">Tentukan Provinsi</label>
                    <div class="relative">
                      <select v-model="form.provinsi" class="form-input appearance-none pr-10 shadow-sm border-2 focus:border-primary cursor-pointer bg-background">
                        <option value="">Semua Provinsi di Indonesia</option>
                        <option v-for="p in provinces" :key="p.id" :value="p.name">{{ p.name }}</option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary">
                        <svg class="h-4 w-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  <!-- Fasilitas Checkboxes -->
                  <div class="pt-2">
                    <label class="form-label">Fasilitas Prioritas</label>
                    <div class="grid grid-cols-1 gap-2.5 max-h-56 overflow-y-auto custom-scrollbar p-1 pr-3 border border-border/50 rounded-xl bg-muted/20">
                      <label v-for="f in fasilitasOptions" :key="f" class="flex items-center gap-3 p-2.5 hover:bg-white rounded-lg cursor-pointer transition-all border border-transparent hover:border-border hover:shadow-sm">
                        <input
                          :value="f"
                          v-model="form.fasilitas"
                          type="checkbox"
                          class="w-4.5 h-4.5 text-primary border-border rounded focus:ring-primary/20 focus:ring-offset-0 cursor-pointer"
                        />
                        <span class="text-sm font-medium text-foreground select-none">{{ f }}</span>
                      </label>
                    </div>
                    <div v-if="form.fasilitas.length > 0" class="mt-3 flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider animate-fade-in">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      {{ form.fasilitas.length }} Kriteria Terpilih
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <button type="submit" class="btn btn-primary w-full py-3.5 text-base shadow-lg shadow-primary/30 flex items-center justify-center gap-2 group mt-8" :disabled="loading">
                    <svg v-if="!loading" class="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <div v-else class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>{{ loading ? 'Menerapkan Algoritma...' : 'Cari Rekomendasi' }}</span>
                  </button>
                </form>
              </div>

              <!-- Scoring Info Card -->
              <div class="p-6 border-t-4 border-accent bg-accent/5 rounded-b-xl">
                <h4 class="font-heading font-bold text-lg mb-4 flex items-center gap-2 text-accent-foreground">
                  <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Bobot Penilaian
                </h4>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-success rounded-full shadow-sm"></div>
                      <span class="text-sm font-medium text-foreground">Kesesuaian Anggaran</span>
                    </div>
                    <span class="font-bold font-heading text-success">40%</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-primary rounded-full shadow-sm"></div>
                      <span class="text-sm font-medium text-foreground">Lokasi Preferensi</span>
                    </div>
                    <span class="font-bold font-heading text-primary">30%</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-accent rounded-full shadow-sm"></div>
                      <span class="text-sm font-medium text-foreground">Fasilitas Ekstrakurikuler</span>
                    </div>
                    <span class="font-bold font-heading text-accent">30%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content - Results -->
        <div class="lg:col-span-3">
          <!-- Loading State -->
          <div v-if="loading && searched" class="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-accent/30 border-t-accent"></div>
            <p class="mt-6 text-foreground font-heading font-medium text-xl">Mesin Cerdas sedang mencocokkan data pesantren...</p>
            <p class="text-muted-foreground mt-2">Menghitung relevansi berdasarkan ratusan parameter institusi.</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="searched && results.length === 0" class="card shadow-lg py-16 text-center animate-fade-in border-0 flex flex-col items-center">
            <div class="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-6">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h3 class="font-heading font-bold text-3xl mb-3 text-foreground">Nihil Kecocokan Ditemukan</h3>
            <p class="text-muted-foreground text-lg mb-8 max-w-md">Kriteria yang Anda masukkan saat ini tidak menemukan kesamaan identik. Coba modifikasi batas budget atau kurangi kriteria prioritas fasilitas.</p>
            <button @click="searched = false" class="btn btn-outline border-primary text-primary px-8">
              Konfigurasi Ulang Prioritas
            </button>
          </div>

          <!-- Results -->
          <div v-else-if="results.length > 0" class="animate-fade-in delay-3">
            <!-- Results Header -->
            <div class="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 px-2">
              <div>
                <h2 class="font-heading font-bold text-3xl text-primary-dark mb-1">Rekomendasi Teratas</h2>
                <p class="text-muted-foreground">Kalkulasi Cerdas berhasil menemukan <strong class="text-foreground">{{ results.length }} kandidat dominan</strong>.</p>
              </div>
              <span class="inline-flex items-center px-5 py-2.5 bg-accent/10 border border-accent/20 text-accent rounded-full font-bold shadow-sm">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                Tingkat Akurasi Tertinggi
              </span>
            </div>

            <!-- Results List -->
            <div class="space-y-6">
              <div 
                v-for="(item, index) in results" 
                :key="item.pesantren?.id"
                class="card relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
                :class="index === 0 ? 'border-2 border-accent shadow-xl bg-gradient-to-r from-accent/5 via-white to-white' : 'border border-border'"
              >
                <!-- Gold ribbon for top match -->
                <div v-if="index === 0" class="absolute -right-12 top-6 bg-accent text-white font-bold py-1 px-12 rotate-45 shadow-md z-10 text-xs tracking-widest uppercase">
                  Paling Cocok
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 h-full relative z-0">
                  <!-- Rank & Score Column -->
                  <div class="md:col-span-1 bg-muted/30 p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-border/60">
                    <div class="text-center">
                      <div class="mb-4">
                        <div v-if="index === 0" class="w-16 h-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center text-4xl shadow-inner border border-accent/30">🥇</div>
                        <div v-else-if="index === 1" class="w-14 h-14 mx-auto rounded-full bg-slate-200/60 flex items-center justify-center text-3xl shadow-inner border border-slate-300">🥈</div>
                        <div v-else-if="index === 2" class="w-14 h-14 mx-auto rounded-full bg-orange-200/50 flex items-center justify-center text-3xl shadow-inner border border-orange-300">🥉</div>
                        <div v-else class="w-12 h-12 mx-auto rounded-full bg-background flex items-center justify-center text-xl font-bold text-muted-foreground border border-border shadow-sm">#{{ index + 1 }}</div>
                      </div>
                      
                      <div class="text-5xl font-heading font-bold" :class="index === 0 ? 'text-accent' : 'text-primary'">
                        {{ Math.round((item.score || 0) * 100) }}<span class="text-2xl text-muted-foreground ml-1">%</span>
                      </div>
                      <div class="text-xs uppercase tracking-widest font-bold text-muted-foreground mt-2 mb-6">Skor Relevansi</div>
                      
                      <!-- Score Breakdown -->
                      <div class="w-full space-y-3">
                        <div>
                          <div class="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                            <span class="text-muted-foreground">Anggaran</span>
                            <span class="text-success">{{ Math.round((item.budget_score || 0) * 100) }}%</span>
                          </div>
                          <div class="w-full bg-border rounded-full h-1.5 overflow-hidden">
                            <div class="bg-success h-full rounded-full transition-all duration-1000" :style="{ width: `${(item.budget_score || 0) * 100}%` }"></div>
                          </div>
                        </div>
                        <div>
                          <div class="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                            <span class="text-muted-foreground">Lokasi</span>
                            <span class="text-primary">{{ Math.round((item.location_score || 0) * 100) }}%</span>
                          </div>
                          <div class="w-full bg-border rounded-full h-1.5 overflow-hidden">
                            <div class="bg-primary h-full rounded-full transition-all duration-1000" :style="{ width: `${(item.location_score || 0) * 100}%` }"></div>
                          </div>
                        </div>
                        <div>
                          <div class="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                            <span class="text-muted-foreground">Fasilitas</span>
                            <span class="text-accent">{{ Math.round((item.fasilitas_score || 0) * 100) }}%</span>
                          </div>
                          <div class="w-full bg-border rounded-full h-1.5 overflow-hidden">
                            <div class="bg-accent h-full rounded-full transition-all duration-1000" :style="{ width: `${(item.fasilitas_score || 0) * 100}%` }"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Main Info Column -->
                  <div class="md:col-span-3 p-6 flex flex-col justify-center">
                    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      <div class="flex-1">
                        <router-link 
                          :to="`/pesantren/${item.pesantren?.id}`" 
                          class="font-heading text-2xl font-bold text-foreground hover:text-primary transition-colors mb-2 block group-hover:text-primary-dark"
                        >
                          {{ item.pesantren?.nama }}
                        </router-link>
                        <p class="text-muted-foreground text-sm mb-4 flex items-center gap-1.5">
                          <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          <span class="font-medium text-foreground">{{ item.pesantren?.kota }}</span>, {{ item.pesantren?.province }}
                        </p>

                        <!-- Highlights -->
                        <div class="flex flex-wrap gap-2.5 mb-5">
                          <div v-if="item.pesantren?.biaya_bulanan" class="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-lg shadow-sm">
                            <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span class="text-sm font-bold text-foreground">
                              {{ formatCurrency(item.pesantren.biaya_bulanan) }}<span class="text-xs text-muted-foreground font-normal">/bln</span>
                            </span>
                          </div>
                          <div v-if="item.pesantren?.kurikulum" class="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg shadow-sm">
                            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                            <span class="text-sm font-bold text-primary">{{ item.pesantren.kurikulum }}</span>
                          </div>
                        </div>

                        <!-- Fasilitas Match -->
                        <div v-if="item.fasilitas_match && item.fasilitas_match.length > 0">
                          <div class="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            Fasilitas yang Dicocokkan:
                          </div>
                          <div class="flex flex-wrap gap-1.5">
                            <span v-for="f in item.fasilitas_match.slice(0, 5)" :key="f" class="px-2.5 py-1 bg-accent/10 border border-accent/20 text-accent-foreground font-medium rounded text-xs shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                              {{ f }}
                            </span>
                            <span v-if="item.fasilitas_match.length > 5" class="px-2.5 py-1 bg-muted/40 text-muted-foreground font-medium rounded text-xs">
                              +{{ item.fasilitas_match.length - 5 }} lainnya
                            </span>
                          </div>
                        </div>
                        <div v-else class="text-sm text-muted-foreground italic border-l-2 border-border pl-3">
                          Pesantren ini masuk nominasi karena sangat dominan dalam sisi anggaran atau zonasi Anda.
                        </div>
                      </div>

                      <!-- Action Buttons -->
                      <div class="flex md:flex-col gap-3 shrink-0 justify-center">
                        <router-link 
                          :to="`/pesantren/${item.pesantren?.id}`" 
                          class="btn btn-primary px-6 py-2.5 shadow-md flex-1 md:flex-none justify-center group-hover:scale-105"
                        >
                          Lihat Kampus
                        </router-link>
                        <button
                          @click="toggleCompare(item.pesantren?.id)"
                          class="btn px-4 py-2.5 flex-1 md:flex-none justify-center border-2 transition-all font-semibold"
                          :class="compareStore.isSelected(item.pesantren?.id) ? 'bg-accent/10 border-accent text-accent' : 'bg-transparent border-input text-foreground hover:border-accent hover:text-accent'"
                        >
                          <svg v-if="compareStore.isSelected(item.pesantren?.id)" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                          </svg>
                          {{ compareStore.isSelected(item.pesantren?.id) ? 'Disimpan' : 'Bandingkan' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Initial State -->
          <div v-else class="card shadow-xl border-border bg-white rounded-2xl animate-fade-in text-center flex flex-col items-center justify-center py-24 min-h-[500px]">
            <div class="relative w-32 h-32 mb-8 group">
              <div class="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors duration-500"></div>
              <div class="relative w-full h-full bg-white rounded-full shadow-lg border-4 border-primary/10 flex items-center justify-center text-primary text-5xl">
                🧠
              </div>
              <!-- Floating tiny icons -->
              <div class="absolute -top-2 -right-2 text-2xl animate-bounce" style="animation-delay: 0.1s">💰</div>
              <div class="absolute -bottom-2 -left-2 text-2xl animate-bounce" style="animation-delay: 0.3s">🗺️</div>
              <div class="absolute top-1/2 -left-6 text-2xl animate-bounce" style="animation-delay: 0.5s">🕌</div>
            </div>
            
            <h3 class="font-heading text-3xl font-bold text-foreground mb-4">Mesin Rekomendasi Cerdas</h3>
            <p class="text-muted-foreground text-lg max-w-lg mx-auto mb-8 leading-relaxed">
              Biarkan algoritma <strong class="text-foreground">Santri Connect</strong> menjelajah ribuan data secara harfiah dalam milih detik. Masukkan parameter finansial, target fasilitas, dan zonasi Anda di panel kontrol.
            </p>
            
            <button @click="autoFocusBudget" class="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full text-sm tracking-wide uppercase font-bold shadow-[0_4px_14px_0_rgba(13,79,79,0.39)] hover:shadow-[0_6px_20px_rgba(13,79,79,0.23)]">
              Mulai Konfigurasi Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCompareStore } from '../stores/compare'
import { pesantren as pesantrenApi, wilayah } from '../services'

const compareStore = useCompareStore()

const form = ref({
  budget: null,
  provinsi: '',
  fasilitas: []
})

const provinces = ref([])
const results = ref([])
const loading = ref(false)
const searched = ref(false)

const fasilitasOptions = [
  'Masjid Agung', 'Asrama Ber-AC', 'Asrama Kipas', 'Lab Komputer', 'Perpustakaan Lengkap',
  'Lapangan Olahraga', 'Kantin Higenis', 'Klinik Kesehatan', 'Kolam Renang',
  'Ruang Kelas Representatif', 'Ruang Multimedia', 'Aula Pertemuan', 'Laundry Khusus', 'Koperasi Pondok'
]

function formatCurrency(amount) {
  if (!amount) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

function toggleCompare(id) {
  if (!id) return
  if (compareStore.isSelected(id)) {
    compareStore.remove(id)
  } else {
    compareStore.add(id)
  }
}

function autoFocusBudget() {
  const budgetInput = document.querySelector('input[type="number"]')
  if (budgetInput) {
    budgetInput.focus()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

async function loadProvinces() {
  try {
    const { data } = await wilayah.getProvinces()
    provinces.value = data.data || []
  } catch {
    provinces.value = []
  }
}

async function cariRekomendasi() {
  if (!form.value.budget) return
  
  loading.value = true
  searched.value = true
  
  try {
    const { data } = await pesantrenApi.getRekomendasi(form.value)
    results.value = data.data || []
  } catch (e) {
    console.error(e)
    results.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadProvinces()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: hsl(var(--muted)/0.2);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--primary)/0.2);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--primary)/0.4);
}
</style>
