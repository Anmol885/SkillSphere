# Deploy SkillSphere to Your Existing EC2 Instance 🚀

Since you already have EC2 with Jenkins and Docker configured, here's the streamlined deployment process.

## ✅ Pre-requisites (You Already Have)
- [x] EC2 instance running
- [x] Jenkins installed and configured
- [x] Docker & Docker Compose installed
- [x] Docker Hub account connected

## 🚀 Quick Deployment Steps

### Step 1: Push Your Code to Git Repository

First, initialize Git and push your code (if not already done):

```bash
# In your local project directory (C:\Users\avika\OneDrive\Desktop\DevOps_Project)

# Initialize Git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: SkillSphere with DevOps setup"

# Add your remote repository (create one on GitHub/GitLab first)
git remote add origin <your-git-repo-url>

# Push to repository
git push -u origin main
```

### Step 2: Connect to Your EC2 Instance

```bash
ssh -i your-key.pem ubuntu@<YOUR-EC2-IP>
```

### Step 3: Clone Repository on EC2

```bash
# Navigate to a working directory
cd /home/ubuntu

# Clone your repository
git clone <your-git-repo-url> skillsphere

# Navigate into the project
cd skillsphere
```

### Step 4: Configure Environment Variables

```bash
# Create .env file from template
cp .env.example .env

# Edit the .env file
nano .env
```

**Update these critical values in `.env`:**

```bash
# Your existing RDS database
DATABASE_URL="postgresql://postgres:anmol0905@skillsphere-db.cbk22084ghpg.eu-central-1.rds.amazonaws.com:5432/skillsphere?schema=public"

# Generate a new JWT secret (run this command to generate)
# openssl rand -base64 32
JWT_SECRET="<paste-generated-secret-here>"

# Your EC2 public IP or domain
CORS_ORIGIN="http://<YOUR-EC2-PUBLIC-IP>"
NEXT_PUBLIC_API_URL="http://<YOUR-EC2-PUBLIC-IP>/api/v1"

# Grafana admin password (change from default!)
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD="YourSecurePassword123"

# Your Docker Hub username (for Jenkins)
DOCKER_USERNAME=<your-dockerhub-username>
EC2_HOST=<YOUR-EC2-PUBLIC-IP>
```

Save and exit (Ctrl+X, Y, Enter)

### Step 5: Make Scripts Executable

```bash
chmod +x scripts/*.sh
```

### Step 6: Deploy the Application

```bash
# Run the deployment script
./scripts/deploy.sh
```

This will:
- Load environment variables
- Build Docker images
- Start all services (frontend, backend, nginx, prometheus, grafana)
- Run health checks

**Wait 2-3 minutes for all services to start up.**

### Step 7: Verify Deployment

```bash
# Check all containers are running
docker-compose ps

# Should show all these containers as "Up":
# - skillsphere-frontend
# - skillsphere-backend
# - skillsphere-nginx
# - skillsphere-prometheus
# - skillsphere-grafana
# - skillsphere-node-exporter
# - skillsphere-cadvisor

# Test the endpoints
curl http://localhost/health              # Nginx
curl http://localhost:5000/health         # Backend
curl http://localhost:3000                # Frontend
```

### Step 8: Update EC2 Security Group

Make sure your EC2 security group allows these ports:

| Port | Service | Source |
|------|---------|--------|
| 22 | SSH | Your IP |
| 80 | HTTP | 0.0.0.0/0 |
| 443 | HTTPS | 0.0.0.0/0 |
| 8080 | Jenkins | Your IP (already configured) |
| 3001 | Grafana | Your IP (optional) |
| 9090 | Prometheus | Your IP (optional) |

### Step 9: Access Your Application

- **Application:** `http://<YOUR-EC2-IP>`
- **API Documentation:** `http://<YOUR-EC2-IP>/api-docs`
- **Grafana Dashboard:** `http://<YOUR-EC2-IP>:3001` (admin / your-password)
- **Prometheus:** `http://<YOUR-EC2-IP>:9090`
- **Jenkins:** `http://<YOUR-EC2-IP>:8080` (already configured)

### Step 10: Configure Jenkins Pipeline (Optional - for CI/CD)

1. **Access Jenkins:** `http://<YOUR-EC2-IP>:8080`

2. **Create New Pipeline:**
   - Click "New Item"
   - Name: `skillsphere-deploy`
   - Type: Pipeline
   - Click OK

3. **Configure Pipeline:**
   - **Pipeline Definition:** Pipeline script from SCM
   - **SCM:** Git
   - **Repository URL:** `<your-git-repo-url>`
   - **Branch:** `*/main`
   - **Script Path:** `Jenkinsfile`
   - **Save**

4. **Add Environment Variables:**
   - Configure → Environment Variables
   - Add: `EC2_HOST = <YOUR-EC2-IP>`

5. **Verify Jenkins Credentials:**
   Since you already have Docker Hub configured, just verify these exist:
   - Manage Jenkins → Credentials
   - Should have: `dockerhub-credentials`, `dockerhub-username`

6. **Test Pipeline:**
   - Click "Build Now"
   - Monitor the build

---

## 🔧 Quick Management Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Update Application (After Code Changes)
```bash
cd /home/ubuntu/skillsphere

# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Or use the deploy script
./scripts/deploy.sh
```

### Stop Services
```bash
docker-compose down
```

### Check Resource Usage
```bash
# Container stats
docker stats

# Disk usage
df -h

# Memory
free -h
```

---

## 🔥 Troubleshooting

### Issue: Port already in use (80, 3000, 5000)

Check if something is already running:
```bash
sudo lsof -i :80
sudo lsof -i :3000
sudo lsof -i :5000

# Stop conflicting service
sudo kill -9 <PID>
```

### Issue: Database connection failed

```bash
# Test database connectivity
docker-compose exec backend npx prisma db pull

# Check if DATABASE_URL is correct
cat .env | grep DATABASE_URL

# Test from EC2 to RDS
psql "postgresql://postgres:anmol0905@skillsphere-db.cbk22084ghpg.eu-central-1.rds.amazonaws.com:5432/skillsphere"
```

### Issue: Docker build fails

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check Docker disk space
docker system df
```

### Issue: Services keep restarting

```bash
# Check logs for errors
docker-compose logs backend
docker-compose logs frontend

# Common issues:
# - Wrong DATABASE_URL
# - Missing environment variables
# - Port conflicts
```

---

## 📊 Monitoring Setup

### Access Grafana
1. Go to: `http://<YOUR-EC2-IP>:3001`
2. Login: `admin` / `<your-password-from-.env>`
3. Navigate to: Dashboards → SkillSphere Overview

The dashboard shows:
- CPU Usage
- Memory Usage
- Network Traffic
- Container Resource Usage

### Access Prometheus
1. Go to: `http://<YOUR-EC2-IP>:9090`
2. Check Targets: Status → Targets (all should be "UP")

---

## 🔄 Setting Up Automated Backups

```bash
# Test backup script
./scripts/backup.sh

# Setup daily backups (3 AM)
crontab -e

# Add this line:
0 3 * * * /home/ubuntu/skillsphere/scripts/backup.sh
```

Backups will be stored in: `/home/ubuntu/backups/`

---

## 🎯 Testing Your Deployment

### 1. Test Frontend
Visit: `http://<YOUR-EC2-IP>`
- Should see SkillSphere landing page
- Click "Sign Up" and register

### 2. Test Backend API
Visit: `http://<YOUR-EC2-IP>/api-docs`
- Should see Swagger API documentation
- Try the `/api/v1/auth/login` endpoint

### 3. Test Full Flow
1. Register a new user
2. Login
3. Add a course with certificate
4. View analytics
5. Check profile

### 4. Test Monitoring
1. Access Grafana: `http://<YOUR-EC2-IP>:3001`
2. View SkillSphere Overview dashboard
3. Verify metrics are being collected

---

## 📝 Important Notes

### Environment Variables Location
- **Main `.env`:** `/home/ubuntu/skillsphere/.env`
- **Backend `.env`:** Automatically loaded from main `.env`
- **Frontend `.env`:** Automatically loaded from main `.env`

### Data Persistence
Your data is stored in Docker volumes:
- **Uploads:** `backend-uploads` volume → mapped to `/app/uploads`
- **Grafana data:** `grafana-data` volume
- **Prometheus data:** `prometheus-data` volume

To view volumes:
```bash
docker volume ls
docker volume inspect backend-uploads
```

### Nginx Configuration
If you need to customize Nginx:
```bash
nano /home/ubuntu/skillsphere/nginx/conf.d/skillsphere.conf

# After changes, restart nginx
docker-compose restart nginx
```

---

## 🚀 Quick Reference

**Your EC2 Setup:**
```
EC2 Instance: <YOUR-EC2-IP>
├─ Jenkins:     :8080 (already configured)
├─ Application: :80   (new - Nginx)
├─ Frontend:    :3000 (new - internal)
├─ Backend:     :5000 (new - internal)
├─ Grafana:     :3001 (new)
└─ Prometheus:  :9090 (new)

Database: AWS RDS (external)
```

**Essential Commands:**
```bash
cd /home/ubuntu/skillsphere

# Deploy
./scripts/deploy.sh

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Stop
docker-compose down

# Status
docker-compose ps

# Update code
git pull && docker-compose up -d --build
```

---

## ✅ Success Checklist

After deployment, verify:

- [ ] All 7+ containers running: `docker-compose ps`
- [ ] Application accessible: `http://<EC2-IP>`
- [ ] Backend healthy: `http://<EC2-IP>/api/v1/health`
- [ ] API docs work: `http://<EC2-IP>/api-docs`
- [ ] User registration works
- [ ] User login works
- [ ] Course CRUD operations work
- [ ] Grafana accessible: `http://<EC2-IP>:3001`
- [ ] Prometheus showing metrics
- [ ] Jenkins can access Git repo

---

## 🔐 Security Recommendations

Since this is on an existing EC2, ensure:

1. **Update Security Group:**
   - Port 3001 (Grafana) - Your IP only
   - Port 9090 (Prometheus) - Your IP only
   - Port 8080 (Jenkins) - Your IP only
   - Port 80 (HTTP) - Public
   - Port 22 (SSH) - Your IP only

2. **Change Default Passwords:**
   - Grafana admin password (in `.env`)
   - Jenkins admin password (already done)

3. **Enable UFW Firewall (if not already):**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 8080/tcp
   sudo ufw --force enable
   ```

---

## 🎉 You're Done!

Your SkillSphere application should now be running on your existing EC2 instance!

**Access your application at:** `http://<YOUR-EC2-IP>`

**Need help?** Check logs: `docker-compose logs -f`

**Update application:** `git pull && ./scripts/deploy.sh`
