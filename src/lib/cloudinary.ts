// Client-side Upload Helper
// Hanya menggunakan fetch API bawaan browser, TIDAK menggunakan SDK Cloudinary

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

    if (!res.ok) throw new Error("Gagal upload gambar");

    const data = await res.json();
    return data.secure_url; // Mengembalikan URL HTTPS yang aman
  } catch (error) {
    console.error("Cloudinary Error:", error);
    throw error;
  }
};