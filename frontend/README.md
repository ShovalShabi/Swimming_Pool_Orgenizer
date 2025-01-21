
# Frontend Application

This is the frontend application for SplashOps, a platform for managing swimming pool lessons.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Development](#development)
- [Production](#production)
- [Scripts](#scripts)
- [Technologies](#technologies)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Overview

The frontend is built with React Native and Expo, offering a cross-platform mobile application for managing lessons and instructors. The project integrates with a backend API and uses Redux for state management.

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Ensure you have Expo CLI installed globally:

    ```bash
    npm install -g expo-cli
    ```

4. Set up environment variables by creating a `.env` file in the root directory and adding the required keys. For example:

    ```env
    API_BASE_URL=https://example.com/api
    ```

## Development

Run the development server with the following command:

```bash
npm run dev
```

This will start the Expo development server with the development environment configuration.

### Running on Specific Platforms

- **Android:**

    ```bash
    npm run android
    ```

- **iOS:**

    ```bash
    npm run ios
    ```

- **Web:**

    ```bash
    npm run web
    ```

## Production

Run the production build using:

```bash
npm run prod
```

This will start the Expo development server with the production environment configuration.

## Scripts

- `start`: Start the Expo development server.
- `android`: Start the app on an Android emulator or device.
- `ios`: Start the app on an iOS simulator or device.
- `web`: Start the app in a web browser.
- `dev`: Start the app in development mode with a clean cache.
- `prod`: Start the app in production mode with a clean cache.

## Technologies

- **React Native**: For building the mobile app.
- **Expo**: For managing the React Native app lifecycle and dependencies.
- **Redux**: For state management.
- **Axios**: For API requests.

## Environment Variables

This application uses environment variables. Create a `.env` file in the root directory and set the following variables:

- `API_BASE_URL`: The base URL of the backend API.

Example `.env` file:

```env
API_BASE_URL=https://example.com/api
```

## Troubleshooting

- If you encounter issues with dependencies, try clearing the cache:

    ```bash
    expo start -c
    ```

- Ensure your environment variables are set correctly in the `.env` file.
- For platform-specific issues, refer to the [Expo documentation](https://docs.expo.dev/).

---

For more details about the project, please contact the development team.
