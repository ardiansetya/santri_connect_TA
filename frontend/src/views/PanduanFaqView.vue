<template>
  <div class="panduan-page paper-texture min-h-screen pb-20">
    <div class="pattern-overlay"></div>

    <!-- Hero -->
    <section class="bg-hero-gradient relative pt-24 pb-16 mb-10 overflow-hidden">
      <div class="container relative z-10 text-center">
        <h1 class="font-heading text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
          Panduan & <span class="italic text-accent-light">FAQ</span>
        </h1>
        <p class="text-white/80 max-w-2xl mx-auto text-lg animate-slide-up delay-1">
          Pelajari cara menggunakan SantriConnect dan temukan jawaban atas pertanyaan yang sering diajukan.
        </p>
      </div>
    </section>

    <div class="container relative z-10">
      <!-- Tutorial Section -->
      <section class="mb-20 animate-fade-in delay-2">
        <div class="text-center mb-12">
          <span class="section-tag">Tutorial</span>
          <h2 class="section-title">Cara Menggunakan SantriConnect</h2>
          <p class="section-subtitle mt-2">Ikuti langkah mudah berikut untuk menemukan pesantren impian Anda.</p>
        </div>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="(step, i) in tutorialSteps" :key="i" class="step-card group" :style="{ animationDelay: `${i * 80}ms` }">
            <div class="step-number">{{ i + 1 }}</div>
            <div class="step-icon" v-html="step.icon"></div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.desc }}</p>
          </div>
        </div>
      </section>

      <!-- Tips Section -->
      <section class="mb-20 animate-fade-in">
        <div class="text-center mb-12">
          <span class="section-tag">Tips</span>
          <h2 class="section-title">Tips Memilih Pesantren yang Tepat</h2>
          <p class="section-subtitle mt-2">Pertimbangkan hal-hal penting berikut sebelum memilih pesantren.</p>
        </div>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="(tip, i) in tips" :key="i" class="tip-card">
            <div class="tip-num">{{ i + 1 }}</div>
            <h3 class="tip-title">{{ tip.title }}</h3>
            <p class="tip-desc">{{ tip.desc }}</p>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="max-w-3xl mx-auto animate-fade-in">
        <div class="text-center mb-12">
          <span class="section-tag">FAQ</span>
          <h2 class="section-title">Pertanyaan yang Sering Diajukan</h2>
        </div>
        <div class="space-y-3">
          <div v-for="(faq, i) in faqs" :key="i" class="faq-item" :class="{ 'faq-open': openFaq === i }">
            <button class="faq-question" @click="openFaq = openFaq === i ? null : i">
              <span>{{ faq.q }}</span>
              <svg class="faq-chevron" :class="{ 'rotate-180': openFaq === i }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div v-show="openFaq === i" class="faq-answer">
              <p>{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const openFaq = ref(null)

const tutorialSteps = [
  { title: 'Buat Akun', desc: 'Daftar gratis dengan email Anda. Pilih peran sebagai Pendaftar atau Pemilik Pesantren.', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>' },
  { title: 'Jelajahi Pesantren', desc: 'Cari dan filter pesantren berdasarkan lokasi, kurikulum, fasilitas, dan rentang biaya.', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' },
  { title: 'Bandingkan', desc: 'Pilih hingga 3 pesantren dan bandingkan fasilitas, biaya, serta keunggulan masing-masing.', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"/><path d="M8 21H3v-5"/><path d="M21 3l-7.5 7.5"/><path d="M3 21l7.5-7.5"/></svg>' },
  { title: 'Gunakan Rekomendasi', desc: 'Isi preferensi Anda dan sistem akan merekomendasikan pesantren terbaik secara otomatis.', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
  { title: 'Daftar Online', desc: 'Isi formulir pendaftaran langsung dari platform. Unggah dokumen yang diperlukan secara digital.', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11v6"/><path d="m9 14 3 3 3-3"/></svg>' },
  { title: 'Pantau Status', desc: 'Lacak status pendaftaran Anda secara real-time melalui halaman Cek Status dengan nomor pendaftaran.', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>' }
]

const tips = [
  { title: 'Sesuaikan dengan Minat Anak', desc: 'Pilih pesantren yang kurikulumnya sesuai minat dan bakat anak, baik itu salaf, modern, atau campuran.' },
  { title: 'Pertimbangkan Lokasi', desc: 'Perhatikan jarak dari rumah. Pesantren yang terlalu jauh dapat menyulitkan kunjungan keluarga.' },
  { title: 'Cek Fasilitas', desc: 'Pastikan fasilitas memadai seperti asrama, masjid, perpustakaan, laboratorium, dan klinik kesehatan.' },
  { title: 'Perhatikan Biaya', desc: 'Hitung total biaya termasuk SPP, uang pangkal, dan biaya tambahan lainnya agar sesuai anggaran keluarga.' },
  { title: 'Baca Ulasan & Testimoni', desc: 'Cari informasi dari alumni atau wali santri yang sudah berpengalaman di pesantren tersebut.' },
  { title: 'Kunjungi Langsung', desc: 'Jika memungkinkan, lakukan kunjungan ke pesantren untuk melihat kondisi secara langsung.' }
]

const faqs = [
  { q: 'Apa itu SantriConnect?', a: 'SantriConnect adalah platform pencarian, perbandingan, dan pendaftaran pondok pesantren secara online. Platform ini memudahkan orang tua dan calon santri dalam menemukan pesantren yang sesuai.' },
  { q: 'Apakah pendaftaran di SantriConnect gratis?', a: 'Ya, membuat akun dan menjelajahi pesantren di SantriConnect sepenuhnya gratis. Biaya pendaftaran pesantren tergantung kebijakan masing-masing pesantren.' },
  { q: 'Bagaimana cara mendaftar ke pesantren?', a: 'Setelah membuat akun, pilih pesantren yang diminati, klik tombol Daftar pada halaman detail pesantren, lalu isi formulir pendaftaran dan unggah dokumen yang diperlukan.' },
  { q: 'Berapa pesantren yang bisa dibandingkan?', a: 'Anda dapat membandingkan hingga 3 pesantren sekaligus. Klik ikon tambah (+) pada kartu pesantren di halaman daftar, lalu buka halaman Bandingkan.' },
  { q: 'Apa itu fitur Rekomendasi?', a: 'Fitur Rekomendasi menggunakan algoritma untuk menyarankan pesantren berdasarkan preferensi Anda, seperti budget, lokasi, fasilitas, dan kurikulum.' },
  { q: 'Bagaimana cara melacak status pendaftaran?', a: 'Gunakan nomor pendaftaran yang diberikan setelah mendaftar. Masukkan di halaman Cek Status untuk melihat progres pendaftaran Anda.' },
  { q: 'Apakah data pesantren di SantriConnect valid?', a: 'Semua data pesantren yang ditampilkan telah diinput dan dikelola oleh pemilik pesantren yang terverifikasi atau admin platform.' },
  { q: 'Bisakah pemilik pesantren mendaftarkan pesantrennya?', a: 'Ya, pemilik pesantren dapat membuat akun dengan peran Pemilik, lalu menambahkan dan mengelola informasi pesantren mereka melalui dashboard.' },
  { q: 'Dokumen apa saja yang diperlukan untuk pendaftaran?', a: 'Umumnya diperlukan foto/scan KTP orang tua, Kartu Keluarga, Akta Kelahiran, Rapor terakhir, Pas Foto, dan bukti transfer biaya pendaftaran.' },
  { q: 'Bagaimana cara pembayaran biaya pendaftaran?', a: 'Pembayaran dilakukan via transfer bank ke rekening pesantren yang tertera di formulir pendaftaran, kemudian unggah bukti transfer melalui platform.' },
  { q: 'Apakah bisa mendaftar ke lebih dari satu pesantren?', a: 'Ya, Anda dapat mendaftar ke beberapa pesantren berbeda. Namun, hanya satu pendaftaran aktif per pesantren.' },
  { q: 'Bagaimana jika pendaftaran saya ditolak?', a: 'Jika ditolak, Anda akan mendapatkan notifikasi beserta alasan penolakan. Anda dapat memperbaiki data dan mendaftar kembali sesuai kebijakan pesantren.' }
]
</script>

<style scoped>
/* Step Cards */
.step-card {
  position: relative;
  padding: 2rem;
  background: white;
  border-radius: 1.25rem;
  border: 1px solid hsl(35 18% 85%);
  transition: all 0.3s ease;
  text-align: center;
}
.step-card:hover {
  border-color: hsl(173 78% 18% / 0.2);
  box-shadow: 0 10px 30px -10px rgba(13, 79, 79, 0.1);
  transform: translateY(-4px);
}
.step-number {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  background: hsl(40 65% 52%);
  color: white;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.75rem; font-weight: 800;
  border-radius: 50%;
  box-shadow: 0 2px 8px hsl(40 65% 52% / 0.3);
}
.step-icon {
  display: flex; align-items: center; justify-content: center;
  width: 3.5rem; height: 3.5rem;
  margin: 0 auto 1rem;
  background: hsl(173 78% 18% / 0.06);
  color: hsl(173 78% 18%);
  border-radius: 1rem;
}
.step-title {
  font-family: 'Playfair Display', serif;
  font-weight: 600; font-size: 1.125rem;
  color: hsl(25 25% 15%); margin-bottom: 0.5rem;
}
.step-desc {
  font-size: 0.875rem; color: hsl(30 10% 45%); line-height: 1.6;
}

/* Tip Cards */
.tip-card {
  position: relative;
  padding: 1.75rem 1.75rem 1.75rem 3.5rem;
  background: white;
  border-radius: 1rem;
  border: 1px solid hsl(35 18% 85%);
  transition: all 0.3s ease;
}
.tip-card:hover {
  border-color: hsl(40 65% 52% / 0.3);
  box-shadow: 0 8px 24px -8px rgba(212, 168, 67, 0.12);
}
.tip-num {
  position: absolute; left: 1.25rem; top: 1.75rem;
  width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  background: hsl(40 65% 52% / 0.1);
  color: hsl(40 65% 48%);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.6875rem; font-weight: 800;
  border-radius: 0.375rem;
}
.tip-title {
  font-family: 'Playfair Display', serif;
  font-weight: 600; font-size: 1.0625rem;
  color: hsl(25 25% 15%); margin-bottom: 0.375rem;
}
.tip-desc {
  font-size: 0.8125rem; color: hsl(30 10% 45%); line-height: 1.6;
}

/* FAQ */
.faq-item {
  background: white;
  border: 1px solid hsl(35 18% 85%);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}
.faq-item:hover { border-color: hsl(173 78% 18% / 0.15); }
.faq-open { border-color: hsl(173 78% 18% / 0.25); box-shadow: 0 4px 16px -4px rgba(13, 79, 79, 0.08); }
.faq-question {
  width: 100%;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: none; border: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9375rem; font-weight: 600;
  color: hsl(25 25% 15%);
  text-align: left;
  transition: color 0.2s;
}
.faq-question:hover { color: hsl(173 78% 18%); }
.faq-chevron {
  flex-shrink: 0;
  color: hsl(30 10% 55%);
  transition: transform 0.3s ease;
}
.faq-answer {
  padding: 0 1.5rem 1.25rem;
  font-size: 0.875rem;
  color: hsl(30 10% 40%);
  line-height: 1.7;
  border-top: 1px solid hsl(35 18% 90%);
  padding-top: 1rem;
}

/* Section tags reuse from global */
.section-tag {
  display: inline-block;
  font-size: 0.75rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: hsl(40 65% 48%);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: hsl(40 65% 52% / 0.08);
  border: 1px solid hsl(40 65% 52% / 0.15);
  margin-bottom: 0.75rem;
  font-family: 'DM Sans', sans-serif;
}
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.25rem; font-weight: 700;
  color: hsl(25 25% 15%); letter-spacing: -0.02em;
  margin-top: 0.5rem;
}
.section-subtitle {
  color: hsl(30 10% 45%); font-size: 1.0625rem; line-height: 1.6;
}
</style>
