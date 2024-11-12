import { Link } from "react-router-dom";

export default function Header() {
	return (
		<header className="bg-gray-800 text-white px-4 py-6 flex justify-between items-center">
			<h1 className="text-2xl font-bold">Redux Blog</h1>
			<nav>
				<ul className="flex space-x-4">
					<li>
						<Link to="/" className="hover:text-gray-400">
							Home
						</Link>
					</li>
					<li>
						<Link to="/post" className="hover:text-gray-400">
							Posts
						</Link>
					</li>
					<li>
						<Link to="/user" className="hover:text-gray-400">
							Users
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
}
