# 🎯 START HERE - Deploy SkillSphere to Your Existing EC2

You already have EC2 + Jenkins + Docker configured. Here's your deployment path:

---

## 🚦 Step-by-Step (Choose Your Path)

### ⚡ SUPER FAST (5 minutes)
**Read:** `QUICK-DEPLOY.md`
- One-page guide
- Essential commands only
- Fastest deployment

### 📖 DETAILED (15 minutes)
**Read:** `DEPLOY-TO-EXISTING-EC2.md`
- Complete step-by-step guide
- Troubleshooting included
- Monitoring setup
- Jenkins pipeline configuration

---

## 📋 What You Need Before Starting

### ✅ You Already Have
- [x] EC2 instance running
- [x] Jenkins installed and configured
- [x] Docker & Docker Compose installed
- [x] Docker Hub account connected
- [x] RDS database (PostgreSQL)

### 📝 You Need to Prepare (5 minutes)

1. **Create GitHub Repository** (if not done)
   - Go to GitHub → New Repository
   - Name: `skillsphere` (or any name)
   - Don't initialize with README (you have code already)
   - Copy the repository URL

2. **Know Your EC2 Details**
   - EC2 Public IP: `_______________`
   - SSH Key location: `_______________`
   - Docker Hub username: `_______________`

3. **That's it!** You're ready to deploy.

---

## 🚀 Deployment Flow

```
┌─────────────────────────────────────────────────────┐
│  1. Push Code to Git (from your Windows machine)   │
│     - git init                                      │
│     - git add .                                     │
│     - git commit -m "Initial commit"                │
│     - git push origin main                          │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  2. SSH to Your EC2 Instance                        │
│     - ssh -i key.pem ubuntu@<EC2-IP>               │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  3. Clone Repository on EC2                         │
│     - cd /home/ubuntu                               │
│     - git clone <your-repo> skillsphere             │
│     - cd skillsphere                                │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  4. Configure .env File                             │
│     - cp .env.example .env                          │
│     - nano .env                                     │
│     - Update: DATABASE_URL, JWT_SECRET,             │
│               CORS_ORIGIN, NEXT_PUBLIC_API_URL      │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  5. Deploy Application                              │
│     - chmod +x scripts/deploy.sh                    │
│     - ./scripts/deploy.sh                           │
│     - Wait 2-3 minutes                              │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  6. Access Your Application                         │
│     - http://<EC2-IP>                              │
│     - Register & test                               │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Critical Configuration (Must Do!)

When editing `.env` file, these **4 values** are critical:

```bash
# 1. Your RDS Database (already configured)
DATABASE_URL="postgresql://postgres:anmol0905@skillsphere-db.cbk22084ghpg.eu-central-1.rds.amazonaws.com:5432/skillsphere?schema=public"

# 2. Generate NEW JWT Secret (run this on EC2 to generate)
JWT_SECRET="$(openssl rand -base64 32)"

# 3. Your EC2 Public IP
CORS_ORIGIN="http://YOUR-EC2-PUBLIC-IP"

# 4. Your EC2 Public IP (for API)
NEXT_PUBLIC_API_URL="http://YOUR-EC2-PUBLIC-IP/api/v1"
```

**Everything else can stay default for initial deployment.**

---

## 📦 What Gets Deployed

Your EC2 will now run:

```
┌─────────────────────────────────────┐
│       Your Existing EC2 Instance     │
│                                      │
│  ✅ Jenkins        :8080 (existing)  │
│  🆕 Application    :80   (new)       │
│  🆕 Grafana        :3001 (new)       │
│  🆕 Prometheus     :9090 (new)       │
│                                      │
│  Internal Services:                  │
│  - Frontend (Next.js)    :3000      │
│  - Backend (Express)     :5000      │
│  - Node Exporter         :9100      │
│  - cAdvisor              :8080      │
└─────────────────────────────────────┘
         │
         └──► PostgreSQL RDS (external)
```

---

## 🔒 Security Group Update

Add these to your EC2 Security Group:

| Port | Service | Source | Status |
|------|---------|--------|--------|
| 22 | SSH | Your IP | ✅ (existing) |
| 80 | HTTP | 0.0.0.0/0 | 🆕 **ADD THIS** |
| 443 | HTTPS | 0.0.0.0/0 | 🆕 (optional) |
| 8080 | Jenkins | Your IP | ✅ (existing) |
| 3001 | Grafana | Your IP | 🆕 (optional) |
| 9090 | Prometheus | Your IP | 🆕 (optional) |

---

## ✅ Success Indicators

After running `./scripts/deploy.sh`, you should see:

```bash
✅ Environment variables loaded
✅ Docker and Docker Compose are installed
✅ Building Docker images...
✅ Starting containers...
✅ Services are running
✅ Backend is healthy
✅ Frontend is healthy
✅ Nginx is healthy

🎉 Deployment completed!

📍 Access points:
   - Application: http://YOUR-EC2-IP
   - API Docs: http://YOUR-EC2-IP/api-docs
   - Grafana: http://YOUR-EC2-IP/grafana
```

Then verify:
```bash
docker-compose ps

# Should show 7-8 containers all with "Up" status
```

---

## 🆘 If Something Goes Wrong

### 1. Check Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 2. Common Issues

**"Port 80 already in use"**
```bash
sudo lsof -i :80
sudo kill -9 <PID>
```

**"Database connection failed"**
```bash
# Verify DATABASE_URL is correct
cat .env | grep DATABASE_URL

# Should match your RDS connection string exactly
```

**"Container keeps restarting"**
```bash
docker-compose logs backend  # See the error
# Usually: wrong DATABASE_URL or missing env vars
```

### 3. Nuclear Option (Start Fresh)
```bash
docker-compose down
docker system prune -a
./scripts/deploy.sh
```

---

## 📚 Documentation Index

| File | When to Use |
|------|-------------|
| **START-HERE.md** | You're reading it! Start here. |
| **QUICK-DEPLOY.md** | Fast deployment, minimal explanation |
| **DEPLOY-TO-EXISTING-EC2.md** | Complete guide with troubleshooting |
| **DEPLOYMENT-CHECKLIST.md** | Verify each step as you go |
| **PROJECT-STRUCTURE.md** | Understand the architecture |
| **README.md** | Project overview and features |

---

## 🎬 Ready to Start?

### Option A: Super Fast (5 min)
1. Open: `QUICK-DEPLOY.md`
2. Follow the 5 steps
3. Done!

### Option B: Detailed (15 min)
1. Open: `DEPLOY-TO-EXISTING-EC2.md`
2. Follow step-by-step
3. Setup Jenkins pipeline
4. Configure monitoring

---

## 💡 Pro Tips

1. **Test Locally First** (Optional)
   ```bash
   # On your Windows machine with Docker Desktop
   docker-compose up -d
   # Visit http://localhost
   # If it works locally, it'll work on EC2
   ```

2. **Use Screen/Tmux on EC2** (Optional)
   ```bash
   # So deployment continues even if SSH disconnects
   screen -S deploy
   ./scripts/deploy.sh
   # Ctrl+A, D to detach
   ```

3. **Monitor Resources**
   ```bash
   docker stats  # Real-time resource usage
   ```

---

## 📞 Quick Help

**Deployment stuck?**
- Check logs: `docker-compose logs -f`

**Can't access application?**
- Verify Security Group has port 80 open
- Check EC2 public IP is correct

**Database connection issues?**
- Verify DATABASE_URL exactly matches your RDS
- Test: `docker-compose exec backend npx prisma db pull`

---

## 🎉 After Successful Deployment

You'll have:
- ✅ Full-stack application running
- ✅ API documentation available
- ✅ Monitoring dashboards active
- ✅ Automated backups configured
- ✅ Jenkins CI/CD ready (optional)

**Your application will be accessible at:**
### `http://<YOUR-EC2-PUBLIC-IP>` 🚀

---

## 🏁 Let's Go!

Choose your path:
- 🏃 **Fast track:** Read `QUICK-DEPLOY.md` → Deploy in 5 min
- 🚶 **Detailed:** Read `DEPLOY-TO-EXISTING-EC2.md` → Deploy in 15 min

**You got this! Everything is ready to deploy! 💪**
