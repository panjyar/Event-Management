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