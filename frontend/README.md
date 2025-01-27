# Swimming Pool Orgenizer Frontend

This directory contains the frontend application for the Swimming Club Back Office System.

---

## Features

- React Native application for managing lessons and instructors.
- Redux Toolkit for state management.
- Hosted and developed using ExpoGo.

---

## Prerequisites

- **Node.js** (>= 16.x)
- **Expo CLI**

---

## Setup Instructions

### Install Dependencies

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

### Run the Application

#### Development

```bash
npm start
```

#### Running on Devices

- For Android:
  ```bash
  npm run android
  ```
- For iOS:
  ```bash
  npm run ios
  ```
- For Web:
  ```bash
  npm run web
  ```

---

## File Structure

```plaintext
frontend/
├── src/
│   ├── components/   # Reusable UI components
│   ├── dto/          # Data transfer objects
│   ├── etc/          # Configuration files
│   ├── hooks/        # Custom React hooks
│   ├── screens/      # Application screens
│   ├── services/     # API interaction logic
│   ├── states/       # Redux state slices
│   ├── themes/       # Theme configurations
│   └── utils/        # Utility functions
├── App.tsx           # Root application entry point
├── package.json      # Project metadata and dependencies
└── tsconfig.json     # TypeScript configuration
```

---

## Deployment

The application is hosted locally via ExpoGo. Ensure you have the Expo Go app installed on your device to preview the application.

**NOTE: The code needs a _.env_ file for running it, please contact [shovalshabi\@gmail.com](mailto:shovalshabi@gmail.com?subject=Request%20for%20ENV%20files) for the _.env_ files**
