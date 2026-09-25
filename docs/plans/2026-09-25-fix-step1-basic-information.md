# Fix Step 1 Basic Information Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menghilangkan seluruh kecacatan visual (bad morphing, teks terpotong, desinkronisasi tombol Next/Save, caption ghosting, dan kontradiksi penutup) pada video `Step1BasicInformation`.

**Architecture:** Modifikasi konfigurasi data panduan di `src/guide/video2.ts` untuk memisahkan titik-titik transisi yang melompat jauh dengan jeda waktu (`>= 0.08s`) agar memicu fade-out/fade-in alami, mengkalibrasi ulang bounding box koordinat `Rect`, memecah caption cue untuk instruksi "Next", serta mengarahkan sorotan penutup ke baris penyelesaian Step 1.

**Tech Stack:** Remotion 4.0, React 19, TypeScript, Remotion CLI (`still` frame extraction verification).

## Global Constraints

- Kompatibilitas 100% dengan `GuideData` type di `src/guide/types.ts`.
- Tidak boleh mengubah core engine `Highlight.tsx` dan `timeline.ts` secara merusak (tetap modular agar tidak memengaruhi video1, video3, video4, video6).
- Setiap perubahan harus diverifikasi menggunakan rendering frame still (`npx remotion still`).

---

### Task 1: Break Destructive Chain-Morphing on Distant Transitions

**Files:**
- Modify: `src/guide/video2.ts:160-200`
- Test: `npx remotion still src/index.ts Step1BasicInformation out/inspect/step1_1638_fixed.png --frame 1638 --overwrite`

**Interfaces:**
- Consumes: `CHAIN_GAP = 0.05` di `src/guide/Highlight.tsx`
- Produces: `video2.spots` dengan jeda `>= 0.08s` pada transisi yang melompat jauh:
  - `mapArea` -> `nextBtn` (Next 2)
  - `addressForm` -> `nextBtn` (Next 3)
  - `titleInput` -> `saveBtn`

- [x] **Step 1: Set gap between `mapArea` and `nextBtn` (Next 2)**
  Ubah waktu akhir `mapArea` dari `tapNext2 - 0.15` menjadi `tapNext2 - 0.28`. Berikan waktu mulai `nextBtn` pada `tapNext2 - 0.18`. Selisih `0.10s` memastikan kotak peta fade-out sempurna sebelum kotak tombol Next muncul langsung di tombolnya.

- [x] **Step 2: Set gap between `addressForm` and `nextBtn` (Next 3)**
  Ubah waktu akhir `addressForm` dari `tapNext3 - 0.15` menjadi `tapNext3 - 0.28`. Berikan waktu mulai `nextBtn` pada `tapNext3 - 0.18`.

- [x] **Step 3: Set gap between `titleInput` and `saveBtn`**
  Ubah waktu akhir `titleInput` dari `tapSave - 0.15` menjadi `tapSave - 0.40`. Mulai `saveBtn` pada `tapSave - 0.28`.

- [x] **Step 4: Render frame 1638 & 2130 untuk verifikasi eliminasi bad morphing**
  Jalankan:
  ```bash
  npx remotion still src/index.ts Step1BasicInformation out/inspect/step1_1638_fixed.png --frame 1638 --overwrite
  npx remotion still src/index.ts Step1BasicInformation out/inspect/step1_2130_fixed.png --frame 2130 --overwrite
  ```
  Pastikan tidak ada kotak raksasa yang menyusut miring melintasi layar.

---

### Task 2: Precision Coordinate Calibration for Map and Address Form

**Files:**
- Modify: `src/guide/video2.ts:47-49`
- Test: `npx remotion still src/index.ts Step1BasicInformation out/inspect/step1_1302_fixed.png --frame 1302 --overwrite`
- Test: `npx remotion still src/index.ts Step1BasicInformation out/inspect/step1_1902_fixed.png --frame 1902 --overwrite`

**Interfaces:**
- Produces:
  - `mapArea`: `{ x: 0, y: 436, w: 720, h: 890 }` (mengurangi tinggi dari 930 ke 890 agar tidak menabrak bar progress).
  - `addressForm`: `{ x: 28, y: 280, w: 664, h: 980 }` (mengangkat batas atas dan memperpanjang bawah agar membalut seluruh field tanpa memotong huruf).

- [x] **Step 1: Update `mapArea` definition in `src/guide/video2.ts`**
  Ganti `const mapArea: Rect = { x: 0, y: 436, w: 720, h: 930 };` dengan:
  ```ts
  const mapArea: Rect = { x: 0, y: 436, w: 720, h: 890 };
  ```

- [x] **Step 2: Update `addressForm` definition in `src/guide/video2.ts`**
  Ganti `const addressForm: Rect = { x: 32, y: 330, w: 656, h: 900 };` dengan:
  ```ts
  const addressForm: Rect = { x: 28, y: 280, w: 664, h: 980 };
  ```

- [x] **Step 3: Render frame 1302 & 1902 untuk verifikasi batas kotak**
  Jalankan:
  ```bash
  npx remotion still src/index.ts Step1BasicInformation out/inspect/step1_1302_fixed.png --frame 1302 --overwrite
  npx remotion still src/index.ts Step1BasicInformation out/inspect/step1_1902_fixed.png --frame 1902 --overwrite
  ```
  Pastikan garis bawah peta tidak memotong progress bar dan form alamat membungkus seluruh teks dengan rapi.

---

### Task 3: Fix Timing for `saveBtn` and Tap Ripple Synchronization

**Files:**
- Modify: `src/guide/video2.ts:194-200`
- Test: `npx remotion still src/index.ts Step1BasicInformation out/inspect/step1_2412_fixed.png --frame 2412 --overwrite`

**Interfaces:**
- Consumes: `tapSave = arrive(47.0) = 36.5s`
- Produces: `saveBtn` spot dengan waktu kemunculan yang cukup sebelum tap terjadi.

- [x] **Step 1: Sesuaikan waktu mulai sorotan tombol Save**
  Ubah spot `saveBtn`:
  ```ts
  {
    from: tapSave - 0.35,
    to: leave(47.0),
    rect: saveBtn,
    radius: 40,
    tapAt: tapSave,
  }
  ```
  Dengan jeda dari `titleInput` (yang berakhir di `tapSave - 0.45`), tombol Save akan fade-in langsung di tempatnya pada detik 36.15 dan sudah berdiri stabil saat tap ripple memancar pada detik 36.50.

- [x] **Step 2: Render frame 2412 untuk verifikasi tombol Save**
  Jalankan:
  ```bash
  npx remotion still src/index.ts Step1BasicInformation out/inspect/step1_2412_fixed.png --frame 2412 --overwrite
  ```
  Pastikan efek ripple memancar tepat di atas tombol "Save" yang sudah tersorot oranye terang.

---

### Task 4: Add Missing Caption Cue & Eliminate Ghosting on Fast Steps

**Files:**
- Modify: `src/guide/video2.ts:98-115`
- Test: `npx remotion still src/index.ts Step1BasicInformation out/inspect/step1_2130_fixed.png --frame 2130 --overwrite`

**Interfaces:**
- Produces: Penambahan caption terpisah untuk tombol Next di layar alamat:
  - `Review your [[address]] details`: `leave(32.5) + 0.2` hingga `tapNext3 - 0.20`
  - `Tap [[Next]] to confirm`: `tapNext3 - 0.20` hingga `leave(39.0)`

- [x] **Step 1: Pecah caption alamat di `src/guide/video2.ts`**
  Ganti blok caption alamat:
  ```ts
  {
    from: leave(32.5) + 0.2,
    to: tapNext3 - 0.2,
    icon: "check",
    text: "Review your [[address]] details",
  },
  {
    from: tapNext3 - 0.2,
    to: leave(39.0),
    icon: "check",
    text: "Tap [[Next]] to confirm",
  },
  ```

- [x] **Step 2: Sinkronkan timing caption judul dan simpan**
  Pastikan caption *"Give your listing a [[title]]"* berakhir tepat sebelum tombol Save disorot, dan caption *"Tap [[Save]] to finish"* aktif saat tombol Save disorot.

- [x] **Step 3: Render frame 2130 & 2412 untuk memverifikasi teks caption**
  Jalankan render still frame dan pastikan caption terbaca jelas tanpa ghosting/faded look.

---

### Task 5: Align Ending Highlight with Completion Message

**Files:**
- Modify: `src/guide/video2.ts:53, 201-206`
- Test: `npx remotion still src/index.ts Step1BasicInformation out/inspect/step1_2742_fixed.png --frame 2742 --overwrite`

**Interfaces:**
- Produces: `completedStep1Row` bounding box yang menyorot baris "Basic Information - Completed" (bukan tombol Step 2).

- [x] **Step 1: Definisikan `completedStep1Row` rect**
  Ganti `startNowBtn2` dengan `completedStep1Row`:
  ```ts
  const completedStep1Row: Rect = { x: 40, y: 395, w: 650, h: 235 };
  ```

- [x] **Step 2: Update spot terakhir di `video2.ts`**
  ```ts
  {
    from: arrive(48.0) + 0.1,
    to: end,
    rect: completedStep1Row,
    radius: 32,
    dim: false,
  }
  ```

- [x] **Step 3: Render frame 2742 untuk verifikasi penutup**
  Jalankan:
  ```bash
  npx remotion still src/index.ts Step1BasicInformation out/inspect/step1_2742_fixed.png --frame 2742 --overwrite
  ```
  Pastikan baris "Basic information Completed" tersorot serasi dengan caption *"Basic Information is complete!"*.

---

### Task 6: Full Verification & Frame Comparison

**Files:**
- Test: Semua frame `318, 552, 678, 930, 1038, 1302, 1638, 1902, 2130, 2322, 2412, 2742`
- Script: `npm run lint` dan render perbandingan

- [x] **Step 1: Jalankan linter dan typecheck**
  ```bash
  npm run lint
  ```

- [x] **Step 2: Render seluruh 12 frame inspeksi sekaligus**
  ```bash
  for f in 318 552 678 930 1038 1302 1638 1902 2130 2322 2412 2742; do npx remotion still src/index.ts Step1BasicInformation out/inspect/step1_$f.png --frame $f --overwrite; done
  ```

- [x] **Step 3: Verifikasi akhir kualitas visual**
  Bandingkan frame-frame baru dengan temuan sebelumnya untuk memastikan tidak ada lagi regresi.
