# SkillSphere - Quick Deploy to Your Existing EC2 ⚡

## Prerequisites (You Already Have ✅)
- EC2 instance running
- Jenkins configured
- Docker & Docker Compose installed
- Docker Hub account connected

---

## 5-Minute Deployment

### 1️⃣ Push to Git (Local Machine)
```bash
cd C:\Users\avika\OneDrive\Desktop\DevOps_Project

git init
git add .
git commit -m "Initial commit: SkillSphere"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2️⃣ Clone on EC2
```bash
ssh -i your-key.pem ubuntu@<YOUR-EC2-IP>

cd /home/ubuntu
git clone <your-github-repo-url> skillsphere
cd skillsphere
```

### 3️⃣ Configure Environment
```bash
cp .env.example .env
nano .env
```

**Update these 4 critical values:**
```bash
DATABASE_URL="postgresql://postgres:anmol0905@skillsphere-db.cbk22084ghpg.eu-central-1.rds.amazonaws.com:5432/skillsphere?schema=public"
JWT_SECRET="$(openssl rand -base64 32)"  # Generate and paste
CORS_ORIGIN="http://<YOUR-EC2-IP>"
NEXT_PUBLIC_API_URL="http://<YOUR-EC2-IP>/api/v1"
```

### 4️⃣ Deploy
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 5️⃣ Verify
```bash
docker-compose ps    # All should be "Up"
```

---

## 🌐 Access Your App

| Service | URL |
|---------|-----|
| **Application** | `http://<YOUR-EC2-IP>` |
| **API Docs** | `http://<YOUR-EC2-IP>/api-docs` |
| **Grafana** | `http://<YOUR-EC2-IP>:3001` (admin/admin) |
| **Jenkins** | `http://<YOUR-EC2-IP>:8080` (already setup) |

---

## 🔥 Essential Commands

```bash
# Deploy/Update
cd /home/ubuntu/skillsphere
./scripts/deploy.sh

# View Logs
docker-compose logs -f

# Restart
docker-compose restart

# Stop
docker-compose down

# Status
docker-compose ps

# Update Code
git pull && docker-compose up -d --build
```

---

## ⚠️ Security Group Ports

Make sure these are open:
- **22** - SSH (your IP)
- **80** - HTTP (public)
- **8080** - Jenkins (your IP) ✅ already open
- **3001** - Grafana (your IP)

---

## 🐛 Quick Fixes

**Port conflict:**
```bash
sudo lsof -i :80
sudo kill -9 <PID>
```

**Database error:**
```bash
cat .env | grep DATABASE_URL  # Verify it's correct
```

**Container won't start:**
```bash
docker-compose logs backend  # Check the error
docker-compose restart backend
```

**Clean slate:**
```bash
docker-compose down
docker system prune -a
./scripts/deploy.sh
```

---

## ✅ Success Check

After deployment:
- [ ] Visit `http://<YOUR-EC2-IP>` - See landing page
- [ ] Register a user - Works
- [ ] Login - Works
- [ ] Add a course - Works
- [ ] `docker-compose ps` - All containers "Up"

---

## 📞 Support

**Logs:** `docker-compose logs -f`

**Detailed Guide:** See `DEPLOY-TO-EXISTING-EC2.md`

**Stuck?** Check DATABASE_URL in `.env`

---

**That's it! Your app should be live in ~5 minutes! 🚀**
