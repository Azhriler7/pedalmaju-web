"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Comment as CommentType, Vote as VoteType } from "@/types";
import VoteButton from "./VoteButton";

interface CommentTreeProps {
	comments: CommentType[];
	currentUserVotes?: Record<string, VoteType["type"] | null | undefined>;
	onVote?: (commentId: string, type: VoteType["type"]) => void;
	onReply?: (comment: CommentType) => void;
	isVotePendingIds?: Set<string>;
}

interface CommentNode extends CommentType {
	replies: CommentNode[];
}

const formatTime = (timestamp: number) => {
	try {
		return new Intl.DateTimeFormat("id-ID", {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(new Date(timestamp));
	} catch {
		return "Baru saja";
	}
};

const buildTree = (items: CommentType[]): CommentNode[] => {
	const map = new Map<string, CommentNode>();
	const roots: CommentNode[] = [];

	items.forEach((comment) => {
		map.set(comment.id, { ...comment, replies: [] });
	});

	map.forEach((node) => {
		if (node.parentId) {
			const parent = map.get(node.parentId);
			if (parent) {
				parent.replies.push(node);
			} else {
				roots.push(node);
			}
		} else {
			roots.push(node);
		}
	});

	const sortNodes = (nodes: CommentNode[]) => {
		nodes.sort((a, b) => b.createdAt - a.createdAt);
		nodes.forEach((child) => sortNodes(child.replies));
	};

	sortNodes(roots);
	return roots;
};

const CommentBubble: React.FC<{
	comment: CommentNode;
	depth: number;
	currentVote?: VoteType["type"] | null;
	onVote?: (commentId: string, type: VoteType["type"]) => void;
	onReply?: (comment: CommentType) => void;
	isVotePending?: boolean;
}> = ({ comment, depth, currentVote, onVote, onReply, isVotePending }) => {
	return (
		<div className={`flex gap-3 rounded-3xl border border-border/80 bg-background/95 px-4 py-4 shadow-sm ${depth > 0 ? "ml-8" : ""}`}>
			<div className="relative h-10 w-10 flex-shrink-0 rounded-full border border-border/70 bg-muted/30">
				{comment.authorPhoto ? (
					<Image
						src={comment.authorPhoto || '/default-avatar.png'}
						alt={comment.authorName}
						fill
						className="rounded-full object-cover"
					/>
				) : (
					<span className="flex h-full w-full items-center justify-center text-xs font-semibold text-foreground/70">
						{comment.authorName.charAt(0).toUpperCase()}
					</span>
				)}
				{comment.authorBadge === "admin" && (
					<span className="absolute -bottom-1 -right-1 inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-[9px] font-semibold uppercase text-white">
						Admin
					</span>
				)}
			</div>

			<div className="flex-1 space-y-3">
				<div className="flex flex-wrap items-center gap-2">
					<Link href={`/profile/${comment.authorId}`} className="hover:underline hover:text-green-600 transition-colors">
						<p className="text-sm font-semibold text-foreground">{comment.authorName}</p>
					</Link>
					<span className="text-xs text-foreground/50">•</span>
					<span className="text-xs text-foreground/60">{formatTime(comment.createdAt)}</span>
				</div>
				<p className="text-sm leading-relaxed text-foreground/80">{comment.text}</p>

				<div className="flex flex-wrap items-center gap-3 text-xs text-foreground/60">
					<VoteButton
						likeCount={comment.likesCount}
						dislikeCount={comment.dislikesCount}
						currentVote={currentVote ?? null}
						onVote={(type) => onVote?.(comment.id, type)}
						disabled={isVotePending}
						size="sm"
						compact
					/>
					<button
						type="button"
						onClick={() => onReply?.(comment)}
						className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-foreground/70 transition-colors hover:border-accent/60 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
					>
						<MessageCircle size={14} />
						Balas
					</button>
				</div>
			</div>
		</div>
	);
};

const CommentTreeComponent: React.FC<CommentTreeProps> = ({
	comments,
	currentUserVotes = {},
	onVote,
	onReply,
	isVotePendingIds,
}) => {
	const tree = useMemo(() => buildTree(comments), [comments]);

	if (tree.length === 0) {
		return (
			<div className="rounded-3xl border border-dashed border-border/70 bg-muted/20 px-6 py-8 text-center text-sm text-foreground/60">
				Belum ada komentar. Jadilah yang pertama memberikan tanggapan.
			</div>
		);
	}

	const renderBranch = (nodes: CommentNode[], depth = 0) =>
		nodes.map((node) => (
			<div key={node.id} className="space-y-3">
				<CommentBubble
					comment={node}
					depth={depth}
					currentVote={currentUserVotes[node.id] ?? null}
					onVote={onVote}
					onReply={onReply}
					isVotePending={isVotePendingIds?.has(node.id)}
				/>
				{node.replies.length > 0 && (
					<div className="space-y-3 border-l border-border/60 pl-5">
						{renderBranch(node.replies, depth + 1)}
					</div>
				)}
			</div>
		));

	return <div className="space-y-4">{renderBranch(tree)}</div>;
};

export default CommentTreeComponent;
