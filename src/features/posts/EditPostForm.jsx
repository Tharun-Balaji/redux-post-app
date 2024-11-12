import { useState } from "react";
import { useSelector } from "react-redux";
import {
	selectPostById,
	useUpdatePostMutation,
	useDeletePostMutation,
} from "./postsSlice";
import { useParams, useNavigate } from "react-router-dom";
import { selectAllUsers } from "../Users/usersSlice";

const EditPostForm = () => {
	const { postId } = useParams();
	const navigate = useNavigate();

	const [updatePost, { isLoading }] = useUpdatePostMutation();
	const [deletePost] = useDeletePostMutation();

	const post = useSelector((state) => selectPostById(state, postId));
	const users = useSelector(selectAllUsers);

	const [title, setTitle] = useState(post.title);
	const [content, setContent] = useState(post.body);
	const [userId, setUserId] = useState(post.userId);

	if (!post) {
		return (
			<section className="flex justify-center items-center h-screen">
				<h2 className="text-2xl font-bold">Post not found!</h2>
			</section>
		);
	}

	const onTitleChanged = (e) => setTitle(e.target.value);
	const onContentChanged = (e) => setContent(e.target.value);
	const onAuthorChanged = (e) => setUserId(Number(e.target.value));

	const canSave = [title, content, userId].every(Boolean) && !isLoading;
	const onSavePostClicked = async () => {
		if (canSave) {
			try {
				await updatePost({
					id: post.id,
					title,
					body: content,
					userId,
				}).unwrap();

				setTitle("");
				setContent("");
				setUserId("");
				navigate(`/post/${postId}`);
			} catch (err) {
				console.error("Failed to save the post", err);
			}
		}
	};

	const onDeletePostClicked = async () => {
		try {
			await deletePost({ id: post.id }).unwrap();

			setTitle("");
			setContent("");
			setUserId("");
			navigate("/");
		} catch (err) {
			console.error("Failed to delete the post", err);
		}
	};

	const usersOptions = users.map((user) => (
		<option key={user.id} value={user.id}>
			{user.name}
		</option>
	));

	return (
		<section className="h-full p-6 bg-white rounded-lg shadow-md mt-auto border">
			<h2 className="text-2xl font-bold mb-4">Edit Post</h2>
			<form className="space-y-4">
				<div>
					<label htmlFor="postTitle" className="block text-gray-700">
						Post Title:
					</label>
					<input
						type="text"
						id="postTitle"
						name="postTitle"
						value={title}
						onChange={onTitleChanged}
						className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
					/>
				</div>
				<div>
					<label htmlFor="postAuthor" className="block text-gray-700">
						Author:
					</label>
					<select
						id="postAuthor"
						value={userId}
						onChange={onAuthorChanged}
						className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
					>
						<option value=""></option>
						{usersOptions}
					</select>
				</div>
				<div>
					<label
						htmlFor="postContent"
						className="block text-gray-700"
					>
						Content:
					</label>
					<textarea
						id="postContent"
						name="postContent"
						value={content}
						onChange={onContentChanged}
						className="h-[20vh] w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
					></textarea>
				</div>
				<div className="flex space-x-4">
					<button
						type="button"
						onClick={onSavePostClicked}
						disabled={!canSave}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
					>
						Save Post
					</button>
					<button
						type="button"
						onClick={onDeletePostClicked}
						className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
					>
						Delete Post
					</button>
				</div>
			</form>
		</section>
	);
};

export default EditPostForm;
