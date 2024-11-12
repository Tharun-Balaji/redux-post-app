import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './app/store';
import { usersApiSlice } from  "./features/Users/usersSlice";
import { extendedApiSlice } from './features/posts/postsSlice';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';


// Dispatch the getPosts action to initiate fetching posts data from the API
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());

// Dispatch the getUsers action to initiate fetching users data from the API
store.dispatch(usersApiSlice.endpoints.getUsers.initiate());



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
