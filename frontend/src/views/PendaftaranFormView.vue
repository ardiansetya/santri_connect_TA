<template>
  <div class="registration-form-page paper-texture min-h-screen pt-24 pb-20 relative bg-background overflow-hidden">
    <!-- Background Overlay -->
    <div class="pattern-overlay z-0 opacity-40"></div>
    
    <div class="container relative z-10 mx-auto px-4 max-w-4xl">
      <!-- Breadcrumb Navigation -->
      <nav class="mb-8 text-sm font-medium animate-fade-in flex items-center gap-2">
        <router-link to="/pesantren" class="text-primary hover:text-primary-dark transition-colors">Eksplorasi Pesantren</router-link>
        <svg class="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        <span class="text-muted-foreground">Form Registrasi Santri Baru</span>
      </nav>

      <!-- Pesantren Target Informational Card -->
      <div v-if="pesantrenInfo" class="mb-10 bg-white shadow-xl shadow-primary/5 rounded-2xl border-l-[6px] border-primary p-6 animate-slide-up flex flex-col md:flex-row items-center gap-6 justify-between">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <div>
            <h4 class="font-heading font-bold text-2xl text-foreground">{{ pesantrenInfo.nama }}</h4>
            <p class="text-sm font-medium text-muted-foreground mt-1 flex items-center gap-1.5">
              <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {{ pesantrenInfo.kota }}, {{ pesantrenInfo.province }}
            </p>
          </div>
        </div>
        <div class="shrink-0">
          <span class="inline-flex px-4 py-2 bg-accent/10 border border-accent/20 text-accent font-bold text-sm uppercase tracking-widest rounded-full shadow-sm">
            Jalur Terbuka
          </span>
        </div>
      </div>

      <!-- Main Registration Card -->
      <div class="bg-white rounded-[2rem] shadow-2xl border border-border/60 overflow-hidden animate-slide-up delay-1 relative">
        <!-- Floating Accent Lines -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

        <!-- Form Header -->
        <div class="px-8 md:px-12 py-10 border-b border-border bg-gradient-to-b from-primary/5 to-transparent relative z-10">
          <h1 class="font-heading font-bold text-3xl md:text-4xl text-primary-dark mb-3">Pendaftaran Resmi Sekolah</h1>
          <p class="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            Lengkapi formulir pendaftaran ini secara komprehensif. Pastikan seluruh administrasi sesuai dengan dokumen kependudukan asli untuk mempermudah verifikasi tim akademik.
          </p>
        </div>

        <!-- The Form -->
        <div class="p-8 md:p-12 relative z-10">
          <form v-show="!success" @submit="onSubmit">
            
            <!-- SECTION 1: Data Pribadi -->
            <div class="mb-12">
              <div class="flex items-center gap-4 mb-8">
                <span class="flex items-center justify-center w-10 h-10 rounded-full bg-primary shadow-md shadow-primary/30 text-white font-bold font-heading text-lg shrink-0">1</span>
                <div>
                  <h3 class="font-heading font-bold text-2xl text-foreground">Identitas Calon Santri</h3>
                  <p class="text-sm font-medium text-muted-foreground uppercase tracking-wider">Biodata Diri Utama</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 bg-muted/20 p-6 md:p-8 rounded-2xl border border-border/50">
                <div class="md:col-span-2">
                  <label class="form-label block mb-2">Nama Lengkap Santri <span class="text-destructive">*</span></label>
                  <input v-model="nama_lengkap" v-bind="nama_lengkapProps" type="text" class="w-full px-4 py-3.5 border-2 rounded-xl border-border focus:border-primary outline-none transition-all focus:ring-4 focus:ring-primary/10 bg-white" :class="{ 'border-destructive focus:border-destructive focus:ring-destructive/10 ring-1 ring-destructive': errors.nama_lengkap }" placeholder="Sesuai Akta Kelahiran / KK" />
                  <p v-if="errors.nama_lengkap" class="text-destructive text-sm font-medium mt-1.5 flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {{ errors.nama_lengkap }}</p>
                </div>
                
                <div>
                  <label class="form-label block mb-2">Nomor Induk Kependudukan (NIK) <span class="text-destructive">*</span></label>
                  <input v-model="nik" v-bind="nikProps" type="text" class="w-full px-4 py-3.5 border-2 rounded-xl border-border focus:border-primary outline-none transition-all focus:ring-4 focus:ring-primary/10 bg-white font-mono placeholder:font-sans text-lg tracking-wider" :class="{ 'border-destructive focus:border-destructive focus:ring-destructive/10 ring-1 ring-destructive': errors.nik }" maxlength="16" inputmode="numeric" placeholder="Contoh: 317XXXXXXXXXXXXX" />
                  <p v-if="errors.nik" class="text-destructive text-sm font-medium mt-1.5 flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {{ errors.nik }}</p>
                </div>
                
                <div>
                  <label class="form-label block mb-2">Jenis Kelamin Identitas <span class="text-destructive">*</span></label>
                  <div class="relative">
                    <select v-model="jenis_kelamin" v-bind="jenis_kelaminProps" class="form-input appearance-none w-full !pr-12 px-4 py-3.5 border-2 rounded-xl border-border focus:border-primary outline-none transition-all focus:ring-4 focus:ring-primary/10 bg-white" :class="{ 'border-destructive focus:border-destructive focus:ring-destructive/10 ring-1 ring-destructive': errors.jenis_kelamin }">
                      <option value="" disabled>Pilih Kategori</option>
                      <option value="L">Laki-laki (Putra)</option>
                      <option value="P">Perempuan (Putri)</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-foreground/50">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  <p v-if="errors.jenis_kelamin" class="text-destructive text-sm font-medium mt-1.5 flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {{ errors.jenis_kelamin }}</p>
                </div>
                
                <div>
                  <label class="form-label block mb-2">Kabupaten/Kota Tempat Lahir</label>
                  <input v-model="tempat_lahir" v-bind="tempat_lahirProps" type="text" class="w-full px-4 py-3.5 border-2 rounded-xl border-border focus:border-primary outline-none transition-all focus:ring-4 focus:ring-primary/10 bg-white" :class="{ 'border-destructive focus:border-destructive focus:ring-destructive/10 ring-1 ring-destructive': errors.tempat_lahir }" placeholder="Lokasi Terbit Akta" />
                </div>
                
                <div>
                  <label class="form-label block mb-2">Tanggal Lahir Santri</label>
                  <input v-model="tanggal_lahir" v-bind="tanggal_lahirProps" type="date" class="w-full px-4 py-3.5 border-2 rounded-xl border-border focus:border-primary outline-none transition-all focus:ring-4 focus:ring-primary/10 bg-white text-foreground" :class="{ 'border-destructive focus:border-destructive focus:ring-destructive/10 ring-1 ring-destructive': errors.tanggal_lahir }" :max="maxDate" />
                </div>
                
                <div class="md:col-span-2">
                  <label class="form-label block mb-2">Domisili Peserta Didik (Alamat Lengkap)</label>
                  <textarea v-model="alamat" v-bind="alamatProps" class="w-full px-4 py-3.5 border-2 rounded-xl border-border focus:border-primary outline-none transition-all focus:ring-4 focus:ring-primary/10 bg-white resize-none" :class="{ 'border-destructive focus:border-destructive focus:ring-destructive/10 ring-1 ring-destructive': errors.alamat }" rows="3" placeholder="Jl. Diponegoro No.XXX, Kelurahan, Kecamatan..."></textarea>
                </div>
                
                <div>
                  <label class="form-label block mb-2">Nomor Telepon Seluler (Pendaftar)</label>
                  <input v-model="no_hp" v-bind="no_hpProps" type="tel" class="w-full px-4 py-3.5 border-2 rounded-xl border-border focus:border-primary outline-none transition-all focus:ring-4 focus:ring-primary/10 bg-white font-mono placeholder:font-sans" :class="{ 'border-destructive focus:border-destructive focus:ring-destructive/10 ring-1 ring-destructive': errors.no_hp }" placeholder="08XXXXXXXXXX" />
                  <p v-if="errors.no_hp" class="text-destructive text-sm font-medium mt-1.5 flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {{ errors.no_hp }}</p>
                </div>
              </div>
            </div>

            <!-- SECTION 2: Data Orang Tua -->
            <div class="mb-12">
              <div class="flex items-center gap-4 mb-8">
                <span class="flex items-center justify-center w-10 h-10 rounded-full bg-accent shadow-md shadow-accent/30 text-white font-bold font-heading text-lg shrink-0">2</span>
                <div>
                  <h3 class="font-heading font-bold text-2xl text-foreground">Penanggung Jawab Santri</h3>
                  <p class="text-sm font-medium text-muted-foreground uppercase tracking-wider">Informasi Orang Tua / Wali</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 bg-muted/10 p-6 md:p-8 rounded-2xl border border-border/50">
                <div>
                  <label class="form-label block mb-2">Nama Lengkap Ayah Kandung</label>
                  <input v-model="nama_ayah" v-bind="nama_ayahProps" type="text" class="w-full px-4 py-3.5 border-2 rounded-xl border-border focus:border-accent outline-none transition-all focus:ring-4 focus:ring-accent/10 bg-white" placeholder="Sesuai KK" />
                </div>
                <div>
                  <label class="form-label block mb-2">Nama Lengkap Ibu Kandung</label>
                  <input v-model="nama_ibu" v-bind="nama_ibuProps" type="text" class="w-full px-4 py-3.5 border-2 rounded-xl border-border focus:border-accent outline-none transition-all focus:ring-4 focus:ring-accent/10 bg-white" placeholder="Sesuai KK (Penting untuk validasi nasab)" />
                </div>
                <div>
                  <label class="form-label block mb-2">Kontak Darurat Wali Utama</label>
                  <input v-model="no_hp_ortu" v-bind="no_hp_ortuProps" type="tel" class="w-full px-4 py-3.5 border-2 rounded-xl border-border focus:border-accent outline-none transition-all focus:ring-4 focus:ring-accent/10 bg-white font-mono placeholder:font-sans" :class="{ 'border-destructive focus:border-destructive ring-destructive': errors.no_hp_ortu }" placeholder="Nomor GSM/WhatsApp Aktif" />
                  <p v-if="errors.no_hp_ortu" class="text-destructive text-sm font-medium mt-1.5 flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {{ errors.no_hp_ortu }}</p>
                </div>
                <div>
                  <label class="form-label block mb-2">Pekerjaan Wali (Ayah/Ibu)</label>
                  <input v-model="pekerjaan_ortu" v-bind="pekerjaan_ortuProps" type="text" class="w-full px-4 py-3.5 border-2 rounded-xl border-border focus:border-accent outline-none transition-all focus:ring-4 focus:ring-accent/10 bg-white" placeholder="Wiraswasta / PNS / Guru / Petani ..." />
                </div>
              </div>
            </div>

            <!-- SECTION 3: Dokumen Pendukung -->
            <div class="mb-12">
              <div class="flex items-center gap-4 mb-8">
                <span class="flex items-center justify-center w-10 h-10 rounded-full bg-success shadow-md shadow-success/30 text-white font-bold font-heading text-lg shrink-0">3</span>
                <div>
                  <h3 class="font-heading font-bold text-2xl text-foreground">Berkas Faktual</h3>
                  <p class="text-sm font-medium text-muted-foreground uppercase tracking-wider">Lampiran Syarat Administrasi (Opsional / Max 2MB)</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- KTP Upload -->
                <div class="border-2 border-dashed border-border/80 hover:border-success/50 transition-colors bg-white rounded-2xl p-6 flex flex-col justify-between group h-full">
                  <div>
                    <div class="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center text-success mb-4 group-hover:scale-110 transition-transform">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                    </div>
                    <label class="form-label font-bold text-base block mb-2">Scan KTP Orang Tua (Wali)</label>
                    <p class="text-xs text-muted-foreground mb-4">Mendukung file JPG, PNG. Maksimum 2MB.</p>
                  </div>
                  <div class="mt-auto">
                    <input type="file" class="hidden" id="ktp-upload" accept="image/jpeg,image/png,image/jpg" @change="handleFile('foto_ktp', $event)" />
                    <label for="ktp-upload" class="cursor-pointer flex items-center justify-center w-full px-4 py-2 bg-muted/40 hover:bg-success/10 border border-border text-sm font-semibold rounded-lg transition-colors" :class="{ 'border-destructive text-destructive bg-destructive/10': fileErrors.foto_ktp }">
                      Memilih File
                    </label>
                    <p v-if="fileErrors.foto_ktp" class="text-destructive text-xs font-bold mt-2 text-center">{{ fileErrors.foto_ktp }}</p>
                    <div v-if="files.foto_ktp" class="mt-3 p-2 bg-success/10 rounded border border-success/20 flex gap-2 items-center">
                      <svg class="w-4 h-4 text-success shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      <p class="text-success-foreground text-xs font-bold truncate">{{ files.foto_ktp.name }} ({{ formatFileSize(files.foto_ktp.size) }})</p>
                    </div>
                  </div>
                </div>

                <!-- Pas Foto Upload -->
                <div class="border-2 border-dashed border-border/80 hover:border-success/50 transition-colors bg-white rounded-2xl p-6 flex flex-col justify-between group h-full">
                  <div>
                    <div class="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center text-success mb-4 group-hover:scale-110 transition-transform">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <label class="form-label font-bold text-base block mb-2">Pas Foto Diri Santri (3x4)</label>
                    <p class="text-xs text-muted-foreground mb-4">Asli berwarna terbaru. Latar bebas. Maks 2MB.</p>
                  </div>
                  <div class="mt-auto">
                    <input type="file" class="hidden" id="pas-foto-upload" accept="image/jpeg,image/png,image/jpg" @change="handleFile('pas_foto', $event)" />
                    <label for="pas-foto-upload" class="cursor-pointer flex items-center justify-center w-full px-4 py-2 bg-muted/40 hover:bg-success/10 border border-border text-sm font-semibold rounded-lg transition-colors" :class="{ 'border-destructive text-destructive bg-destructive/10': fileErrors.pas_foto }">
                      Memilih File
                    </label>
                    <p v-if="fileErrors.pas_foto" class="text-destructive text-xs font-bold mt-2 text-center">{{ fileErrors.pas_foto }}</p>
                    <div v-if="files.pas_foto" class="mt-3 p-2 bg-success/10 rounded border border-success/20 flex gap-2 items-center">
                      <svg class="w-4 h-4 text-success shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      <p class="text-success-foreground text-xs font-bold truncate">{{ files.pas_foto.name }} ({{ formatFileSize(files.pas_foto.size) }})</p>
                    </div>
                  </div>
                </div>

                <!-- Kartu Keluarga Upload -->
                <div class="border-2 border-dashed border-border/80 hover:border-success/50 transition-colors bg-white rounded-2xl p-6 flex flex-col justify-between group h-full">
                  <div>
                    <div class="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center text-success mb-4 group-hover:scale-110 transition-transform">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <label class="form-label font-bold text-base block mb-2">Scan Resmi Kartu Keluarga</label>
                    <p class="text-xs text-muted-foreground mb-4">Ekstensi dibolehkan: PDF & Gambar Resolusi Tinggi.</p>
                  </div>
                  <div class="mt-auto">
                    <input type="file" class="hidden" id="kk-upload" accept="image/jpeg,image/png,image/jpg,application/pdf" @change="handleFile('kartu_keluarga', $event)" />
                    <label for="kk-upload" class="cursor-pointer flex items-center justify-center w-full px-4 py-2 bg-muted/40 hover:bg-success/10 border border-border text-sm font-semibold rounded-lg transition-colors" :class="{ 'border-destructive text-destructive bg-destructive/10': fileErrors.kartu_keluarga }">
                      Memilih File
                    </label>
                    <p v-if="fileErrors.kartu_keluarga" class="text-destructive text-xs font-bold mt-2 text-center">{{ fileErrors.kartu_keluarga }}</p>
                    <div v-if="files.kartu_keluarga" class="mt-3 p-2 bg-success/10 rounded border border-success/20 flex gap-2 items-center">
                      <svg class="w-4 h-4 text-success shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      <p class="text-success-foreground text-xs font-bold truncate">{{ files.kartu_keluarga.name }} ({{ formatFileSize(files.kartu_keluarga.size) }})</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pre-Submit Validation View -->
            <div v-if="Object.keys(errors).length > 0" class="mb-10 p-6 bg-accent/10 border-l-4 border-accent rounded-r-xl">
              <h5 class="font-bold text-accent-foreground mb-3 flex items-center gap-2">
                <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                Peringatan: Verifikasi Isian
              </h5>
              <ul class="text-sm text-foreground/80 list-disc pl-5 space-y-1.5 font-medium">
                <li v-for="(msg, key) in errors" :key="key"><span class="uppercase tracking-widest text-xs font-bold text-accent-foreground mr-1">{{ key.replace(/_/g, ' ') }}:</span> {{ msg }}</li>
              </ul>
            </div>

            <!-- Server Error View -->
            <div v-if="serverError" class="mb-10 p-6 bg-destructive/10 border-l-4 border-destructive rounded-r-xl">
              <h5 class="font-bold text-destructive mb-2 flex items-center gap-2">Transmisi Data Gagal</h5>
              <p class="text-sm font-medium">{{ serverError }}</p>
            </div>


            <!-- Submit Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-10 border-t border-border">
              <button 
                type="submit" 
                class="flex-1 btn btn-primary py-4 text-lg font-bold shadow-xl shadow-primary/20 
                      disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-1 transition-all" 
                :disabled="!!success || isSubmitting"
              >
                <div v-if="isSubmitting" class="flex items-center justify-center gap-3">
                  <svg class="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Mengamankan Berkas Pendaftaran...</span>
                </div>
                <div v-else class="flex items-center justify-center gap-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.95 11.95 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  Finalisasi & Ajukan Pendaftaran
                </div>
              </button>
              
              <router-link :to="`/pesantren/${route.params.id}`" class="sm:w-1/4 btn bg-muted/40 hover:bg-muted text-foreground border-border hover:border-muted-foreground transition-all py-4 font-bold flex justify-center text-lg">
                Batalkan
              </router-link>
            </div>
          </form>

          <!-- Success Guidance Overlay -->
          <div v-if="success" class="animate-fade-in relative z-50">
            <div class="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border/50">
              <!-- Header -->
              <div class="bg-gradient-to-r from-success/20 to-success/5 p-8 md:p-12 text-center relative">
                <div class="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden">
                  <div class="absolute -right-10 -bottom-10 text-[15rem] font-bold text-success rotate-12">✓</div>
                </div>
                
                <div class="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-success/30 relative z-10">
                  <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 class="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3 relative z-10">Selamat! Registrasi Berhasil</h3>
                <p class="text-muted-foreground text-lg max-w-2xl mx-auto relative z-10">
                  Data Anda telah kami terima dengan nomor registrasi 
                  <span class="font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">{{ success.nomor_pendaftaran }}</span>. 
                  Silakan ikuti panduan selanjutnya di bawah ini.
                </p>
              </div>

              <!-- Next Steps Content -->
              <div class="p-8 md:p-12 bg-white">
                <h4 class="font-heading font-bold text-xl mb-8 flex items-center gap-2">
                  <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">💡</span>
                  Tahapan Selanjutnya:
                </h4>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  <!-- Step 1: Payment -->
                  <div class="flex flex-col gap-4 relative">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md shadow-primary/20 shrink-0">1</div>
                      <h5 class="font-bold text-lg">Biaya Administrasi</h5>
                    </div>
                    <div class="flex-1 p-5 rounded-2xl bg-muted/30 border border-border/50">
                      <p class="text-sm text-muted-foreground mb-4">Lakukan pembayaran biaya pendaftaran agar berkas Anda dapat segera diproses oleh admin.</p>
                      <div class="flex flex-col gap-3">
                        <div class="flex justify-between items-center bg-white p-3 rounded-xl border border-border shadow-sm">
                          <span class="text-xs font-bold uppercase text-muted-foreground">Nominal</span>
                          <span class="font-bold text-primary">Rp {{ success.payment_amount?.toLocaleString('id-ID') || 0 }}</span>
                        </div>
                        
                        <button 
                          v-if="success.payment_status !== 'paid'"
                          @click="handlePayment"
                          class="btn btn-primary w-full shadow-lg shadow-primary/20 flex items-center justify-center gap-2 py-3"
                          :disabled="paymentLoading"
                        >
                          <span v-if="paymentLoading" class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
                          <span v-else>Bayar Sekarang</span>
                          <svg v-if="!paymentLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </button>
                        <div v-else class="flex items-center justify-center gap-2 p-3 bg-success/10 text-success rounded-xl border border-success/20 font-bold text-sm">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                          Sudah Terbayar
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Step 2: Verification -->
                  <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md shadow-primary/20 shrink-0">2</div>
                      <h5 class="font-bold text-lg">Verifikasi Berkas</h5>
                    </div>
                    <div class="flex-1 p-5 rounded-2xl bg-muted/30 border border-border/50">
                      <p class="text-sm text-muted-foreground mb-4">Admin pesantren akan meninjau dokumen yang Anda unggah. Proses ini biasanya memakan waktu:</p>
                      <div class="flex items-center gap-3 bg-white p-3 rounded-xl border border-border shadow-sm">
                        <div class="w-8 h-8 rounded bg-accent/10 flex items-center justify-center text-accent">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span class="font-bold text-sm text-foreground">1 - 3 Hari Kerja</span>
                      </div>
                    </div>
                  </div>

                  <!-- Step 3: Result -->
                  <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md shadow-primary/20 shrink-0">3</div>
                      <h5 class="font-bold text-lg">Lacak Status</h5>
                    </div>
                    <div class="flex-1 p-5 rounded-2xl bg-muted/30 border border-border/50">
                      <p class="text-sm text-muted-foreground mb-4">Pantau terus status pendaftaran Anda melalui halaman Lacak Status secara berkala.</p>
                      <router-link to="/track" class="btn bg-white border border-border w-full flex items-center justify-center gap-2 py-3 font-bold hover:bg-primary/5 hover:border-primary/20 transition-all">
                        Ke Halaman Lacak
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Footer Actions -->
                <div class="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
                  <div class="flex items-center gap-4">
                      <button @click="copyNomor" class="text-sm font-bold text-primary hover:underline flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        {{ copiedNomor ? 'Tersalin ke Clipboard!' : 'Salin Nomor Registrasi' }}
                      </button>
                  </div>
                  <div class="flex items-center gap-3">
                    <router-link to="/dashboard" class="btn btn-outline border-border font-bold">Ke Dashboard Saya</router-link>
                    <router-link to="/" class="btn bg-muted/50 hover:bg-muted font-bold text-foreground">Kembali ke Beranda</router-link>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tip -->
            <div class="mt-6 flex items-center justify-center gap-2 text-muted-foreground text-sm font-medium">
              <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Tip: Simpan halaman ini atau catat nomor registrasi Anda sebagai bukti.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { pesantren as pesantrenApi, pendaftaran } from '../services'

const route = useRoute()
const pesantrenInfo = ref(null)
const files = ref({})
const fileErrors = ref({})
const serverError = ref('')
const success = ref('')
const copiedNomor = ref(false)

const maxDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const phoneRegex = /^(\+62|62|0)[0-9]{8,13}$/

const schema = yup.object({
  nama_lengkap: yup.string().required('Nama lengkap harus diisi').min(3, 'Nama min. 3 karakter'),
  nik: yup.string()
    .required('NIK harus diisi')
    .length(16, 'Panjang NIK wajib 16 digit angka')
    .matches(/^[0-9]{16}$/, 'Format NIK hanya membolehkan angka'),
  jenis_kelamin: yup.string().required('Silakan tentukan identitas Kelamin').oneOf(['L', 'P']),
  tempat_lahir: yup.string().notRequired(),
  tanggal_lahir: yup.string().notRequired().test('is-valid-date', 'Kalender kelahiran di luar rentang wajar', (val) => {
    if (!val) return true
    const date = new Date(val)
    return date <= new Date() && date.getFullYear() >= 1950
  }),
  alamat: yup.string().notRequired(),
  no_hp: yup.string().notRequired().test('phone-format', 'Contoh Format Standar: 0812XXXXXXXX', (val) => {
    if (!val) return true
    return phoneRegex.test(val)
  }),
  nama_ayah: yup.string().notRequired(),
  nama_ibu: yup.string().notRequired(),
  no_hp_ortu: yup.string().notRequired().test('phone-format', 'Nomor tak dikenal, mohon koreksi pengetikan', (val) => {
    if (!val) return true
    return phoneRegex.test(val)
  }),
  pekerjaan_ortu: yup.string().notRequired()
})

const { defineField, handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    nama_lengkap: '',
    nik: '',
    jenis_kelamin: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat: '',
    no_hp: '',
    nama_ayah: '',
    nama_ibu: '',
    no_hp_ortu: '',
    pekerjaan_ortu: ''
  }
})

const [nama_lengkap, nama_lengkapProps] = defineField('nama_lengkap')
const [nik, nikProps] = defineField('nik')
const [jenis_kelamin, jenis_kelaminProps] = defineField('jenis_kelamin')
const [tempat_lahir, tempat_lahirProps] = defineField('tempat_lahir')
const [tanggal_lahir, tanggal_lahirProps] = defineField('tanggal_lahir')
const [alamat, alamatProps] = defineField('alamat')
const [no_hp, no_hpProps] = defineField('no_hp')
const [nama_ayah, nama_ayahProps] = defineField('nama_ayah')
const [nama_ibu, nama_ibuProps] = defineField('nama_ibu')
const [no_hp_ortu, no_hp_ortuProps] = defineField('no_hp_ortu')
const [pekerjaan_ortu, pekerjaan_ortuProps] = defineField('pekerjaan_ortu')

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

function handleFile(field, event) {
  const file = event.target.files[0]
  if (!file) return

  const maxSize = 2 * 1024 * 1024 // 2MB
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  const allowedTypes = [...allowedImageTypes, 'application/pdf']

  if (field === 'kartu_keluarga') {
    if (!allowedTypes.includes(file.type)) {
      fileErrors.value[field] = 'Resolusi format (Gambar/PDF) dibutuhkan.'
      event.target.value = ''
      return
    }
  } else {
    if (!allowedImageTypes.includes(file.type)) {
      fileErrors.value[field] = 'Lampirkan file citra Gambar (JPG, PNG, WebP) saja.'
      event.target.value = ''
      return
    }
  }

  if (file.size > maxSize) {
    fileErrors.value[field] = 'Volume data melonjak. Standar sistem maksimum bernilai 2MB per formulir.'
    event.target.value = ''
    return
  }

  fileErrors.value[field] = ''
  files.value[field] = file
}

async function copyNomor() {
  if (!success.value) return
  try {
    const textToCopy = success.value.nomor_pendaftaran || success.value
    await navigator.clipboard.writeText(textToCopy)
    copiedNomor.value = true
    setTimeout(() => { copiedNomor.value = false }, 2500)
  } catch (err) {
    const textArea = document.createElement('textarea')
    textArea.value = success.value.nomor_pendaftaran || success.value
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      copiedNomor.value = true
      setTimeout(() => { copiedNomor.value = false }, 2500)
    } finally {
      document.body.removeChild(textArea)
    }
  }
}

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  try {
    const formData = new FormData()
    formData.append('pesantren_id', route.params.id)
    Object.entries(values).forEach(([key, val]) => {
      if (val) formData.append(key, val)
    })
    Object.entries(files.value).forEach(([key, file]) => {
      formData.append(key, file)
    })

    const { data } = await pendaftaran.create(formData, { timeout: 30000 })
    success.value = data.data
    window.scrollTo({ top: 0, behavior: 'smooth'})
  } catch (err) {
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      serverError.value = 'Mesin peladen sibuk menanggapi lonjakan. Silahkan ulangi kembali.'
    } else {
      serverError.value = err.response?.data?.error || 'Kesalahan Teknis pada basis data.'
    }
  }
})

const paymentLoading = ref(false)
async function handlePayment() {
  if (!success.value?.id) return
  paymentLoading.value = true
  try {
    const { data } = await pendaftaran.getPaymentToken(success.value.id)
    
    if (window.snap) {
      window.snap.pay(data.data.token, {
        onSuccess: function (result) {
          toast.success('Pembayaran Berhasil! Berkas akan segera diverifikasi.')
          success.value.payment_status = 'paid'
        },
        onPending: function (result) {
          toast.info('Selesaikan pembayaran sesuai instruksi')
        },
        onError: function (result) {
          toast.error('Pembayaran gagal, silakan coba lagi nanti.')
        }
      })
    }
  } catch (err) {
    toast.error(err.response?.data?.error || 'Gagal memuat portal pembayaran')
  } finally {
    paymentLoading.value = false
  }
}

// Focus fix
watch([() => isSubmitting.value, () => Object.keys(errors.value).length], ([submitting, errCount]) => {
  if (!submitting && errCount > 0) {
    // Try scrolling to first error field
    const firstErrorName = Object.keys(errors.value)[0];
    const el = document.querySelector(`[name="${firstErrorName}"]`);
    if(el) {
       el.scrollIntoView({ behavior: 'smooth', block: 'center' });
       el.focus();
    }
  }
});

onMounted(async () => {
  const id = route.params.id
  if (id) {
    try {
      const { data } = await pesantrenApi.getById(id)
      pesantrenInfo.value = data.data
    } catch {
      pesantrenInfo.value = null
    }
  }
})
</script>
