# Panduan & Template Spesifikasi Highlight Video

Dokumen ini adalah format standar yang bisa Anda isi kapan pun Anda ingin membuat atau mengedit video panduan dengan sorotan (*highlight*).
Anda cukup mengisi bagian ini, menyertakan screenshot (jika ada), lalu beri tahu saya untuk menerapkannya ke dalam kode Remotion.

---

## 🚀 Cara Cepat Pakai

1. Taruh screenshot referensi Anda di folder `assets/screenshots/` (misal: `assets/screenshots/step1.png`). Anda boleh memberi tanda kotak merah/coretan di screenshot pada bagian yang ingin disorot.
2. Salin blok **Template Highlight** di bawah ini ke bagian **Daftar Poin yang Ingin Dibuat / Diedit**.
3. Isi informasi perkiraan detik, bagian mana yang disorot, teks judul/caption, serta efek yang diinginkan.
4. Simpan file ini, lalu cukup beri instruksi ke saya: *"Tolong terapkan highlight dari file HIGHLIGHT_SPEC.md"*.
5. Saya akan otomatis:
   - Mencocokkan frame rekaman layar dengan screenshot Anda.
   - Mengukur koordinat piksel elemen (`{ x, y, w, h }`) secara presisi.
   - Mengatur timeline hold, zoom kamera, animasi ripple, dan caption.
   - Merender still frame untuk verifikasi hasil tampilan.

---

## 📋 Info Video

- **Nama Komposisi / Step:** `Step4PriceSettings` *(atau nama video yang ingin diedit/dibuat)*
- **File Rekaman Layar (MP4):** `step4-price-settings-recording.mp4` *(di folder public/)*
- **Judul Header Pembuka (Opsional):**
  - **Subtitle:** `Step 4 of 4`
  - **Title:** `Price and Settings`

---

## 📝 Daftar Poin yang Ingin Dibuat / Diedit

*(Salin template di bawah ini sebanyak poin/highlight yang ingin Anda buat)*

### Poin 1: [Nama Elemen / Tombol]
- **Perkiraan Waktu di Video:** `Detik 05.2` *(atau deskripsi momen: "saat card rekomendasi harga muncul")*
- **Screenshot Referensi:** `assets/screenshots/poin1_harga.png` *(atau paste gambar / sebutkan nama filenya)*
- **Bagian yang Disorot di Layar:**
  - *Deskripsi:* Tombol "Get Price Recommendation" berwarna hijau di tengah card.
  - *Bentuk:* `Kotak` / `Lingkaran` *(pilih salah satu, default: Kotak)*
- **Teks Caption / Panduan:**
  - *Icon:* `check` *(pilihan: house / plus / check / dollar)*
  - *Teks Utama:* Gunakan rekomendasi harga dari [[AI RUUMI]] *(kata di dalam [[...]] akan otomatis berwarna oranye brand)*
  - *Subtitle / Penjelasan (Opsional):* Membantu menentukan harga sewa paling kompetitif.
- **Efek Tambahan:**
  - *Freeze Layar (Hold)?:* `Ya, sekitar 2 detik` *(agar penonton sempat membaca sebelum layar bergeser)*
  - *Efek Ketuk (Tap Ripple)?:* `Ya, saat tombol diklik` *(menghasilkan animasi gelombang tap)*
  - *Zoom Kamera?:* `Ya` *(kamera otomatis zoom dan fokus ke tombol ini)*

---

### Poin 2: [Nama Elemen / Tombol]
- **Perkiraan Waktu di Video:** `Detik 12.0`
- **Screenshot Referensi:** `assets/screenshots/poin2_instant_book.png`
- **Bagian yang Disorot di Layar:**
  - *Deskripsi:* Switch toggle "Use Instant Book" di baris kedua.
  - *Bentuk:* `Kotak`
- **Teks Caption / Panduan:**
  - *Icon:* `dollar`
  - *Teks Utama:* Aktifkan fitur [[Instant Book]]
  - *Subtitle / Penjelasan (Opsional):* Penyewa bisa langsung booking tanpa perlu konfirmasi manual.
- **Efek Tambahan:**
  - *Freeze Layar (Hold)?:* `Ya, 1.5 detik`
  - *Efek Ketuk (Tap Ripple)?:* `Ya`
  - *Zoom Kamera?:* `Tidak`

---

## 💡 Contekan Pilihan Fitur

| Properti | Pilihan yang Didukung | Keterangan |
| :--- | :--- | :--- |
| **Bentuk Sorotan** | `Kotak` (Rect) atau `Lingkaran` (Circle) | Kotak cocok untuk card, input, dan tombol panjang. Lingkaran cocok untuk floating button / avatar. |
| **Pilihan Icon Caption** | `house`, `plus`, `check`, `dollar` | Ikon kecil di samping judul teks caption. |
| **Format Teks Oranye** | `[[kata kunci]]` | Teks di dalam tanda kurung siku ganda `[[...]]` otomatis diwarnai oranye Ruumi. |
| **Freeze Layar (Hold)** | `Ya` (sebutkan durasi detik) / `Tidak` | Menjeda video rekaman sementara agar pembacaan teks terasa nyaman dan tidak buru-buru. |
| **Tap Ripple** | `Ya` / `Tidak` | Efek gelombang sentuhan jari tepat di titik target saat tombol diketuk. |
| **Zoom Kamera** | `Ya` / `Tidak` | Otomatis memperbesar tampilan layar dan mengarahkan fokus ke elemen target. |
