<template>
  <div class="pesantren-management">
    
    <!-- Header -->
    <div class="card bg-white border border-border shadow-md rounded-2xl overflow-hidden mb-6 flex flex-col md:flex-row justify-between items-center px-6 py-5">
      <div>
        <h5 class="font-heading font-bold text-xl text-foreground">Direktori Lembaga</h5>
        <p class="text-sm text-muted-foreground mt-0.5">Kelola data seluruh pesantren terdaftar di ekosistem terpusat.</p>
      </div>
      <button class="btn btn-primary shadow-lg shadow-primary/30 mt-4 md:mt-0 font-bold px-6 py-2.5 flex items-center shrink-0" @click="openForm()">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        Entri Lembaga Baru
      </button>
    </div>

    <!-- Data State -->
    <div class="card bg-white border border-border shadow-sm rounded-2xl overflow-hidden min-h-[400px]">
      
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center p-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mb-4"></div>
        <p class="text-muted-foreground font-medium">Melakukan query basis data...</p>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="pesantren.length === 0" class="flex flex-col items-center justify-center p-20 text-center">
        <div class="w-24 h-24 bg-muted/40 rounded-full flex items-center justify-center mb-6 text-muted-foreground/50 border-4 border-white shadow-sm">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
        </div>
        <h6 class="font-heading font-bold text-xl text-foreground mb-2">Basis Data Kosong</h6>
        <p class="text-muted-foreground text-sm max-w-sm">Mulai konstruksi jaringan santri dengan menambahkan institusi pendidikan pertama ke sistem.</p>
      </div>

      <!-- Data Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full whitespace-nowrap">
            <thead class="bg-muted/30 border-y border-border/60 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th class="px-6 py-4">Lembaga & Identitas</th>
                <th class="px-6 py-4">Regional Status</th>
                <th class="px-6 py-4">Fokus Kurikulum</th>
                <th class="px-6 py-4">Basis Santri</th>
                <th class="px-6 py-4 text-primary">Biaya Bulanan</th>
                <th class="px-6 py-4 text-center">Tindakan Otoritas</th>
              </tr>
            </thead>
          <tbody class="divide-y divide-border/60">
            <tr v-for="p in pesantren" :key="p.id" class="hover:bg-muted/20 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0 border border-border shadow-sm">
                    <img v-if="p.foto_utama" :src="getUploadUrl(p.foto_utama)" :alt="p.nama" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground/40 bg-muted/50">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                  </div>
                  <div>
                    <p class="font-bold text-sm text-foreground mb-0.5 group-hover:text-primary transition-colors max-w-[160px] truncate" :title="p.nama">{{ p.nama }}</p>
                    <p class="text-[11px] text-muted-foreground uppercase opacity-70">ID-#{{ String(p.id).padStart(4, '0') }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm font-medium text-foreground">
                {{ p.kota }}
                <p class="text-xs text-muted-foreground">{{ p.province }}</p>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex px-2.5 py-1 rounded shadow-sm text-xs font-bold uppercase tracking-wider" :class="kurikulumBadge(p.kurikulum)">
                  {{ p.kurikulum || '-' }}
                </span>
              </td>
              <td class="px-6 py-4 font-mono text-sm font-semibold">
                {{ p.jumlah_santri || '-' }}
              </td>
              <td class="px-6 py-4 text-sm font-bold text-primary">
                {{ formatCurrency(p.biaya_bulanan) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <button class="btn btn-outline-primary px-3 py-1.5 text-xs font-bold border-border/80 hover:border-primary" @click="openForm(p)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button class="btn bg-destructive/10 text-destructive hover:bg-destructive hover:text-white px-3 py-1.5 text-xs font-bold transition-colors border border-destructive/20" @click="confirmDelete(p)">
                     <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form (Create / Edit) -->
    <Teleport to="body">
      <div v-if="showForm" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-full overflow-hidden flex flex-col transform animate-slide-up border border-border">
          
          <!-- Modal Header -->
          <div class="flex justify-between items-center px-8 py-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent shrink-0">
            <div>
               <h5 class="font-heading font-bold text-xl text-primary-dark mb-0.5">{{ editingId ? 'Penyesuaian Metadata Pesantren' : 'Integrasi Pesantren Baru' }}</h5>
               <p class="text-xs text-muted-foreground uppercase tracking-widest font-bold">Harap Verifikasi Akurasi Otoritas Edukasi</p>
            </div>
            <button type="button" class="w-10 h-10 rounded-full bg-muted/40 text-muted-foreground hover:bg-destructive hover:text-white flex items-center justify-center transition-all" @click="closeForm">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <!-- Modal Body (Scrollable) -->
          <div class="p-8 overflow-y-auto flex-1">
            <form @submit="onSubmit">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <!-- Identitas Utama -->
                <div class="md:col-span-2">
                  <label class="form-label block mb-1 font-bold text-sm">Nama Entitas Pendidikan *</label>
                  <input v-model="nama" v-bind="namaProps" type="text" class="w-full px-4 py-3 border-2 rounded-xl border-border focus:border-primary outline-none transition-all" :class="{ 'border-destructive focus:border-destructive': errors.nama }" placeholder="Nama Lengkap Pesantren" />
                  <p v-if="errors.nama" class="text-destructive text-xs font-bold mt-1.5">{{ errors.nama }}</p>
                </div>

                <!-- Lokasi -->
                <div>
                  <label class="form-label block mb-1 font-bold text-sm">Provinsi Domisili *</label>
                  <div class="relative">
                    <select v-model="province" v-bind="provinceProps" class="w-full px-4 py-3 border-2 rounded-xl border-border focus:border-primary outline-none transition-all appearance-none bg-white font-medium" :class="{ 'border-destructive focus:border-destructive': errors.province }">
                      <option value="">-- Pilih Wilayah --</option>
                      <option v-for="p in provinces" :key="p.id" :value="p.name">{{ p.name }}</option>
                    </select>
                    <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                   <label class="form-label block mb-1 font-bold text-sm">Kota / Kabupaten Administratif *</label>
                   <input v-model="kota" v-bind="kotaProps" type="text" class="w-full px-4 py-3 border-2 rounded-xl border-border focus:border-primary outline-none transition-all" :class="{ 'border-destructive focus:border-destructive': errors.kota }" placeholder="Misal: Magelang" />
                   <p v-if="errors.kota" class="text-destructive text-xs font-bold mt-1.5">{{ errors.kota }}</p>
                </div>

                <div class="md:col-span-2">
                   <label class="form-label block mb-1 font-bold text-sm">Alamat Lengkap Presisi</label>
                   <input v-model="alamat" v-bind="alamatProps" type="text" class="w-full px-4 py-3 border-2 rounded-xl border-border focus:border-primary outline-none transition-all" placeholder="Jl. Raya Utama KM 15..." />
                </div>

                <!-- Karakteristik -->
                <div>
                   <label class="form-label block mb-1 font-bold text-sm">Paradigma Kurikulum</label>
                   <div class="relative">
                    <select v-model="kurikulum" v-bind="kurikulumProps" class="w-full px-4 py-3 border-2 rounded-xl border-border focus:border-primary outline-none transition-all appearance-none bg-white font-medium">
                      <option value="">-- Pilih Sistem --</option>
                      <option value="modern">Modern (KMI/TMI)</option>
                      <option value="salaf">Salaf (Kitab Kuning)</option>
                      <option value="campuran">Terpadu / Campuran</option>
                    </select>
                    <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="form-label block mb-1 font-bold text-sm">Tahun Afiliasi Diri (Berdiri)</label>
                  <input v-model="tahun_berdiri" v-bind="tahun_berdiriProps" type="number" class="w-full px-4 py-3 border-2 rounded-xl border-border focus:border-primary outline-none transition-all" :class="{ 'border-destructive focus:border-destructive': errors.tahun_berdiri }" min="1900" :max="currentYear" placeholder="YYYY" />
                  <p v-if="errors.tahun_berdiri" class="text-destructive text-xs font-bold mt-1.5">{{ errors.tahun_berdiri }}</p>
                </div>
                
                 <!-- Data Statistik -->
                <div>
                  <label class="form-label block mb-1 font-bold text-sm">Populasi (Jumlah Santri)</label>
                  <input v-model="jumlah_santri" v-bind="jumlah_santriProps" type="number" class="w-full px-4 py-3 border-2 rounded-xl border-border focus:border-primary outline-none transition-all" :class="{ 'border-destructive focus:border-destructive': errors.jumlah_santri }" min="0" placeholder="Kapasitas Saat Ini" />
                  <p v-if="errors.jumlah_santri" class="text-destructive text-xs font-bold mt-1.5">{{ errors.jumlah_santri }}</p>
                </div>

                 <!-- Kontak -->
                 <div>
                  <label class="form-label block mb-1 font-bold text-sm">Nomor Telepon Sekretariat</label>
                  <input v-model="telepon" v-bind="teleponProps" type="text" class="w-full px-4 py-3 border-2 rounded-xl border-border focus:border-primary outline-none transition-all font-mono placeholder:font-sans" :class="{ 'border-destructive focus:border-destructive': errors.telepon }" placeholder="08XXXXXXXXXX" />
                  <p v-if="errors.telepon" class="text-destructive text-xs font-bold mt-1.5">{{ errors.telepon }}</p>
                </div>

                 <!-- Keuangan -->
                <div>
                  <label class="form-label block mb-1 font-bold text-sm">Biaya Pendaftaran / Infaq Masuk</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">Rp</span>
                    <input v-model="biaya_pendaftaran" v-bind="biaya_pendaftaranProps" type="number" class="w-full pl-12 pr-4 py-3 border-2 rounded-xl border-border focus:border-primary outline-none transition-all" :class="{ 'border-destructive focus:border-destructive': errors.biaya_pendaftaran }" min="0" placeholder="0" />
                  </div>
                  <p v-if="errors.biaya_pendaftaran" class="text-destructive text-xs font-bold mt-1.5">{{ errors.biaya_pendaftaran }}</p>
                </div>
                
                <div>
                   <label class="form-label block mb-1 font-bold text-sm">Biaya SPP (Bulanan)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">Rp</span>
                    <input v-model="biaya_bulanan" v-bind="biaya_bulananProps" type="number" class="w-full pl-12 pr-4 py-3 border-2 rounded-xl border-border focus:border-primary outline-none transition-all" :class="{ 'border-destructive focus:border-destructive': errors.biaya_bulanan }" min="0" placeholder="0" />
                  </div>
                  <p v-if="errors.biaya_bulanan" class="text-destructive text-xs font-bold mt-1.5">{{ errors.biaya_bulanan }}</p>
                </div>
                
                <!-- Fasilitas -->
                <div class="md:col-span-2">
                  <label class="form-label block mb-1 font-bold text-sm">Inventaris Fasilitas (Pisahkan Koma)</label>
                  <input v-model="fasilitasInput" type="text" class="w-full px-4 py-3 border-2 rounded-xl border-border focus:border-primary outline-none transition-all" placeholder="Misal: Keamanan 24 Jam, Masjid Besar, Asrama Terpisah..." />
                </div>

                <!-- Deskripsi -->
                 <div class="md:col-span-2">
                   <label class="form-label block mb-1 font-bold text-sm">Narasi / Deskripsi Profil</label>
                   <textarea v-model="deskripsi" v-bind="deskripsiProps" class="w-full px-4 py-3 border-2 rounded-xl border-border focus:border-primary outline-none transition-all resize-none" rows="4" placeholder="Tuliskan pesan sambutan atau profil singkat mengenai pesantren ini..."></textarea>
                 </div>

                 <!-- Media Uploads (Foto Utama & Galeri) -->
                 <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                   
                   <!-- Foto Utama -->
                   <div class="border-2 border-dashed rounded-2xl p-5 hover:border-primary/50 transition-colors bg-muted/10 relative group" :class="{ 'border-destructive hover:border-destructive': fileErrors.foto_utama }">
                      <label class="form-label block mb-2 font-bold text-sm">Visual Thumbnail Utama *</label>
                      
                      <input @change="handleFileUpload('foto_utama', $event)" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" type="file" accept="image/jpeg,image/png,image/jpg" :name="'foto_utama'" />
                      
                      <div class="text-center py-4">
                        <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-3 group-hover:scale-110 transition-transform">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <p class="text-sm font-bold text-primary mb-1">Pilih atau Seret Foto Anda Disini</p>
                        <p class="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Format JPG/PNG, Max 1MB</p>
                      </div>

                      <p v-if="fileErrors.foto_utama" class="text-destructive text-xs font-bold mt-2 text-center relative z-20">{{ fileErrors.foto_utama }}</p>
                      
                      <div class="mt-2 text-xs font-bold bg-white p-2 border border-border shadow-sm rounded flex justify-between items-center relative z-20" v-if="files.foto_utama">
                        <span class="truncate pr-2 text-success"><span class="mr-1 inline-block">✓</span>{{ files.foto_utama.name }}</span>
                        <button type="button" class="text-destructive hover:text-white hover:bg-destructive px-2 py-0.5 rounded transition-colors shrink-0" @click="removeFile('foto_utama')">Hapus</button>
                      </div>
                   </div>

                   <!-- Foto Galeri -->
                   <div class="border-2 border-dashed rounded-2xl p-5 hover:border-primary/50 transition-colors bg-muted/10 relative group" :class="{ 'border-destructive hover:border-destructive': fileErrors.foto_galeri }">
                      <label class="form-label block mb-2 font-bold text-sm">Media Galeri Lingkungan</label>
                      
                      <input @change="handleFileUpload('foto_galeri', $event)" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" type="file" accept="image/jpeg,image/png,image/jpg" multiple :name="'foto_galeri'" />
                      
                      <div class="text-center py-4">
                        <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-3 group-hover:scale-110 transition-transform flex-wrap">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <p class="text-sm font-bold text-primary mb-1">Lampirkan Hingga 5 Foto Tambahan</p>
                        <p class="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Format JPG/PNG, Masing-masing Max 1MB</p>
                      </div>

                      <p v-if="fileErrors.foto_galeri" class="text-destructive text-xs font-bold mt-2 text-center relative z-20">{{ fileErrors.foto_galeri }}</p>
                      
                      <div class="mt-2 text-xs font-bold relative z-20" v-if="files.foto_galeri && files.foto_galeri.length > 0">
                        <div class="flex justify-between items-center mb-1 bg-muted px-2 py-1 rounded">
                           <span class="uppercase tracking-widest text-[9px]">{{ files.foto_galeri.length }} File Siap Upload</span>
                           <button type="button" class="text-destructive hover:text-white hover:bg-destructive px-1 rounded text-[10px]" @click="clearGalleryFiles()">Reset</button>
                        </div>
                        <div class="flex flex-col gap-1 max-h-32 overflow-y-auto pr-1">
                           <div v-for="(file, index) in files.foto_galeri" :key="index" class="flex justify-between items-center bg-white p-2 border border-border rounded shadow-sm text-[10px] font-bold">
                              <span class="truncate pr-4"><span class="text-success mr-1">✓</span> {{ file.name }}</span>
                              <button type="button" @click="removeGalleryFile(index)" class="text-destructive hover:bg-destructive/10 px-1 rounded">Hapus</button>
                           </div>
                        </div>
                      </div>
                   </div>
                 </div>
              </div>

              <!-- General Error -->
              <div v-if="serverError" class="mt-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold rounded-xl">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {{ serverError }}
                </div>
              </div>
              
              <!-- Submit Footer -->
              <div class="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-end gap-3 bg-white sticky bottom-0 -mx-8 px-8 pb-2">
                <button type="button" class="btn btn-outline border-border hover:bg-muted font-bold px-8 py-3 rounded-xl transition-all" @click="closeForm">Batalkan Entri</button>
                <button type="submit" class="btn btn-primary shadow-lg shadow-primary/30 font-bold px-10 py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]" :disabled="isSubmitting">
                   {{ isSubmitting ? 'Memsinkronkan...' : (editingId ? 'Simpan Perubahan' : 'Finalisasi Integrasi') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Delete Confirmation -->
    <Teleport to="body">
       <div v-if="showDeleteConfirm" class="fixed inset-0 z-[100] flex items-center justify-center p-4" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up border-2 border-destructive/30">
             <div class="bg-destructive/10 p-6 flex flex-col items-center text-center">
                <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-destructive shadow-sm mb-4">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </div>
                <h3 class="font-heading font-extrabold text-2xl text-destructive mb-2">Konfirmasi Destruksi</h3>
                <p class="text-sm text-foreground/80 font-medium">Anda akan menghapus data metadata lembaga <strong class="text-destructive">{{ deleteTarget?.nama }}</strong>.</p>
             </div>
             
             <div v-if="deleteError" class="px-6 pb-2 text-center">
                <p class="text-[10px] font-bold text-destructive uppercase tracking-widest">{{ deleteError }}</p>
             </div>

             <div class="p-6 flex gap-3">
                <button class="btn btn-outline border-border flex-1 font-bold py-3 hover:bg-muted" @click="showDeleteConfirm = false">Batal</button>
                 <button class="btn bg-destructive hover:bg-red-700 text-white flex-1 font-bold py-3 shadow-lg shadow-destructive/20 transition-all transform active:scale-95" :disabled="deleting" @click="executeDelete">
                    {{ deleting ? 'Menghapus...' : 'YA, HAPUS TOTAL' }}
                </button>
             </div>
          </div>
       </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { admin, wilayah } from '../../services'
import { pesantren as pesantrenApi } from '../../services'
import { getUploadUrl } from '../../services/api'

const emit = defineEmits(['refresh'])

const pesantren = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingId = ref(null)
const provinces = ref([])
const fasilitasInput = ref('')
const serverError = ref('')

const showDeleteConfirm = ref(false)
const deleteTarget = ref(null)
const deleteError = ref('')
const deleting = ref(false)

const currentYear = new Date().getFullYear()
const phoneRegex = /^(\+62|62|0)[0-9]{8,13}$/

const schema = yup.object({
  nama: yup.string().required('Legalitas nama wajib diisi').min(3, 'Nama min. 3 karakter'),
  province: yup.string().required('Provinsi regional wajib.'),
  kota: yup.string().required('Kota afiliasi wajib dicatat.'),
  alamat: yup.string().notRequired(),
  kurikulum: yup.string().notRequired(),
  tahun_berdiri: yup.number().nullable().transform((v) => (v === '' ? null : v)).notRequired().test('year-range', 'Indeks tahun di luar batas normal', (val) => {
    if (val === null || val === undefined) return true
    return val >= 1900 && val <= currentYear
  }),
  jumlah_santri: yup.number().nullable().transform((v) => (v === '' ? null : v)).notRequired().min(0, 'Kapasitas tidak relevan jika negatif'),
  biaya_pendaftaran: yup.number().nullable().transform((v) => (v === '' ? null : v)).notRequired().min(0, 'Batas terendah nol'),
  biaya_bulanan: yup.number().nullable().transform((v) => (v === '' ? null : v)).notRequired().min(0, 'Batas terendah nol'),
  email: yup.string().nullable().transform((v) => (v === '' ? null : v)).email('Tata letak bahasa email usang').notRequired(),
  telepon: yup.string().notRequired().test('phone-format', 'Contoh format yang valid: 0812XXX', (val) => {
    if (!val) return true
    return phoneRegex.test(val)
  }),
  deskripsi: yup.string().notRequired()
})

const { defineField, handleSubmit, errors, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    nama: '', province: '', kota: '', alamat: '', kurikulum: '',
    tahun_berdiri: null, jumlah_santri: null,
    biaya_pendaftaran: null, biaya_bulanan: null,
    email: '', telepon: '', deskripsi: ''
  }
})

const [nama, namaProps] = defineField('nama')
const [province, provinceProps] = defineField('province')
const [kota, kotaProps] = defineField('kota')
const [alamat, alamatProps] = defineField('alamat')
const [kurikulum, kurikulumProps] = defineField('kurikulum')
const [tahun_berdiri, tahun_berdiriProps] = defineField('tahun_berdiri')
const [jumlah_santri, jumlah_santriProps] = defineField('jumlah_santri')
const [biaya_pendaftaran, biaya_pendaftaranProps] = defineField('biaya_pendaftaran')
const [biaya_bulanan, biaya_bulananProps] = defineField('biaya_bulanan')
const [email, emailProps] = defineField('email')
const [telepon, teleponProps] = defineField('telepon')
const [deskripsi, deskripsiProps] = defineField('deskripsi')

function formatCurrency(amount) {
  if (!amount) return 'Gratis / N-A'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

function kurikulumBadge(kurikulum) {
  const map = {
    modern: 'bg-primary/20 text-primary border border-primary/20',
    salaf: 'bg-success/20 text-success border border-success/20',
    campuran: 'bg-accent/20 text-accent border border-accent/20'
  }
  return map[kurikulum] || 'bg-muted/50 text-muted-foreground border border-border'
}

function openForm(p) {
  serverError.value = ''
  editingId.value = p?.id || null
  if (p) {
    setValues({
      nama: p.nama || '',
      province: p.province || '',
      kota: p.kota || '',
      alamat: p.alamat || '',
      kurikulum: p.kurikulum || '',
      tahun_berdiri: p.tahun_berdiri || null,
      jumlah_santri: p.jumlah_santri || null,
      biaya_pendaftaran: p.biaya_pendaftaran || null,
      biaya_bulanan: p.biaya_bulanan || null,
      email: p.email || '',
      telepon: p.telepon || '',
      deskripsi: p.deskripsi || ''
    })
    fasilitasInput.value = Array.isArray(p.fasilitas) ? p.fasilitas.join(', ') : ''
  } else {
    resetForm()
    fasilitasInput.value = ''
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingId.value = null
  serverError.value = ''
  resetForm()
  files.value.foto_utama = null
  files.value.foto_galeri = []
  fileErrors.value.foto_utama = ''
  fileErrors.value.foto_galeri = ''
}

const onSubmit = handleSubmit(async (values) => {
   serverError.value = ''
   try {
     const formData = new FormData()

     Object.entries(values).forEach(([key, value]) => {
       if (value !== null && value !== undefined && value !== '') {
         formData.append(key, value)
       }
     })

     if (fasilitasInput.value.trim()) {
       const fasilitas = fasilitasInput.value.split(',').map(f => f.trim()).filter(Boolean)
       formData.append('fasilitas', JSON.stringify(fasilitas))
     }

     if (files.value.foto_utama) {
       formData.append('foto_utama', files.value.foto_utama)
     }

     if (files.value.foto_galeri && files.value.foto_galeri.length > 0) {
       files.value.foto_galeri.forEach(file => {
         formData.append('foto_galeri', file)
       })
     }

     if (editingId.value) {
       await admin.updatePesantren(editingId.value, formData)
     } else {
       await admin.createPesantren(formData)
     }
     closeForm()
     await loadPesantren()
     emit('refresh')
   } catch (err) {
     serverError.value = err.response?.data?.error || err.response?.data?.message || 'Gagal menyimpan meta-data'
   } finally {
     files.value.foto_utama = null
     files.value.foto_galeri = []
     fileErrors.value.foto_utama = ''
     fileErrors.value.foto_galeri = ''
   }
 })

function confirmDelete(p) {
  deleteTarget.value = p
  deleteError.value = ''
  showDeleteConfirm.value = true
}

async function executeDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  deleteError.value = ''
  try {
    await admin.deletePesantren(deleteTarget.value.id)
    showDeleteConfirm.value = false
    deleteTarget.value = null
    await loadPesantren()
    emit('refresh')
  } catch (err) {
    deleteError.value = err.response?.data?.error || 'Kesalahan izin server saat penghapusan blok meta-data institution'
  } finally {
    deleting.value = false
  }
}

async function loadPesantren() {
  loading.value = true
  try {
    const { data } = await pesantrenApi.list({ limit: 1000 })
    pesantren.value = data.data || []
  } catch {
    pesantren.value = []
  } finally {
    loading.value = false
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

const files = ref({
   foto_utama: null,
   foto_galeri: []
})
const fileErrors = ref({
   foto_utama: '',
   foto_galeri: ''
})

function handleFileUpload(fieldName, event) {
   const fileInput = event.target
   if (!fileInput.files || fileInput.files.length === 0) {
      return
   }

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
         const maxSize = 1 * 1024 * 1024
         if (file.size > maxSize) error = 'Terdapat file melebih ambang Max 1MB.'
      }
      if (selectedFiles.length > 5) error = 'Restriksi limit: Maksimal 5 Foto batch.'
      
      if(error) {
        fileErrors.value.foto_galeri = error;
        return;
      }

      fileErrors.value.foto_galeri = ''
      files.value.foto_galeri = selectedFiles
   }
}

function removeFile(fieldName) {
   if (fieldName === 'foto_utama') files.value.foto_utama = null
}

function removeGalleryFile(index) {
   files.value.foto_galeri.splice(index, 1)
}

function clearGalleryFiles() {
   files.value.foto_galeri = []
}

onMounted(async () => {
  await Promise.all([loadPesantren(), loadProvinces()])
})
</script>

<style scoped>
/* Inherited globally Tailwind v4 spec */
</style>
