# SkillSphere - Full Stack Learning Tracker

A complete full-stack application for tracking courses, managing certificates, and visualizing learning progress.

## 🎯 Project Overview

**SkillSphere** helps users track their learning journey across multiple platforms (Coursera, Udemy, AWS Academy, etc.), upload certificates, set goals, and visualize progress with analytics.

## 📁 Project Structure

```
DevOps_Project/
├── frontend/           # Next.js 14 + TypeScript + Tailwind CSS
│   ├── app/           # Pages and routes
│   ├── components/    # React components
│   ├── contexts/      # Auth & Theme contexts
│   ├── lib/api/       # API client
│   └── ...
├── backend/           # Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── ...
│   ├── prisma/       # Database schema
│   └── ...
└── README.md         # This file
```

## 🚀 Features

### Frontend
- ✅ Landing page with hero section
- ✅ Authentication (Login/Register)
- ✅ Dashboard with course management
- ✅ Add/Edit courses with certificate upload
- ✅ Analytics with charts (Recharts)
- ✅ User profile management
- ✅ Light/Dark mode toggle
- ✅ Fully responsive design

### Backend
- ✅ RESTful API with Express
- ✅ PostgreSQL database with Prisma ORM
- ✅ JWT authentication
- ✅ File upload (local/S3)
- ✅ Analytics endpoints
- ✅ Notifications system
- ✅ Swagger API documentation
- ✅ Security (Helmet, CORS, Zod validation)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Charts**: Recharts
- **HTTP Client**: Axios
- **State**: React Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd DevOps_Project
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your database credentials
DATABASE_URL=""
JWT_SECRET="your-secret-key"
PORT=5000
CORS_ORIGIN="http://localhost:3000"

# Set up database
npm run prisma:generate
npm run prisma:migrate

# Start backend server
npm run dev
```

Backend will run at: **http://localhost:5000**
API Docs at: **http://localhost:5000/api-docs**

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install --legacy-peer-deps

# Configure environment variables
# Edit .env.local file
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Start frontend dev server
npm run dev
```

Frontend will run at: **http://localhost:3000**

## 🎮 Usage

1. **Open the application**: http://localhost:3000
2. **Register** a new account or login
3. **Add courses** from the dashboard
4. **Upload certificates** when creating/editing courses
5. **View analytics** to see your progress
6. **Manage profile** with avatar and bio

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user

### Courses
- `GET /api/v1/courses` - Get all courses
- `POST /api/v1/courses` - Create course
- `PUT /api/v1/courses/:id` - Update course
- `DELETE /api/v1/courses/:id` - Delete course

### Analytics
- `GET /api/v1/analytics` - Get analytics data
- `GET /api/v1/analytics/dashboard` - Dashboard stats

### User
- `GET /api/v1/user/profile` - Get profile
- `PUT /api/v1/user/profile` - Update profile

### Notifications
- `GET /api/v1/notifications` - Get notifications

**Full API Documentation**: http://localhost:5000/api-docs

## 📊 Database Schema

```sql
User
├── id (UUID)
├── email (unique)
├── password (hashed)
├── name
├── bio
└── avatarUrl

Course
├── id (UUID)
├── userId (FK)
├── title
├── platform
├── category
├── startDate
├── endDate
├── progress (0-100)
├── status (enum)
└── hoursLearned

Certificate
├── id (UUID)
├── courseId (FK)
├── fileUrl
├── fileName
└── fileType

Notification
├── id (UUID)
├── userId (FK)
├── message
├── type
└── isRead
```

## 🔐 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/skillsphere
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
UPLOAD_MODE=local
UPLOAD_DIR=./uploads
```

## 🧪 Testing the Application

### 1. Register a User
- Go to http://localhost:3000
- Click "Start Tracking" or "Sign Up"
- Fill in the registration form

### 2. Add a Course
- Login to dashboard
- Click "Add Course"
- Fill in course details
- Upload certificate (optional)

### 3. View Analytics
- Navigate to Analytics page
- See charts and statistics

### 4. Test API with Swagger
- Visit http://localhost:5000/api-docs
- Test endpoints interactively

## 📦 Production Deployment

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

MIT License

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Shadcn for beautiful UI components
- Prisma for the excellent ORM
- All open-source contributors

---

**Status**: ✅ **Production Ready**

Both frontend and backend are complete and fully functional!
