import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Cloudinary environment variables are missing. Please check .env.local and restart the server.');
}
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'Tidak ada file diunggah.' }, { status: 400 });
    }

    // Validasi tipe dan ukuran file (misal maksimal 5MB dan hanya gambar)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'File harus berupa gambar.' }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Ukuran gambar maksimal 5MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Unggah gambar ke Cloudinary
    const result = await new Promise<{ secure_url?: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result as { secure_url?: string });
        }
      }).end(buffer);
    });

    if (!result?.secure_url) {
      return NextResponse.json({ success: false, error: 'Gagal mendapatkan URL gambar.' }, { status: 500 });
    }

    // Jika unggahan berhasil, kirim URL gambar
    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
    });

  } catch (error: unknown) {
    console.error('Unggahan gagal:', error);
    let errorMessage = 'Unggahan gagal.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}