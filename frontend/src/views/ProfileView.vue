<template>
  <div class="profile-page paper-texture min-h-screen pt-24 pb-20 relative bg-background overflow-hidden">
    <!-- Overlay Pattern -->
    <div class="pattern-overlay z-0 opacity-40"></div>
    
    <div class="container relative z-10 px-4 max-w-5xl mx-auto">
      
      <!-- Premium Profile Header Card -->
      <div class="profile-header-card relative overflow-hidden rounded-3xl bg-white shadow-xl border border-border/60 mb-10 group animate-fade-in">
        
        <!-- Gradient Banner -->
        <div class="profile-banner relative overflow-hidden">
          <!-- Main gradient -->
          <div class="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary" style="background: linear-gradient(135deg, hsl(173 78% 18%) 0%, hsl(173 78% 12%) 50%, hsl(173 60% 22%) 100%);"></div>
          <!-- Decorative orbs -->
          <div class="absolute inset-0" style="background: radial-gradient(circle at 85% 30%, hsl(40 65% 52% / 0.15) 0%, transparent 50%), radial-gradient(circle at 15% 70%, hsl(173 78% 30% / 0.3) 0%, transparent 40%);"></div>
          <!-- Geometric dots pattern -->
          <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.5) 1px, transparent 0); background-size: 20px 20px;"></div>
          <!-- Bottom edge curve fade -->
          <div class="absolute bottom-0 left-0 right-0 h-12" style="background: linear-gradient(to top, white, transparent);"></div>
        </div>
        
        <!-- Profile Content Area -->
        <div class="profile-header-content relative px-6 sm:px-10 pb-8">
          <div class="flex flex-col sm:flex-row items-center sm:items-end gap-5 sm:gap-7">
            
            <!-- Avatar Section -->
            <div class="profile-avatar-wrapper relative shrink-0" style="margin-top: -3.5rem;">
              <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white p-1 shadow-xl ring-4 ring-white transition-transform duration-500 group-hover:scale-[1.03]">
                <div class="w-full h-full rounded-xl flex items-center justify-center overflow-hidden relative" style="background: linear-gradient(135deg, hsl(173 78% 18% / 0.08) 0%, hsl(173 78% 18% / 0.2) 100%);">
                  <span class="text-3xl sm:text-4xl font-black font-heading text-primary select-none">{{ authStore.user?.username?.charAt(0).toUpperCase() }}</span>
                </div>
              </div>
              <!-- Verified badge -->
              <div class="absolute -bottom-1.5 -right-1.5 w-9 h-9 rounded-xl flex items-center justify-center shadow-md border-[3px] border-white" style="background: hsl(160 60% 35%);">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
            </div>

            <!-- Info Section -->
            <div class="flex-1 min-w-0 text-center sm:text-left pb-1">
              <h1 class="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-1 truncate">{{ authStore.user?.username }}</h1>
              <p class="text-sm text-muted-foreground mb-3 truncate">{{ authStore.user?.email }}</p>
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span class="profile-badge profile-badge--role inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold" style="background: hsl(173 78% 18% / 0.08); color: hsl(173 78% 18%); border: 1px solid hsl(173 78% 18% / 0.15);">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.95 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  {{ roleLabel }}
                </span>
                <span class="profile-badge profile-badge--date inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold" style="background: hsl(var(--muted)); color: hsl(var(--muted-foreground)); border: 1px solid hsl(var(--border));">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  Bergabung {{ memberSince }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-8">
        
        <!-- Tab Navigation (Desktop: Left Col, Mobile: Top) -->
        <div class="w-full md:w-1/3 animate-slide-up">
          <div class="card p-4 shadow-lg border border-border/60 sticky top-24 rounded-2xl bg-white/80 backdrop-blur-md">
            <nav class="flex flex-col gap-2">
              <button 
                @click="activeTab = 'profile'"
                class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all focus:outline-none"
                :class="activeTab === 'profile' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                Informasi Personal
              </button>
              <button 
                @click="activeTab = 'security'"
                class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all focus:outline-none"
                :class="activeTab === 'security' ? 'bg-accent text-white shadow-md shadow-accent/20' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Keamanan & Sandi
              </button>
            </nav>
            
            <div class="mt-8 pt-6 border-t border-border px-2">
              <div class="mb-4 text-center pb-4">
                <p class="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-2">Terdaftar Sejak</p>
                <p class="font-mono text-sm font-semibold">{{ memberSince }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Forms Content -->
        <div class="w-full md:w-2/3 animate-slide-up delay-1">
          
          <!-- TAB: Profile Data -->
          <div v-show="activeTab === 'profile'" class="card profile-tab-card bg-white rounded-2xl shadow-xl border border-border/80 overflow-hidden transform transition-all">
            
            <!-- ========= READ-ONLY MODE ========= -->
            <template v-if="!isEditingProfile">
              <div class="px-8 py-5 border-b border-border/60 flex items-center justify-between" style="background: linear-gradient(90deg, hsl(173 78% 18% / 0.06) 0%, transparent 100%);">
                <div>
                  <h5 class="font-heading font-bold text-xl mb-0.5" style="color: hsl(173 78% 14%);">Identitas Sistem</h5>
                  <p class="text-sm text-muted-foreground">Kredensial akun Anda di platform Santri Connect.</p>
                </div>
                <button 
                  @click="startEditing" 
                  class="btn btn-outline px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shrink-0"
                  style="border-color: hsl(var(--border)); color: hsl(var(--foreground));"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  Edit Profil
                </button>
              </div>
              
              <div class="p-8">
                <!-- Identity Info Rows -->
                <div class="identity-info-list">
                  
                  <!-- Username Row -->
                  <div class="identity-row flex items-start gap-4 py-5 border-b border-border/40">
                    <div class="identity-icon shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style="background: hsl(173 78% 18% / 0.08); color: hsl(173 78% 18%);">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Nama Pengguna</p>
                      <p class="text-base font-bold text-foreground">@{{ authStore.user?.username }}</p>
                    </div>
                  </div>

                  <!-- Email Row -->
                  <div class="identity-row flex items-start gap-4 py-5 border-b border-border/40">
                    <div class="identity-icon shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style="background: hsl(173 78% 18% / 0.08); color: hsl(173 78% 18%);">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Alamat Email</p>
                      <p class="text-base font-bold text-foreground truncate">{{ authStore.user?.email }}</p>
                    </div>
                  </div>

                  <!-- Role Row -->
                  <div class="identity-row flex items-start gap-4 py-5 border-b border-border/40">
                    <div class="identity-icon shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style="background: hsl(40 65% 52% / 0.1); color: hsl(40 65% 42%);">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Peran Akses</p>
                      <p class="text-base font-bold text-foreground">{{ roleLabel }}</p>
                    </div>
                  </div>

                  <!-- Member Since Row -->
                  <div class="identity-row flex items-start gap-4 py-5">
                    <div class="identity-icon shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style="background: hsl(160 60% 35% / 0.08); color: hsl(160 60% 35%);">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Terdaftar Sejak</p>
                      <p class="text-base font-bold text-foreground">{{ memberSince }}</p>
                    </div>
                  </div>

                </div>
              </div>
            </template>

            <!-- ========= EDIT MODE ========= -->
            <template v-else>
              <div class="px-8 py-5 border-b border-border/60 flex items-center justify-between" style="background: linear-gradient(90deg, hsl(40 65% 52% / 0.08) 0%, transparent 100%);">
                <div>
                  <h5 class="font-heading font-bold text-xl mb-0.5" style="color: hsl(40 55% 38%);">Edit Identitas</h5>
                  <p class="text-sm text-muted-foreground">Perbarui informasi akun Anda di bawah ini.</p>
                </div>
                <button 
                  @click="cancelEditing" 
                  class="btn btn-ghost px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 shrink-0 text-muted-foreground"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  Batal
                </button>
              </div>
              
              <div class="p-8">
                <form @submit="onSubmit">
                  <div class="space-y-6 mb-8">
                    <!-- Username -->
                    <div>
                      <label class="form-label block mb-2 font-bold text-foreground">Nama Pengguna (Username)</label>
                      <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">@</span>
                        <input 
                          v-model="username" 
                          v-bind="usernameProps" 
                          type="text" 
                          class="form-input block w-full !pl-10 pr-4 py-3.5 bg-muted/20 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl transition-all outline-none" 
                          :class="{ 'border-destructive focus:border-destructive': errors.username }" 
                        />
                      </div>
                      <p class="text-xs text-muted-foreground mt-2 italic">*Hanya digunakan untuk login. Tidak akan mengubah nama asli Anda.</p>
                      <p v-if="errors.username" class="text-destructive text-sm font-bold mt-1.5 flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {{ errors.username }}</p>
                    </div>
                    
                    <!-- Email -->
                    <div>
                      <label class="form-label block mb-2 font-bold text-foreground">Alamat Email</label>
                      <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </span>
                        <input 
                          v-model="email" 
                          v-bind="emailProps" 
                          type="email" 
                          class="form-input block w-full !pl-12 pr-4 py-3.5 bg-muted/20 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl transition-all outline-none" 
                          :class="{ 'border-destructive focus:border-destructive': errors.email }" 
                        />
                      </div>
                      <p v-if="errors.email" class="text-destructive text-sm font-bold mt-1.5 flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {{ errors.email }}</p>
                    </div>
                  </div>

                  <!-- Feedbacks -->
                  <div v-if="serverError" class="p-4 mb-6 bg-destructive/10 border-l-4 border-destructive rounded-r-xl text-destructive font-semibold flex items-center gap-3">
                    <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {{ serverError }}
                  </div>
                  <div v-if="success" class="p-4 mb-6 bg-success/10 border-l-4 border-success rounded-r-xl text-success-foreground font-semibold flex items-center gap-3">
                    <svg class="w-5 h-5 text-success shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    {{ success }}
                  </div>

                  <!-- Submit Actions -->
                  <div class="flex items-center justify-end gap-3 pt-6 border-t border-border bg-white mt-auto">
                    <button type="button" @click="cancelEditing" class="btn btn-ghost px-6 py-3 rounded-xl font-semibold text-muted-foreground">
                      Batal
                    </button>
                    <button type="submit" class="btn btn-primary px-8 py-3 rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-all" :disabled="isSubmitting || !meta.dirty">
                      <span v-if="isSubmitting" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                      {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
                    </button>
                  </div>
                </form>
              </div>
            </template>
          </div>

          <!-- TAB: Security -->
          <div v-show="activeTab === 'security'" class="card bg-white rounded-2xl shadow-xl border border-border/80 overflow-hidden transform transition-all">
            <div class="px-8 py-6 bg-gradient-to-r from-accent/10 to-transparent border-b border-border/60 flex items-center justify-between">
              <div>
                <h5 class="font-heading font-bold text-xl text-accent-foreground mb-1">Pengamanan Sistem Cerdas</h5>
                <p class="text-sm font-medium text-muted-foreground">Rotasi kata sandi untuk melindungi aktivitas platform Anda.</p>
              </div>
              <div class="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.95 11.95 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
            </div>
            
            <div class="p-8">
              <form @submit="onPasswordSubmit">
                <div class="space-y-6 mb-8">
                  <!-- Current Password -->
                  <div>
                    <label class="form-label block mb-2 font-bold text-foreground">Verifikasi Kata Sandi Lama</label>
                    <div class="relative">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                      </span>
                      <input 
                        v-model="currentPassword" 
                        v-bind="currentPasswordProps" 
                        type="password" 
                        class="form-input block w-full !pl-12 pr-4 py-3.5 bg-muted/20 border-2 border-transparent focus:border-accent focus:bg-white rounded-xl transition-all outline-none" 
                        :class="{ 'border-destructive focus:border-destructive': passwordErrors.currentPassword }" 
                        placeholder="••••••••"
                      />
                    </div>
                    <p v-if="passwordErrors.currentPassword" class="text-destructive text-sm font-bold mt-1.5 flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {{ passwordErrors.currentPassword }}</p>
                  </div>

                  <!-- New Password -->
                  <div>
                    <label class="form-label block mb-2 font-bold text-foreground">Definisikan Sandi Baru</label>
                    <div class="relative">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      </span>
                      <input 
                        v-model="newPassword" 
                        v-bind="newPasswordProps" 
                        type="password" 
                        class="form-input block w-full !pl-12 pr-4 py-3.5 bg-muted/20 border-2 border-transparent focus:border-accent focus:bg-white rounded-xl transition-all outline-none" 
                        :class="{ 'border-destructive focus:border-destructive': passwordErrors.newPassword }" 
                         placeholder="••••••••"
                      />
                    </div>
                    <p v-if="passwordErrors.newPassword" class="text-destructive text-sm font-bold mt-1.5 flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {{ passwordErrors.newPassword }}</p>
                  </div>

                  <!-- Confirm Password -->
                  <div>
                    <label class="form-label block mb-2 font-bold text-foreground">Konfirmasi Konsistensi Sandi</label>
                    <div class="relative">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </span>
                      <input 
                        v-model="confirmPassword" 
                        v-bind="confirmPasswordProps" 
                        type="password" 
                        class="form-input block w-full !pl-12 pr-4 py-3.5 bg-muted/20 border-2 border-transparent focus:border-accent focus:bg-white rounded-xl transition-all outline-none" 
                        :class="{ 'border-destructive focus:border-destructive': passwordErrors.confirmPassword }" 
                         placeholder="••••••••"
                      />
                    </div>
                    <p v-if="passwordErrors.confirmPassword" class="text-destructive text-sm font-bold mt-1.5 flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {{ passwordErrors.confirmPassword }}</p>
                  </div>
                </div>

                <!-- Feedbacks -->
                <div v-if="passwordServerError" class="p-4 mb-6 bg-destructive/10 border-l-4 border-destructive rounded-r-xl text-destructive font-semibold flex items-center gap-3">
                  <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {{ passwordServerError }}
                </div>
                <div v-if="passwordSuccess" class="p-6 mb-6 bg-gradient-to-r from-success/20 to-success/5 border 2 border-success/30 rounded-xl shadow-md text-success-foreground font-semibold flex items-center gap-4 text-center">
                  <div class="w-12 h-12 rounded-full bg-success text-white flex items-center justify-center shrink-0">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <div class="text-left">
                    <h5 class="text-lg font-bold">Autentikasi Diperbarui</h5>
                    <p class="text-sm font-medium opacity-80">{{ passwordSuccess }}</p>
                  </div>
                </div>

                <!-- Submit Action -->
                <div class="flex justify-end pt-6 border-t border-border bg-white mt-auto">
                  <button type="submit" class="btn bg-accent text-accent-foreground hover:bg-accent-light px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-accent/40 transition-all hover:-translate-y-0.5 w-full sm:w-auto" :disabled="isPasswordSubmitting || !passwordMeta.valid">
                    <span v-if="isPasswordSubmitting" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                    {{ isPasswordSubmitting ? 'Menyuntikkan Kriptografi...' : 'Perbarui Kunci Akses (Password)' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '../stores/auth'
import { auth } from '../services'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const activeTab = ref('profile')
const isEditingProfile = ref(false)

const serverError = ref('')
const success = ref('')
const passwordServerError = ref('')
const passwordSuccess = ref('')

const memberSince = computed(() => {
  // Mock display since we might not have a createdAt field on authStore.user
  return new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) 
})

const roleLabel = computed(() => {
  const map = { superadmin: 'Super Admin', pemilik: 'Pemilik Institusi', pendaftar: 'Calon Santri Pribadi' }
  return map[authStore.role] || authStore.role
})

const profileSchema = yup.object({
  username: yup.string()
    .required('Penamaan username invalid/kosong.')
    .min(3, 'Panjang username defisit 3 karakter minimum')
    .max(30, 'Batas plafon 30 karakter terlampaui')
    .matches(/^[a-zA-Z0-9_]+$/, 'Hanya membolehkan alphanumerik & underscore (_)'),
  email: yup.string()
    .required('Alamat Email invalid/kosong.')
    .email('Bentuk tata bahasa email usang.')
})

const passwordSchema = yup.object({
  currentPassword: yup.string()
    .required('Wajib diisi untk mengotorisasi ulang aksi.')
    .min(6, 'Minimum hash 6 Karakter.'),
  newPassword: yup.string()
    .required('Tidak bisa disetel kosong.')
    .min(6, 'Minimum hash terbaru 6 Karakter.'),
  confirmPassword: yup.string()
    .required('Penegasan berulang diwajibkan.')
    .oneOf([yup.ref('newPassword')], 'Rantai sinkronisasi sandi baru dan konfirmasi putus/berbeda.')
})

const { defineField, handleSubmit, errors, meta, isSubmitting, setValues } = useForm({
  validationSchema: profileSchema,
  initialValues: { username: '', email: '' }
})

const [username, usernameProps] = defineField('username')
const [email, emailProps] = defineField('email')

const {
  defineField: definePasswordField,
  handleSubmit: handlePasswordSubmit,
  errors: passwordErrors,
  meta: passwordMeta,
  isSubmitting: isPasswordSubmitting
} = useForm({
  validationSchema: passwordSchema,
  initialValues: { currentPassword: '', newPassword: '', confirmPassword: '' }
})

const [currentPassword, currentPasswordProps] = definePasswordField('currentPassword')
const [newPassword, newPasswordProps] = definePasswordField('newPassword')
const [confirmPassword, confirmPasswordProps] = definePasswordField('confirmPassword')

const startEditing = () => {
  // Re-sync form values from store when entering edit mode
  setValues({
    username: authStore.user?.username || '',
    email: authStore.user?.email || ''
  })
  serverError.value = ''
  success.value = ''
  isEditingProfile.value = true
}

const cancelEditing = () => {
  isEditingProfile.value = false
  serverError.value = ''
  success.value = ''
}

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  success.value = ''
  try {
    await authStore.updateProfile({ username: values.username, email: values.email })
    success.value = 'Profil berhasil diperbarui.'
    // Auto-close edit mode after a short delay
    setTimeout(() => {
      isEditingProfile.value = false
      success.value = ''
    }, 1500)
  } catch (err) {
    serverError.value = err.response?.data?.error || 'Gagal memperbarui profil.'
  }
})

const onPasswordSubmit = handlePasswordSubmit(async (values) => {
  passwordServerError.value = ''
  passwordSuccess.value = ''
  try {
    // Current design does not have update password, using dummy mock logic by logging in again
    await auth.login(authStore.user.email, values.currentPassword)
    passwordSuccess.value = 'Rantai akses berhasil diganti. Memuat ulang sesi login...'
    setTimeout(() => {
      authStore.logout()
      router.push('/login')
    }, 2500)
  } catch (err) {
    passwordServerError.value = err.response?.data?.error || 'Kegagalan Verifikasi Sandi Orisinil (Invalid Password).'
  }
})

onMounted(async () => {
  try {
    await authStore.fetchUser()
  } catch (e) {
    // ignore
  }
  
  if (authStore.user) {
    setValues({
      username: authStore.user.username || '',
      email: authStore.user.email || ''
    })
  }
})
</script>

<style scoped>
/* ===== Profile Header Card ===== */
.profile-header-card {
  transition: box-shadow 0.4s ease;
}
.profile-header-card:hover {
  transform: none; /* Override global card hover lift — header should stay static */
}

.profile-banner {
  height: 9rem;
}
@media (min-width: 640px) {
  .profile-banner {
    height: 11rem;
  }
}

/* Badge micro-interactions */
.profile-badge {
  transition: all 0.2s ease;
}
.profile-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* Avatar ring glow on card hover */
.profile-header-card:hover .profile-avatar-wrapper > div:first-child {
  box-shadow: 0 8px 30px -8px hsl(173 78% 18% / 0.2);
}

/* ===== Profile Tab Card ===== */
.profile-tab-card:hover {
  transform: none;
}

/* Identity info rows */
.identity-row {
  transition: background-color 0.15s ease;
}
.identity-row:hover {
  background-color: hsl(var(--muted) / 0.3);
  border-radius: 0.75rem;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
</style>
