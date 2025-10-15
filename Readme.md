# Event Management API

A robust REST API for managing events and user registrations built with Node.js, Express, and PostgreSQL.

## 🚀 Features

- ✅ Create and manage events with capacity limits (max 1000)
- ✅ User registration and management
- ✅ Event registration with business logic validation
- ✅ Prevent duplicate registrations
- ✅ Block registration for past events and full events
- ✅ Custom sorting algorithm (by date, then location)
- ✅ Real-time event statistics
- ✅ Concurrent registration handling with database transactions
- ✅ Comprehensive error handling and validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd event-management-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Database Setup

#### Create PostgreSQL database

```bash
psql -U postgres
```

```sql
CREATE DATABASE event_management;
\q
```

#### Run schema migration

```bash
psql -U postgres -d event_management -f database/schema.sql
```

#### (Optional) Seed sample data

```bash
psql -U postgres -d event_management -f database/seed.sql
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_management
DB_USER=postgres
DB_PASSWORD=your_password_here

DB_MAX_CONNECTIONS=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000
```

### 5. Start the server

#### Development mode (with auto-reload)

```bash
npm run dev
```

#### Production mode

```bash
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### 1. Create Event

**POST** `/api/events`

Create a new event with validation.

**Request Body:**

```json
{
  "title": "Tech Conference 2025",
  "date_time": "2025-11-15T09:00:00Z",
  "location": "San Francisco",
  "capacity": 500
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "event_id": 1,
    "event": {
      "id": 1,
      "title": "Tech Conference 2025",
      "date_time": "2025-11-15T09:00:00.000Z",
      "location": "San Francisco",
      "capacity": 500,
      "created_at": "2025-10-15T10:30:00.000Z"
    }
  }
}
```

**Validation Rules:**
- Title: 3-255 characters, required
- Date & Time: ISO 8601 format, required
- Location: 2-255 characters, required
- Capacity: 1-1000, positive integer, required

---

#### 2. Get Event Details

**GET** `/api/events/:id`

Retrieve event details with all registered users.

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Tech Conference 2025",
    "date_time": "2025-11-15T09:00:00.000Z",
    "location": "San Francisco",
    "capacity": 500,
    "created_at": "2025-10-15T10:30:00.000Z",
    "current_registrations": 3,
    "registered_users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "registered_at": "2025-10-15T11:00:00.000Z"
      }
    ]
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": {
    "message": "Event not found"
  }
}
```

---

#### 3. Register for Event

**POST** `/api/events/register`

Register a user for an event with validation.

**Request Body:**

```json
{
  "user_id": 1,
  "event_id": 1
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Successfully registered for the event",
  "data": {
    "registration_id": 1,
    "user_id": 1,
    "event_id": 1,
    "registered_at": "2025-10-15T11:00:00.000Z"
  }
}
```

**Business Logic Validations:**

- ❌ Cannot register if user already registered (409)
- ❌ Cannot register if event is full (400)
- ❌ Cannot register for past events (400)
- ❌ User must exist (404)
- ❌ Event must exist (404)

**Error Responses:**

```json
// Duplicate registration
{
  "success": false,
  "error": {
    "message": "User is already registered for this event"
  }
}

// Event is full
{
  "success": false,
  "error": {
    "message": "Event is full. Registration capacity has been reached"
  }
}

// Past event
{
  "success": false,
  "error": {
    "message": "Cannot register for past events"
  }
}
```

---

#### 4. Cancel Registration

**POST** `/api/events/cancel`

Cancel a user's registration for an event.

**Request Body:**

```json
{
  "user_id": 1,
  "event_id": 1
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Registration cancelled successfully",
  "data": {
    "user_id": 1,
    "event_id": 1
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": {
    "message": "User is not registered for this event"
  }
}
```

---

#### 5. List Upcoming Events

**GET** `/api/events/upcoming`

Get all future events sorted by custom algorithm.

**Sorting Logic:**
1. First by date (ascending - earliest first)
2. Then by location (alphabetically)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "count": 5,
    "events": [
      {
        "id": 2,
        "title": "Web Development Workshop",
        "date_time": "2025-10-20T14:00:00.000Z",
        "location": "New York",
        "capacity": 50,
        "current_registrations": "2"
      },
      {
        "id": 4,
        "title": "Startup Networking Event",
        "date_time": "2025-10-25T18:00:00.000Z",
        "location": "Austin",
        "capacity": 100,
        "current_registrations": "1"
      },
      {
        "id": 5,
        "title": "Cloud Computing Seminar",
        "date_time": "2025-11-10T13:00:00.000Z",
        "location": "Seattle",
        "capacity": 200,
        "current_registrations": "2"
      }
    ]
  }
}
```

---

#### 6. Event Statistics

**GET** `/api/events/:id/stats`

Get detailed statistics for an event.

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "event_id": 1,
    "event_title": "Tech Conference 2025",
    "total_registrations": 3,
    "remaining_capacity": 497,
    "percentage_filled": 0.6,
    "capacity": 500
  }
}
```

---

#### 7. Create User

**POST** `/api/users`

Create a new user.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "krishna.sharma@example.com",
    "created_at": "2025-10-15T10:30:00.000Z"
  }
}
```

**Error Response (409):**

```json
{
  "success": false,
  "error": {
    "message": "Email already exists"
  }
}
```

---

#### 8. Get All Users

**GET** `/api/users`

Retrieve all users.

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "count": 5,
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "created_at": "2025-10-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

#### 9. Get User by ID

**GET** `/api/users/:id`

Get specific user details.

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "created_at": "2025-10-15T10:30:00.000Z"
  }
}
```

---

#### 10. Get User's Events

**GET** `/api/users/:id/events`

Get all events a user is registered for.

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "events_count": 3,
    "events": [
      {
        "id": 1,
        "title": "Tech Conference 2025",
        "date_time": "2025-11-15T09:00:00.000Z",
        "location": "San Francisco",
        "capacity": 500,
        "registered_at": "2025-10-15T11:00:00.000Z"
      }
    ]
  }
}
```

---

## 🧪 Testing the API

### Using cURL

#### Create a User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "krishna.sharma@example.com"
  }'
```

#### Create an Event

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tech Conference 2025",
    "date_time": "2025-11-15T09:00:00Z",
    "location": "Banglore",
    "capacity": 500
  }'
```

#### Register for Event

```bash
curl -X POST http://localhost:3000/api/events/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "event_id": 1
  }'
```

#### Get Upcoming Events

```bash
curl http://localhost:3000/api/events/upcoming
```

#### Get Event Statistics

```bash
curl http://localhost:3000/api/events/1/stats
```

#### Cancel Registration

```bash
curl -X POST http://localhost:3000/api/events/cancel \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "event_id": 1
  }'
```

---

## 🏗️ Project Structure

```
event-management-api/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection configuration
│   ├── controllers/
│   │   ├── eventController.js   # Event business logic
│   │   └── userController.js    # User business logic
│   ├── models/
│   │   ├── eventModel.js        # Event data access layer
│   │   └── userModel.js         # User data access layer
│   ├── routes/
│   │   ├── eventRoutes.js       # Event API routes
│   │   └── userRoutes.js        # User API routes
│   ├── middleware/
│   │   ├── errorHandler.js      # Global error handling
│   │   └── validator.js         # Input validation middleware
│   ├── utils/
│   │   └── sortEvents.js        # Custom sorting algorithm
│   ├── app.js                   # Express app configuration
│   └── server.js                # Server entry point
├── database/
│   ├── schema.sql               # Database schema
│   └── seed.sql                 # Sample data
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js
- **express-validator** - Input validation
- **dotenv** - Environment variable management

---

## 🐛 Error Handling

The API provides meaningful error messages:

- **Validation Errors**: Field-specific messages
- **Database Errors**: Human-readable constraint violations
- **Business Logic Errors**: Clear explanations

Example:

```json
{
  "success": false,
  "error": {
    "message": "Event is full. Registration capacity has been reached"
  }
}
```

**Made with ❤️ using Node.js, Express, and PostgreSQL**