# Full Stack Authentication Test

A full-stack authentication application built as part of a Full Stack Engineer technical assessment.

The application provides user registration, login, session authentication, and a protected application page. It is split into a React/TypeScript frontend and a NestJS/TypeScript backend backed by MongoDB.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- React Hook Form
- Zod
- Axios
- Zustand
- Tailwind CSS

### Backend

- NestJS
- TypeScript
- MongoDB
- Mongoose
- JWT authentication
- Passport / Passport JWT
- Argon2 password hashing
- class-validator / class-transformer
- Helmet
- NestJS Throttler
- Swagger

### Infrastructure

- Docker
- Docker Compose
- MongoDB 8

## Features

- User sign up
- User sign in
- Client-side form validation
- Server-side DTO validation
- Password hashing with Argon2
- JWT-based authentication
- Protected backend endpoint
- Authenticated application page
- Logout/session cleanup
- HTTP security headers
- Rate limiting
- Environment-based configuration
- Dockerized frontend, backend, and MongoDB services

## Project Structure

```text
Full-Stack-test/
├── backend/
│   ├── src/
│   │   ├── common/
│   │   ├── config/
│   │   ├── modules/
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/auth/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── sdk/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── validations/
│   │   └── App.tsx
│   ├── public/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── package.json
└── pnpm-lock.yaml
```

## Prerequisites

You can run the project either with Docker Compose or locally.

### Option 1: Docker

Install:

- Docker
- Docker Compose

### Option 2: Local development

Install:

- Node.js
- pnpm
- MongoDB

## Environment Variables

### Backend

Create `backend/.env` from `backend/.env.example`.

The backend requires configuration for the application port, MongoDB connection, and JWT authentication settings.

Example:

```env
NODE_ENV=development

DATABASE_URL=mongodb://admin:secret@localhost:27017/full_stack_test?authSource=admin

JWT_ACCESS_SECRET=b69b515827e28b9a3f298f66be7cb143c4c9e37d37230b7c05e9af2b8ed806c2
JWT_REFRESH_SECRET=ba5ce66de8653f20d2cf5cbfedea11504b0714eb647bd38d21d05ade47c5450d
JWT_ACCESS_EXPIRES_IN=900
JWT_REFRESH_EXPIRES_DAYS=30

COOKIE_ACCESS_TOKEN_MAX_AGE_MS=900000        # 15 minutes
COOKIE_REFRESH_TOKEN_MAX_AGE_MS=604800000    # 7 days
```

Do not commit real secrets to the repository.

### Frontend

The frontend uses:

```env
VITE_API_URL=http://localhost:3000
```

Create the appropriate `.env` file if your environment requires overriding the default API URL.

## Running with Docker Compose

The repository includes a complete Docker Compose setup containing:

- MongoDB on port `27017`
- NestJS backend on port `3000`
- React/Vite frontend on port `5173`

The Compose configuration uses a persistent MongoDB volume and connects the backend to MongoDB through the Docker network.

Start the application:

```bash
docker compose up --build
```

Then open:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```

Stop the services:

```bash
docker compose down
```

To stop the services and remove the persisted database volumes:

```bash
docker compose down -v
```

## Running Locally

### Backend

```bash
cd backend
pnpm install
pnpm start:dev
```

The backend runs on:

```text
http://localhost:3000
```

Useful commands:

```bash
pnpm build
pnpm start
pnpm start:dev
pnpm start:prod
pnpm lint
pnpm test
pnpm test:e2e
pnpm test:cov
```

### Frontend

In another terminal:

```bash
cd frontend
pnpm install
pnpm dev
```

The frontend runs on:

```text
http://localhost:5173
```

Useful commands:

```bash
pnpm build
pnpm lint
pnpm preview
```
## API Documentation

Swagger API documentation is available at:

http://localhost:3000/api/docs

When running the backend locally, open the URL above to explore and test the available API endpoints.

## Authentication Flow

### Sign Up

The user submits:

- Name
- Email
- Password

The password follows the assessment requirements:

- At least 8 characters
- At least one letter
- At least one number
- At least one special character

The frontend validates the input before sending it to the API, while the backend validates the request again.

The backend stores a securely hashed password rather than the plaintext password.

### Sign In

The user submits:

- Email
- Password

The backend verifies the credentials and creates an authenticated session using JWT.

The client then uses the authenticated state to access protected application functionality.

### Protected Endpoint

Authenticated requests are protected by the backend JWT authentication guard. Requests without a valid authentication token are rejected rather than being allowed to access protected resources.

### Logout

The frontend provides logout functionality to end the authenticated session and clear the local authentication state.

## Security Considerations

The implementation includes several security-focused measures:

- Passwords are hashed with Argon2.
- JWT secrets are provided through environment configuration.
- Request DTOs are validated on the server.
- Throttling/rate limiting is configured to reduce abuse.
- Authentication is enforced through NestJS guards.
- Secrets are excluded from source control through environment configuration.
- The frontend validates user input, but the backend remains the final authority for validation.

For a production deployment, HTTPS, a strong randomly generated JWT secret, restricted CORS origins, secure cookie/token handling, centralized logging, monitoring, and a managed MongoDB deployment should also be configured according to the deployment environment.

## API Documentation

The backend includes Swagger support. When Swagger is enabled in the running application, the generated API documentation can be used to inspect and test the available endpoints.

## Production Readiness

The project was structured with maintainability and production-readiness in mind:

- Feature-oriented NestJS modules
- DTO-based API validation
- Centralized configuration
- Authentication guards and JWT strategy
- Secure password hashing
- Security headers
- Rate limiting
- Docker support
- Automated linting/build commands
- Unit/e2e testing configuration
- API documentation support

The assessment explicitly evaluates functionality, production readiness, security, maintainability, and code quality.

## Assessment Requirements

This repository implements the requested assessment around:

1. React/Vue authentication UI
2. TypeScript
3. Sign-up form and validation
4. Sign-in form
5. Authenticated application page
6. NestJS backend
7. MongoDB database
8. Sign-up and sign-in APIs
9. At least one protected endpoint
10. Repository documentation

The assessment also requires an `AI.md` file documenting AI assistance, including useful prompts, effective approaches, corrections, and rework.

## License

This project was created as a technical assessment submission.
