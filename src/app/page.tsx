// src/app/page.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Menggunakan komponen Image dari Next.js

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white bg-green-700 overflow-hidden">
        {/* Latar Belakang Gambar/Video */}
        <Image
          src="/images/hero-bg.jpg" // Ganti dengan path gambar pertanian yang relevan
          alt="Pertanian Modern"
          layout="fill"
          objectFit="cover"
          quality={80}
          className="absolute inset-0 z-0 opacity-70"
        />
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div> {/* Overlay gelap */}

        <div className="relative z-10 text-center p-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up">
            Panen Pengetahuan, Tumbuhkan Masa Depan
          </h1>
          <p className="text-lg md:text-xl mb-8 animate-fade-in-up delay-200">
            Platform e-learning interaktif untuk memberdayakan petani muda hingga berpengalaman dengan ilmu dan teknologi terbaru di bidang ketahanan pangan.
          </p>
          <Link href="/login" passHref>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 animate-fade-in-up delay-400">
              Mulai Belajar Gratis
            </button>
          </Link>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-green-800">Kenapa Memilih "Panen Pengetahuan"?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-lg shadow-md bg-gray-50 hover:shadow-xl transition-shadow duration-300">
              <div className="text-5xl text-green-600 mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-2">Inovasi Pertanian</h3>
              <p className="text-gray-600">Pelajari teknik bercocok tanam modern, pengelolaan hama terpadu, hingga penggunaan sensor pintar.</p>
            </div>
            <div className="p-6 rounded-lg shadow-md bg-gray-50 hover:shadow-xl transition-shadow duration-300">
              <div className="text-5xl text-yellow-600 mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Komunitas Aktif</h3>
              <p className="text-gray-600">Terhubung dengan ribuan petani lain, berbagi pengalaman, dan saling membantu memecahkan masalah.</p>
            </div>
            <div className="p-6 rounded-lg shadow-md bg-gray-50 hover:shadow-xl transition-shadow duration-300">
              <div className="text-5xl text-blue-600 mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Akses Mudah & Fleksibel</h3>
              <p className="text-gray-600">Belajar kapan saja, di mana saja, melalui smartphone, tablet, atau komputer Anda.</p>
            </div>
            <div className="p-6 rounded-lg shadow-md bg-gray-50 hover:shadow-xl transition-shadow duration-300">
              <div className="text-5xl text-red-600 mb-4">🌾</div>
              <h3 className="text-xl font-semibold mb-2">Masa Depan Pangan</h3>
              <p className="text-gray-600">Siapkan diri Anda untuk tantangan global ketahanan pangan dengan ilmu yang relevan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-green-800">Kursus Pilihan Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Contoh Kursus 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <Image src="/images/course-irigasi.jpg" alt="Irigasi Pintar" width={400} height={250} layout="responsive" objectFit="cover" />
              <div className="p-6 text-left">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Sistem Irigasi Otomatis</h3>
                <p className="text-gray-600 text-sm mb-4">Pelajari cara mengimplementasikan irigasi berbasis sensor untuk efisiensi air maksimal.</p>
                <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full text-sm">
                  Lihat Kursus
                </button>
              </div>
            </div>
            {/* Contoh Kursus 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <Image src="/images/course-drone.jpg" alt="Drone Pertanian" width={400} height={250} layout="responsive" objectFit="cover" />
              <div className="p-6 text-left">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Penggunaan Drone untuk Pemantauan Lahan</h3>
                <p className="text-gray-600 text-sm mb-4">Optimalkan pemantauan kesehatan tanaman dan prediksi panen dengan teknologi drone.</p>
                <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full text-sm">
                  Lihat Kursus
                </button>
              </div>
            </div>
            {/* Contoh Kursus 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <Image src="/images/course-marketing.jpg" alt="Pemasaran Digital" width={400} height={250} layout="responsive" objectFit="cover" />
              <div className="p-6 text-left">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Pemasaran Hasil Panen Digital</h3>
                <p className="text-gray-600 text-sm mb-4">Tingkatkan jangkauan pasar Anda dengan strategi pemasaran online yang efektif.</p>
                <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full text-sm">
                  Lihat Kursus
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-green-800">Apa Kata Mereka?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <p className="italic text-gray-700 mb-4">"Sejak bergabung, saya jadi lebih percaya diri menggunakan teknologi. Panen saya meningkat, dan saya bisa menjual produk lebih luas!"</p>
              <p className="font-semibold text-green-700">- Bapak Budi, Petani Muda, Jawa Timur</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <p className="italic text-gray-700 mb-4">"Saya tidak menyangka belajar teknologi semudah ini. Materi disampaikan dengan bahasa yang ramah dan mudah dipahami, bahkan untuk orang tua seperti saya."</p>
              <p className="font-semibold text-green-700">- Ibu Siti, Petani Berpengalaman, Sumatera Barat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-green-700 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap Mengembangkan Pertanian Anda?</h2>
          <p className="text-lg mb-8">Bergabunglah dengan komunitas "Panen Pengetahuan" hari ini dan mulailah perjalanan Anda menuju pertanian yang lebih cerdas dan berkelanjutan!</p>
          <Link href="/login" passHref>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105">
              Daftar Sekarang
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}