import { CorsOptions } from "cors"; // Import the type for CorsOptions

// Define CORS options with proper typing
const corsOptions: CorsOptions = {
  origin: [
    process.env.CLIENT_DEV_URL as string,
    process.env.CLIENT_PROD_URL as string,
  ],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies to be sent from client to server
};

export default corsOptions;
