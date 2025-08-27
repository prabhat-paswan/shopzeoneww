# 🚀 Shopzeo Multivendor eCommerce Platform - Backend

A complete, production-ready backend API for a multivendor eCommerce platform built with Node.js, Express, Sequelize, and MySQL.

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** (Admin, Vendor, Customer, Delivery)
- **Password encryption** with bcrypt
- **Email verification** system
- **Password reset** functionality
- **Rate limiting** and security middleware

### 🏪 Store Management
- **Vendor store creation** with automatic user account generation
- **Store verification** and approval system
- **GST management** for Indian businesses
- **Store analytics** and performance tracking
- **Commission rate** management

### 📦 Product Management
- **Bulk CSV upload** support for up to 50,000 products
- **Multiple image support** (up to 10 images per product)
- **Video support** for product demonstrations
- **GST percentage** calculation
- **HSN code** management
- **Custom attributes** support

### 🗂️ Category Management
- **Hierarchical categories** with parent-child relationships
- **SEO optimization** with meta tags
- **Home category** designation
- **Sort order** management

### 🔒 Security Features
- **Helmet.js** for security headers
- **CORS protection** with configurable origins
- **Input validation** with express-validator
- **SQL injection protection** with Sequelize
- **XSS protection** middleware
- **CSRF protection** support

## 🛠️ Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **ORM**: Sequelize 6
- **Database**: MySQL 8.0+
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **File Upload**: Multer
- **Security**: Helmet, CORS
- **Logging**: Morgan, Winston
- **Testing**: Jest

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **MySQL** 8.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/shopzeo/backend.git
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:

```bash
# Copy the example file
cp .env.example .env

# Edit with your configuration
nano .env
```

**Required Environment Variables:**
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=shopzeo_db
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Server
PORT=5000
NODE_ENV=development
```

### 4. Database Setup
```bash
# Run the database setup script
npm run setup-db
```

This will:
- Create the database
- Create all tables with proper relationships
- Create an admin user (admin@shopzeo.com / admin123)
- Create sample categories

### 5. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
POST   /api/auth/logout            # User logout
GET    /api/auth/profile           # Get user profile
PUT    /api/auth/profile           # Update user profile
PUT    /api/auth/change-password  # Change password
POST   /api/auth/forgot-password  # Forgot password
POST   /api/auth/reset-password   # Reset password
```

### Store Management Endpoints
```
POST   /api/stores                 # Create store (Admin only)
GET    /api/stores                 # Get all stores (Admin only)
GET    /api/stores/:id             # Get store by ID (Admin only)
PUT    /api/stores/:id             # Update store (Admin only)
DELETE /api/stores/:id             # Delete store (Admin only)
PATCH  /api/stores/:id/toggle-status      # Toggle store status
PATCH  /api/stores/:id/toggle-verification # Toggle verification
PATCH  /api/stores/:id/update-password    # Update vendor password
GET    /api/stores/export/csv      # Export stores to CSV
```

### Category Management Endpoints
```
POST   /api/categories             # Create category
GET    /api/categories             # Get all categories
GET    /api/categories/:id         # Get category by ID
PUT    /api/categories/:id         # Update category
DELETE /api/categories/:id         # Delete category
```

### Product Management Endpoints
```
POST   /api/products               # Create product
GET    /api/products               # Get all products
GET    /api/products/:id           # Get product by ID
PUT    /api/products/:id           # Update product
DELETE /api/products/:id           # Delete product
POST   /api/products/bulk-upload   # Bulk upload products
```

## 🗄️ Database Schema

### Users Table
- **id**: Primary key
- **first_name, last_name**: User names
- **email**: Unique email (used as username)
- **password**: Encrypted password
- **role**: User role (admin, vendor, customer, delivery)
- **is_active**: Account status
- **is_verified**: Verification status

### Stores Table
- **id**: Primary key
- **name**: Store name
- **slug**: URL-friendly store identifier
- **owner_id**: Foreign key to users table
- **gst_number**: GST registration number
- **gst_percentage**: Default GST rate
- **is_active**: Store status
- **is_verified**: Verification status

### Products Table
- **id**: Primary key
- **product_code**: Unique product identifier
- **store_id**: Foreign key to stores table
- **category_id**: Foreign key to categories table
- **name, description**: Product details
- **selling_price, mrp, cost_price**: Pricing
- **image_1 to image_10**: Multiple product images
- **video_1, video_2**: Product videos
- **gst_percentage**: Product-specific GST rate

## 🔐 Authentication Flow

### 1. Store Creation (Admin Only)
```
Admin creates store → System creates vendor user account → Vendor can login
```

### 2. Vendor Login
```
Vendor uses email (username) + password → JWT token generated → Access store dashboard
```

### 3. Password Management
```
Admin can update vendor passwords → Vendor uses new password → Secure access maintained
```

## 🚀 Production Deployment

### 1. Environment Setup
```bash
NODE_ENV=production
PORT=5000
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
JWT_SECRET=your_production_jwt_secret
```

### 2. Database Migration
```bash
# Run migrations
npm run migrate

# Seed data
npm run seed:run
```

### 3. Process Management
```bash
# Using PM2
npm install -g pm2
pm2 start ecosystem.config.js

# Using Docker
docker-compose up -d
```

### 4. Security Considerations
- Use strong JWT secrets
- Enable HTTPS in production
- Configure proper CORS origins
- Set up rate limiting
- Enable logging and monitoring
- Use environment-specific configurations

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📝 Development

### Code Style
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Database Migrations
```bash
# Create migration
npx sequelize-cli migration:generate --name migration_name

# Run migrations
npm run migrate

# Undo migrations
npm run migrate:undo
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Complete authentication system
- Store management
- Product management
- Category management
- Security middleware
- Production-ready configuration

---

**Built with ❤️ by the Shopzeo Team**
