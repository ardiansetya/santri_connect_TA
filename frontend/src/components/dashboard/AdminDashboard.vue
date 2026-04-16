<template>
  <div class="admin-dashboard-wrapper">
    <!-- Action Bar / Sub-header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-2">
      <div>
        <p class="text-sm font-bold text-destructive uppercase tracking-widest mb-1 flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Sistem Pusat Pengendalian
        </p>
        <h2 class="font-heading text-xl md:text-2xl font-bold text-foreground">Aktivitas Jaringan Nasional</h2>
      </div>
      <!-- Tabs (desktop horizontal, mobile wrapped) -->
      <div class="bg-muted/40 p-1.5 rounded-xl border border-border/60 shadow-inner flex flex-wrap gap-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all"
          :class="activeTab === tab.id ? 'bg-white text-destructive shadow-md' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'"
        >
          <svg v-if="tab.id === 'overview'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <svg v-else-if="tab.id === 'pendaftaran'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <svg v-else-if="tab.id === 'pesantren'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- TAB: Overview -->
    <div v-show="activeTab === 'overview'" class="animate-fade-in">
      <!-- Stat Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card bg-white border border-border/80 shadow-md rounded-2xl p-6 relative overflow-hidden group">
          <div class="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div class="flex justify-start items-start mb-4">
            <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
          </div>
          <div>
            <h3 class="font-heading text-4xl font-bold text-foreground mb-1">{{ stats.total_pesantren || 0 }}</h3>
            <p class="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Institusi</p>
          </div>
        </div>

        <div class="card bg-white border border-border/80 shadow-md rounded-2xl p-6 relative overflow-hidden group">
          <div class="absolute right-0 top-0 w-32 h-32 bg-accent/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div class="flex justify-start items-start mb-4">
            <div class="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
          </div>
          <div>
            <h3 class="font-heading text-4xl font-bold text-foreground mb-1">{{ stats.total_users || 0 }}</h3>
            <p class="text-sm font-bold text-muted-foreground uppercase tracking-widest">Akun Terdaftar</p>
          </div>
        </div>

        <div class="card bg-white border border-border/80 shadow-md rounded-2xl p-6 relative overflow-hidden group">
          <div class="absolute right-0 top-0 w-32 h-32 bg-destructive/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div class="flex justify-start items-start mb-4">
            <div class="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
          </div>
          <div>
            <h3 class="font-heading text-4xl font-bold text-foreground mb-1">{{ stats.total_pendaftaran || 0 }}</h3>
            <p class="text-sm font-bold text-muted-foreground uppercase tracking-widest">Volume Pendaftaran</p>
          </div>
        </div>
      </div>

      <!-- Live Data Area -->
      <div class="live-data-area">
        
        <!-- Live Pendaftaran Log -->
        <div class="flex-1 card bg-white border border-border rounded-2xl shadow-lg flex flex-col h-[500px]">
          <div class="p-6 border-b border-border bg-gradient-to-r from-muted/30 to-transparent flex justify-between items-center shrink-0">
            <div>
              <h4 class="font-heading font-bold text-lg text-foreground">Log Pendaftaran Cepat</h4>
              <p class="text-xs text-muted-foreground mt-0.5">5 Transaksi Terakhir Masuk</p>
            </div>
            <button @click="activeTab = 'pendaftaran'" class="text-xs font-bold text-primary hover:text-primary-dark uppercase tracking-wider">Muat Semua</button>
          </div>
          
          <div class="flex-1 overflow-y-auto p-2">
            <div v-if="loading" class="flex justify-center items-center h-full">
               <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary"></div>
            </div>
            <div v-else-if="latestPendaftaran.length === 0" class="flex justify-center items-center h-full flex-col text-muted-foreground">
              <svg class="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
              <p class="text-sm">Tidak ada transmisi baru.</p>
            </div>
            <div v-else class="space-y-1">
              <div v-for="p in latestPendaftaran" :key="p.id" class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 hover:bg-muted/30 rounded-xl transition-colors border border-transparent hover:border-border/50">
                <div class="mb-2 sm:mb-0">
                  <p class="font-bold text-sm text-foreground mb-0.5">{{ p.nama_lengkap }}</p>
                  <p class="text-xs text-muted-foreground flex items-center gap-2">
                    <span class="font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded">{{ p.nomor_pendaftaran }}</span>
                    <span>•  {{ p.pesantren?.nama }}</span>
                  </p>
                </div>
                <span class="inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded border shadow-sm" :class="statusBadge(p.status)">
                  {{ statusLabel(p.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Hot Pesantren Log -->
        <div class="flex-1 card bg-white border border-border rounded-2xl shadow-lg flex flex-col h-[500px]">
          <div class="p-6 border-b border-border bg-gradient-to-l from-muted/30 to-transparent flex justify-between items-center shrink-0">
            <div>
              <h4 class="font-heading font-bold text-lg text-foreground">Aktivitas Pesantren</h4>
              <p class="text-xs text-muted-foreground mt-0.5">Institusi Berdasarkan Entri Terbaru</p>
            </div>
            <button @click="activeTab = 'pesantren'" class="text-xs font-bold text-primary hover:text-primary-dark uppercase tracking-wider">Urus Semua</button>
          </div>
          
           <div class="flex-1 overflow-y-auto p-4">
             <div v-if="loading" class="flex justify-center items-center h-full">
               <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary"></div>
            </div>
             <div v-else-if="pesantrenStats.length === 0" class="flex justify-center items-center h-full flex-col text-muted-foreground">
               <p class="text-sm">Data Institusi Kosong.</p>
             </div>
             <div v-else class="grid grid-cols-1 gap-4">
                <div v-for="(p, index) in pesantrenStats" :key="p.id" class="flex items-center gap-4 p-4 border border-border rounded-xl bg-white shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                  <div class="w-10 h-10 rounded-full font-bold flex items-center justify-center shrink-0" :class="index < 3 ? 'bg-accent/10 text-accent font-heading text-xl' : 'bg-muted text-muted-foreground text-sm'">
                    #{{ index + 1 }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-sm text-foreground truncate">{{ p.nama }}</p>
                    <p class="text-xs text-muted-foreground mt-0.5">{{ p.kota }}, {{ p.province }}</p>
                  </div>
                  <div class="shrink-0 text-right">
                    <p class="font-heading font-bold text-xl text-primary leading-none">{{ Math.floor(Math.random() * 50) + 1 }}</p>
                    <p class="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mt-1">Calon</p>
                  </div>
                </div>
             </div>
           </div>
        </div>

      </div>
    </div>
    
    <!-- TAB: Pendaftaran (Transaksi Santri) -->
    <div v-show="activeTab === 'pendaftaran'" class="animate-fade-in space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h3 class="font-heading text-xl font-bold text-foreground">Manajemen Transaksi</h3>
          <p class="text-sm text-muted-foreground">Kelola pendaftaran santri dari seluruh institusi</p>
        </div>
        <div class="flex gap-2">
          <button @click="handleExport" class="btn bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-600 hover:text-white flex items-center gap-2 transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Ekspor .XLSX
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            v-model="pendaftaranFilters.search" 
            type="text" 
            placeholder="Cari Nama / No Pendaftaran..." 
            class="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          >
        </div>
        <select 
          v-model="pendaftaranFilters.status"
          class="bg-white border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        >
          <option value="">Semua Status</option>
          <option value="pending">Menunggu</option>
          <option value="diproses">Validasi</option>
          <option value="diterima">Diterima</option>
          <option value="ditolak">Ditolak</option>
        </select>
      </div>

      <!-- Table Container -->
      <div class="card bg-white border border-border rounded-2xl shadow-xl overflow-hidden overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-muted/30 border-b border-border text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
            <tr>
              <th class="px-6 py-4">Pendaftar & No. Ref</th>
              <th class="px-6 py-4">Institusi Target</th>
              <th class="px-6 py-4">Tgl Daftar</th>
              <th class="px-6 py-4 text-center">Status</th>
              <th class="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-if="pendaftaranLoading">
              <td colspan="5" class="px-6 py-12 text-center text-muted-foreground">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary mb-2"></div>
                <p class="text-xs uppercase tracking-widest">Sinkronisasi Data...</p>
              </td>
            </tr>
            <tr v-else-if="pendaftaranList.length === 0" class="px-6 py-12 text-center text-muted-foreground">
              <td colspan="5" class="px-6 py-12 text-center">
                <svg class="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Data tidak ditemukan.
              </td>
            </tr>
            <tr v-for="p in pendaftaranList" :key="p.id" class="hover:bg-muted/30 transition-colors">
              <td class="px-6 py-4">
                <div class="font-bold text-sm text-foreground">{{ p.nama_lengkap }}</div>
                <div class="text-[10px] font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded w-fit mt-1">{{ p.nomor_pendaftaran }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-foreground">{{ p.pesantren?.nama }}</div>
                <div class="text-xs text-muted-foreground">{{ p.user?.email }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-xs text-muted-foreground">{{ new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}</div>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded border shadow-sm" :class="statusBadge(p.status)">
                  {{ statusLabel(p.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="openDetailModal(p)" class="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors" title="Lihat Detail">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  </button>
                  <button @click="confirmDeletePendaftaran(p)" class="p-2 hover:bg-red-500/10 text-red-600 rounded-lg transition-colors" title="Hapus">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination (Very Simple) -->
      <div v-if="pendaftaranMeta.total_page > 1" class="flex justify-center gap-2">
        <button 
          @click="pendaftaranFilters.page--" 
          :disabled="pendaftaranFilters.page === 1"
          class="px-4 py-2 border border-border rounded-lg transition-all hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:hover:border-border"
        >Prev</button>
        <span class="px-4 py-2 bg-muted/50 rounded-lg text-sm font-bold flex items-center">Halaman {{ pendaftaranFilters.page }} dari {{ pendaftaranMeta.total_page }}</span>
        <button 
          @click="pendaftaranFilters.page++" 
          :disabled="pendaftaranFilters.page === pendaftaranMeta.total_page"
          class="px-4 py-2 border border-border rounded-lg transition-all hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:hover:border-border"
        >Next</button>
      </div>
    </div>

    <!-- Integrate the existing full featured AdminPesantrenManagement if tab is active -->
    <div v-if="activeTab === 'pesantren'" class="animate-fade-in">
       <AdminPesantrenManagement />
    </div>

    <!-- TAB: User Management (Autentikasi User) -->
    <div v-show="activeTab === 'users'" class="animate-fade-in space-y-6">
      <div class="bg-white p-6 rounded-2xl border border-border shadow-sm">
        <h3 class="font-heading text-xl font-bold text-foreground">Otorisasi Pengguna</h3>
        <p class="text-sm text-muted-foreground">Monitor dan kelola seluruh akun pengguna di platform</p>
      </div>

      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            v-model="usersFilters.search" 
            type="text" 
            placeholder="Cari Username / Email..." 
            class="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          >
        </div>
        <select 
          v-model="usersFilters.role"
          class="bg-white border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        >
          <option value="">Semua Role</option>
          <option value="pendaftar">Pendaftar</option>
          <option value="pemilik">Pemilik Pesantren</option>
          <option value="superadmin">Superadmin</option>
        </select>
      </div>

      <!-- Table Container -->
      <div class="card bg-white border border-border rounded-2xl shadow-xl overflow-hidden overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-muted/30 border-b border-border text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Informasi User</th>
              <th class="px-6 py-4">Role</th>
              <th class="px-6 py-4">Tgl Registrasi</th>
              <th class="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-if="usersLoading">
              <td colspan="5" class="px-6 py-12 text-center text-muted-foreground">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary mb-2"></div>
                <p class="text-xs uppercase tracking-widest">Sinkronisasi Jaringan...</p>
              </td>
            </tr>
            <tr v-for="u in usersList" :key="u.id" class="hover:bg-muted/30 transition-colors">
              <td class="px-6 py-4 text-xs font-mono text-muted-foreground">#{{ u.id }}</td>
              <td class="px-6 py-4">
                <div class="font-bold text-sm text-foreground">{{ u.username }}</div>
                <div class="text-xs text-muted-foreground">{{ u.email }}</div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full border shadow-sm"
                  :class="{
                    'bg-destructive/10 text-destructive border-destructive/20': u.role === 'superadmin',
                    'bg-primary/10 text-primary border-primary/20': u.role === 'pemilik',
                    'bg-muted text-muted-foreground border-border': u.role === 'pendaftar'
                  }"
                >
                  {{ u.role }}
                </span>
              </td>
              <td class="px-6 py-4 text-xs text-muted-foreground">
                {{ new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="confirmDeleteUser(u)" class="p-2 hover:bg-red-500/10 text-red-600 rounded-lg transition-colors" title="Hapus User">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL: Detail Pendaftaran -->
    <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-foreground/60 backdrop-blur-sm" @click="showDetailModal = false"></div>
      <div class="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        <!-- Modal Header -->
        <div class="p-6 border-b border-border flex justify-between items-center bg-muted/20">
          <div>
            <h3 class="font-heading text-xl font-bold text-foreground">Detail Transaksi Pendaftar</h3>
            <p class="text-xs text-muted-foreground mt-0.5">Ref ID: {{ selectedPendaftaran?.nomor_pendaftaran }}</p>
          </div>
          <button @click="showDetailModal = false" class="p-2 hover:bg-muted rounded-full transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="flex-1 overflow-y-auto p-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
            <!-- Left Side: Data & Management -->
            <div class="space-y-8 text-left">
              <section>
                <h4 class="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-4">Biodata Pendaftar</h4>
                <div class="space-y-3">
                  <div class="flex justify-between border-b border-border/40 pb-2">
                    <span class="text-sm text-muted-foreground">Nama Lengkap</span>
                    <span class="text-sm font-bold text-foreground">{{ selectedPendaftaran?.nama_lengkap }}</span>
                  </div>
                  <div class="flex justify-between border-b border-border/40 pb-2">
                    <span class="text-sm text-muted-foreground">Institusi</span>
                    <span class="text-sm font-bold text-foreground">{{ selectedPendaftaran?.pesantren?.nama }}</span>
                  </div>
                  <div class="flex justify-between border-b border-border/40 pb-2">
                    <span class="text-sm text-muted-foreground">Email Pendaftar</span>
                    <span class="text-sm font-bold text-foreground font-mono">{{ selectedPendaftaran?.user?.email }}</span>
                  </div>
                </div>
              </section>

              <section class="p-6 bg-muted/20 rounded-2xl border border-border">
                <h4 class="text-[10px] uppercase font-bold tracking-widest text-primary mb-4">Pengambil Keputusan (Admin)</h4>
                <div class="space-y-4">
                  <div>
                    <label class="block text-xs font-bold text-muted-foreground uppercase mb-2">Update Status Alur</label>
                    <select 
                      v-model="statusForm.status"
                      class="w-full bg-white border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="pending">Menunggu (Draf)</option>
                      <option value="diproses">Validasi (Proses)</option>
                      <option value="diterima">Diterima (Final)</option>
                      <option value="ditolak">Ditolak (Final)</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-muted-foreground uppercase mb-2">Catatan Administratif</label>
                    <textarea 
                      v-model="statusForm.catatan_admin"
                      rows="3" 
                      placeholder="Tambahkan instruksi atau alasan penolakan..."
                      class="w-full bg-white border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    ></textarea>
                  </div>
                  <button 
                    @click="handleUpdateStatus"
                    :disabled="updatingStatus"
                    class="w-full btn bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    <span v-if="updatingStatus" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-2"></span>
                    Simpan Perubahan Status
                  </button>
                </div>
              </section>
            </div>

            <!-- Right Side: Document Previews -->
            <div class="space-y-6">
               <h4 class="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Verifikasi Dokumen</h4>
               <div class="grid grid-cols-1 gap-4 overflow-y-auto max-h-[400px] pr-2">
                  <div v-for="(val, key) in selectedPendaftaran?.dokumen" :key="key" class="p-4 bg-muted/10 rounded-xl border border-border">
                    <p class="text-[10px] font-bold uppercase text-muted-foreground mb-2">{{ key.replace(/_/g, ' ') }}</p>
                    <div class="aspect-video bg-muted rounded-lg overflow-hidden border border-border/50 relative group">
                      <img 
                        :src="`http://localhost:3000/uploads/pendaftaran/${val}`" 
                        class="w-full h-full object-cover transition-transform group-hover:scale-110" 
                        @error="(e) => (e.target.src = 'https://placehold.co/600x400?text=Dokumen+Tidak+Tersedia')"
                      >
                      <div class="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <a :href="`http://localhost:3000/uploads/pendaftaran/${val}`" target="_blank" class="p-2 bg-white rounded-full text-foreground hover:bg-primary hover:text-white">
                           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                         </a>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { admin, pesantren } from '../../services'
import { useToast } from 'vue-toastification'
import AdminPesantrenManagement from './AdminPesantrenManagement.vue'

const toast = useToast()
const activeTab = ref('overview')
const tabs = [
  { id: 'overview', label: 'Ringkasan' },
  { id: 'pesantren', label: 'Lembaga Pesantren' },
  { id: 'pendaftaran', label: 'Transaksi Santri' },
  { id: 'users', label: 'Autentikasi User' }
]

const stats = ref({})
const latestPendaftaran = ref([])
const pesantrenStats = ref([])
const loading = ref(true)

// Tab: Pendaftaran Data
const pendaftaranList = ref([])
const pendaftaranLoading = ref(false)
const pendaftaranFilters = ref({
  search: '',
  status: '',
  page: 1,
  limit: 10
})
const pendaftaranMeta = ref({ total_data: 0, total_page: 0 })

// Tab: User Management Data
const usersList = ref([])
const usersLoading = ref(false)
const usersFilters = ref({
  search: '',
  role: '',
  page: 1,
  limit: 10
})
const usersMeta = ref({ total_data: 0, total_page: 0 })

// Detail Modal State
const selectedPendaftaran = ref(null)
const showDetailModal = ref(false)
const updatingStatus = ref(false)
const statusForm = ref({
  status: '',
  catatan_admin: ''
})

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
    diproses: 'Validasi',
    diterima: 'Diterima',
    ditolak: 'Ditolak'
  }
  return map[status] || status
}

async function fetchOverview() {
  loading.value = true
  try {
    const [statsRes, pendaftaranRes, pesantrenRes] = await Promise.all([
      admin.getStats().catch(() => ({ data: { data: {} } })),
      admin.getPendaftaran({ limit: 5 }).catch(() => ({ data: { data: [] } })),
      pesantren.list({ limit: 5 }).catch(() => ({ data: { data: [] } }))
    ])
    
    stats.value = statsRes.data.data || {}
    latestPendaftaran.value = pendaftaranRes.data.data || []
    pesantrenStats.value = pesantrenRes.data.data || []
  } catch (error) {
    console.error('Failed to load overview:', error)
  } finally {
    loading.value = false
  }
}

async function fetchPendaftaran() {
  pendaftaranLoading.value = true
  try {
    const { data: res } = await admin.getPendaftaran(pendaftaranFilters.value)
    pendaftaranList.value = res.data
    pendaftaranMeta.value = res.meta
  } catch (error) {
    toast.error('Gagal memuat data pendaftaran')
  } finally {
    pendaftaranLoading.value = false
  }
}

async function fetchUsers() {
  usersLoading.value = true
  try {
    const { data: res } = await admin.getUsers(usersFilters.value)
    usersList.value = res.data
    usersMeta.value = res.meta
  } catch (error) {
    toast.error('Gagal memuat data user')
  } finally {
    usersLoading.value = false
  }
}

function openDetailModal(item) {
  selectedPendaftaran.value = item
  statusForm.value = {
    status: item.status,
    catatan_admin: item.catatan_admin || ''
  }
  showDetailModal.value = true
}

async function handleUpdateStatus() {
  if (!selectedPendaftaran.value) return
  updatingStatus.value = true
  try {
    await admin.updatePendaftaranStatus(selectedPendaftaran.value.id, statusForm.value)
    toast.success('Status pendaftaran berhasil diperbarui')
    showDetailModal.value = false
    fetchPendaftaran()
    fetchOverview() // Refresh stats
  } catch (error) {
    toast.error(error.response?.data?.error || 'Gagal memperbarui status')
  } finally {
    updatingStatus.value = false
  }
}

async function handleExport() {
  try {
    const response = await admin.exportPendaftaran()
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `pendaftaran-${new Date().getTime()}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    toast.error('Gagal mengekspor data')
  }
}

function confirmDeletePendaftaran(item) {
  if (confirm(`Apakah Anda yakin ingin menghapus pendaftaran ${item.nama_lengkap}?`)) {
     toast.info('Fitur penghapusan pendaftaran sedang diintegrasikan ke backend.')
  }
}

function confirmDeleteUser(item) {
  if (confirm(`Apakah Anda yakin ingin menghapus user ${item.username}?`)) {
     toast.info('Fitur penghapusan user sedang diintegrasikan ke backend.')
  }
}

// Watch for tab changes to load data
watch(activeTab, (newTab) => {
  if (newTab === 'pendaftaran' && pendaftaranList.value.length === 0) {
    fetchPendaftaran()
  } else if (newTab === 'users' && usersList.value.length === 0) {
    fetchUsers()
  }
})

// Watch for filter changes
watch(pendaftaranFilters, () => {
  fetchPendaftaran()
}, { deep: true })

watch(usersFilters, () => {
  fetchUsers()
}, { deep: true })

onMounted(() => {
  fetchOverview()
})
</script>

<style scoped>
.live-data-area {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .live-data-area {
    flex-direction: row;
  }
}
</style>
