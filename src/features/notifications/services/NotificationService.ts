import { db } from '@/lib/firebase';
import { 
  collection, addDoc, query, where, orderBy, getDocs, 
  updateDoc, doc, limit 
} from 'firebase/firestore';
import { Notification } from '@/types';

const COLLECTION = 'notifications';

// Create new notification
export const sendNotification = async (
  recipientId: string,
  senderId: string,
  senderName: string,
  senderPhoto: string,
  type: Notification['type'],
  message: string,
  link: string
) => {
  // Jangan kirim notif jika user berinteraksi dengan postingan sendiri
  if (recipientId === senderId) return;

  await addDoc(collection(db, COLLECTION), {
    recipientId,
    senderId,
    senderName,
    senderPhoto,
    type,
    message,
    link,
    isRead: false,
    createdAt: Date.now(),
  });
};

// Get user notifications
export const getUserNotifications = async (userId: string) => {
  const q = query(
    collection(db, COLLECTION),
    where('recipientId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20) // Batasi 20 notif terakhir agar ringan
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
};

// Mark single notification as read
export const markAsRead = async (notificationId: string) => {
  const docRef = doc(db, COLLECTION, notificationId);
  await updateDoc(docRef, { isRead: true });
};

// Mark all as read (Optional feature)
export const markAllAsRead = async (userId: string) => {
  const notifs = await getUserNotifications(userId);
  const unread = notifs.filter(n => !n.isRead);
  
  const promises = unread.map(n => 
    updateDoc(doc(db, COLLECTION, n.id), { isRead: true })
  );
  
  await Promise.all(promises);
};

// Get unread notifications count
export const getUnreadCount = async (userId: string): Promise<number> => {
  const q = query(
    collection(db, COLLECTION),
    where('recipientId', '==', userId),
    where('isRead', '==', false)
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
};