<template>
  <div class="pemilik-dashboard">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 px-2">
      <div>
        <p class="text-xs text-accent uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg> Otoritas Institusi</p>
        <h2 class="font-heading text-2xl md:text-3xl font-bold text-foreground">Dashboard Manajemen Pemilik</h2>
      </div>
      
      <!-- Segmented Control Tabs (Overrides old buttons) -->
      <div class="flex gap-1 bg-muted/40 p-1.5 rounded-xl border border-border/60 shadow-inner w-full sm:w-auto overflow-x-auto">
        <button
          @click="activeTab = 'overview'"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all focus:outline-none"
          :class="activeTab === 'overview' ? 'bg-white text-accent shadow-md' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          Ikhtisar
        </button>
        <button
          @click="activeTab = 'pesantren'"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all focus:outline-none"
          :class="activeTab === 'pesantren' ? 'bg-white text-accent shadow-md' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          Inventaris Pesantren
        </button>
        <button
          @click="activeTab = 'pendaftar'"
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all focus:outline-none relative"
          :class="activeTab === 'pendaftar' ? 'bg-white text-accent shadow-md' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          Delegasi Pendaftar
          <span v-if="pendingCount > 0" class="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border border-white animate-pulse"></span>
        </button>
      </div>
    </div>

    <!-- Active Content Area -->
    <div class="relative min-h-[400px]">
      
      <!-- TAB: OVERVIEW -->
      <div v-show="activeTab === 'overview'" class="animate-fade-in">
         <!-- Stat Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="card bg-white border border-border/80 shadow-md rounded-2xl p-6 relative overflow-hidden group">
            <div class="absolute right-0 top-0 w-32 h-32 bg-accent/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <div class="flex justify-between items-start mb-4">
              <div class="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
            </div>
            <div>
              <h3 class="font-heading text-4xl font-bold text-foreground mb-1">{{ pesantren.length }}</h3>
              <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pesantren Dimiliki</p>
            </div>
          </div>

          <div class="card bg-white border border-border/80 shadow-md rounded-2xl p-6 relative overflow-hidden group">
            <div class="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <div class="flex justify-between items-start mb-4">
              <div class="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
            </div>
            <div>
              <h3 class="font-heading text-4xl font-bold text-foreground mb-1">{{ formatNumber(totalSantri) }}</h3>
              <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Kapasitas Santri</p>
            </div>
          </div>

          <div class="card bg-white border border-border/80 shadow-md rounded-2xl p-6 relative overflow-hidden group">
            <div class="absolute right-0 top-0 w-32 h-32 bg-destructive/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <div class="flex justify-between items-start mb-4">
              <div class="w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center relative">
                 <span v-if="pendingCount > 0" class="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full animate-ping"></span>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
            </div>
            <div>
              <h3 class="font-heading text-4xl font-bold text-foreground mb-1">{{ pendingCount }}</h3>
              <p class="text-xs font-bold text-destructive uppercase tracking-widest">Dokumen Menunggu Aksi</p>
            </div>
          </div>
        </div>

        <!-- Quick actions / Empty states for overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div class="card bg-muted/40 border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-accent">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </div>
              <h4 class="font-heading font-bold mb-2">Perluas Jaringan</h4>
              <p class="text-sm text-muted-foreground mb-6">Miliki cabang pesantren lain? Tambahkan kedalam ekosistem Santri Connect.</p>
              <button @click="openForm(); activeTab='pesantren'" class="btn bg-white border border-border hover:border-accent text-foreground font-bold shadow-sm px-6">Tambah Institusi</button>
           </div>
           
           <div class="card bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden">
             <!-- decorative -->
             <svg class="absolute right-0 bottom-0 text-primary w-48 h-48 opacity-5 transform translate-x-1/4 translate-y-1/4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
             <div class="relative z-10">
               <span class="badge bg-primary/20 text-primary mb-3 font-bold border-0">{{ pendaftar.length }} Pendaftar Aktif</span>
               <h4 class="font-heading font-bold text-xl mb-2">Tinjau Rekrutmen</h4>
               <p class="text-sm text-muted-foreground mb-6 max-w-[80%]">Pantau ketat arus dokumen calon santri yang mendaftar pada portal pesantren Anda secara institusional.</p>
               <button @click="activeTab='pendaftar'" class="btn btn-primary font-bold shadow-md shadow-primary/20 px-6">Buka Log Pendaftar</button>
             </div>
           </div>
        </div>
      </div>

      <!-- TAB: PESANTREN -->
      <div v-if="activeTab === 'pesantren'" class="animate-fade-in">
        <div class="flex justify-end mb-4">
          <button class="btn btn-accent shadow-md shadow-accent/20 px-6 font-bold inline-flex items-center gap-2 hover:bg-amber-600 hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98]" @click="openForm()">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Entri Pesantren Baru
          </button>
        </div>

        <div v-if="loading" class="flex flex-col justify-center items-center py-20 card bg-white border border-border rounded-xl">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent/20 border-t-accent mb-4"></div>
          <p class="text-sm font-medium text-muted-foreground">Melakukan sinkronisasi data institusi...</p>
        </div>

        <div v-else-if="pesantren.length === 0" class="card bg-white border border-border rounded-xl p-16 text-center shadow-sm">
          <div class="w-20 h-20 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm text-muted-foreground/60">
             <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <h6 class="font-heading font-bold text-lg mb-2">Belum Memiliki Otoritas Pesantren</h6>
          <p class="text-muted-foreground text-sm max-w-[300px] mx-auto mb-6">Mulai masukkan unit pendidikan yang Anda kelola untuk mengaktifkan modul penerimaan.</p>
          <button class="btn btn-outline border-border hover:bg-muted font-bold" @click="openForm()">Daftarkan Sekarang</button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="p in pesantren" :key="p.id" class="card bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col">
            <!-- image cap -->
            <div class="h-40 bg-muted relative overflow-hidden shrink-0">
               <img v-if="p.foto_utama" :src="getImageUrl(p.foto_utama)" :alt="p.nama" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                 <svg class="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
               </div>
               <!-- overlay gradient -->
               <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               <span class="absolute bottom-3 left-4 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/20 backdrop-blur-sm rounded">ID #{{ String(p.id).padStart(4, '0') }}</span>
            </div>
            <!-- card body -->
            <div class="p-5 flex-1 flex flex-col">
              <h5 class="font-heading font-bold text-lg mb-1 line-clamp-1" :title="p.nama">{{ p.nama }}</h5>
              <p class="text-sm text-muted-foreground flex items-center gap-1.5 mb-4">
                <svg class="w-4 h-4 text-accent/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                {{ p.kota }}, {{ p.province }}
              </p>
              
              <div class="grid grid-cols-2 gap-2 mb-5 shrink-0">
                 <div class="bg-muted/30 border border-border/60 rounded p-2 text-center">
                   <p class="text-[10px] uppercase font-bold text-muted-foreground mb-0.5.">Santri</p>
                   <p class="font-mono font-bold text-sm">{{ p.jumlah_santri || '-' }}</p>
                 </div>
                 <div class="bg-muted/30 border border-border/60 rounded p-2 text-center">
                   <p class="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Kurikulum</p>
                   <p class="font-bold text-xs" :class="p.kurikulum ? 'text-foreground capitalize' : 'text-muted-foreground'">{{ p.kurikulum || 'N-A' }}</p>
                 </div>
              </div>
              
              <!-- actions -->
              <div class="flex gap-2 mt-auto pt-4 border-t border-border/60">
                <button class="btn btn-outline border-border hover:bg-muted text-foreground font-bold text-xs py-2 flex-1 flex justify-center items-center gap-1.5 transition-all" @click="openForm(p)">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  Perbarui
                </button>
                 <button class="btn bg-destructive/10 text-destructive hover:bg-destructive hover:text-white font-bold text-xs py-2 px-3 transition-colors shrink-0 border border-destructive/20" @click="confirmDelete(p)" title="Hapus Permanen">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: PENDAFTAR -->
      <div v-show="activeTab === 'pendaftar'" class="animate-fade-in card bg-white border border-border shadow-sm rounded-2xl overflow-hidden min-h-[400px]">
        <div class="px-6 py-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent flex justify-between items-center sm:hidden">
            <h5 class="font-heading font-bold text-xl text-primary-dark">Auditor Pendaftar</h5>
        </div>
        
        <div class="px-6 py-4 bg-muted/30 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
           <!-- Pesantren Filter for Pendaftar Table -->
           <div class="flex items-center gap-3 w-full sm:w-auto">
             <label class="text-xs font-bold text-muted-foreground uppercase tracking-wider shrink-0 hidden sm:block">Filter Institusi:</label>
             <select v-model="filterPesantrenId" class="form-input text-sm border border-border w-full sm:w-64 py-2 font-medium bg-white rounded-lg focus:border-primary">
               <option value="">-- Tampilkan Semua Cabang --</option>
               <option v-for="p in pesantren" :key="p.id" :value="p.id">{{ p.nama }}</option>
             </select>
           </div>
           
           <!-- Search inline -->
           <div class="relative w-full sm:w-64 shrink-0">
             <span class="absolute inset-y-0 left-0 pl-3 flex items-center pt-0.5 text-muted-foreground">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             </span>
             <input type="text" class="w-full form-input pl-10 py-2 border border-border rounded-lg text-sm bg-white focus:border-primary" placeholder="Cari Nama / No Pendaftaran..." v-model="searchQuery">
           </div>
        </div>

        <div v-if="loadingPendaftar" class="flex justify-center items-center py-20">
             <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary"></div>
        </div>
        <div v-else-if="filteredPendaftar.length === 0" class="text-center py-20">
          <div class="w-16 h-16 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm text-muted-foreground/50">
             <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <h6 class="font-bold text-lg text-foreground mb-1">Log Bersih</h6>
          <p class="text-sm text-muted-foreground">Tidak ditemukan antrian pendaftar aktif.</p>
        </div>
        
         <!-- Pendaftar Grid/Cards instead of basic table for mobile flex -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left whitespace-nowrap">
            <thead class="bg-muted/20 border-y border-border/60 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th class="px-6 py-4">Entitas Registran</th>
                <th class="px-6 py-4">No. Kontak</th>
                <th class="px-6 py-4">Status & Waktu</th>
                <th class="px-6 py-4 text-center">Otorisasi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/60">
               <tr v-for="p in filteredPendaftar" :key="p.id" class="hover:bg-primary/5 transition-colors group">
                 <td class="px-6 py-4">
                   <p class="font-bold text-sm text-foreground mb-0.5">{{ p.nama_lengkap }}</p>
                   <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span class="font-mono bg-muted/50 px-1 py-0.5 rounded border border-border/50 text-foreground">{{ p.nomor_pendaftaran }}</span>
                      <span class="truncate max-w-[150px] opacity-70" :title="p.pesantren?.nama">{{ p.pesantren?.nama }}</span>
                   </div>
                 </td>
                 <td class="px-6 py-4">
                   <p class="font-mono text-sm font-medium">{{ p.no_hp || '-' }}</p>
                 </td>
                 <td class="px-6 py-4">
                    <span class="inline-flex px-2 py-0.5 rounded border text-[10px] uppercase font-bold tracking-widest shadow-[0_1px_2px_rgba(0,0,0,0.05)] mb-1" :class="statusBadge(p.status)">
                      {{ statusLabel(p.status) }}
                    </span>
                    <p class="text-xs text-muted-foreground flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      {{ formatDate(p.created_at) }}
                    </p>
                 </td>
                 <td class="px-6 py-4 text-center">
                    <button class="btn btn-outline border-border hover:border-primary hover:text-primary hover:bg-primary/5 px-4 py-1.5 text-xs font-bold transition-colors shadow-sm" @click="openPendaftarModal(p)">
                      Verifikasi Berkas
                    </button>
                 </td>
               </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div><!-- End Active Area -->

    <!-- Form Modal (Pesantren) - Simplified visually -->
    <Teleport to="body">
      <div v-if="showForm" class="fixed inset-0 z-[100] flex justify-center p-4 sm:p-6" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-full overflow-hidden flex flex-col animate-slide-up relative mt-10 md:mt-0">
          
          <div class="px-8 py-5 border-b border-border bg-gradient-to-r from-accent/5 to-transparent flex justify-between items-center shrink-0">
             <div>
               <h5 class="font-heading font-bold text-xl text-accent-foreground mb-0.5">{{ editingId ? 'Restrukturisasi Database Pesantren' : 'Onboarding Cabang Pesantren' }}</h5>
               <p class="text-xs text-muted-foreground uppercase tracking-widest font-bold">Modul Manajemen Kepemilikan</p>
             </div>
             <button type="button" class="w-8 h-8 rounded-full bg-muted hover:bg-destructive hover:text-white flex items-center justify-center transition-colors" @click="closeForm">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
          </div>

          <div class="p-8 overflow-y-auto flex-1 custom-scrollbar">
            <!-- We rely on same form schema as AdminPesantrenManagement, but inject stylistic updates inline here -->
            <form @submit="onSubmit">
              <!-- Error Summary -->
              <div v-if="Object.keys(errors).length > 0" class="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <p class="text-sm font-bold text-destructive flex items-center gap-2 mb-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  Terdapat {{ Object.keys(errors).length }} kesalahan pada form
                </p>
                <p class="text-xs text-destructive/80">Silakan periksa dan perbaiki field yang ditandai merah di bawah.</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div class="md:col-span-2">
                  <label class="form-label font-bold text-sm mb-1 block">Nama Resmi Pesantren <span class="text-destructive">*</span></label>
                  <input v-model="nama" v-bind="namaProps" type="text" class="w-full px-4 py-3 border-2 rounded-xl border-border focus:border-accent outline-none" :class="{ 'border-destructive': errors.nama }" placeholder="Nama lengkap pesantren" />
                  <p v-if="errors.nama" class="text-destructive text-xs font-bold mt-1">{{ errors.nama }}</p>
                </div>
                
                <div>
                  <label class="form-label font-bold text-sm mb-1 block">Provinsi Wilayah <span class="text-destructive">*</span></label>
                  <select v-model="province" v-bind="provinceProps" class="form-input appearance-none w-full px-4 py-3 border-2 rounded-xl border-border focus:border-accent outline-none bg-white" :class="{ 'border-destructive': errors.province }">
                    <option value="">Pilih Provinsi</option>
                    <option v-for="p in provinces" :key="p.id" :value="p.name">{{ p.name }}</option>
                  </select>
                  <p v-if="errors.province" class="text-destructive text-xs font-bold mt-1">{{ errors.province }}</p>
                </div>
                
                <div>
                  <label class="form-label font-bold text-sm mb-1 block">Kota / Kabupaten <span class="text-destructive">*</span></label>
                  <div class="relative">
                    <select v-model="kota" v-bind="kotaProps" class="form-input appearance-none w-full px-4 py-3 border-2 rounded-xl border-border focus:border-accent outline-none bg-white font-medium" :class="{ 'border-destructive': errors.kota, 'opacity-60 cursor-not-allowed': !province || loadingRegencies }" :disabled="!province || loadingRegencies">
                      <option value="">{{ loadingRegencies ? 'Memuat Data...' : (province ? 'Pilih Kota/Kabupaten' : 'Pilih Provinsi Terlebih Dahulu') }}</option>
                      <option v-for="r in regencies" :key="r.id" :value="r.name">{{ r.name }}</option>
                    </select>
                    <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <svg v-if="loadingRegencies" class="animate-spin h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  <p v-if="errors.kota" class="text-destructive text-xs font-bold mt-1">{{ errors.kota }}</p>
                </div>
                
                <div class="md:col-span-2">
                  <label class="form-label font-bold text-sm mb-1 block">Detail Alamat Lengkap</label>
                  <input v-model="alamat" v-bind="alamatProps" type="text" class="form-input w-full px-4 py-3 border-2 rounded-xl border-border focus:border-accent outline-none" placeholder="Jl. Raya Utama No. 15..." />
                </div>

                <!-- Kontak Section -->
                <div class="md:col-span-2 pt-4 border-t border-border/60">
                  <h6 class="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    Informasi Kontak
                  </h6>
                </div>

                <div>
                  <label class="form-label font-bold text-sm mb-1 block">Email Pesantren</label>
                  <input v-model="email" v-bind="emailProps" type="email" class="form-input w-full px-4 py-3 border-2 rounded-xl border-border focus:border-accent outline-none" :class="{ 'border-destructive': errors.email }" placeholder="pesantren@domain.com" />
                  <p v-if="errors.email" class="text-destructive text-xs font-bold mt-1">{{ errors.email }}</p>
                </div>

                <div>
                  <label class="form-label font-bold text-sm mb-1 block">Nomor Telepon</label>
                  <input v-model="telepon" v-bind="teleponProps" type="text" class="form-input w-full px-4 py-3 border-2 rounded-xl border-border focus:border-accent outline-none font-mono" :class="{ 'border-destructive': errors.telepon }" placeholder="081234567890" />
                  <p v-if="errors.telepon" class="text-destructive text-xs font-bold mt-1">{{ errors.telepon }}</p>
                </div>

                <div class="md:col-span-2">
                  <label class="form-label font-bold text-sm mb-1 block">Website</label>
                  <input v-model="website" v-bind="websiteProps" type="text" class="form-input w-full px-4 py-3 border-2 rounded-xl border-border focus:border-accent outline-none" :class="{ 'border-destructive': errors.website }" placeholder="https://pesantren.example.com" />
                  <p v-if="errors.website" class="text-destructive text-xs font-bold mt-1">{{ errors.website }}</p>
                </div>

                <!-- Statistik Section -->
                <div class="md:col-span-2 pt-4 border-t border-border/60">
                  <h6 class="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    Data Statistik
                  </h6>
                </div>

                <div>
                  <label class="form-label font-bold text-sm mb-1 block">Sistem Kurikulum</label>
                  <select v-model="kurikulum" v-bind="kurikulumProps" class="form-input appearance-none w-full px-4 py-3 border-2 rounded-xl border-border focus:border-accent outline-none bg-white">
                    <option value="">Pilih Kurikulum</option>
                    <option value="modern">Pesantren Modern</option>
                    <option value="salaf">Pesantren Salaf</option>
                    <option value="campuran">Hibrida/Campuran</option>
                  </select>
                </div>

                <div>
                  <label class="form-label font-bold text-sm mb-1 block">Tahun Berdiri</label>
                  <input v-model="tahun_berdiri" v-bind="tahun_berdiriProps" type="number" class="form-input w-full px-4 py-3 border-2 rounded-xl border-border focus:border-accent outline-none" :class="{ 'border-destructive': errors.tahun_berdiri }" placeholder="Contoh: 1995" min="1800" :max="currentYear" />
                  <p v-if="errors.tahun_berdiri" class="text-destructive text-xs font-bold mt-1">{{ errors.tahun_berdiri }}</p>
                </div>

                <div>
                  <label class="form-label font-bold text-sm mb-1 block">Jumlah Santri</label>
                  <input v-model="jumlah_santri" v-bind="jumlah_santriProps" type="number" class="form-input w-full px-4 py-3 border-2 rounded-xl border-border focus:border-accent outline-none font-mono" :class="{ 'border-destructive': errors.jumlah_santri }" min="0" placeholder="0" />
                  <p v-if="errors.jumlah_santri" class="text-destructive text-xs font-bold mt-1">{{ errors.jumlah_santri }}</p>
                </div>

                <div>
                  <label class="form-label font-bold text-sm mb-1 block">Jumlah Pengajar</label>
                  <input v-model="jumlah_pengajar" v-bind="jumlah_pengajarProps" type="number" class="form-input w-full px-4 py-3 border-2 rounded-xl border-border focus:border-accent outline-none font-mono" :class="{ 'border-destructive': errors.jumlah_pengajar }" min="0" placeholder="0" />
                  <p v-if="errors.jumlah_pengajar" class="text-destructive text-xs font-bold mt-1">{{ errors.jumlah_pengajar }}</p>
                </div>

                <!-- Keuangan Section -->
                <div class="md:col-span-2 space-y-4 pt-4 border-t border-border/60">
                  <h6 class="font-bold text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Biaya (Rp)
                  </h6>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="form-label text-sm mb-1 block font-semibold">Uang Masuk Pendaftaran</label>
                      <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">Rp</span>
                        <input :value="biayaPendaftaranDisplay" @input="onBiayaPendaftaranInput" type="text" inputmode="numeric" class="form-input w-full pl-12 pr-4 py-2 border-2 rounded-xl border-border focus:border-accent" :class="{ 'border-destructive': errors.biaya_pendaftaran }" placeholder="0" />
                      </div>
                      <p v-if="errors.biaya_pendaftaran" class="text-destructive text-xs font-bold mt-1">{{ errors.biaya_pendaftaran }}</p>
                    </div>
                    <div>
                      <label class="form-label text-sm mb-1 block font-semibold">SPP Bulanan</label>
                      <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">Rp</span>
                        <input :value="biayaBulananDisplay" @input="onBiayaBulananInput" type="text" inputmode="numeric" class="form-input w-full pl-12 pr-4 py-2 border-2 rounded-xl border-border focus:border-accent" :class="{ 'border-destructive': errors.biaya_bulanan }" placeholder="0" />
                      </div>
                      <p v-if="errors.biaya_bulanan" class="text-destructive text-xs font-bold mt-1">{{ errors.biaya_bulanan }}</p>
                    </div>
                  </div>
                </div>

                <!-- Fasilitas Section -->
                <div class="md:col-span-2 pt-4 border-t border-border/60">
                  <label class="form-label font-bold text-sm mb-2 block">Fasilitas Pesantren</label>
                  <p class="text-xs text-muted-foreground mb-3">Pisahkan dengan koma. Contoh: Masjid, Asrama, Perpustakaan, Lab Komputer</p>
                  <input v-model="fasilitasInput" type="text" class="form-input w-full px-4 py-3 border-2 rounded-xl border-border focus:border-accent outline-none" placeholder="Masjid, Asrama, Perpustakaan, Lab Komputer..." />
                </div>
                 
                <div class="md:col-span-2">
                  <label class="form-label font-bold text-sm mb-1 block">Deskripsi / Profil Singkat</label>
                  <textarea v-model="deskripsi" v-bind="deskripsiProps" class="form-input w-full px-4 py-3 border-2 rounded-xl border-border focus:border-accent resize-none" rows="3" placeholder="Tuliskan profil singkat pesantren..."></textarea>
                </div>
                 
                 <!-- Media Upload UI -->
                 <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                   <!-- Foto Utama -->
                   <div class="border-2 border-dashed rounded-2xl p-5 hover:border-accent/50 transition-colors bg-muted/10 relative group" :class="{ 'border-destructive': fileErrors.foto_utama }">
                      <label class="form-label block mb-2 font-bold text-sm">Visual Thumbnail Utama *</label>
                      
                      <!-- Existing Thumbnail Preview -->
                      <div v-if="!files.foto_utama && existing_foto_utama" class="mb-3 relative z-20 pointer-events-auto flex justify-center">
                         <div class="relative w-32 h-32 rounded-xl border-4 border-white shadow-md overflow-hidden group/thumb">
                            <img :src="getImageUrl(existing_foto_utama)" class="w-full h-full object-cover" />
                            <button type="button" @click.stop="removeExistingUtama" class="absolute top-1 right-1 p-1.5 bg-destructive rounded-full text-white shadow-lg opacity-100 sm:opacity-0 sm:group-hover/thumb:opacity-100 transition-all transform hover:scale-110 flex items-center justify-center">
                               <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                            <div class="absolute inset-x-0 bottom-0 bg-black/40 py-1 text-[8px] text-white text-center font-bold">Thumbnail Aktif</div>
                         </div>
                      </div>

                      <input @change="handleFileUpload('foto_utama', $event)" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" type="file" accept="image/jpeg,image/png,image/jpg" />
                      <div class="text-center py-2" v-if="!files.foto_utama && !existing_foto_utama">
                        <div class="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <p class="text-xs font-bold text-accent">Pilih Foto Utama</p>
                      </div>
                      
                      <!-- Pending New Thumbnail -->
                      <div v-if="files.foto_utama" class="mt-2 text-[10px] font-bold bg-white p-2 border border-border rounded flex justify-between items-center relative z-20 shadow-sm">
                        <span class="truncate pr-2 text-success flex items-center gap-1.5">
                          <span class="w-2 h-2 rounded-full bg-success"></span>
                          Siap Ganti: {{ files.foto_utama.name }}
                        </span>
                        <button type="button" class="text-destructive font-bold hover:bg-destructive/10 p-1 rounded" @click.stop="removeFile('foto_utama')">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </div>
                   </div>

                   <!-- Foto Galeri -->
                   <div class="border-2 border-dashed rounded-2xl p-5 hover:border-accent/50 transition-colors bg-muted/10 relative group" :class="{ 'border-destructive': fileErrors.foto_galeri }">
                      <label class="form-label block mb-2 font-bold text-sm">Media Galeri (Maks 5)</label>
                      <input @change="handleFileUpload('foto_galeri', $event)" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" type="file" accept="image/jpeg,image/png,image/jpg" multiple />
                      <div class="text-center py-2">
                        <div class="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <p class="text-xs font-bold text-accent">Pilih Foto Galeri</p>
                      </div>

                      <!-- Existing Gallery Section -->
                      <div v-if="existing_foto_galeri.length > 0" class="mt-4 relative z-20 pointer-events-auto">
                        <p class="text-[10px] uppercase font-bold text-muted-foreground mb-2">Foto Saat Ini ({{ existing_foto_galeri.length }})</p>
                        <div class="grid grid-cols-5 gap-2 pb-2">
                           <div v-for="(filename, index) in existing_foto_galeri" :key="index" class="relative group/img aspect-square rounded-lg border border-border overflow-hidden bg-white shadow-sm">
                              <img :src="getImageUrl(filename)" class="w-full h-full object-cover" />
                              <button type="button" @click.stop="removeExistingGallery(index)" class="absolute top-0 right-0 p-1 bg-destructive/90 text-white opacity-100 sm:opacity-0 sm:group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                 <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                              </button>
                           </div>
                        </div>
                      </div>
                      <!-- Pending Uploads Section -->
                      <div v-if="files.foto_galeri.length > 0" class="mt-4 relative z-20 pointer-events-auto">
                        <p class="text-[10px] uppercase font-bold text-muted-foreground mb-2">Unggahan Baru ({{ files.foto_galeri.length }})</p>
                        <div class="flex flex-col gap-1 max-h-32 overflow-y-auto pr-1">
                           <div v-for="(file, index) in files.foto_galeri" :key="index" class="bg-white px-2 py-1.5 border border-border rounded flex justify-between items-center text-[10px] font-bold shadow-sm">
                             <span class="truncate pr-2 text-success flex items-center gap-1.5">
                               <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
                               {{ file.name }}
                             </span>
                             <button type="button" class="text-destructive font-bold hover:bg-destructive/10 p-1 rounded" @click.stop="removeGalleryFile(index)">
                               <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                             </button>
                           </div>
                        </div>
                      </div>
                   </div>
                 </div>
              </div>
              
              <div v-if="serverError" class="mt-4 p-3 bg-destructive/10 text-destructive text-sm font-bold rounded-lg">{{ serverError }}</div>

              <div class="mt-8 flex justify-end gap-3 pt-6 border-t border-border bg-white sticky bottom-0 -mx-8 px-8 pb-2">
                <button type="button" class="btn btn-outline border-border hover:bg-muted text-foreground font-bold px-6 py-2.5 rounded-xl transition-all" @click="closeForm">Buang Skenario</button>
                <button type="submit" class="btn bg-accent text-white px-8 py-2.5 rounded-xl font-bold shadow-md hover:bg-amber-600 hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]" :disabled="isSubmitting">
                   {{ isSubmitting ? 'Mengeksekusi...' : 'Eksekusi Modifikasi' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Pendaftar Detail -->
    <Teleport to="body">
       <div v-if="selectedPendaftar" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up transform border border-border">
             <div class="px-8 py-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent flex justify-between items-start shrink-0">
               <div>
                 <div class="flex items-center gap-2 mb-1">
                    <h5 class="font-heading font-bold text-xl text-foreground m-0">Verifikasi Berkas Pendaftar</h5>
                    <span class="inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded shadow-sm border" :class="statusBadge(selectedPendaftar.status)">{{ statusLabel(selectedPendaftar.status) }}</span>
                 </div>
                 <p class="text-xs text-muted-foreground font-mono">Kode: {{ selectedPendaftar.nomor_pendaftaran }}</p>
               </div>
               <button @click="closePendaftarModal" class="w-8 h-8 rounded-full bg-muted hover:bg-destructive hover:text-white flex items-center justify-center transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
               </button>
             </div>
             
             <div class="p-8 overflow-y-auto flex-1">
                <!-- Identity Info -->
                <h6 class="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-3">Data Identitas</h6>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                   <div>
                      <p class="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">Nama Lengkap</p>
                      <p class="font-semibold text-sm">{{ selectedPendaftar.nama_lengkap }}</p>
                   </div>
                   <div>
                      <p class="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">NIK</p>
                      <p class="font-mono text-sm font-semibold">{{ selectedPendaftar.nik || '-' }}</p>
                   </div>
                   <div>
                      <p class="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">Jenis Kelamin</p>
                      <p class="text-sm font-medium">{{ selectedPendaftar.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</p>
                   </div>
                   <div>
                      <p class="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">Tempat, Tgl Lahir</p>
                      <p class="text-sm font-medium">{{ selectedPendaftar.tempat_lahir || '-' }}, {{ formatDate(selectedPendaftar.tanggal_lahir) }}</p>
                   </div>
                   <div>
                      <p class="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">No. HP</p>
                      <p class="font-mono text-sm font-medium">{{ selectedPendaftar.no_hp || '-' }}</p>
                   </div>
                   <div>
                      <p class="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">Pesantren Tujuan</p>
                      <p class="font-bold text-sm text-primary">{{ selectedPendaftar.pesantren?.nama || selectedPendaftar.pesantren_nama }}</p>
                   </div>
                </div>

                <!-- Parent Info -->
                <h6 class="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-3">Data Orang Tua / Wali</h6>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                   <div>
                      <p class="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">Nama Ayah</p>
                      <p class="text-sm font-medium">{{ selectedPendaftar.nama_ayah || '-' }}</p>
                   </div>
                   <div>
                      <p class="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">Nama Ibu</p>
                      <p class="text-sm font-medium">{{ selectedPendaftar.nama_ibu || '-' }}</p>
                   </div>
                   <div>
                      <p class="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">No. HP Ortu</p>
                      <p class="font-mono text-sm font-medium">{{ selectedPendaftar.no_hp_ortu || '-' }}</p>
                   </div>
                </div>

                <!-- Document Preview -->
                <h6 class="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-3">Dokumen yang Diunggah</h6>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                   <div class="border border-border rounded-xl overflow-hidden">
                      <p class="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-3 py-2 bg-muted/30 border-b border-border">Foto KTP</p>
                      <div class="aspect-[4/3] bg-muted/10 flex items-center justify-center">
                         <img v-if="selectedPendaftar.foto_ktp" :src="getPendaftaranUrl(selectedPendaftar.foto_ktp)" alt="Foto KTP" class="w-full h-full object-contain p-2" @error="(e) => e.target.src=''" />
                         <p v-else class="text-xs text-muted-foreground italic">Belum diunggah</p>
                      </div>
                   </div>
                   <div class="border border-border rounded-xl overflow-hidden">
                      <p class="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-3 py-2 bg-muted/30 border-b border-border">Pas Foto</p>
                      <div class="aspect-[4/3] bg-muted/10 flex items-center justify-center">
                         <img v-if="selectedPendaftar.pas_foto" :src="getPendaftaranUrl(selectedPendaftar.pas_foto)" alt="Pas Foto" class="w-full h-full object-contain p-2" @error="(e) => e.target.src=''" />
                         <p v-else class="text-xs text-muted-foreground italic">Belum diunggah</p>
                      </div>
                   </div>
                   <div class="border border-border rounded-xl overflow-hidden">
                      <p class="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-3 py-2 bg-muted/30 border-b border-border">Kartu Keluarga</p>
                      <div class="aspect-[4/3] bg-muted/10 flex items-center justify-center">
                         <img v-if="selectedPendaftar.kartu_keluarga" :src="getPendaftaranUrl(selectedPendaftar.kartu_keluarga)" alt="Kartu Keluarga" class="w-full h-full object-contain p-2" @error="(e) => e.target.src=''" />
                         <p v-else class="text-xs text-muted-foreground italic">Belum diunggah</p>
                      </div>
                   </div>
                </div>

                <!-- Existing notes -->
                <div v-if="selectedPendaftar.catatan_admin" class="bg-destructive/5 border border-destructive/20 rounded-xl p-4 mb-4">
                   <p class="text-[10px] uppercase font-bold text-destructive tracking-widest mb-1 mt-0 flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Catatan Sebelumnya
                   </p>
                   <p class="text-sm leading-relaxed">{{ selectedPendaftar.catatan_admin }}</p>
                </div>

                <!-- Notes input for action -->
                <div class="mb-2">
                   <label class="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1 block">Catatan Verifikasi (Opsional)</label>
                   <textarea v-model="verifikasiCatatan" rows="2" class="form-input w-full border border-border rounded-lg text-sm p-3 focus:border-primary" placeholder="Tambahkan catatan untuk pendaftar..."></textarea>
                </div>
             </div>
             
             <!-- Action Footer -->
             <div class="px-8 py-5 bg-muted/20 border-t border-border shrink-0">
                <div v-if="statusUpdateError" class="text-xs text-destructive font-medium mb-3 text-center">{{ statusUpdateError }}</div>
                <div class="flex flex-col sm:flex-row gap-3">
                   <button class="btn bg-white border border-border shadow-sm font-bold text-sm px-6 flex-1" @click="closePendaftarModal" :disabled="updatingStatus">
                     Tutup
                   </button>
                   <button 
                     v-if="selectedPendaftar.status === 'pending' || selectedPendaftar.status === 'diproses'"
                     class="btn bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive hover:text-white font-bold text-sm px-6 flex-1 transition-all" 
                     @click="handleStatusUpdate('ditolak')"
                     :disabled="updatingStatus"
                   >
                     <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                     {{ updatingStatus ? 'Memproses...' : 'Tolak Pendaftar' }}
                   </button>
                   <button 
                     v-if="selectedPendaftar.status === 'pending' || selectedPendaftar.status === 'diproses'"
                     class="btn bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-6 flex-1 shadow-lg shadow-green-600/20 transition-all" 
                     @click="handleStatusUpdate('diterima')"
                     :disabled="updatingStatus"
                   >
                     <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                     {{ updatingStatus ? 'Memproses...' : 'Terima Pendaftar' }}
                   </button>
                </div>
             </div>
          </div>
       </div>
    </Teleport>
    
     <!-- Modal Delete Confirmation -->
    <Teleport to="body">
       <div v-if="showDeleteConfirm" class="fixed inset-0 z-[100] flex items-center justify-center p-4" style="background: rgba(0,0,0,0.5); backdrop-filter: blur(2px);">
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm text-center p-6 border-2 border-destructive border-opacity-50">
              <h3 class="font-bold text-lg text-destructive mb-2">Hapus Otoritas!</h3>
              <p class="text-sm text-muted-foreground mb-4">Mencabut {{ deleteTarget?.nama }} dari kontrol anda tidak bisa dibatalkan.</p>
              <div class="flex gap-2">
                 <button class="btn btn-outline flex-1 py-2 font-bold" @click="showDeleteConfirm=false">Batal</button>
                 <button class="btn bg-destructive hover:bg-red-700 text-white flex-1 py-2 font-bold shadow-lg shadow-destructive/20 transition-all transform active:scale-95" @click="executeDelete">SETUJU, HAPUS</button>
              </div>
          </div>
       </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { pemilik, wilayah } from '../../services'
import { getUploadUrl } from '../../services/api'

const getImageUrl = (path) => getUploadUrl(path)

const activeTab = ref('overview')
const pesantren = ref([])
const pendaftar = ref([])
const loading = ref(true)
const loadingPendaftar = ref(true)
const filterPesantrenId = ref('')
const searchQuery = ref('')
const selectedPendaftar = ref(null)

// Verification Logic State
const verifikasiCatatan = ref('')
const updatingStatus = ref(false)
const statusUpdateError = ref('')

const getPendaftaranUrl = (filename) => {
  if (!filename) return ''
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  if (import.meta.env.DEV) {
    return `/uploads/pendaftaran/${filename}`
  }
  const baseUrl = API_BASE_URL.replace('/api', '')
  return `${baseUrl}/uploads/pendaftaran/${filename}`
}

const provinces = ref([])
const regencies = ref([])
const loadingRegencies = ref(false)
const showForm = ref(false)
const editingId = ref(null)
const serverError = ref('')
const existing_foto_galeri = ref([])
const existing_foto_utama = ref(null)

// Stat computations
const pendingCount = computed(() => {
  return pendaftar.value.filter(p => p.status === 'pending').length
})
const totalSantri = computed(() => {
  return pesantren.value.reduce((total, p) => total + (parseInt(p.jumlah_santri) || 0), 0)
})

const filteredPendaftar = computed(() => {
   let result = pendaftar.value;
   if(filterPesantrenId.value) {
     result = result.filter(p => String(p.pesantren_id) === String(filterPesantrenId.value))
   }
   if(searchQuery.value) {
     const lp = searchQuery.value.toLowerCase()
     result = result.filter(p => 
       p.nama_lengkap?.toLowerCase().includes(lp) || 
       p.nomor_pendaftaran?.toLowerCase().includes(lp)
     )
   }
   return result
})


function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num)
}
function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function statusBadge(status) {
  const map = {
    pending: 'bg-accent/10 text-accent border-accent/20',
    diproses: 'bg-blue-100 text-blue-800 border-blue-200',
    diterima: 'bg-success/10 text-success border-success/20',
    ditolak: 'bg-destructive/10 text-destructive border-destructive/20'
  }
  return map[status] || 'bg-muted text-muted-foreground border-border'
}

function statusLabel(status) {
  const map = {
    pending: 'Menunggu',
    diproses: 'Review',
    diterima: 'Diterima',
    ditolak: 'Ditolak/Batal'
  }
  return map[status] || status
}

function openPendaftarModal(p) {
  selectedPendaftar.value = p
  verifikasiCatatan.value = ''
  statusUpdateError.value = ''
}
function closePendaftarModal() {
  selectedPendaftar.value = null
  verifikasiCatatan.value = ''
  statusUpdateError.value = ''
}

async function handleStatusUpdate(newStatus) {
  if (!selectedPendaftar.value) return
  
  updatingStatus.value = true
  statusUpdateError.value = ''

  try {
    const payload = { status: newStatus }
    if (verifikasiCatatan.value.trim()) {
      payload.catatan_admin = verifikasiCatatan.value.trim()
    }
    
    await pemilik.updatePendaftaranStatus(selectedPendaftar.value.id, payload)
    
    // Refresh list locally
    const index = pendaftar.value.findIndex(p => p.id === selectedPendaftar.value.id)
    if (index !== -1) {
      pendaftar.value[index].status = newStatus
      if (payload.catatan_admin) {
        pendaftar.value[index].catatan_admin = payload.catatan_admin
      }
    }
    
    closePendaftarModal()
  } catch (err) {
    statusUpdateError.value = err.response?.data?.error || 'Gagal memperbarui status pendaftar'
  } finally {
    updatingStatus.value = false
  }
}

// ==== CRUD PESANTREN LOGIC ====
const showDeleteConfirm = ref(false)
const deleteTarget = ref(null)

const currentYear = new Date().getFullYear()
const phoneRegex = /^(\+62|62|0)[0-9]{8,13}$/
const schema = yup.object({
  nama: yup.string().required('Nama pesantren wajib diisi').min(3, 'Nama minimal 3 karakter'),
  province: yup.string().required('Provinsi wajib dipilih'),
  kota: yup.string().required('Kota/Kabupaten wajib diisi'),
  alamat: yup.string().notRequired(),
  kurikulum: yup.string().notRequired(),
  tahun_berdiri: yup.number().nullable().transform((v) => (v === '' ? null : v)).notRequired()
    .test('year-range', `Tahun harus antara 1800 - ${new Date().getFullYear()}`, (val) => {
      if (val === null || val === undefined) return true
      return val >= 1800 && val <= new Date().getFullYear()
    }),
  jumlah_santri: yup.number().nullable().transform((v) => (v === '' ? null : v)).notRequired().min(0, 'Jumlah tidak boleh negatif'),
  jumlah_pengajar: yup.number().nullable().transform((v) => (v === '' ? null : v)).notRequired().min(0, 'Jumlah tidak boleh negatif'),
  biaya_pendaftaran: yup.number().nullable().transform((v) => (v === '' ? null : v)).notRequired().min(0, 'Biaya tidak boleh negatif'),
  biaya_bulanan: yup.number().nullable().transform((v) => (v === '' ? null : v)).notRequired().min(0, 'Biaya tidak boleh negatif'),
  email: yup.string().nullable().transform((v) => (v === '' ? null : v)).email('Format email tidak valid (contoh: pesantren@domain.com)').notRequired(),
  telepon: yup.string().notRequired().test('phone-format', 'Nomor telepon harus 8-15 digit (contoh: 081234567890)', (val) => {
    if (!val) return true
    return phoneRegex.test(val)
  }),
  website: yup.string().nullable().transform((v) => (v === '' ? null : v)).notRequired()
    .test('url-format', 'URL harus diawali http:// atau https://', (val) => {
      if (!val) return true
      return /^https?:\/\/.+/.test(val)
    }),
  deskripsi: yup.string().notRequired()
})

const { defineField, handleSubmit, errors, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    nama: '', province: '', kota: '', alamat: '', kurikulum: '',
    tahun_berdiri: null, jumlah_santri: null, jumlah_pengajar: null,
    biaya_pendaftaran: null, biaya_bulanan: null,
    email: '', telepon: '', website: '', deskripsi: ''
  }
})

const [nama, namaProps] = defineField('nama')
const [province, provinceProps] = defineField('province')
const [kota, kotaProps] = defineField('kota')
const [alamat, alamatProps] = defineField('alamat')
const [kurikulum, kurikulumProps] = defineField('kurikulum')
const [tahun_berdiri, tahun_berdiriProps] = defineField('tahun_berdiri')
const [jumlah_santri, jumlah_santriProps] = defineField('jumlah_santri')
const [jumlah_pengajar, jumlah_pengajarProps] = defineField('jumlah_pengajar')
const [biaya_pendaftaran, biaya_pendaftaranProps] = defineField('biaya_pendaftaran')
const [biaya_bulanan, biaya_bulananProps] = defineField('biaya_bulanan')
const [email, emailProps] = defineField('email')
const [telepon, teleponProps] = defineField('telepon')
const [website, websiteProps] = defineField('website')
const [deskripsi, deskripsiProps] = defineField('deskripsi')
const fasilitasInput = ref('')

// Rupiah formatter helpers
const biayaPendaftaranDisplay = ref('')
const biayaBulananDisplay = ref('')

function formatRupiahInput(val) {
  if (!val && val !== 0) return ''
  return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
function parseRupiahInput(str) {
  const num = parseInt(String(str).replace(/\./g, ''), 10)
  return isNaN(num) ? null : num
}
function onBiayaPendaftaranInput(e) {
  const raw = e.target.value.replace(/\./g, '').replace(/\D/g, '')
  biaya_pendaftaran.value = raw ? parseInt(raw, 10) : null
  biayaPendaftaranDisplay.value = formatRupiahInput(raw)
}
function onBiayaBulananInput(e) {
  const raw = e.target.value.replace(/\./g, '').replace(/\D/g, '')
  biaya_bulanan.value = raw ? parseInt(raw, 10) : null
  biayaBulananDisplay.value = formatRupiahInput(raw)
}

// Watch province to fetch regencies
watch(province, async (newProvince) => {
  if (!newProvince) {
    regencies.value = []
    setValues({ kota: '' })
    return
  }

  const selectedProv = provinces.value.find(p => p.name === newProvince)
  if (selectedProv) {
    loadingRegencies.value = true
    try {
      const res = await wilayah.getRegencies(selectedProv.id)
      regencies.value = res.data.data || []
      
      // If editing and current kota is not in regencies, we might need to keep it or clear it.
      // Usually, when editing, we load regencies but don't want to clear 'kota' immediately if it's already set.
      // However, if the user manually changes province, we should clear kota.
      // We can check if the form is just opening or if it's a manual change.
    } catch (e) {
      regencies.value = []
    } finally {
      loadingRegencies.value = false
    }
  }
})

const files = ref({ foto_utama: null, foto_galeri: [] })
const fileErrors = ref({ foto_utama: '', foto_galeri: '' })

function handleFileUpload(fieldName, event) {
   const fileInput = event.target
   if (!fileInput.files || fileInput.files.length === 0) return

   if (fieldName === 'foto_utama') {
      const file = fileInput.files[0]
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) return fileErrors.value.foto_utama = 'Gunakan format JPG/PNG.'
      const maxSize = 1 * 1024 * 1024
      if (file.size > maxSize) return fileErrors.value.foto_utama = 'Size berlebih. Max 1MB.'

      fileErrors.value.foto_utama = ''
      files.value.foto_utama = file
   } else if (fieldName === 'foto_galeri') {
       const selectedFiles = Array.from(fileInput.files)
       const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
       
       let error = ''
       for (const file of selectedFiles) {
          if (!allowedTypes.includes(file.type)) error = 'Terdapat format ekstensi illegal.'
           const maxSize = 1 * 1024 * 1024 // 1MB
           if (file.size > maxSize) error = 'Terdapat file yang melebihi batas maksimum 1MB. Silakan kompres gambar terlebih dahulu.'
       }
       
       if (existing_foto_galeri.value.length + files.value.foto_galeri.length + selectedFiles.length > 5) {
         error = 'Restriksi limit: Total maksimal 5 Foto (Eksisting + Baru).'
       }
       
       if(error) {
         fileErrors.value.foto_galeri = error
         return
       }

       fileErrors.value.foto_galeri = ''
       // Append instead of overwrite
       files.value.foto_galeri.push(...selectedFiles)
       // Reset input so user can pick same file again if they deleted it from list
       fileInput.value = ''
   }
}

function removeFile(fieldName) {
   if (fieldName === 'foto_utama') files.value.foto_utama = null
}

function removeExistingUtama() {
   existing_foto_utama.value = null
}

function removeGalleryFile(index) {
   files.value.foto_galeri.splice(index, 1)
}

function removeExistingGallery(index) {
   existing_foto_galeri.value.splice(index, 1)
}

function clearGalleryFiles() {
   files.value.foto_galeri = []
}

function openForm(p) {
  serverError.value = ''
  editingId.value = p?.id || null
  if (p) {
    setValues({
      nama: p.nama || '', province: p.province || '', kota: p.kota || '',
      alamat: p.alamat || '', kurikulum: p.kurikulum || '',
      tahun_berdiri: p.tahun_berdiri || null, jumlah_santri: p.jumlah_santri || null,
      jumlah_pengajar: p.jumlah_pengajar || null,
      biaya_pendaftaran: p.biaya_pendaftaran || null, biaya_bulanan: p.biaya_bulanan || null,
      email: p.email || '', telepon: p.telepon || '', website: p.website || '',
      deskripsi: p.deskripsi || ''
    })
    biayaPendaftaranDisplay.value = formatRupiahInput(p.biaya_pendaftaran)
    biayaBulananDisplay.value = formatRupiahInput(p.biaya_bulanan)
    fasilitasInput.value = Array.isArray(p.fasilitas) ? p.fasilitas.join(', ') : (typeof p.fasilitas === 'string' ? p.fasilitas : '')
    
    // Parse existing gallery from pesantren data
    existing_foto_utama.value = p.foto_utama || null
    try {
      if (p.foto_galeri) {
        existing_foto_galeri.value = typeof p.foto_galeri === 'string' 
          ? JSON.parse(p.foto_galeri) 
          : Array.isArray(p.foto_galeri) ? p.foto_galeri : []
      } else {
        existing_foto_galeri.value = []
      }
    } catch (e) {
      console.error('Failed to parse gallery:', e)
      existing_foto_galeri.value = []
    }
  } else {
    resetForm()
    biayaPendaftaranDisplay.value = ''
    biayaBulananDisplay.value = ''
    fasilitasInput.value = ''
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingId.value = null
  resetForm()
  files.value.foto_utama = null
  files.value.foto_galeri = []
  existing_foto_galeri.value = []
  existing_foto_utama.value = null
  fileErrors.value.foto_utama = ''
  fileErrors.value.foto_galeri = ''
}

const onSubmit = handleSubmit(async (values) => {
   serverError.value = ''
   try {
     const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') formData.append(key, value)
      })

      // Send fasilitas as JSON array
      if (fasilitasInput.value.trim()) {
        const fasilitas = fasilitasInput.value.split(',').map(f => f.trim()).filter(Boolean)
        formData.append('fasilitas', JSON.stringify(fasilitas))
      }
     
     // Send existing gallery filenames
     if (editingId.value) {
       formData.append('existing_foto_galeri', JSON.stringify(existing_foto_galeri.value))
       // If existing thumbnail was removed and no new one selected, send null
       if (!existing_foto_utama.value && !files.value.foto_utama) {
         formData.append('foto_utama', '') // This will be treated as null by backend logic for numerical/file fields
       }
     }
     
     if (files.value.foto_utama) formData.append('foto_utama', files.value.foto_utama)
     if (files.value.foto_galeri && files.value.foto_galeri.length > 0) {
       files.value.foto_galeri.forEach(file => {
         formData.append('foto_galeri', file)
       })
     }

     if (editingId.value) {
       await pemilik.updatePesantren(editingId.value, formData)
     } else {
       await pemilik.createPesantren(formData)
     }
     closeForm()
     loadData()
   } catch (err) {
     serverError.value = 'Distribusi basis data gagal, periksa kelengkapan form.'
   }
})

function confirmDelete(p) { deleteTarget.value = p; showDeleteConfirm.value = true }
async function executeDelete() {
  if (deleteTarget.value) {
     try {
       await pemilik.deletePesantren(deleteTarget.value.id)
       showDeleteConfirm.value = false
       loadData()
     } catch(e) {}
  }
}

async function loadData() {
  loading.value = true
  try {
    const res = await pemilik.getPesantren()
    pesantren.value = res.data.data || []
  } catch(e) {} finally { loading.value = false }
}

async function loadPendaftar() {
   loadingPendaftar.value = true
   try {
     const res = await pemilik.getPendaftaran()
     pendaftar.value = res.data.data || []
   } catch(e) {} finally { loadingPendaftar.value = false }
}

onMounted(() => {
  loadData()
  loadPendaftar()
  wilayah.getProvinces().then(res => provinces.value = res.data.data || []).catch(()=>{})
})
</script>

<style scoped>
/* Scoped overrdies if needed */
</style>
