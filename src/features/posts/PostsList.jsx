import { useSelector } from "react-redux";
import { selectPostIds, useGetPostsQuery } from "./postsSlice";
import PostsExcerpt from "./PostsExcerpt";
import Loading from "../../components/Loading";

const PostsList = () => {
	const { isLoading, error, isSuccess, isError } = useGetPostsQuery();

	const orderedPosts = useSelector(selectPostIds);

	let content;
	if (isLoading) {
		content = <Loading />;
	} else if (isSuccess) {
		content = (
			<ul className="list-none space-y-4 w-full px-4">
				{orderedPosts.map((postId) => (
					<PostsExcerpt key={postId} postId={postId} />
				))}
			</ul>
		);
	} else if (isError) {
		content = <p className="text-center text-red-500 py-4">{error}</p>;
	}

	return (
		<section className="rounded-lg flex justify-center items-center shadow-md px-2 py-8 mx-auto max-w-md mt-16">
			{content}
		</section>
	);
};

export default PostsList;
