// ==========================================
// 1. USER & AUTH
// Collection Path: /users/{uid}
// ==========================================

export interface User {
  uid: string;            // ID dari Firebase Auth
  email: string;
  displayName: string;    // Nama Lengkap
  photoURL: string;       // URL Foto (Cloudinary)
  role: 'admin' | 'user'; // Penentu hak akses & Badge di forum
  bio?: string;           // Info tambahan (mis: "Petani Cabai di Malang")
  createdAt: number;      // Timestamp (Date.now())
  isOnline?: boolean;     // Status aktif
  lastSeen?: number;  // Waktu terakhir aktif
}

// ==========================================
// 2. MATERI KELAS (BLOCK SYSTEM)
// Collection Path: /materials/{materialId}
// ==========================================

// Tipe blok konten untuk fleksibilitas (Teks - Video - Gambar)
export type BlockType = 'text' | 'video' | 'image';

export interface ContentBlock {
  id: string;        // ID unik (gunakan UUID/Date.now) untuk Key React
  type: BlockType;   
  value: string;     // Text: Isi paragraf | Video: URL YouTube | Image: URL Cloudinary
}

export interface Material {
  id: string;             // Auto-generated ID dari Firestore
  title: string;          // Judul Materi
  thumbnailUrl: string;   // Cover depan (Cloudinary)
  contentBlocks: ContentBlock[]; // Array urutan konten
  createdAt: number;      // Timestamp
}

/** * CONTOH DATA 'contentBlocks':
 * [
 * { id: "1", type: "text", value: "Halo, ini cara menanam padi..." },
 * { id: "2", type: "video", value: "https://youtube.com/watch?v=..." },
 * { id: "3", type: "image", value: "https://res.cloudinary.com/.../foto.jpg" }
 * ]
 */

// ==========================================
// 3. FORUM UTAMA (POSTS)
// Collection Path: /posts/{postId}
// ==========================================

export interface Post {
  id: string;             // Auto-generated ID
  
  // Data Penulis (Denormalization - Disimpan di sini agar load feed cepat)
  authorId: string;
  authorName: string;
  authorPhoto: string;    // Cloudinary URL
  authorBadge: 'admin' | 'user'; // Jika admin, frontend tampilkan icon centang biru/badge
  
  // Konten Post
  content: string;        // Teks status
  imageUrl?: string;      // Foto lampiran (Cloudinary) - Opsional
  tags?: string[];         // Tag kategori (misal: ["pertanian", "irigasi"]) - Opsional
  
  // Statistik Interaksi (Counter sederhana untuk tampilan)
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  
  createdAt: number;      // Timestamp
}

// ==========================================
// 4. KOMENTAR & REPLY (NESTED)
// Collection Path: /posts/{postId}/comments/{commentId}
// ==========================================

export interface Comment {
  id: string;
  postId: string;         // Referensi ke Post induk
  
  // LOGIKA REPLY BERTINGKAT
  // null = Komentar Utama (Level 1)
  // string (ID Komentar Lain) = Reply terhadap komentar tersebut (Level 2 dst)
  parentId: string | null;
  
  // Data Penulis Komentar
  authorId: string;
  authorName: string;
  authorPhoto: string;
  authorBadge: 'admin' | 'user';
  
  text: string;
  
  // Komentar juga bisa di-like/dislike
  likesCount: number;
  dislikesCount: number;
  
  createdAt: number;
}

// ==========================================
// 5. VOTES (LIKE / DISLIKE)
// Mencegah user vote berkali-kali (One user, one vote per item)
// ==========================================

// Path Post:    /posts/{postId}/votes/{userId}
// Path Comment: /posts/{postId}/comments/{commentId}/votes/{userId}
// PENTING: Gunakan 'userId' sebagai ID Dokumen (Document ID)

export interface Vote {
  userId: string;        // ID User yang melakukan vote
  type: 'like' | 'dislike'; // User hanya bisa pilih satu, toggle jika diklik lagi
  createdAt: number;
}

// ==========================================
// 6. NOTIFIKASI
// Collection Path: /notifications/{notificationId}
// ==========================================

export interface Notification {
  id: string;
  recipientId: string;   // UID penerima notif (pemilik post/komen)
  
  senderName: string;    // "Budi"
  senderPhoto: string;   // Foto Budi
  
  type: 'like' | 'dislike' | 'comment' | 'reply' | 'system';
  message: string;       // Contoh: "Budi menyukai postingan Anda"
  
  link: string;          // URL redirect (misal: /forum/post-123)
  isRead: boolean;       // Status sudah dibaca/belum (untuk highlight merah)
  
  createdAt: number;
}