/**
 * Redux Store Configuration
 *
 * This module configures and exports the Redux store for managing application state.
 *
 * @module store
 */

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import instructorReducer from "./instructor.reducer";
import lessonReducer from "./lesson.reducers";

/**
 * Root Reducer
 * Combines all the application's reducers, including `instructor` and `lesson`.
 */
const rootReducer = combineReducers({
  instructor: instructorReducer,
  lesson: lessonReducer,
});

/**
 * RootState
 * Type representing the shape of the application's global state.
 *
 * @typedef {ReturnType<typeof rootReducer>} RootState
 */
export type RootState = ReturnType<typeof rootReducer>;

/**
 * Redux Store
 * Configured using Redux Toolkit's `configureStore`.
 * Combines all reducers under the `reducer` key.
 *
 * @type {EnhancedStore}
 */
const store = configureStore({
  reducer: rootReducer, // Pass the rootReducer under the 'reducer' key
});

export default store;
