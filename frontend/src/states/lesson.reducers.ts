/**
 * Redux Reducer: Lesson Reducer
 *
 * Manages the state of the lesson creation or editing process using Redux Toolkit.
 *
 * @module LessonReducer
 */

import { createAction, createReducer } from "@reduxjs/toolkit";
import NewLesson from "../dto/lesson/new-lesson.dto";

/**
 * Action to edit a lesson.
 *
 * @type {ActionCreatorWithPayload<NewLesson, "EDIT_LESSON">}
 */
export const editLesson = createAction<NewLesson>("EDIT_LESSON");

/**
 * Action to discard a lesson.
 *
 * @type {ActionCreatorWithoutPayload<"DISCARD_LESSON">}
 */
export const discardLesson = createAction("DISCRARD_LESSON");

/**
 * Initial state interface for the lesson reducer.
 *
 * @interface LessonState
 * @property {NewLesson | null} lesson - The lesson data or `null` if no lesson is being edited.
 */
interface LessonState {
  lesson: NewLesson | null;
}

/**
 * The initial state for the lesson reducer.
 *
 * @type {LessonState}
 */
const initialState: LessonState = {
  lesson: null, // No lesson by default
};

/**
 * Reducer to handle lesson actions.
 *
 * @param {LessonState} state - The current state of the lesson.
 * @param {Action} action - The action to handle.
 * @returns {LessonState} The updated state based on the action.
 */
const lessonReducer = createReducer(initialState, (builder) => {
  builder
    /**
     * Handles the "EDIT_LESSON" action.
     * Updates the state with the provided lesson data.
     *
     * @param {LessonState} state - The current state of the lesson.
     * @param {Action<NewLesson>} action - The action containing the new lesson data.
     */
    .addCase(editLesson, (state, action) => {
      state.lesson = action.payload; // Set the Lesson data response from the server
    })

    /**
     * Handles the "DISCARD_LESSON" action.
     * Resets the lesson state to `null`.
     *
     * @param {LessonState} state - The current state of the lesson.
     */
    .addCase(discardLesson, (state) => {
      state.lesson = null; // Clear lesson on reset
    });
});

export default lessonReducer;
