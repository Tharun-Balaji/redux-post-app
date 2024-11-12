import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";

const PostsExcerpt = ({ postId }) => {
    const post = useSelector(state => selectPostById(state, postId));

    return (
        <article className="w-full max-w-2xl mx-auto border border-gray-300 rounded-md p-4 hover:bg-gray-100">
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-700">{post.body.substring(0, 75)}...</p>
            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                    <PostAuthor userId={post.userId} />
                    <TimeAgo timestamp={post.date} className="ml-2 text-sm text-gray-500" />
                </div>
                <Link to={`/post/${post.id}`} className="text-blue-500 hover:underline px-4 py-2 rounded-md bg-blue-100 hover:bg-blue-200">
                    View Post
                </Link>
            </div>
            <ReactionButtons post={post} />
        </article>
    );
};

export default PostsExcerpt;
