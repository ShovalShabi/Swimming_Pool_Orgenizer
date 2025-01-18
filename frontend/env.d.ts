/**
 * Module declaration for environment variables loaded from `@env`.
 *
 * This file defines the types for environment variables that are accessed
 * within the application using the `@env` module. These variables are typically
 * provided by a `.env` file and loaded at runtime.
 */
declare module "@env" {
  /**
   * The port used by the Expo app.
   * @type {string}
   */
  export const EXPO_PORT: string;

  /**
   * The environment the app is running in (e.g., "dev", "prod").
   * @type {string}
   */
  export const EXPO_ENV: string;

  /**
   * The backend server IP address.
   * @type {string}
   */
  export const EXPO_BCAKEND_SERVER_IP: string;

  /**
   * The backend server port number as development environment.
   * @type {string}
   */
  export const EXPO_BCAKEND_SERVER_DEV_PORT: string;
  /**
   * The backend server port number as production environment.
   * @type {string}
   */
  export const EXPO_BCAKEND_SERVER_PROD_PORT: string;
}
