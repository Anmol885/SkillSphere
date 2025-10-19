# SkillSphere Backend

RESTful API backend for SkillSphere - A micro-learning and certification tracker platform.

## Features

- **Authentication**: JWT-based auth with register, login, and Google OAuth placeholder
- **Course Management**: Full CRUD operations for courses
- **Certificate Upload**: File upload support (local storage or AWS S3)
- **Analytics**: Dashboard stats, monthly progress, category distribution
- **Notifications**: Automatic deadline reminders for upcoming courses
- **User Profile**: Profile management with avatar upload
- **Swagger Documentation**: Interactive API documentation
- **Security**: Helmet, CORS, input validation with Zod
- **Database**: PostgreSQL with Prisma ORM

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **File Upload**: Multer
- **Security**: Helmet, CORS, bcryptjs
- **Documentation**: Swagger/OpenAPI

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma client
│   │   └── env.ts             # Environment config
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── courses.controller.ts
│   │   ├── analytics.controller.ts
│   │   ├── user.controller.ts
│   │   └── notifications.controller.ts
│   ├── middleware/
│   │   ├── auth.ts            # JWT authentication
│   │   ├── errorHandler.ts   # Error handling
│   │   └── upload.ts          # File upload
│   ├── routes/                # API routes
│   ├── utils/                 # Utilities
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   └── validation.ts
│   ├── app.ts                 # Express app
│   └── server.ts              # Server entry point
├── uploads/                   # Uploaded files
├── .env                       # Environment variables
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/skillsphere?schema=public"
PORT=5000
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

4. Set up the database:
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view/edit data
npm run prisma:studio
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/google` - Google OAuth (placeholder)
- `POST /api/v1/auth/logout` - Logout user

### Courses
- `GET /api/v1/courses` - Get all courses
- `GET /api/v1/courses/:id` - Get course by ID
- `POST /api/v1/courses` - Create new course
- `PUT /api/v1/courses/:id` - Update course
- `DELETE /api/v1/courses/:id` - Delete course
- `PATCH /api/v1/courses/:id/complete` - Mark course as completed

### Analytics
- `GET /api/v1/analytics` - Get full analytics data
- `GET /api/v1/analytics/dashboard` - Get dashboard statistics

### User Profile
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile

### Notifications
- `GET /api/v1/notifications` - Get notifications
- `PATCH /api/v1/notifications/:id/read` - Mark notification as read

## API Documentation

Interactive Swagger documentation is available at:
```
http://localhost:5000/api-docs
```

## Database Schema

### Models

**User**
- id (UUID)
- email (unique)
- password (hashed)
- name
- bio (optional)
- avatarUrl (optional)
- googleId (optional)
- courses (relation)
- notifications (relation)

**Course**
- id (UUID)
- userId
- title
- platform
- category
- startDate
- endDate
- progress (0-100)
- status (NOT_STARTED | IN_PROGRESS | COMPLETED)
- hoursLearned
- certificates (relation)

**Certificate**
- id (UUID)
- courseId
- fileUrl
- fileName
- fileType
- uploadedAt

**Notification**
- id (UUID)
- userId
- message
- type
- isRead
- createdAt

## Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm start             # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | - |
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRES_IN | Token expiration | 7d |
| GOOGLE_CLIENT_ID | Google OAuth client ID | - |
| GOOGLE_CLIENT_SECRET | Google OAuth secret | - |
| UPLOAD_MODE | Upload mode (local/s3) | local |
| UPLOAD_DIR | Upload directory | ./uploads |
| AWS_ACCESS_KEY_ID | AWS access key | - |
| AWS_SECRET_ACCESS_KEY | AWS secret key | - |
| AWS_REGION | AWS region | us-east-1 |
| AWS_S3_BUCKET | S3 bucket name | - |
| CORS_ORIGIN | CORS allowed origin | http://localhost:3000 |

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Zod schemas for all inputs
- **Helmet**: Security headers
- **CORS**: Configurable cross-origin requests
- **Error Handling**: Centralized error handling
- **File Upload Validation**: Type and size limits

## File Upload

Files are uploaded to:
- **Local**: `./uploads` directory (development)
- **AWS S3**: Configure S3 credentials in `.env` (production)

Supported file types:
- Images: JPEG, JPG, PNG
- Documents: PDF
- Max size: 10MB

## Error Handling

All errors return JSON in the format:
```json
{
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request / Validation Error
- 401: Unauthorized
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## Testing Database Connection

```bash
# Test database connection
npx prisma db push

# View database in browser
npx prisma studio
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables

3. Run migrations:
```bash
npx prisma migrate deploy
```

4. Start the server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
