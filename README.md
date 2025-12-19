# E-commerce REST API

A fully-featured e-commerce REST API built with Express.js, TypeScript, Prisma ORM, and MySQL. Features JWT-based authentication with access and refresh tokens.

## Features

- 🔐 **JWT Authentication** - Access & Refresh token system
- 👤 **User Management** - Registration, login, profile management
- 📦 **Product Management** - CRUD operations with categories
- 🛒 **Shopping Cart** - Add, update, remove items
- 📋 **Order Management** - Create orders, track status
- ⭐ **Reviews** - Product review system
- 🏷️ **Categories** - Product categorization
- 📍 **Addresses** - User address management
- ✅ **Validation** - Zod schema validation
- 🛡️ **Role-based Access** - Admin and User roles

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** MySQL
- **Validation:** Zod
- **Authentication:** JWT (jsonwebtoken)

## Project Structure

```
server/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── config/            # Configuration
│   ├── controllers/       # Route controllers
│   ├── lib/               # Shared libraries (Prisma client)
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   ├── validators/        # Zod validation schemas
│   └── app.ts             # App entry point
├── .env.example           # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+

### Installation

1. Install dependencies:
```bash
cd server
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```env
DATABASE_URL="mysql://root:password@localhost:3306/ecommerce_db"
ACCESS_TOKEN_SECRET=your-super-secret-access-token
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |
| POST | `/api/v1/auth/refresh-token` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout user |
| POST | `/api/v1/auth/change-password` | Change password |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/profile` | Get user profile |
| PATCH | `/api/v1/users/profile` | Update profile |
| GET | `/api/v1/users/addresses` | Get addresses |
| POST | `/api/v1/users/addresses` | Create address |
| PATCH | `/api/v1/users/addresses/:id` | Update address |
| DELETE | `/api/v1/users/addresses/:id` | Delete address |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/categories` | Get all categories |
| GET | `/api/v1/categories/:id` | Get category by ID |
| GET | `/api/v1/categories/slug/:slug` | Get category by slug |
| POST | `/api/v1/categories` | Create category (Admin) |
| PATCH | `/api/v1/categories/:id` | Update category (Admin) |
| DELETE | `/api/v1/categories/:id` | Delete category (Admin) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/products` | Get all products (paginated) |
| GET | `/api/v1/products/:id` | Get product by ID |
| GET | `/api/v1/products/slug/:slug` | Get product by slug |
| GET | `/api/v1/products/:id/reviews` | Get product reviews |
| POST | `/api/v1/products` | Create product (Admin) |
| PATCH | `/api/v1/products/:id` | Update product (Admin) |
| DELETE | `/api/v1/products/:id` | Delete product (Admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/cart` | Get cart |
| POST | `/api/v1/cart/items` | Add item to cart |
| PATCH | `/api/v1/cart/items/:itemId` | Update cart item |
| DELETE | `/api/v1/cart/items/:itemId` | Remove cart item |
| DELETE | `/api/v1/cart` | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/orders` | Get orders |
| GET | `/api/v1/orders/:id` | Get order by ID |
| POST | `/api/v1/orders` | Create order |
| POST | `/api/v1/orders/:id/cancel` | Cancel order |
| PATCH | `/api/v1/orders/:id/status` | Update status (Admin) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/reviews` | Create review |
| PATCH | `/api/v1/reviews/:id` | Update review |
| DELETE | `/api/v1/reviews/:id` | Delete review |

## Authentication Flow

### Access Token
- Short-lived token (15 minutes by default)
- Sent in Authorization header: `Bearer <token>`
- Used to authenticate API requests

### Refresh Token
- Long-lived token (7 days by default)
- Used to obtain new access tokens
- Stored in database for validation

### Token Refresh
```bash
POST /api/v1/auth/refresh-token
{
  "refreshToken": "your-refresh-token"
}
```

## Query Parameters (Products)

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| search | string | Search in name/description |
| categoryId | uuid | Filter by category |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| sortBy | string | Sort field (name, price, createdAt) |
| sortOrder | string | Sort order (asc, desc) |

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:push      # Push schema to database
npm run prisma:studio    # Open Prisma Studio
```

## License

ISC

