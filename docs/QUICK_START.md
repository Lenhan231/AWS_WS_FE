# Quick Start Guide - Easy Body

Get the Easy Body project running locally in minutes!

---

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Java** 21+
- **PostgreSQL** 15+ with PostGIS extension
- **AWS Account** (for Cognito and S3)
- **Git**

---

## 🚀 Quick Setup (5 minutes)

### 1. Clone Repository
```bash
git clone <repository-url>
cd easy-body
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env.local

# Edit .env.local with your AWS credentials
# NEXT_PUBLIC_AWS_REGION=us-east-1
# NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-pool-id
# NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 3. Backend Setup
```bash
cd backend

# Configure application.properties
# spring.datasource.url=jdbc:postgresql://localhost:5432/easybody
# spring.datasource.username=postgres
# spring.datasource.password=your-password

# Run Spring Boot
./mvnw spring-boot:run
```

Backend API will be available at `http://localhost:8080`
Swagger UI at `http://localhost:8080/swagger-ui/index.html`

### 4. Database Setup
```bash
# Create database
createdb easybody

# Enable PostGIS
psql easybody -c "CREATE EXTENSION postgis;"

# Flyway will auto-migrate on first run
```

---

## ✅ Verify Installation

### Check Frontend
1. Open `http://localhost:3000`
2. You should see the landing page
3. Try searching for gyms/trainers

### Check Backend
1. Open `http://localhost:8080/swagger-ui/index.html`
2. You should see API documentation
3. Try the health check endpoint

### Check Database
```bash
psql easybody -c "SELECT PostGIS_Version();"
```

---

## 🎯 Next Steps

1. **Register a User**
   - Go to `/auth/register`
   - Create account with AWS Cognito
   - Verify email

2. **Create Test Data**
   - Register as GYM_STAFF
   - Create a gym
   - Create offers

3. **Test Search**
   - Allow location access
   - Search for nearby gyms
   - Filter by price/rating

---

## 🐛 Common Issues

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### Backend connection error
- Check PostgreSQL is running: `pg_isready`
- Check database exists: `psql -l | grep easybody`
- Check application.properties credentials

### AWS Cognito errors
- Verify User Pool ID and Client ID
- Check region matches
- Ensure Cognito is configured correctly

---

## 📚 Learn More

- [Frontend Guide](./frontend/FRONTEND_GUIDE.md)
- [API Documentation](./api/API_DOCUMENTATION.md)
- [Backend Setup](./backend/BACKEND_PLAN.md)
- [Deployment Guide](./deployment/RAILWAY_DEPLOY.md)

---

## 🆘 Need Help?

1. Check [Documentation Index](./README.md)
2. Review [Project Overview](./PROJECT_OVERVIEW.md)
3. Check Swagger UI for API details
4. Review error logs in console

---

**Happy Coding! 🚀**
