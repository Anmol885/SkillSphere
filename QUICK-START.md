# SkillSphere - Quick Start Guide 🚀

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or use AWS RDS)
- Git

### Setup Steps

1. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd DevOps_Project
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install

   # Copy and configure .env
   cp .env.example .env
   # Edit .env with your database credentials

   # Generate Prisma client and run migrations
   npm run prisma:generate
   npm run prisma:migrate

   # Start backend
   npm run dev
   ```
   Backend runs on: http://localhost:5000

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install --legacy-peer-deps

   # Copy and configure .env.local
   cp .env.example .env.local
   # Edit .env.local

   # Start frontend
   npm run dev
   ```
   Frontend runs on: http://localhost:3000

---

## Docker Deployment (Local Testing)

### Prerequisites
- Docker Desktop
- Docker Compose

### Quick Deploy

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env with your settings

# 2. Build and start all services
docker-compose up -d --build

# 3. Wait for services to start (30-60 seconds)

# 4. Access application
# - Application: http://localhost
# - API Docs: http://localhost/api-docs
# - Grafana: http://localhost:3001 (admin/admin)
# - Prometheus: http://localhost:9090
```

### Stop Services
```bash
docker-compose down
```

---

## AWS EC2 Deployment

### Prerequisites
- AWS Account
- SSH key pair
- EC2 instance (Ubuntu 22.04, t3.medium minimum)

### Quick Deploy

1. **Launch EC2 Instance**
   - AMI: Ubuntu 22.04 LTS
   - Instance Type: t3.medium or larger
   - Security Group: Allow ports 22, 80, 443, 8080

2. **Connect to EC2**
   ```bash
   ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
   ```

3. **Clone and Setup**
   ```bash
   git clone <your-repo-url> skillsphere
   cd skillsphere
   chmod +x scripts/setup-ec2.sh
   ./scripts/setup-ec2.sh
   ```

4. **Configure Environment**
   ```bash
   cp .env.example .env
   nano .env
   # Update DATABASE_URL, CORS_ORIGIN, NEXT_PUBLIC_API_URL
   ```

5. **Deploy**
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

6. **Access Application**
   - Application: `http://<EC2-PUBLIC-IP>`
   - Jenkins: `http://<EC2-PUBLIC-IP>:8080`
   - Grafana: `http://<EC2-PUBLIC-IP>:3001`

**For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## Environment Variables

### Required Variables

**Backend (.env):**
```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Optional Variables

```bash
# Grafana
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=your-password

# Docker Hub (for CI/CD)
DOCKER_USERNAME=your-username

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket
```

---

## Useful Commands

### Docker Commands
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Restart service
docker-compose restart backend

# Rebuild and restart
docker-compose up -d --build backend

# Stop all services
docker-compose down

# Clean up
docker system prune -a
```

### Database Commands
```bash
# Generate Prisma client
cd backend && npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

### Monitoring
```bash
# Check container stats
docker stats

# View Prometheus metrics
curl http://localhost:9090/metrics

# Check application health
curl http://localhost/health
```

---

## Default Access Points

| Service | Local | EC2 |
|---------|-------|-----|
| Application | http://localhost:3000 | http://EC2-IP |
| Backend API | http://localhost:5000 | http://EC2-IP/api/v1 |
| API Docs | http://localhost:5000/api-docs | http://EC2-IP/api-docs |
| Grafana | http://localhost:3001 | http://EC2-IP:3001 |
| Prometheus | http://localhost:9090 | http://EC2-IP:9090 |
| Jenkins | - | http://EC2-IP:8080 |

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Connection Failed
```bash
# Check database connectivity
docker-compose exec backend npx prisma db pull

# Verify DATABASE_URL in .env
cat .env | grep DATABASE_URL
```

### Frontend Build Errors
```bash
cd frontend
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run dev
```

### Docker Issues
```bash
# Restart Docker daemon
sudo systemctl restart docker

# Remove all containers and volumes
docker-compose down -v

# Clean everything
docker system prune -a --volumes
```

---

## Testing the Application

1. **Register a new user**
   - Go to http://localhost:3000
   - Click "Sign Up"
   - Fill in details and register

2. **Add a course**
   - Login to dashboard
   - Click "Add Course"
   - Fill in course details
   - Upload certificate (optional)

3. **View analytics**
   - Navigate to Analytics page
   - See charts and progress

4. **Check monitoring**
   - Access Grafana
   - View SkillSphere Overview dashboard

---

## Support

- **Documentation:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues:** Check logs with `docker-compose logs -f`
- **Database:** Use Prisma Studio: `npm run prisma:studio`

---

**Happy Coding! 🎉**
