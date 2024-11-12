import { Link, useParams } from "react-router-dom";
import {  useGetUsersQuery } from "./usersSlice";
import { useGetPostsByUserIdQuery } from "../posts/postsSlice";
import Loading from "../../components/Loading";

export default function UserPage() {
	const { userId } = useParams();
	const {
		user,
		isLoading: isLoadingUser,
		isSuccess: isSuccessUser,
		isError: isErrorUser,
		error: errorUser,
	} = useGetUsersQuery("getUsers", {
		selectFromResult: ({ data, isLoading, isSuccess, isError, error }) => ({
			user: data?.entities[userId],
			isLoading,
			isSuccess,
			isError,
			error,
		}),
	});

	const {
		data: postsForUsers,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetPostsByUserIdQuery(userId);

	let content;
	if (isLoading || isLoadingUser) {
		content = <Loading />;
	} else if (isSuccess && isSuccessUser) {
		const { ids, entities } = postsForUsers;
		content = ids.map((id) => (
			<li
				key={id}
				className="flex items-center py-2 border-b border-gray-200 hover:bg-gray-100"
			>
				<Link
					to={`/post/${id}`}
					className="text-blue-500 hover:underline mr-2"
				>
					{entities[id].title}
				</Link>
			</li>
		));
	} else if (isError || isErrorUser) {
		content = <p className="text-center text-red-500">{error || errorUser}</p>;
	}

	return (
		<section className="w-full max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
			<h2>{user.name}</h2>
			<ul className="list-none">{content}</ul>
		</section>
	);
}
