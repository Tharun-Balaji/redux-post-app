import { useAddReactionMutation } from "./postsSlice";

const reactionEmoji = {
	thumbsUp: "👍",
	wow: "😮",
	heart: "❤️",
	rocket: "🚀",
	coffee: "☕",
};

export default function ReactionButtons({ post }) {
	const [addReaction] = useAddReactionMutation();

	const reactionButtons = Object.entries(reactionEmoji).map(
		([name, emoji]) => {
			return (
				<button
					key={name}
					type="button"
					className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out m-1 border border-blue-300"
					onClick={() => {
						const newValue = post.reactions[name] + 1;
						addReaction({
							postId: post.id,
							reactions: { ...post.reactions, [name]: newValue },
						});
					}}
				>
					{emoji} {post.reactions[name]}
				</button>
			);
		}
	);
	return <div>{reactionButtons}</div>;
}
    