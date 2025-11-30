'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebaseAdmin';
import { deleteFromCloudinary } from '@/lib/cloudinaryAdmin';
import type { firestore } from 'firebase-admin';

type DeletePostOptions = {
	revalidatePaths?: string[];
};

const DEFAULT_REVALIDATE_PATHS = ['/forum', '/admin/forum'];

async function deleteCollectionDocs(
	collectionRef: firestore.CollectionReference<firestore.DocumentData>
) {
	const snapshot = await collectionRef.get();
	await Promise.all(snapshot.docs.map((docSnap) => docSnap.ref.delete()));
}

export async function deletePostByAdmin(
	postId: string,
	imageUrl?: string,
	options: DeletePostOptions = {}
): Promise<void> {
	if (!postId) {
		throw new Error('ID postingan wajib diisi');
	}

	const postRef = adminDb.collection('posts').doc(postId);

	await adminDb.runTransaction(async (transaction) => {
		const snapshot = await transaction.get(postRef);
		if (!snapshot.exists) {
			throw new Error('Postingan tidak ditemukan atau telah dihapus');
		}
		transaction.delete(postRef);
	});

	await deleteCollectionDocs(postRef.collection('votes'));

	const commentsSnapshot = await postRef.collection('comments').get();
	await Promise.all(
		commentsSnapshot.docs.map(async (commentDoc) => {
			await deleteCollectionDocs(commentDoc.ref.collection('votes'));
			await commentDoc.ref.delete();
		})
	);

	if (imageUrl) {
		await deleteFromCloudinary(imageUrl);
	}

	const pathsToRevalidate = options.revalidatePaths ?? DEFAULT_REVALIDATE_PATHS;
	pathsToRevalidate.forEach((path) => revalidatePath(path));
}
