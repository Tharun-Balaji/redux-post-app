import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { useParams, Link } from "react-router-dom";

export default function SinglePostPage() {
	const { postId } = useParams();

	// console.log(postId);

	const post = useSelector((state) => selectPostById(state, postId));

	if (!post) {
		return (
			<section>
				<h2>Post not found!</h2>
			</section>
		);
	}

	return (
		<div className="h-screen flex items-center justify-center">
			<article className="max-w-3xl bg-white p-8 rounded-md shadow-md">
				<h2 className="text-xl font-bold mb-2" >{post.title}</h2>
				<p className="text-gray-700">{post.body}</p>
				<p className="flex items-center justify-between mt-2">
					<PostAuthor userId={post.userId} />
					<TimeAgo
						timestamp={post.date}
						className="text-sm text-gray-500"
					/>
				</p>
				<ReactionButtons post={post} />
				<Link
					to={`/post/edit/${post.id}`}
					className="text-blue-500 hover:underline px-2 py-1 rounded-md font-medium"
				>
					Edit Post
				</Link>
			</article>
		</div>
	);
}
