import { CorsOptions } from "cors"; // Import the type for CorsOptions

/**
 * Configuration options for Cross-Origin Resource Sharing (CORS).
 * Defines the rules for allowing or restricting cross-origin requests.
 */
const corsOptions: CorsOptions = {
  // origin: [
  //   "*",
  //   process.env.CLIENT_DEV_URL as string,
  //   process.env.CLIENT_PROD_URL as string,
  // ],

  /**
   * Function to dynamically control the allowed origins.
   * In this case, it allows all origins.
   *
   * @param origin - The origin of the incoming request.
   * @param callback - Callback to signal whether the origin is allowed or denied.
   */
  origin: (origin, callback) => {
    callback(null, true); // Allow all origins
  },

  /**
   * Specifies the allowed HTTP headers for cross-origin requests.
   * - `Content-Type`: Allows specifying the MIME type of the request body.
   * - `Authorization`: Allows sending authorization headers for authenticated requests.
   */
  allowedHeaders: ["Content-Type", "Authorization"],

  /**
   * Enables the use of cookies and credentials in cross-origin requests.
   * When `credentials: true`, the client must explicitly set `withCredentials: true`.
   */
  credentials: true,
};

export default corsOptions;
