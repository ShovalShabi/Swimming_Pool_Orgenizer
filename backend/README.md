# Backend Project

This is a Node.js backend application configured with TypeScript, Mongoose, and Express. It supports both development and production environments and can be run standalone or using Docker.

## Features

- TypeScript support.
- Environment-based configurations.
- Swagger for API documentation.
- Logging with Winston.
- MongoDB as the database.
- Docker support.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or above)
- [MongoDB](https://www.mongodb.com/) (ensure it's running locally or use a hosted solution)
- [Docker](https://www.docker.com/) (if you wish to use Docker)

---

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## Environment Configuration

Use `dotenv-flow` for managing environment variables. Create `.env` files for each environment:

- `.env` (default)
- `.env.dev` (development)
- `.env.prod` (production)

Example `.env` file:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/my_database
```

---

## Running the Project

### Development

```bash
npm run dev
```

This runs the project in development mode with:

- TypeScript in watch mode.
- Nodemon for hot reloading.
- Local MongoDB instance.

### Production

```bash
npm run build
npm run prod
```

This compiles TypeScript into JavaScript and starts the server.

---

## Running with Docker

### Development Mode

```bash
npm run dev-docker
```

Ensure you have a `docker-compose` file for the MongoDB service.

### Production Mode

```bash
npm run prod-docker
```

This runs the application in production mode within a Docker container.

---

## Swagger API Documentation

The project includes Swagger for API documentation only for development mode. Access it at:

```
http://localhost:<PORT>/api-docs
```

---

## Scripts

- `npm run build`: Compiles TypeScript files into JavaScript.
- `npm run dev`: Starts the server in development mode.
- `npm run prod`: Starts the server in production mode.
- `npm run dev-docker`: Starts the server in development mode within Docker.
- `npm run prod-docker`: Starts the server in production mode within Docker.

---

## Dependencies

- `express`: Web framework for building APIs.
- `mongoose`: MongoDB object modeling.
- `swagger-jsdoc` and `swagger-ui-express`: API documentation.
- `winston`: Logging library.

## DevDependencies

- `typescript`: TypeScript support.
- `nodemon`: Automatically restarts the server on file changes.
- `dotenv-cli`: CLI for managing environment variables.

---

## License

This project is licensed under the ISC License.
