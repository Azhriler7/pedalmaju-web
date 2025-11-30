import 'server-only'; // Penjaga: File ini HARAM masuk ke Client Bundle
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Server (Butuh API Secret)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: Ambil Public ID dari URL
export const getPublicIdFromUrl = (url: string) => {
  try {
    const regex = /\/v\d+\/(.+)\.\w+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

// Fungsi Delete (Hanya jalan di Server Action / API Route)
export const deleteFromCloudinary = async (imageUrl: string) => {
  const publicId = getPublicIdFromUrl(imageUrl);
  
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Berhasil hapus gambar Cloudinary: ${publicId}`);
  } catch (error) {
    console.error("Gagal hapus gambar di Cloudinary:", error);
  }
};