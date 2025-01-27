/**
 * Redux Reducer: Instructor Reducer
 *
 * Manages the state of the instructor creation process using Redux Toolkit.
 *
 * @module InstructorReducer
 */

import { createAction, createReducer } from "@reduxjs/toolkit";
import NewInstructor from "../dto/instructor/new-instructor.dto";

/**
 * Action to edit an instructor.
 *
 * @type {ActionCreatorWithPayload<NewInstructor, "EDIT_INSTRUCTOR">}
 */
export const editInstructor = createAction<NewInstructor>("EDIT_INSTRUCTOR");

/**
 * Action to discard an instructor.
 *
 * @type {ActionCreatorWithoutPayload<"DISCARD_INSTRUCTOR">}
 */
export const discardInstructor = createAction("DISCRARD_INSTRUCTOR");

/**
 * Initial state interface for the instructor reducer.
 *
 * @interface InstructorState
 * @property {NewInstructor | null} instructor - The instructor data or `null` if no instructor is being edited.
 */
interface InstructorState {
  instructor: NewInstructor | null;
}

/**
 * The initial state for the instructor reducer.
 *
 * @type {InstructorState}
 */
const initialState: InstructorState = {
  instructor: null, // No instructor by default
};

/**
 * Reducer to handle instructor actions.
 *
 * @param {InstructorState} state - The current state of the instructor.
 * @param {Action} action - The action to handle.
 * @returns {InstructorState} The updated state based on the action.
 */
const instructorReducer = createReducer(initialState, (builder) => {
  builder
    /**
     * Handles the "EDIT_INSTRUCTOR" action.
     * Updates the state with the provided instructor data.
     *
     * @param {InstructorState} state - The current state of the instructor.
     * @param {Action<NewInstructor>} action - The action containing the new instructor data.
     */
    .addCase(editInstructor, (state, action) => {
      state.instructor = action.payload; // Set the Instructor data response from the server
    })

    /**
     * Handles the "DISCARD_INSTRUCTOR" action.
     * Resets the instructor state to `null`.
     *
     * @param {InstructorState} state - The current state of the instructor.
     */
    .addCase(discardInstructor, (state) => {
      state.instructor = null; // Clear instructor on reset
    });
});

export default instructorReducer;
