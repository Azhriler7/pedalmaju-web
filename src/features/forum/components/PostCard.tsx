"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, MoreHorizontal } from "lucide-react";
import { Post, Vote as VoteType } from "@/types";
import VoteButton from "./VoteButton";
import ForumService from "../services/ForumService";
import { deletePostByAdmin } from "../Action";

interface PostCardProps {
	post: Post;
	currentVote?: VoteType["type"] | null;
	onVote?: (postId: string, type: VoteType["type"]) => void;
	onComment?: (post: Post) => void;
	isVotePending?: boolean;
	currentUserId?: string;
	isAdminView?: boolean;
	isAdmin?: boolean;
	onDelete?: (postId: string) => void;
	hideDetailLink?: boolean;
	onTagClick?: (tag: string) => void;
}

const formatTimestamp = (timestamp: number) => {
	try {
		const formatter = new Intl.DateTimeFormat("id-ID", {
			dateStyle: "medium",
			timeStyle: "short",
		});
		return formatter.format(new Date(timestamp));
	} catch {
		return "Baru saja";
	}
};

export const PostCard: React.FC<PostCardProps> = ({
	post,
	currentVote = null,
	onVote,
	onComment,
	isVotePending = false,
	currentUserId,
	isAdminView = false,
	isAdmin = false,
	onDelete,
	hideDetailLink = false,
	onTagClick,
}) => {
	const formattedDate = useMemo(() => formatTimestamp(post.createdAt), [post.createdAt]);
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const actionMenuRef = useRef<HTMLDivElement | null>(null);

	const canDelete = isAdmin || isAdminView || (!!currentUserId && currentUserId === post.authorId);

	useEffect(() => {
		if (!isActionMenuOpen) {
			return;
		}
		const handleClickOutside = (event: MouseEvent) => {
			if (!actionMenuRef.current) return;
			if (!actionMenuRef.current.contains(event.target as Node)) {
				setIsActionMenuOpen(false);
			}
		};
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsActionMenuOpen(false);
				setIsConfirmOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isActionMenuOpen]);

	useEffect(() => {
		if (!isConfirmOpen) {
			return;
		}
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !isDeleting) {
				setIsConfirmOpen(false);
			}
		};
		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isConfirmOpen, isDeleting]);

	const executeDelete = async () => {
		if (isDeleting) return;
		setIsDeleting(true);
		setDeleteError(null);

		try {
			if (isAdminView) {
				await deletePostByAdmin(post.id, post.imageUrl);
			} else {
				await ForumService.deleteOwnPost(post.id);
			}
			onDelete?.(post.id);
		} catch (error) {
			console.error("Failed to delete post", error);
			setDeleteError("Tidak dapat menghapus postingan saat ini. Coba lagi nanti.");
		} finally {
			setIsDeleting(false);
			setIsConfirmOpen(false);
		}
	};

	const openDeleteConfirm = () => {
		setIsActionMenuOpen(false);
		setIsConfirmOpen(true);
	};

	return (
		<article className="flex gap-4 border-b border-border/60 px-5 py-6 transition-colors hover:bg-muted/20">
			<Link href={`/profile/${post.authorId}`} className="group relative mt-1 h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border border-border/70 bg-muted/40">
				<Image
					src={post.authorPhoto || '/default-avatar.png'}
					alt={post.authorName}
					fill
					sizes="48px"
					className="rounded-full object-cover group-hover:opacity-80 transition-opacity"
				/>
				{post.authorBadge === "admin" && (
					<span className="absolute -bottom-1 -right-1 inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase text-white shadow-sm">
						Admin
					</span>
				)}
			</Link>

			<div className="flex-1 space-y-4">
				<header className="flex items-start justify-between gap-3">
					<div className="flex flex-col">
						<div className="flex items-center gap-2">
							<Link href={`/profile/${post.authorId}`} className="group">
								<p className="text-sm font-semibold text-foreground group-hover:text-green-600 group-hover:underline transition-colors">
									{post.authorName}
								</p>
							</Link>
							<span className="text-xs text-foreground/50">•</span>
							<span className="text-xs text-foreground/60">{formattedDate}</span>
						</div>
						<Link href={`/profile/${post.authorId}`}>
							<p className="text-xs text-foreground/50 hover:text-green-600 transition-colors">
								@{post.authorName?.toLowerCase().replace(/\s+/g, "")}
							</p>
						</Link>
					</div>
					{canDelete && (
						<div className="relative" ref={actionMenuRef}>
							<button
								type="button"
								onClick={() => setIsActionMenuOpen((previous) => !previous)}
								disabled={isDeleting}
								title="Menu tindakan"
								className="rounded-full p-2 text-foreground/50 transition-colors hover:bg-muted/30 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
							>
								<MoreHorizontal size={16} />
							</button>
							{isActionMenuOpen && (
								<div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-border/70 bg-background/95 shadow-lg">
									<button
										type="button"
										onClick={openDeleteConfirm}
										className="flex w-full items-center justify-between px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
									>
										Hapus post
									</button>
								</div>
							)}
						</div>
					)}
				</header>

				{deleteError && (
					<div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-2 text-xs text-red-600">
						{deleteError}
					</div>
				)}

				<div className="space-y-3 text-sm text-foreground/80">
					<p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">{post.content}</p>
					{post.imageUrl && (
						<div className="overflow-hidden rounded-2xl border border-border/70 bg-muted/20">
							<Image
								src={post.imageUrl}
								alt="Lampiran forum"
								width={720}
								height={400}
								className="h-auto w-full object-cover"
							/>
						</div>
					)}
					{Array.isArray(post.tags) && post.tags.length > 0 && (
						<div className="flex flex-wrap gap-2 text-xs">
							{post.tags.filter(Boolean).map((tag) =>
								onTagClick ? (
									<button
										key={tag}
										type="button"
										onClick={() => onTagClick(tag)}
										className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-medium uppercase tracking-[0.18em] text-accent transition-colors hover:border-accent hover:bg-accent/20"
									>
										#{tag}
									</button>
								) : (
									<span
										key={tag}
										className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1 font-medium uppercase tracking-[0.18em] text-accent"
									>
										#{tag}
									</span>
								)
							)}
						</div>
					)}
				</div>

				<footer className="flex flex-col gap-3 text-xs text-foreground/60 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-4">
						<button
							type="button"
							onClick={() => onComment?.(post)}
							disabled={isDeleting}
							className="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors hover:bg-accent/10 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
						>
							<MessageCircle size={16} className="text-foreground/60 group-hover:text-accent" />
							<span>{post.commentsCount}</span>
						</button>

						<VoteButton
							likeCount={post.likesCount}
							dislikeCount={post.dislikesCount}
							currentVote={currentVote}
							onVote={(type) => onVote?.(post.id, type)}
							disabled={isVotePending || isDeleting}
							compact
							size="sm"
						/>
					</div>

					{!hideDetailLink && (
						<Link
							href={isAdminView ? `/admin/forum/${post.id}` : `/forum/${post.id}`}
							className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/10"
						>
							Lihat Detail
						</Link>
					)}
				</footer>
			</div>
			{isConfirmOpen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
					onClick={() => {
						if (!isDeleting) {
							setIsConfirmOpen(false);
						}
					}}
				>
					<div
						className="w-full max-w-sm rounded-2xl border border-border/70 bg-background p-6 shadow-xl"
						onClick={(event) => event.stopPropagation()}
					>
						<h3 className="text-lg font-semibold text-foreground">Hapus postingan?</h3>
						<p className="mt-2 text-sm text-foreground/70">
							Tindakan ini tidak dapat dibatalkan dan akan menghapus seluruh percakapan pada postingan ini.
						</p>
						<div className="mt-6 flex items-center justify-end gap-3">
							<button
								type="button"
								onClick={() => setIsConfirmOpen(false)}
								disabled={isDeleting}
								className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-60"
							>
								Batal
							</button>
							<button
								type="button"
								onClick={executeDelete}
								disabled={isDeleting}
								className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isDeleting ? 'Menghapus...' : 'Hapus'}
							</button>
						</div>
					</div>
				</div>
			)}
		</article>
	);
};

export default PostCard;
