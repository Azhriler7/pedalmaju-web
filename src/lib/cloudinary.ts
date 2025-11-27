import { v2 as cloudinary } from 'cloudinary';

// 1. Konfigurasi (Server Side Only)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Ini yang krusial
});

// --- HELPER FUNCTIONS ---

// A. Upload Gambar (Bisa dipanggil di Client / Frontend)
export const uploadToCloudinary = async (file: File, folder: string = 'general') => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string);
  formData.append("folder", folder);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    return data.secure_url; // Return URL: https://res.cloudinary.com/.../gambar.jpg
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

// B. Extract Public ID dari URL (Helper untuk Delete)
// URL Cloudinary: https://res.cloudinary.com/.../v12345/folder/gambar_keren.jpg
// Kita butuh ID: "folder/gambar_keren" untuk menghapusnya
export const getPublicIdFromUrl = (url: string) => {
  try {
    const regex = /\/v\d+\/(.+)\.\w+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

// C. Hapus Gambar (WAJIB Panggil di Server Action / API Route)
export const deleteFromCloudinary = async (imageUrl: string) => {
  const publicId = getPublicIdFromUrl(imageUrl);
  
  if (!publicId) return;

  try {
    // Menggunakan Library 'cloudinary' Node.js
    await cloudinary.uploader.destroy(publicId);
    console.log(`Berhasil hapus gambar: ${publicId}`);
  } catch (error) {
    console.error("Gagal hapus gambar di Cloudinary:", error);
    // Kita tidak throw error agar proses delete post tetap lanjut meski gambar gagal dihapus
  }
};