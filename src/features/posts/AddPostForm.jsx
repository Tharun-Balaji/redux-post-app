	import { useState } from "react";
	import { useSelector } from "react-redux";

	import { useAddNewPostMutation } from "./postsSlice";
	import { selectAllUsers } from "../Users/usersSlice";
import { useNavigate } from "react-router-dom";

	const AddPostForm = () => {
		const [addNewPost, { isLoading }] = useAddNewPostMutation();
		const navigate = useNavigate();

		const [title, setTitle] = useState("");
		const [content, setContent] = useState("");
		const [userId, setUserId] = useState("");

		const users = useSelector(selectAllUsers);

		const onTitleChanged = (e) => setTitle(e.target.value);
		const onContentChanged = (e) => setContent(e.target.value);
		const onAuthorChanged = (e) => setUserId(e.target.value);

		const canSave = [title, content, userId].every(Boolean) && !isLoading;

		const onSavePostClicked = async (e) => {
			e.preventDefault();
			if (canSave) {
				try {
					await addNewPost({ title, body: content, userId }).unwrap();

					setTitle("");
					setContent("");
					setUserId("");
					navigate("/");
				} catch (err) {
					console.error("Failed to save the post", err);
				}
			}
		};

		const usersOptions = users.map((user) => (
			<option key={user.id} value={user.id}>
				{user.name}
			</option>
		));

		return (
			<section className="bg-gray-100 px-4 py-8 rounded-lg shadow-md mx-auto max-w-md mt-16">
				<h2 className="text-2xl font-bold mb-4 text-center">
					Add a New Post
				</h2>
				<form className="grid grid-cols-1 gap-4">
					<div className="flex items-center">
						<label
							htmlFor="postTitle"
							className="w-1/4 text-right mr-2 sm:w-1/3 md:w-auto"
						>
							Post Title:
						</label>
						<input
							type="text"
							id="postTitle"
							name="postTitle"
							value={title}
							onChange={onTitleChanged}
							className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
						/>
					</div>
					<div className="flex items-center">
						<label
							htmlFor="postAuthor"
							className="w-1/4 text-right mr-2 sm:w-1/3 md:w-auto"
						>
							Author:
						</label>
						<select
							id="postAuthor"
							value={userId}
							onChange={onAuthorChanged}
							className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
						>
							<option value=""></option>
							{usersOptions}
						</select>
					</div>
					<div>
						<label
							htmlFor="postContent"
							className="block text-right mb-2"
						>
							Content:
						</label>
						<textarea
							id="postContent"
							name="postContent"
							value={content}
							onChange={onContentChanged}
							className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
							rows="5"
						></textarea>
					</div>
					<button
						type="button"
						onClick={onSavePostClicked}
						className="justify-self-end px-4 py-2 rounded-md bg-blue-500 text-white font-bold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						disabled={!canSave}
					>
						Save Post
					</button>
				</form>
			</section>
		);
	};

	export default AddPostForm;
