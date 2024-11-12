
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";

/**
 * Configure the Redux store to use the apiSlice reducer and middleware.
 *
 * The apiSlice reducer is used to store data fetched from the API, and the
 * middleware is used to handle the API requests and caching.
 */
export const store = configureStore({
    reducer: {
        /**
         * The apiSlice reducer is stored under the key of its reducerPath,
         * which is defined in apiSlice.js.
         */
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    /**
     * The middleware is an array of functions that are called in order when
     * an action is dispatched. The getDefaultMiddleware function returns an
     * array of default middleware that is used by Redux Toolkit, and we
     * concatenate the apiSlice middleware to the end of that array.
     */
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});
