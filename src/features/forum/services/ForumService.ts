import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	increment,
	limit as limitQuery,
	onSnapshot,
	orderBy,
	query,
	runTransaction,
	setDoc,
	type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Comment, Post, Vote } from "@/types";

interface CreatePostInput {
	authorId: string;
	authorName: string;
	authorPhoto: string;
	authorBadge: Post["authorBadge"];
	content: string;
	imageUrl?: string;
	tags?: string[];
}

interface CreateCommentInput {
	postId: string;
	parentId?: string | null;
	authorId: string;
	authorName: string;
	authorPhoto: string;
	authorBadge: Comment["authorBadge"];
	text: string;
}

interface ForumTagRecord {
	label?: string;
	usageCount?: number;
	createdAt?: number;
	updatedAt?: number;
}

export interface ForumTag {
	id: string;
	label: string;
	usageCount: number;
}

class ForumService {
	private static normalizeTag(tag: string): string {
		return tag.trim().replace(/^#/, "").replace(/\s+/g, "").toLowerCase();
	}

	private static normalizeTags(tags: string[]): string[] {
		const unique = new Set<string>();
		tags.forEach((tag) => {
			const normalized = ForumService.normalizeTag(tag);
			if (normalized) {
				unique.add(normalized);
			}
		});
		return Array.from(unique);
	}

	private static async registerTags(tags: string[]): Promise<void> {
		if (tags.length === 0) return;
		const tagsRef = collection(db, "tags");
		await Promise.all(
			tags.map(async (tag) => {
				const normalized = ForumService.normalizeTag(tag);
				if (!normalized) return;
				const tagRef = doc(tagsRef, normalized);
				await setDoc(
					tagRef,
					{
						label: normalized,
						usageCount: increment(1),
						updatedAt: Date.now(),
					},
					{ merge: true }
				);
			})
		);
	}

	static subscribeToTags(callback: (tags: ForumTag[]) => void): Unsubscribe {
		const tagsRef = collection(db, "tags");
		const tagsQuery = query(tagsRef, orderBy("usageCount", "desc"));

		return onSnapshot(tagsQuery, (snapshot) => {
			const tags = snapshot.docs.map((docSnap) => {
				const data = docSnap.data() as ForumTagRecord;
				return {
					id: docSnap.id,
					label: data.label ?? docSnap.id,
					usageCount: data.usageCount ?? 0,
				} satisfies ForumTag;
			});
			callback(tags);
		});
	}

	static async getAllTags(): Promise<ForumTag[]> {
		const tagsRef = collection(db, "tags");
		const snapshot = await getDocs(tagsRef);
		return snapshot.docs.map((docSnap) => {
			const data = docSnap.data() as ForumTagRecord;
			return {
				id: docSnap.id,
				label: data.label ?? docSnap.id,
				usageCount: data.usageCount ?? 0,
			};
		});
	}

	static subscribeToPosts(callback: (posts: Post[]) => void, limit = 25): Unsubscribe {
		const postsRef = collection(db, "posts");
		const postsQuery = query(postsRef, orderBy("createdAt", "desc"), limitQuery(limit));

		return onSnapshot(postsQuery, (snapshot) => {
			const posts = snapshot.docs.map((docSnap) => {
				const data = docSnap.data() as Omit<Post, "id">;
				return {
					id: docSnap.id,
					...data,
					tags: Array.isArray((data as Partial<Post>).tags) ? (data as Partial<Post>).tags : [],
				} satisfies Post;
			});

			callback(posts);
		});
	}

	static subscribeToPost(postId: string, callback: (post: Post | null) => void): Unsubscribe {
		const postRef = doc(db, "posts", postId);

		return onSnapshot(postRef, (snapshot) => {
			if (!snapshot.exists()) {
				callback(null);
				return;
			}

			const data = snapshot.data() as Omit<Post, "id">;
			callback({
				id: snapshot.id,
				...data,
				tags: Array.isArray((data as Partial<Post>).tags) ? (data as Partial<Post>).tags : [],
			});
		});
	}

	static subscribeToComments(postId: string, callback: (comments: Comment[]) => void): Unsubscribe {
		const commentsRef = collection(db, "posts", postId, "comments");
		const commentsQuery = query(commentsRef, orderBy("createdAt", "desc"));

		return onSnapshot(commentsQuery, (snapshot) => {
			const comments = snapshot.docs.map((docSnap) => {
				const data = docSnap.data() as Omit<Comment, "id">;
				return {
					id: docSnap.id,
					...data,
				} satisfies Comment;
			});

			callback(comments);
		});
	}

	static async createPost(input: CreatePostInput): Promise<string> {
		const postsRef = collection(db, "posts");
		const normalizedTags = ForumService.normalizeTags(input.tags ?? []);
		const payload: Omit<Post, "id"> = {
			authorId: input.authorId,
			authorName: input.authorName,
			authorPhoto: input.authorPhoto,
			authorBadge: input.authorBadge,
			content: input.content,
			imageUrl: input.imageUrl ?? "",
			tags: normalizedTags,
			likesCount: 0,
			dislikesCount: 0,
			commentsCount: 0,
			createdAt: Date.now(),
		};

		const docRef = await addDoc(postsRef, payload);
		if (normalizedTags.length > 0) {
			await ForumService.registerTags(normalizedTags);
		}
		return docRef.id;
	}

	static async createComment(input: CreateCommentInput): Promise<string> {
		const postRef = doc(db, "posts", input.postId);
		const commentsRef = collection(postRef, "comments");

		const commentId = await runTransaction(db, async (transaction) => {
			const postSnap = await transaction.get(postRef);
			if (!postSnap.exists()) {
				throw new Error("Postingan tidak ditemukan");
			}

			const newCommentRef = doc(commentsRef);
			const payload: Omit<Comment, "id"> = {
				postId: input.postId,
				parentId: input.parentId ?? null,
				authorId: input.authorId,
				authorName: input.authorName,
				authorPhoto: input.authorPhoto,
				authorBadge: input.authorBadge,
				text: input.text,
				likesCount: 0,
				dislikesCount: 0,
				createdAt: Date.now(),
			};

			transaction.set(newCommentRef, payload);

			const postData = postSnap.data() as Omit<Post, "id">;
			const currentComments = postData.commentsCount ?? 0;
			transaction.update(postRef, { commentsCount: currentComments + 1 });

			return newCommentRef.id;
		});

		return commentId;
	}

	static async togglePostVote(postId: string, userId: string, type: Vote["type"]): Promise<Vote["type"] | null> {
		const postRef = doc(db, "posts", postId);
		const voteRef = doc(postRef, "votes", userId);

		const result = await runTransaction(db, async (transaction) => {
			const postSnap = await transaction.get(postRef);
			if (!postSnap.exists()) {
				throw new Error("Postingan tidak ditemukan");
			}

			const postData = postSnap.data() as Omit<Post, "id">;
			let likesCount = postData.likesCount ?? 0;
			let dislikesCount = postData.dislikesCount ?? 0;

			const voteSnap = await transaction.get(voteRef);
			let nextVote: Vote["type"] | null = null;

			if (voteSnap.exists()) {
				const existing = voteSnap.data() as Vote;
				if (existing.type === type) {
					transaction.delete(voteRef);
					if (type === "like") {
						likesCount = Math.max(0, likesCount - 1);
					} else {
						dislikesCount = Math.max(0, dislikesCount - 1);
					}
					nextVote = null;
				} else {
					transaction.update(voteRef, { type, createdAt: Date.now() });
					if (type === "like") {
						likesCount += 1;
						dislikesCount = Math.max(0, dislikesCount - 1);
					} else {
						dislikesCount += 1;
						likesCount = Math.max(0, likesCount - 1);
					}
					nextVote = type;
				}
			} else {
				transaction.set(voteRef, {
					userId,
					type,
					createdAt: Date.now(),
				} satisfies Vote);
				if (type === "like") {
					likesCount += 1;
				} else {
					dislikesCount += 1;
				}
				nextVote = type;
			}

			transaction.update(postRef, { likesCount, dislikesCount });
			return nextVote;
		});

		return result;
	}

	static async toggleCommentVote(
		postId: string,
		commentId: string,
		userId: string,
		type: Vote["type"]
	): Promise<Vote["type"] | null> {
		const commentRef = doc(db, "posts", postId, "comments", commentId);
		const voteRef = doc(commentRef, "votes", userId);

		const result = await runTransaction(db, async (transaction) => {
			const commentSnap = await transaction.get(commentRef);
			if (!commentSnap.exists()) {
				throw new Error("Komentar tidak ditemukan");
			}

			const commentData = commentSnap.data() as Omit<Comment, "id">;
			let likesCount = commentData.likesCount ?? 0;
			let dislikesCount = commentData.dislikesCount ?? 0;

			const voteSnap = await transaction.get(voteRef);
			let nextVote: Vote["type"] | null = null;

			if (voteSnap.exists()) {
				const existing = voteSnap.data() as Vote;
				if (existing.type === type) {
					transaction.delete(voteRef);
					if (type === "like") {
						likesCount = Math.max(0, likesCount - 1);
					} else {
						dislikesCount = Math.max(0, dislikesCount - 1);
					}
					nextVote = null;
				} else {
					transaction.update(voteRef, { type, createdAt: Date.now() });
					if (type === "like") {
						likesCount += 1;
						dislikesCount = Math.max(0, dislikesCount - 1);
					} else {
						dislikesCount += 1;
						likesCount = Math.max(0, likesCount - 1);
					}
					nextVote = type;
				}
			} else {
				transaction.set(voteRef, {
					userId,
					type,
					createdAt: Date.now(),
				} satisfies Vote);
				if (type === "like") {
					likesCount += 1;
				} else {
					dislikesCount += 1;
				}
				nextVote = type;
			}

			transaction.update(commentRef, { likesCount, dislikesCount });
			return nextVote;
		});

		return result;
	}

	static async getUserVoteForPost(postId: string, userId: string): Promise<Vote["type"] | null> {
		const voteRef = doc(db, "posts", postId, "votes", userId);
		const snapshot = await getDoc(voteRef);
		if (!snapshot.exists()) return null;
		const data = snapshot.data() as Vote;
		return data.type;
	}

	static async getUserVoteForComment(
		postId: string,
		commentId: string,
		userId: string
	): Promise<Vote["type"] | null> {
		const voteRef = doc(db, "posts", postId, "comments", commentId, "votes", userId);
		const snapshot = await getDoc(voteRef);
		if (!snapshot.exists()) return null;
		const data = snapshot.data() as Vote;
		return data.type;
	}

	static async markCommentCount(postId: string, delta: number): Promise<void> {
		const postRef = doc(db, "posts", postId);
		await runTransaction(db, async (transaction) => {
			const postSnap = await transaction.get(postRef);
			if (!postSnap.exists()) {
				throw new Error("Postingan tidak ditemukan");
			}
			const postData = postSnap.data() as Omit<Post, "id">;
			const current = postData.commentsCount ?? 0;
			transaction.update(postRef, { commentsCount: Math.max(0, current + delta) });
		});
	}

	static async deleteComment(postId: string, commentId: string): Promise<void> {
		const commentRef = doc(db, "posts", postId, "comments", commentId);

		await runTransaction(db, async (transaction) => {
			const commentSnap = await transaction.get(commentRef);
			if (!commentSnap.exists()) return;

			transaction.delete(commentRef);

			const postRef = doc(db, "posts", postId);
			const postSnap = await transaction.get(postRef);
			if (postSnap.exists()) {
				const postData = postSnap.data() as Omit<Post, "id">;
				const current = postData.commentsCount ?? 0;
				transaction.update(postRef, { commentsCount: Math.max(0, current - 1) });
			}
		});
	}

	static async deleteOwnPost(postId: string): Promise<void> {
		const postRef = doc(db, "posts", postId);

		const [postVotesSnapshot, commentsSnapshot] = await Promise.all([
			getDocs(collection(postRef, "votes")),
			getDocs(collection(postRef, "comments")),
		]);

		await Promise.all([
			...postVotesSnapshot.docs.map((voteDoc) => deleteDoc(voteDoc.ref)),
			...commentsSnapshot.docs.map(async (commentDoc) => {
				const commentVotesSnapshot = await getDocs(collection(commentDoc.ref, "votes"));
				await Promise.all(commentVotesSnapshot.docs.map((voteDoc) => deleteDoc(voteDoc.ref)));
				await deleteDoc(commentDoc.ref);
			}),
		]);

		await deleteDoc(postRef);
	}
}

export default ForumService;
