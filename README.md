# TodoList API

Node.js REST API for managing a task list with Express, MongoDB, PostgreSQL, JWT authentication, and Swagger documentation.

## Features

- 🔐 **JWT Authentication** with token generation and user management
- 💾 **Dual database support** (MongoDB + PostgreSQL)
- 📚 **RESTful API** endpoints
- 📖 **Interactive Swagger UI** documentation
- ✅ **Comprehensive test suite** (38 tests passing)
- 📊 **82.52% code coverage**
- 🌐 **Web interface** for task and authentication management

## Quick Start

```bash
# Install dependencies
npm install

# Start MongoDB and PostgreSQL
brew services start mongodb-community
brew services start postgresql

# Create PostgreSQL database
createdb -U your_user todolist

# Configure environment (see Configuration section)
cp .env.example .env  # Edit with your values

# Start the server
npm start
```

Application runs on **http://localhost:3000**
Swagger documentation at **http://localhost:3000/api-docs**

## Configuration

Create a `.env` file at the root:

```env
# Server
PORT=3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/todolist

# PostgreSQL
PG_USER=your_user
PG_PASSWORD=your_password
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=todolist

# Database Mode (both | mongodb | postgresql)
DATABASE_MODE=both

# JWT Authentication
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=1h
```

### Database Modes

- **`both`** (default): Synchronizes data between MongoDB and PostgreSQL
- **`mongodb`**: Uses MongoDB only
- **`postgresql`**: Uses PostgreSQL only

## API Endpoints

### 🔐 Authentication (JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/token/user` | Create user and generate JWT token |
| POST | `/token/generate` | Login and generate JWT token |
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and get token |
| GET | `/auth/profile` | Get user profile (requires token) |

**Create User Example:**
```bash
curl -X POST http://localhost:3000/token/user \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "1h",
  "user": {
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Generate Token (Login) Example:**
```bash
curl -X POST http://localhost:3000/token/generate \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Use Token for Protected Routes:**
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 📝 Tasks (MongoDB)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create a new task |
| DELETE | `/tasks/:id` | Delete a task |

### 📝 Tasks (PostgreSQL)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks-pg` | Get all tasks |
| POST | `/tasks-pg` | Create a new task |
| DELETE | `/tasks-pg/:id` | Delete a task |

### 🌐 Web Interface

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Task management and auth interface |
| POST | `/tasks/add` | Add task (synced to both DBs) |
| POST | `/tasks/delete/:id` | Delete task (from both DBs) |

## Authentication Features

### JWT Token Specifications
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Expiration**: 1 hour (configurable via `JWT_EXPIRES_IN`)
- **Payload**: User ID and email
- **Signature**: Secret key from `JWT_SECRET`

### User Model (MongoDB)
```javascript
{
  username: String (required, unique, min 3 chars),
  email: String (required, unique, lowercase),
  password: String (required, min 6 chars, auto-hashed with bcrypt),
  createdAt: Date,
  updatedAt: Date
}
```

### User Table (PostgreSQL)
```sql
CREATE TABLE users_pg (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Password Security
- Passwords are hashed using **bcrypt** with salt rounds of 10
- Automatic hashing via Mongoose pre-save hook
- Password comparison using bcrypt's secure compare function
- Passwords never stored or returned in plain text

## Web Interface Usage

Access **http://localhost:3000** to use the visual interface:

### Authentication Section (Top)
- **Left panel**: Create a new account
  - Enter username, email, password (min 6 chars)
  - Click "S'inscrire" to register
  - Receive JWT token immediately

- **Right panel**: Login to generate token
  - Enter email and password
  - Click "Générer Token" to authenticate
  - Get a new JWT token (valid 1 hour)

### Task Management Section
- View all tasks from both databases
- Add new tasks (synchronized to MongoDB and PostgreSQL)
- Delete tasks (removed from both databases)
- Tasks show database badge (MongoDB/PostgreSQL/Both)

## Swagger Documentation

Interactive API documentation available at:

**http://localhost:3000/api-docs**

Features:
- Complete API endpoint documentation
- Request/response schemas with examples
- Interactive testing interface ("Try it out" buttons)
- JWT authentication support (click "Authorize" button)
- OpenAPI 3.0 specification

JSON specification: **http://localhost:3000/api-docs.json**

## Testing

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- __tests__/auth.test.js
```

### Test Results
- ✅ **38 tests passing**
- 📊 **82.52% code coverage**
- Test suites:
  - Authentication API (13 tests)
  - MongoDB Tasks (6 tests)
  - PostgreSQL Tasks (6 tests)
  - Swagger Documentation (10 tests)
  - View Controller (3 tests)

## Project Structure

```
nodeToDo/
├── src/
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # Server entry point
│   ├── config/
│   │   ├── database.js           # MongoDB connection
│   │   ├── postgres.js           # PostgreSQL connection & tables
│   │   └── swagger.js            # Swagger/OpenAPI configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── tokenController.js    # Token generation logic
│   │   ├── taskController.js     # MongoDB task controller
│   │   ├── taskPgController.js   # PostgreSQL task controller
│   │   └── viewController.js     # Web interface controller
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── Task.js               # MongoDB Task model
│   │   └── User.js               # MongoDB User model
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication routes
│   │   ├── tokenRoutes.js        # Token generation routes
│   │   ├── taskRoutes.js         # MongoDB task routes
│   │   ├── taskPgRoutes.js       # PostgreSQL task routes
│   │   └── viewRoutes.js         # Web interface routes
│   └── views/
│       └── index.pug             # Web interface template
├── __tests__/
│   ├── auth.test.js              # Authentication tests
│   ├── task.test.js              # MongoDB tests
│   ├── taskPg.test.js            # PostgreSQL tests
│   ├── view.test.js              # View controller tests
│   └── swagger.test.js           # Swagger documentation tests
├── .env                          # Environment variables (not in git)
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
├── jest.config.js                # Jest configuration
├── eslint.config.js              # ESLint configuration
├── docker-compose.yml            # Docker services
├── Dockerfile                    # Docker image
└── README.md                     # This file
```

## Technologies

### Core
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8.19** - MongoDB ODM
- **PostgreSQL** - SQL database
- **pg 8.16** - PostgreSQL client

### Authentication
- **jsonwebtoken 9.0** - JWT generation and verification
- **bcrypt 6.0** - Password hashing

### Documentation
- **Swagger UI Express 5.0** - Interactive API documentation
- **Swagger JSDoc 6.2** - OpenAPI specification from JSDoc

### Development
- **Pug 3.0** - Template engine
- **Jest 30.2** - Testing framework
- **Supertest 7.1** - HTTP testing
- **ESLint 9.37** - Linting
- **Prettier 3.6** - Code formatting
- **dotenv 17.2** - Environment variables

## Docker Deployment

```bash
# Start all services (app + MongoDB + PostgreSQL)
docker-compose up --build

# Start in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Stop and remove volumes (delete data)
docker-compose down -v
```

**Docker Services:**
- **app**: Node.js application (port 3000)
- **mongodb**: MongoDB database (port 27017)
- **postgres**: PostgreSQL database (port 5432)

## Database Schemas

### MongoDB Task
```javascript
{
  _id: ObjectId,
  title: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### PostgreSQL tasks_pg
```sql
CREATE TABLE tasks_pg (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Best Practices

⚠️ **Important for Production:**

1. **Change JWT_SECRET**: Use a strong, random secret key
2. **Use HTTPS**: Enable SSL/TLS for secure token transmission
3. **Environment Variables**: Never commit `.env` file to version control
4. **Token Storage**: Store tokens securely (httpOnly cookies or secure storage)
5. **Rate Limiting**: Implement rate limiting on authentication endpoints
6. **Password Policy**: Enforce strong password requirements
7. **Token Refresh**: Implement refresh token mechanism for longer sessions

## Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server (watch mode)
npm test           # Run tests with coverage
npm run test:watch # Run tests in watch mode
npm run lint       # Lint code with ESLint
npm run format     # Format code with Prettier
```

## Key Features Implemented

### ✅ Authentication System
- User registration with bcrypt password hashing
- JWT token generation and verification
- Protected routes with authentication middleware
- Dual database support (MongoDB + PostgreSQL)
- Web interface for easy user management

### ✅ Swagger Documentation
- Complete OpenAPI 3.0 specification
- Interactive API testing
- JWT security scheme integration
- Request/response examples
- Automatic documentation from JSDoc comments

### ✅ Code Quality
- 82.52% test coverage
- Professional English codebase
- Comprehensive error handling
- Server resilience (continues without databases)
- Clean architecture with separation of concerns

### ✅ Dual Database
- Seamless synchronization between MongoDB and PostgreSQL
- Configurable database modes
- Independent API endpoints for each database
- Unified web interface

## License

ISC

## Author

Developed as part of B3 2025 Backend coursework.