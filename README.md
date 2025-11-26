PEDAL MAJU WEB E-LEARNING

DIBUAT OLEH:
1. Adim Agus Sugianto
2. Ali Nasruloh Budiman 
3. Arya Agung Triadi
4. Azhriler Lintang
5. Muhammad Zidan Heiqmatyar

Tech: 
Next Js as Front-End
Firebase as Back-End
Cloudinary as Image Database 
Youtube as Video Database 

Panduan Setup dan Workflow Git

Dokumen ini berisi langkah-langkah untuk clone, setup environment (Firebase & Cloudinary), update, dan push code.

1. Clone & Instalasi Awal

Lakukan ini hanya saat pertama kali mengambil projek.

# Clone repository (ganti URL dengan link repo teman)
git clone https://github.com/Azhriler7/pedalmaju-web.git

# Masuk ke folder projek
cd nama-repo

# Install dependencies
npm install


2. Setup Environment Variables

Projek ini menggunakan Firebase dan Cloudinary. File .env tidak ikut ter-upload ke git, jadi harus dibuat manual.

Buat file bernama .env.local di root folder.

Minta isi value key kepada pemilik repo.

3. Menjalankan Projek

Pastikan dependensi sudah terinstall dan .env.local sudah dibuat.

# Jalankan server development
npm run dev


Akses di: http://localhost:3000

4. Cara Pull (Ambil Update Teman)

Lakukan ini sebelum mulai coding untuk memastikan kodemu sinkron dengan repo utama.

# Pindah ke branch utama
git checkout main

# Tarik data terbaru
git pull origin main


5. Cara Push (Kirim Fitur Baru)

Gunakan branch baru untuk setiap fitur agar tidak merusak branch utama.

# 1. Buat dan masuk ke branch baru
git checkout -b nama-fitur-baru

# --- Lakukan coding di sini ---

# 2. Cek status file (Opsional)
git status

# 3. Masukkan file ke staging
git add .

# 4. Simpan perubahan (Commit)
git commit -m "Menambahkan fitur X"

# 5. Upload ke GitHub (Push)
git push -u origin nama-fitur-baru


Setelah langkah ke-5, buka GitHub di browser dan buat Pull Request (PR).