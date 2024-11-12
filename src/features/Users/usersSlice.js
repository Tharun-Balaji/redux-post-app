/**
 * The usersAdapter is an instance of the createEntityAdapter function from
 * @reduxjs/toolkit. It is used to manage the state of the users in the store.
 * The initialState is an object that is used to initialize the state of the
 * users in the store.
 */
import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()

/**
 * The usersApiSlice is an instance of the apiSlice from ../api/apiSlice. It
 * is used to manage the API requests and caching for the users.
 */
export const usersApiSlice = apiSlice.injectEndpoints({
    /**
     * The endpoints property is an object where each key is the name of an
     * endpoint and the value is a function that returns an object with
     * properties that are used to configure the endpoint.
     */
    endpoints: builder => ({
        /**
         * The getUsers endpoint is a query endpoint that is used to fetch the
         * list of users from the API. The query function returns the URL of the
         * API endpoint. The transformResponse function is used to transform the
         * response data into the format expected by the usersAdapter. The
         * providesTags property is used to specify the tags that are provided by
         * this endpoint.
         */
        getUsers: builder.query({
            query: () => '/users',
            transformResponse: responseData => {
                return usersAdapter.setAll(initialState, responseData)
            },
            providesTags: (result, error, arg) => [
                { type: 'User', id: "LIST" },
                ...result.ids.map(id => ({ type: 'User', id }))
            ]
        })
    })
});

/**
 * The useGetUsersQuery hook is a wrapper around the getUsers endpoint that is
 * used to fetch the list of users from the API. It returns an object with the
 * result of the query and the status of the query.
 */
export const {
    useGetUsersQuery
} = usersApiSlice

/**
 * The selectUsersResult selector is a function that returns the result of the
 * getUsers endpoint. The selectUsersData selector is a memoized selector that
 * returns the data property of the result of the getUsers endpoint.
 */
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data // normalized state object with ids & entities
)

/**
 * The getSelectors function returns a set of selectors that can be used to
 * access the users data in the store. The selectAll, selectById, and selectIds
 * selectors are used to access the list of users, a specific user by id, and
 * the list of user ids, respectively.
 */
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the posts slice of state
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)
