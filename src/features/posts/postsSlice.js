import {
  createSelector,
  createEntityAdapter
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/apiSlice";

// This adapter is used to normalize the posts data and provide
// functions to work with it. The sortComparer function is used
// to sort the posts by date in descending order.
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
});

// This is the initial state of the posts slice. It is an empty
// object that will be populated with the posts data when the
// getPosts endpoint is called.
const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // This endpoint is used to get all the posts. It returns
    // an object with the posts data and the total number of
    // posts. The transformResponse function is used to add
    // a default date and reactions to each post if they are
    // missing. The providesTags function is used to set the
    // tags for the posts so that they can be cached.
    getPosts: builder.query({
      query: () => '/posts',
      transformResponse: responseData => {
        let min = 1;
        const loadedPosts = responseData.map(post => {
          if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
          if (!post?.reactions) post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
          }
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts)
      },
      providesTags: (result, error, arg) => [
        { type: 'Post', id: "LIST" },
        ...result.ids.map(id => ({ type: 'Post', id }))
      ]
    }),
    // This endpoint is used to get all the posts for a specific user.
    // It returns an object with the posts data and the total number of
    // posts. The transformResponse function is used to add a default
    // date and reactions to each post if they are missing. The providesTags
    // function is used to set the tags for the posts so that they can be
    // cached.
    getPostsByUserId: builder.query({
      query: id => `/posts/?userId=${id}`,
      transformResponse: responseData => {
        let min = 1;
        const loadedPosts = responseData.map(post => {
          if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
          if (!post?.reactions) post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
          }
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts)
      },
      providesTags: (result, error, arg) => [
        ...result.ids.map(id => ({ type: 'Post', id }))
      ]
    }),
    // This endpoint is used to add a new post. It returns an object
    // with the new post data. The invalidatesTags function is used
    // to set the tags for the posts so that they can be cached.
    addNewPost: builder.mutation({
      query: initialPost => ({
        url: '/posts',
        method: 'POST',
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
          }
        }
      }),
      invalidatesTags: [
        { type: 'Post', id: "LIST" }
      ]
    }),
    // This endpoint is used to update a post. It returns an object
    // with the updated post data. The invalidatesTags function is used
    // to set the tags for the posts so that they can be cached.
    updatePost: builder.mutation({
      query: initialPost => ({
        url: `/posts/${initialPost.id}`,
        method: 'PUT',
        body: {
          ...initialPost,
          date: new Date().toISOString()
        }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Post', id: arg.id }
      ]
    }),
    // This endpoint is used to delete a post. It returns an object
    // with the deleted post data. The invalidatesTags function is used
    // to set the tags for the posts so that they can be cached.
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Post', id: arg.id }
      ]
    }),
    // This endpoint is used to add a reaction to a post. It returns
    // an object with the updated post data. The onQueryStarted function
    // is used to update the cache when the reaction is added.
    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `posts/${postId}`,
        method: 'PATCH',
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reactions }
      }),
      async onQueryStarted({ postId, reactions }, { dispatch, queryFulfilled }) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData('getPosts', undefined, draft => {
            // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
            const post = draft.entities[postId]
            if (post) post.reactions = reactions
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      }
    })
  }),
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation
} = extendedApiSlice;

// returns the query result object
// This selector function is used to get the result of the getPosts endpoint.
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select()

// Creates memoized selector
// This selector function is used to get the posts data from the cache.
const selectPostsData = createSelector(
  selectPostsResult,
  postsResult => postsResult.data // normalized state object with ids & entities
)

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postsAdapter.getSelectors((state) => selectPostsData(state) ?? initialState);

