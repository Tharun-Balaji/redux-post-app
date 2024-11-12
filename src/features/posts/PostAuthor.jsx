import { useGetUsersQuery } from "../Users/usersSlice";
import { Link } from "react-router-dom";


const PostAuthor = ({ userId }) => {

     const { author } = useGetUsersQuery("getUsers", {
			selectFromResult: ({ data, isLoading }) => ({
				author: data?.entities[userId],
			}),
		});

    return (
		<span>
            by {author ? <Link to={`/user/${userId}`} className="text-blue-500 hover:underline px-2 py-1 rounded-md font-medium" >
                {author.name}
            </Link> : "Unknown author"}
		</span>
	);
}
export default PostAuthor;