"use client";

import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

type VoteType = "like" | "dislike";

interface VoteButtonProps {
	likeCount: number;
	dislikeCount: number;
	currentVote?: VoteType | null;
	onVote?: (type: VoteType) => void;
	disabled?: boolean;
	size?: "sm" | "md";
	compact?: boolean;
}

const sizeConfig = {
	sm: {
		gap: "gap-2",
		padding: "px-2 py-1",
		text: "text-xs",
		icon: 16,
	},
	md: {
		gap: "gap-3",
		padding: "px-3 py-1.5",
		text: "text-sm",
		icon: 18,
	},
} as const;

export const VoteButton: React.FC<VoteButtonProps> = ({
	likeCount,
	dislikeCount,
	currentVote = null,
	onVote,
	disabled = false,
	size = "md",
	compact = false,
}) => {
	const config = sizeConfig[size];

	const handleClick = (type: VoteType) => {
		if (disabled) return;
		onVote?.(type);
	};

	const buttonBase = `inline-flex items-center ${config.gap} rounded-full border border-border bg-background/80 ${config.padding} ${config.text} font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60`;

	return (
		<div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
			<button
				type="button"
				onClick={() => handleClick("like")}
				className={`${buttonBase} ${
					currentVote === "like"
						? "border-accent bg-accent/10 text-accent"
						: "hover:border-accent/60 hover:text-accent"
				}`}
				disabled={disabled}
				aria-pressed={currentVote === "like"}
			>
				<ThumbsUp
					size={config.icon}
					className={currentVote === "like" ? "fill-accent text-accent" : "text-foreground/70"}
				/>
				{!compact && <span>{likeCount}</span>}
			</button>
			<button
				type="button"
				onClick={() => handleClick("dislike")}
				className={`${buttonBase} ${
					currentVote === "dislike"
						? "border-red-500/80 bg-red-50 text-red-600"
						: "hover:border-red-500/50 hover:text-red-600"
				}`}
				disabled={disabled}
				aria-pressed={currentVote === "dislike"}
			>
				<ThumbsDown
					size={config.icon}
					className={currentVote === "dislike" ? "fill-red-500 text-red-600" : "text-foreground/70"}
				/>
				{!compact && <span>{dislikeCount}</span>}
			</button>
		</div>
	);
};

export default VoteButton;
