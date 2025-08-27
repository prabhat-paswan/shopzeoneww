# 🛍️ Shopzeo - Complete Multivendor eCommerce Platform

A comprehensive, production-ready multivendor eCommerce platform built with React.js frontend, Node.js backend, and MySQL database. Features role-based dashboards for Admin, Vendor, Customer, Delivery Man, and Employee with JWT authentication.

![Shopzeo Dashboard](https://img.shields.io/badge/Shopzeo-Dashboard-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.5-38B2AC)

## ✨ Features

### 🎯 Core Features
- **Multi-role System**: Admin, Vendor, Customer, Delivery Man, Employee
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permissions for each user type
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live dashboard updates and notifications

### 📊 Admin Dashboard
- **Business Analytics**: Order statistics, revenue tracking, user growth
- **User Management**: Customer, vendor, and employee management
- **Store Management**: Vendor store approval and monitoring
- **Product Management**: Category, brand, and inventory management
- **Order Management**: Complete order lifecycle tracking
- **Financial Overview**: Commission tracking, wallet management
- **Performance Metrics**: Sales analytics, popular products, top customers

### 🏪 Vendor Features
- **Store Dashboard**: Sales analytics and performance metrics
- **Product Management**: Add, edit, and manage products
- **Order Management**: Process and fulfill orders
- **Inventory Tracking**: Stock management and low stock alerts
- **Commission Tracking**: Revenue and commission analytics

### 🛒 Customer Features
- **Shopping Experience**: Browse products from multiple vendors
- **Order Tracking**: Real-time order status updates
- **Profile Management**: Personal information and preferences
- **Order History**: Complete purchase history

### 🚚 Delivery System
- **Order Assignment**: Automatic and manual order assignment
- **Route Optimization**: Efficient delivery planning
- **Status Updates**: Real-time delivery tracking
- **Performance Metrics**: Delivery success rates and timing

## 🏗️ Architecture

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Beautiful, accessible UI components
- **React Router**: Client-side routing
- **React Query**: Server state management
- **Zustand**: Lightweight state management
- **Recharts**: Beautiful charts and data visualization

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MySQL**: Relational database
- **Sequelize**: Object-Relational Mapping (ORM)
- **JWT**: JSON Web Token authentication
- **bcryptjs**: Password hashing
- **Multer**: File upload handling
- **Sharp**: Image processing
- **Nodemailer**: Email functionality
- **Twilio**: SMS notifications
- **Stripe/PayPal/Razorpay**: Payment gateway integration

### Database Design
- **Users**: Multi-role user management
- **Stores**: Vendor store information
- **Products**: Product catalog with variants
- **Orders**: Complete order lifecycle
- **Wallets**: Financial transaction management
- **Transactions**: Payment and commission tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/shopzeo.git
cd shopzeo
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Environment Setup**
```bash
# Backend
cp backend/env.example backend/.env
# Edit backend/.env with your configuration

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your configuration
```

4. **Database Setup**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE shopzeo_db;
exit

# Run database migrations
npm run setup-db

# Seed initial data (optional)
npm run seed
```

5. **Start Development Servers**
```bash
# Start both frontend and backend
npm run dev

# Or start separately
npm run server    # Backend on port 5000
npm run client    # Frontend on port 3000
```

### Environment Variables

#### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=shopzeo_db
DB_USER=root
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment Gateway Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
PAYPAL_CLIENT_ID=your-paypal-client-id
RAZORPAY_KEY_ID=your-razorpay-key-id
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Shopzeo
```

## 📁 Project Structure

```
shopzeo/
├── backend/                 # Node.js backend
│   ├── config/             # Database and app configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── scripts/            # Database setup and seeding
│   ├── uploads/            # File uploads
│   └── server.js           # Main server file
├── frontend/               # React frontend
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Page layouts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── stores/         # State management
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── index.html          # HTML template
│   └── package.json        # Frontend dependencies
├── package.json            # Root package.json
└── README.md              # This file
```

## 🔧 Development

### Available Scripts

```bash
# Root level
npm run dev              # Start both frontend and backend
npm run server           # Start backend only
npm run client           # Start frontend only
npm run build            # Build frontend for production
npm run install-all      # Install all dependencies
npm run setup-db         # Setup database
npm run seed             # Seed database with sample data

# Backend
cd backend
npm run dev              # Start with nodemon
npm run start            # Start production server
npm run test             # Run tests

# Frontend
cd frontend
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### Code Style

- **Backend**: ESLint with Node.js best practices
- **Frontend**: ESLint with React best practices
- **Database**: Consistent naming conventions
- **Git**: Conventional commit messages

### Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests (when implemented)
cd frontend
npm run test
```

## 🚀 Deployment

### Backend Deployment

1. **Environment Setup**
```bash
# Set production environment variables
NODE_ENV=production
PORT=5000
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
```

2. **Database Migration**
```bash
npm run setup-db
```

3. **Start Production Server**
```bash
npm run start
```

### Frontend Deployment

1. **Build for Production**
```bash
npm run build
```

2. **Deploy to your hosting service**
- Netlify
- Vercel
- AWS S3
- DigitalOcean App Platform

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build individual images
docker build -t shopzeo-backend ./backend
docker build -t shopzeo-frontend ./frontend
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input validation and sanitization
- **CORS Protection**: Configurable Cross-Origin Resource Sharing
- **Helmet**: Security headers for Express.js
- **SQL Injection Protection**: Sequelize ORM with parameterized queries

## 📱 Mobile Responsiveness

- **Mobile-First Design**: Responsive design for all screen sizes
- **Touch-Friendly Interface**: Optimized for mobile devices
- **Progressive Web App**: PWA capabilities for mobile users
- **Offline Support**: Service worker for offline functionality

## 🌐 Internationalization

- **Multi-language Support**: Ready for multiple languages
- **Multi-currency Support**: Support for different currencies
- **Localization**: Date, time, and number formatting
- **RTL Support**: Right-to-left language support

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Admin Endpoints
- `GET /api/analytics/dashboard-overview` - Dashboard statistics
- `GET /api/analytics/order-statistics` - Order analytics
- `GET /api/analytics/earning-statistics` - Revenue analytics
- `GET /api/users` - User management
- `GET /api/stores` - Store management
- `GET /api/products` - Product management
- `GET /api/orders` - Order management

### Vendor Endpoints
- `GET /api/vendor/dashboard` - Vendor dashboard
- `GET /api/vendor/products` - Vendor products
- `GET /api/vendor/orders` - Vendor orders
- `PUT /api/vendor/store` - Update store information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass
- Follow conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing frontend framework
- **Node.js Team**: For the powerful backend runtime
- **Tailwind CSS**: For the utility-first CSS framework
- **shadcn/ui**: For the beautiful UI components
- **Sequelize**: For the excellent ORM
- **Express.js**: For the web framework

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/shopzeo/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/shopzeo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/shopzeo/discussions)
- **Email**: support@shopzeo.com

## 🚀 Roadmap

### Phase 1 (Current)
- ✅ Core platform development
- ✅ Admin dashboard
- ✅ Basic vendor functionality
- ✅ Customer features
- ✅ Authentication system

### Phase 2 (Next)
- 🔄 Advanced analytics
- 🔄 Mobile app development
- 🔄 Advanced payment gateways
- 🔄 Multi-language support
- 🔄 Advanced inventory management

### Phase 3 (Future)
- 📋 AI-powered recommendations
- 📋 Advanced marketing tools
- 📋 Marketplace features
- 📋 Advanced shipping options
- 📋 Enterprise features

---

**Built with ❤️ by the Shopzeo Team**

*Empowering businesses with the best eCommerce experience*
