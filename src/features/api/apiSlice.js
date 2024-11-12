/**
 * The apiSlice is a Redux Toolkit Query API slice that manages data fetching
 * and caching for our app. It's initialized with a base URL of our JSON server
 * and a tag type of "Post", which is used to track which entities are cached.
 *
 * The endpoints property is an object where each key is the name of an endpoint
 * and the value is a function that returns an object with properties that are
 * used to configure the endpoint.
 */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  // The reducer path is the name of the reducer that will be generated
  // by the createApi function. It should match the name of the slice
  // in your store.
  reducerPath: "api",
  // The baseQuery is a function that is used to make requests to the
  // server. The fetchBaseQuery function is a utility function that
  // returns a baseQuery function that uses the fetch API to make
  // requests.
  baseQuery: fetchBaseQuery({
    // The base URL of our JSON server
    baseUrl: "https://json-server-for-post-app.onrender.com",
  }),
  // The tagTypes property is an array of strings that are used to
  // track which entities are cached. In this case, we're only
  // caching Post entities.
  tagTypes: ["Post"],
  // The endpoints property is an object where each key is the name
  // of an endpoint and the value is a function that returns an object
  // with properties that are used to configure the endpoint.
  endpoints: (builder) => ({}),
});
