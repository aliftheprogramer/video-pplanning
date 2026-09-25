# Plan: Perbaikan & Penyempurnaan Highlight Address (Step 1 Basic Information)

> **Tujuan:** Mengeliminasi seluruh kecacatan visual pada tahap *Review Address* (teks "Confirm your address" dan "State/territory" terpotong oleh garis sorotan, serta ketidaksinkronan saat layar merekam scroll ke bawah/atas), sehingga tampilan highlight presisi, rapi, dan sekelas demo produk profesional.

---

## 1. Analisis Masalah (Berdasarkan Screenshot User)

Berdasarkan screenshot yang diunggah (`media_1790325048135.png`) dan inspeksi frame aktual (`frame 1800`):

1. **Batas Bawah Memotong Teks ("State/territory" & "Selangor")**:
   - Nilai saat ini: `y: 280, h: 980` $\to$ garis bawah berada pada $y = 1260$ (atau $y = 1250$ dengan padding $10\text{px}$).
   - Teks `"State/territory"` terletak di $y = 1230 - 1250$, sedangkan `"Selangor"` berada di $y = 1310 - 1330$.
   - **Efek visual:** Garis oranye memotong horizontal tepat di tengah tulisan *"State/territory"*, dan kata *"Selangor"* tertinggal di luar kotak.

2. **Batas Atas Menabrak Judul ("Confirm your address")**:
   - Judul `"Confirm your address"` terletak pada $y = 245 - 270$.
   - Garis atas sorotan berada pada $y = 270$, memotong tepat di bawah huruf judul secara canggung.

3. **Konflik Animasi dengan Rekaman Scroll (Motion Desync)**:
   - Pada rekaman sumber (`rec 34.5s - 37.2s`), pengguna merekam gerakan scroll ke bawah untuk melihat *ZIP code* lalu scroll kembali ke atas.
   - Karena kotak highlight saat ini berstatus statis, teks di dalam HP bergerak naik-turun menembus garis sorotan yang diam, menciptakan ilusi visual yang berantakan (*content clipping*).

---

## 2. Solusi Desain yang Diusulkan

### A. Kalibrasi Presisi Bounding Box (`Rect`)
Mengubah koordinat `addressForm` agar membungkus seluruh formulir alamat sebagai satu kesatuan kartu yang elegan:

| Parameter | Lama (`video2.ts`) | Rekomendasi Baru | Alasan |
| :--- | :--- | :--- | :--- |
| **`x`** | `28` | **`36`** | Padding horizontal simetris ($26\text{px}$ dari tepi layar HP setelah `PAD = 10`). |
| **`y`** | `280` | **`230`** | Garis atas jatuh di $y = 220$ (di bawah header "Create a listing", di atas judul form). |
| **`w`** | `664` | **`648`** | Lebar proporsional ($648 + 20 = 668\text{px}$) selaras dengan kartu input aplikasi. |
| **`h`** | `980` | **`1125`** | Garis bawah jatuh di $y = 1365$ (di bawah "Selangor", berjarak aman $20\text{px}$ di atas progress bar $y = 1384$). |
| **`radius`** | `24` | **`28`** | Sudut membulat modern yang harmonis dengan ukuran container. |

*Hasil:* Seluruh elemen alamat (**Region, Street Address, City, State/Territory, Selangor**) terbungkus utuh tanpa ada satu pun huruf yang terpotong.

---

### B. Opsi Penanganan Gerakan Scroll (Dynamic Polish)

Terdapat 2 pendekatan untuk menangani scroll rekaman di detik 34.5–37.2:

- **Opsi 1 (Sangat Direkomendasikan — Potong Jitter Scroll via `cuts`)**:
  - Menambahkan `{ from: 34.5, to: 37.2 }` ke dalam array `cuts` di `video2.ts`.
  - *Alasan:* Pada rekaman mentah, scroll tersebut hanyalah jeda ragu-ragu pengguna yang melihat ke bawah dan langsung kembali ke atas tanpa mengubah data apa pun. Memotongnya membuat video berjalan mulus: formulir alamat tampil tenang dan mudah dibaca selama ~2 detik, lalu langsung beralih ke tombol **Next**. Ini sesuai standar video onboarding Airbnb/Apple dan konsisten dengan potongan *typing delay* lainnya di `video2.ts`.
  
- **Opsi 2 (Pertahankan Scroll dengan 2-Phase Spot Fade)**:
  - Jika rekaman scroll tetap ingin dipertahankan, kita memecah spot alamat:
    - *Phase 1:* Sorotan `addressForm` aktif pada tampilan atas ($25.4\text{s} - 27.2\text{s}$).
    - *Phase 2:* Sorotan fade-out halus saat layar sedang bergerak, sehingga teks tidak bertabrakan dengan garis kotak.
    - *Phase 3:* Sorotan berpindah ke tombol `Next` saat posisi layar kembali tenang.

---

## 3. Rencana Eksekusi Bertahap (Task-by-Task)

### Task 1: Penerapan Koordinat Presisi `addressForm`
- [x] Update definisi `addressForm` di [`src/guide/video2.ts`](file:///home/alif/Metairflow/video-result/video-pplanning/src/guide/video2.ts):
  ```ts
  const addressForm: Rect = { x: 36, y: 230, w: 648, h: 1125 };
  ```
- [x] Sesuaikan `radius` spot `addressForm` menjadi `28`.

### Task 2: Implementasi Pemotongan Jitter Scroll (`cuts`)
- [x] Tambahkan rentang cut `{ from: 34.5, to: 37.2 }` pada array `cuts` di [`src/guide/video2.ts`](file:///home/alif/Metairflow/video-result/video-pplanning/src/guide/video2.ts).
- [x] Verifikasi sinkronisasi waktu caption cue (`Review your [[address]] details` dan `Tap [[Next]] to confirm`).

### Task 3: Verifikasi Visual dengan Still Frame Render
- [x] Render frame 1800 (tampilan awal alamat dengan kotak baru):
  ```bash
  npx remotion still src/index.ts Step1BasicInformation out/inspect/address_fixed_1800.png --frame 1800 --overwrite
  ```
- [x] Render frame saat tombol Next disorot untuk memastikan transisi bersih.
- [x] Jalankan `npm run lint` (`eslint src && tsc`) untuk menjamin zero regression.

---

## 4. Hasil yang Diharapkan
1. Tidak ada lagi huruf yang terbelah/terpotong garis oranye di bagian atas maupun bawah.
2. Teks "Confirm your address" dan "Selangor" berada rapi di dalam batas kotak.
3. Jarak ke progress bar memiliki margin pernapasan visual yang konsisten.
4. Tampilan video menjadi stabil, elegan, dan profesional.
