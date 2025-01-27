# Swimming Pool Orgenizer Backend

This directory contains the backend server application for the Swimming Club Back Office System.

---

## Features

- RESTful API for managing instructors, lessons, and trainees.
- MongoDB as the database for storing persistent data.
- Middleware for validation and logging.
- Dockerized for consistent deployment.

---

## Prerequisites

- **Node.js** (>= 16.x)
- **Docker**
- **MongoDB**

---

## Setup Instructions

### Install Dependencies

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

### Run the Application

#### Development

```bash
npm run dev
```

#### Production

```bash
npm run build && npm run prod
```

#### Docker

```bash
docker-compose up --build
```

### Run Tests

```bash
npm run test
```

---

## API Endpoints

### Instructor Routes

- **POST `/instructor`**: Add a new instructor.
- **GET `/instructor`**: Retrieve all instructors.
- **GET `/instructor/single/:id`**: Retrieve a single instructor by ID.
- **PUT `/instructor/:id`**: Update an instructor.
- **DELETE `/instructor/:id`**: Delete an instructor by ID.

### Lesson Routes

- **POST `/lesson`**: Create a new lesson.
- **GET `/lesson/:id`**: Retrieve a single lesson by ID.
- **GET `/lesson`**: Retrieve lessons within a date range.
- **PUT `/lesson/:id`**: Update a lesson.
- **DELETE `/lesson/:id`**: Delete a lesson by ID.

---

## File Structure

```plaintext
backend/
├── src/
│   ├── controller/    # API controllers
│   ├── dto/           # Data transfer objects
│   ├── etc/           # Configuration files
│   ├── model/         # Database schemas
│   ├── repository/    # Database interaction logic
│   ├── route/         # API route definitions
│   ├── service/       # Business logic
│   ├── utils/         # Utility functions and middleware
│   ├── app.ts         # Express application setup
│   └── server.ts      # Application entry point
├── test/              # Unit and integration tests
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose configuration
└── package.json       # Project metadata and dependencies
```

**NOTE: The code needs a _.env_ file for running it, please contact [shovalshabi\@gmail.com](mailto:shovalshabi@gmail.com?subject=Request%20for%20ENV%20files) for the _.env_ files**
