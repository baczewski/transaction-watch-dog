# Transaction Watch-Dog

A real-time Ethereum transaction monitoring system with dynamic rule-based filtering and comprehensive API management.

## Overview

Transaction Watch-Dog is a production-ready application that monitors Ethereum blockchain transactions in real-time, allowing you to create dynamic filtering rules and persist matching transactions into the database.

### Features

- **Real-time Transaction Monitoring**: Monitor Ethereum blockchain for specific transactions
- **Dynamic Rule Management**: Create, update, and manage filtering rules via REST API
- **Hot-Reloading**: Instant rule updates without service restart
- **Rate Limiting**: Built-in protection against API abuse
- **Clean Architecture**: Well-structured, maintainable codebase
- **Redis Caching**: High-performance rule caching
- **PostgreSQL**: Reliable data persistence
- **Comprehensive API**: Full CRUD operations for rules and transactions

## Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── application/           # Business logic and use cases
│   ├── use-cases/        # Application use cases
│   ├── validation/       # Input validation schemas
│   └── services/         # Application services
├── infrastructure/       # External concerns
│   ├── database/         # Database models and migrations
│   ├── repository/       # Data access layer
│   ├── services/         # External services (Redis, etc.)
│   └── container/        # Dependency injection
└── interfaces/           # External interfaces
    └── http/            # HTTP API layer
```

## Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **Redis** (v6 or higher)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/baczewski/transaction-watch-dog.git
cd transaction-watch-dog
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=transaction_watchdog
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_URL=redis://localhost:6379

# Blockchain (Infura)
INFURA_PROJECT_ID=your_infura_project_id

# CORS
CORS_ORIGIN=*
```

### 4. Database Setup

#### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE transaction_watchdog;
```

### 5. Run Redis in Container
```bash
# Pull and run Redis container
docker run -d \
  --name redis-transaction-watchdog \
  -p 6379:6379 \
  redis:7-alpine
```

### 6. Start the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

### 7. Verify Installation

The application will be available at:
- **API**: http://localhost:3000/api

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
Currently, the API uses IP-based rate limiting.

### Rate Limiting
- **General API**: 20 requests per 10 seconds per IP
- **Block Duration**: 60 seconds when limit exceeded

### Endpoints

#### Rules Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/rules` | Get all rules with pagination |
| `POST` | `/rules` | Create a new rule |
| `GET` | `/rules/{id}` | Get rule by ID |
| `PATCH` | `/rules/{id}` | Update rule |
| `POST` | `/rules/{id}/deactivate` | Deactivate rule |

#### Transaction Monitoring

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/transactions/rule/{ruleId}` | Get transactions by rule ID |

### Example Requests

#### Create a Rule
```bash
curl -X POST "http://localhost:3000/api/rules" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "High Value ETH Transfers",
    "blockConfirmationDelay": 12,
    "conditions": [{
          "field": "value",
          "operator": "gte",
          "value": "100000000000000000000"
    }],
    "metadata": {
      "description": "Monitor transfers above 100 ETH",
      "priority": "high"
    }
  }'
```

#### Get All Rules
```bash
curl -X GET "http://localhost:3000/api/rules"
```

#### Get Transactions by Rule
```bash
curl -X GET "http://localhost:3000/api/transactions/rule/{ruleId}"
```

## Configuration

### Error Handling

The API returns standardized error responses:

```json
{
  "error": "Validation Error",
  "message": "Invalid rule conditions",
  "details": [...]
}
```

Common HTTP Status Codes:
- `200` - Success
- `400` - Bad Request (Validation Error)
- `404` - Not Found
- `409` - Conflict (Rule already exists)
- `429` - Too Many Requests (Rate Limited)
- `500` - Internal Server Error

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Server port | `3000` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `transaction_watchdog` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | - |
| `REDIS_URL` | Redis URL | `redis://localhost:6379` |
| `INFURA_PROJECT_ID` | Infura project ID | - |

### Rule Conditions

Rules support various conditions for transaction matching:

#### Supported Fields
- `to` - Recipient address
- `from` - Sender address
- `value` - Transaction value
- `blockNumber` - Block number
- `hash` - Transaction hash

#### Supported Operators
- `eq` - Equal
- `ne` - Not equal
- `gt` - Greater than
- `gte` - Greater than or equal
- `lt` - Less than
- `lte` - Less than or equal
- `in` - Inclusion
- `nin` - Exclusion
- `contains` - Contains substring

## 🛠️ Development
```

### Available Scripts

```bash
# Development
npm run dev              # Start with nodemon
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
```

## Security

### Rate Limiting
- Built-in rate limiting with Redis
- IP-based protection

### Input Validation
- Comprehensive input validation with Yup
- SQL injection protection
- XSS protection

### CORS
- Configurable CORS settings

### Code Style
- Follow ESLint configuration
- Use Prettier for formatting
- Follow Clean Architecture principles

## Future Improvements

This project is actively developed with several planned enhancements to improve functionality, performance, and maintainability.

**Priority Roadmap:**

1. Fill missing swagger documentation
2. Delayed block processing
3. Comprehensive tests
4. Docker containerization
5. Monitoring

# Author

Martin Marinov  
[GitHub: @baczewski](https://github.com/baczewski)  
[LinkedIn: Martin Marinov](https://www.linkedin.com/in/martin-marinov-a52237250/)
