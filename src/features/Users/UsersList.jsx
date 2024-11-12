
import Loading from "../../components/Loading";
import { useGetUsersQuery } from "./usersSlice";
import { Link } from "react-router-dom";

export default function UsersList() {
	 const {
			data: users,
			isLoading,
			isSuccess,
			isError,
			error,
		} = useGetUsersQuery("getUsers");

	let content;
	if (isLoading) {
		content = <Loading />;
	} else if (isSuccess) {
		const renderedUsers = users.ids.map((userId) => (
			<li
				className="flex items-center py-2 border-b border-gray-200 hover:bg-gray-100"
				key={userId}
			>
				<Link
					className="text-blue-500 hover:underline mr-2"
					to={`/user/${userId}`}
				>
					{users.entities[userId].name}
				</Link>
			</li>
		));

		content = (
			<section className="w-full max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
				<h2>Users</h2>
				<ul className="list-none">{renderedUsers}</ul>
			</section>
		);
	} else if (isError) {
		content = <p>{error}</p>;
	}
	
	return content;
}
