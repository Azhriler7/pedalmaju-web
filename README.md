# PEDALMAJU WEB E-LEARNING

Platform e-learning komunitas pertanian cerdas yang menggabungkan materi terkurasi, forum diskusi, serta pengelolaan konten oleh admin. Proyek ini dibangun menggunakan Next.js dengan backend Firebase dan penyimpanan media pada Cloudinary.

## Tim Pengembang

- Adim Agus Sugianto
- Ali Nasruloh Budiman
- Arya Agung Triadi
- Azhriler Lintang
- Muhammad Zidan Heiqmatyar

## Teknologi Utama

- Next.js 15 (App Router) sebagai front-end framework
- TypeScript untuk type-safety
- Firebase (Auth, Firestore, Storage) sebagai backend
- Cloudinary untuk manajemen gambar
- YouTube embed sebagai sumber video pembelajaran

## Prasyarat

- Node.js 18+ dan npm terbaru
- Akun Firebase dengan akses ke Firestore & Authentication
- Akun Cloudinary untuk penyimpanan media
- Git untuk manajemen versi

## Memulai Proyek

1. Clone repository:
   ```bash
   git clone https://github.com/Azhriler7/pedalmaju-web.git
   cd pedalmaju-web
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Buat file environment `./.env.local` berdasarkan variabel yang dibutuhkan (minta kredensial pada pemilik repo) dan isi contoh berikut:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   CLOUDINARY_UPLOAD_PRESET=...
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

## Menjalankan Aplikasi

- Mode pengembangan: `npm run dev`
- Akses lokal: http://localhost:3000

## Skrip NPM

- `npm run dev` – menjalankan server development
- `npm run build` – membuat bundel produksi Next.js
- `npm start` – menjalankan bundel produksi
- `npm run lint` – menjalankan linting

## Struktur Proyek (Ringkas)

```
src/
  app/           # Halaman dengan App Router
  components/    # Komponen UI reusable
  features/      # Modul domain (auth, forum, materials, dll)
  lib/           # Utility dan konfigurasi pihak ketiga
  types/         # Definisi TypeScript global
public/          # Aset statis
```

## Alur Git yang Disarankan

### Mengambil Perubahan Terbaru

```bash
git checkout main
git pull origin main
```

### Membuat Fitur Baru

```bash
git checkout -b nama-fitur-baru
# ... lakukan perubahan kode ...
git add .
git commit -m "Deskripsi singkat perubahan"
git push -u origin nama-fitur-baru
```

Setelah push, buat Pull Request melalui GitHub untuk review sebelum merge.

## Tips Kontribusi

- Selalu perbarui branch sebelum mulai mengerjakan fitur
- Gunakan commit message yang jelas dan konsisten
- Sertakan screenshot/gif pada PR untuk perubahan UI
- Pastikan linting dan build berjalan tanpa error sebelum mengajukan PR

## Lisensi

Proyek ini dikembangkan untuk kebutuhan internal tim PedalMaju. Hubungi pemilik repo untuk informasi lebih lanjut mengenai penggunaan kode sumber.
