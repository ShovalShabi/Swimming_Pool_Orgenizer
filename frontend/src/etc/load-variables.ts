import {
  EXPO_ENV,
  EXPO_BCAKEND_SERVER_IP,
  EXPO_BCAKEND_SERVER_DEV_PORT,
  EXPO_BCAKEND_SERVER_PROD_PORT,
} from "@env";

/**
 * Function to retrieve and validate environment variables used in the application.
 *
 * It handles default values for the development environment and constructs URLs for service endpoints.
 *
 * @function getEnvVariables
 * @returns {Object} An object containing the environment configurations:
 * - `port`: The assigned port for the environment (default for dev is 6002, prod is 7002).
 * - `env`: The environment mode ('dev', 'prod', or default 'dev').
 * - `apiGlobalKey`: The Google Maps API key.
 * - `orderBusServiceURL`: The URL for the Order Bus Service.
 * - `authServiceURL`: The URL for the Auth Service.
 * - `webSocketOrderBusServiceURL`: The WebSocket URL for the Order Bus Service.
 */
const getEnvVariables = () => {
  // Validate required variables or provide default values
  let backendPort = 0; // A default port for testing (OS assigns the port)
  const env = EXPO_ENV || "dev"; // Default to 'dev' if EXPO_ENV is not defined

  if (env === "dev") {
    backendPort = parseInt(EXPO_BCAKEND_SERVER_DEV_PORT || "6001", 10); // Default to 6002 if EXPO_PORT is not defined
  } else if (env === "prod") {
    backendPort = parseInt(EXPO_BCAKEND_SERVER_PROD_PORT || "6000", 10); // Default to 7002 if EXPO_PORT is not defined
  } else {
    // Testing the application, using the services in dev mode, port will remain 0
  }
  const backendServerURL = `http://${EXPO_BCAKEND_SERVER_IP}:${backendPort}`;

  return {
    backendPort,
    env,
    backendServerURL,
  };
};

export default getEnvVariables;
