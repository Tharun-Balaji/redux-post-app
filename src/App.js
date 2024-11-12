import "./App.css";
import PostsList from "./features/posts/PostsList";
import AddPostForm from "./features/posts/AddPostForm";
import { Routes, Route } from "react-router-dom";
import SinglePostPage from "./features/posts/SinglePostPage";
import Layout from "./components/Layout";
import EditPostForm from "./features/posts/EditPostForm";
import { Navigate } from "react-router-dom";
import UsersList from "./features/Users/UsersList";
import UserPage from "./features/Users/UserPage";

const App = () => <Routes>
  <Route path="/" element={<Layout />}>

    <Route index element={<PostsList />} />

    <Route path="post">
      <Route index element={<AddPostForm />} />
      <Route path=":postId" element={<SinglePostPage />} />
      <Route path="edit/:postId" element={<EditPostForm />} />
    </Route>

    <Route path="user">
      <Route index element={<UsersList />} />
      <Route path=":userId" element={<UserPage />} />
    </Route>

    {/* Catch all routes */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route>
</Routes>

export default App;
