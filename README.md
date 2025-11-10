# TodoList API

Node.js REST API for managing a task list with Express, MongoDB, PostgreSQL, JWT authentication, and Swagger documentation.

## Features

- 🔐 **JWT Authentication** with token generation and user management
- � **OAuth 2.0** integration (Google authentication)
- 🛡️ **Rate Limiting** protection against abuse
- �💾 **Dual database support** (MongoDB + PostgreSQL)
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

### 🔐 JWT Token Specifications
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Expiration**: 1 hour (configurable via `JWT_EXPIRES_IN`)
- **Payload**: User ID and email
- **Signature**: Secret key from `JWT_SECRET`

### 🔑 OAuth 2.0 Integration

#### Supported Providers
- **Google OAuth 2.0**
  - Automatic user creation on first login
  - Profile information retrieval (email, display name)
  - Support for both MongoDB and PostgreSQL storage
  - Secure session management

#### OAuth Configuration
1. Create a Google Cloud Project at [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google+ API
3. Create OAuth 2.0 credentials:
   - **Application type**: Web application
   - **Authorized redirect URIs**: `http://localhost:3000/oauth/google/callback`
4. Add credentials to `.env`:
   ```env
   GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/oauth/google/callback
   ```

#### OAuth Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/oauth/google?db=mongodb` | Initiate Google auth (MongoDB) |
| GET | `/oauth/google?db=postgres` | Initiate Google auth (PostgreSQL) |
| GET | `/oauth/google/callback` | OAuth callback handler |
| GET | `/oauth/status` | Check authentication status |
| GET | `/oauth/logout` | Logout from OAuth session |

#### OAuth Flow
1. User clicks "Continuer avec Google" on login/register page
2. Redirect to Google authentication
3. User grants permissions
4. Google redirects back to callback URL
5. Server creates/finds user and generates JWT token
6. User redirected to TodoList with active session

### 🛡️ Rate Limiting Protection

Multiple rate limiters protect different endpoints:

#### General Rate Limiter
- **Limit**: 100 requests per 15 minutes
- **Applied to**: All routes
- **Purpose**: Prevent general abuse

#### Authentication Rate Limiter
- **Limit**: 5 attempts per 15 minutes
- **Applied to**: `/auth/*` and `/oauth/*` routes
- **Purpose**: Prevent brute force attacks

#### Token Generation Rate Limiter
- **Limit**: 10 tokens per hour
- **Applied to**: `/token/*` routes
- **Purpose**: Prevent token abuse

#### API Operations Rate Limiter
- **Limit**: 50 requests per 10 minutes
- **Applied to**: `/tasks/*` and `/tasks-pg/*` routes
- **Purpose**: Prevent API flooding

#### Rate Limit Headers
All rate-limited responses include standard headers:
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1699876543
```

#### Rate Limit Response
When limit is exceeded:
```json
{
  "error": "Trop de requêtes depuis cette adresse IP, veuillez réessayer dans 15 minutes."
}
```

### User Model (MongoDB)
```javascript
{
  username: String (required, unique, min 3 chars),
  email: String (required, unique, lowercase),
  password: String (required, min 6 chars, auto-hashed with bcrypt),
  oauth_provider: String (enum: ['google', 'github', 'local'], default: 'local'),
  oauth_id: String (sparse index),
  createdAt: Date,
  updatedAt: Date
}
```

### User Table (PostgreSQL)
```sql
CREATE TABLE users_pg (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  oauth_provider VARCHAR(50) DEFAULT 'local',
  oauth_id VARCHAR(255),
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
│   │   ├── passport.js           # OAuth 2.0 Passport configuration
│   │   └── swagger.js            # Swagger/OpenAPI configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── tokenController.js    # Token generation logic
│   │   ├── oauthController.js    # OAuth 2.0 controller
│   │   ├── taskController.js     # MongoDB task controller
│   │   ├── taskPgController.js   # PostgreSQL task controller
│   │   └── viewController.js     # Web interface controller
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication middleware
│   │   ├── authWeb.js            # Web authentication middleware
│   │   └── rateLimiter.js        # Rate limiting middleware
│   ├── models/
│   │   ├── Task.js               # MongoDB Task model
│   │   └── User.js               # MongoDB User model (with OAuth)
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication routes
│   │   ├── oauthRoutes.js        # OAuth 2.0 routes
│   │   ├── tokenRoutes.js        # Token generation routes
│   │   ├── taskRoutes.js         # MongoDB task routes
│   │   ├── taskPgRoutes.js       # PostgreSQL task routes
│   │   └── viewRoutes.js         # Web interface routes
│   └── views/
│       ├── index.pug             # TodoList web interface
│       ├── login.pug             # Login page with OAuth
│       └── register.pug          # Registration page with OAuth
├── __tests__/
│   ├── auth.test.js              # Authentication tests
│   ├── task.test.js              # MongoDB tests
│   ├── taskPg.test.js            # PostgreSQL tests
│   ├── view.test.js              # View controller tests
│   └── swagger.test.js           # Swagger documentation tests
├── .env                          # Environment variables (not in git)
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
├── jest.config.js                # Jest configuration
├── eslint.config.js              # ESLint configuration
├── docker-compose.yml            # Docker services
├── Dockerfile                    # Docker image
├── init-postgres.sql             # PostgreSQL initialization
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

### Security & Authentication
- **jsonwebtoken 9.0** - JWT generation and verification
- **bcrypt 6.0** - Password hashing
- **passport** - Authentication middleware
- **passport-google-oauth20** - Google OAuth 2.0 strategy
- **express-session** - Session management for OAuth
- **express-rate-limit** - Rate limiting middleware
- **cookie-parser** - Cookie parsing for sessions

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

### ✅ Security & Authentication
- **JWT Authentication**: Token generation, verification, and refresh
- **OAuth 2.0**: Google authentication with automatic user creation
- **Rate Limiting**: Multi-tier protection against abuse and DDoS
  - General API rate limiting (100 req/15min)
  - Strict authentication limits (5 attempts/15min)
  - Token generation limits (10 tokens/hour)
  - API operation limits (50 req/10min)
- **Password Security**: bcrypt hashing with salt rounds
- **Session Management**: Secure HTTP-only cookies
- **Dual Database Support**: OAuth works with MongoDB and PostgreSQL

### ✅ Swagger Documentation
- Complete OpenAPI 3.0 specification
- Interactive API testing
- JWT security scheme integration
- OAuth 2.0 endpoints documentation
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
- OAuth user storage in both databases

## Security Best Practices

### 🔒 Implemented Security Measures

1. **Authentication**
   - JWT tokens with expiration (1 hour default)
   - Secure password hashing (bcrypt, 10 salt rounds)
   - HTTP-only cookies for session tokens
   - OAuth 2.0 with industry-standard providers

2. **Rate Limiting**
   - Multiple tiers based on endpoint sensitivity
   - Standard rate limit headers (RateLimit-*)
   - IP-based tracking
   - Configurable limits via environment variables

3. **Data Protection**
   - Passwords never stored in plain text
   - Email normalization (lowercase)
   - Input validation and sanitization
   - Secure session secret rotation

4. **API Security**
   - CORS configuration
   - Protected routes with middleware
   - Request body size limits
   - Error messages without sensitive data

### ⚠️ Production Recommendations

1. **Environment Variables**
   - Use strong, random secrets (64+ characters)
   - Rotate secrets regularly
   - Never commit `.env` files to git
   - Use environment-specific configurations

2. **HTTPS**
   - Enable HTTPS in production
   - Set `secure: true` for cookies
   - Use HSTS headers
   - Implement certificate pinning

3. **Database Security**
   - Use connection pooling
   - Implement query parameterization
   - Regular backups
   - Database user with minimal privileges

4. **Monitoring**
   - Log failed authentication attempts
   - Monitor rate limit violations
   - Track unusual activity patterns
   - Set up alerts for security events

## License

ISC

## Author

Developed as part of B3 2025 Backend coursework.