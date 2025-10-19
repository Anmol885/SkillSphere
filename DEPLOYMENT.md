# SkillSphere Deployment Guide - Single EC2 Instance

This guide walks you through deploying SkillSphere on a single AWS EC2 instance with full DevOps setup including Jenkins CI/CD, Nginx reverse proxy, and Prometheus/Grafana monitoring.

## 📋 Prerequisites

- AWS Account with EC2 access
- Git installed locally
- SSH client
- Domain name (optional, for production SSL)

## 🏗️ Architecture Overview

```
                          Internet
                             |
                          [Route53] (optional)
                             |
                    [EC2 Security Group]
                             |
                    ┌────────┴────────┐
                    │   EC2 Instance   │
                    │   Ubuntu 22.04   │
                    └──────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
    [Nginx:80]          [Jenkins:8080]      [Monitoring]
        │                                         │
    ┌───┴───┐                               ┌────┴─────┐
    │       │                               │          │
[Frontend] [Backend]                   [Grafana] [Prometheus]
  :3000     :5000                        :3001      :9090
    │         │
    │    [PostgreSQL RDS]
    │    (External)
    │
[Static Files]
```

## 🚀 Step-by-Step Deployment

### Step 1: Launch EC2 Instance

1. **Go to AWS Console → EC2 → Launch Instance**

2. **Configure Instance:**
   - **Name:** `skillsphere-production`
   - **AMI:** Ubuntu Server 22.04 LTS (64-bit x86)
   - **Instance Type:** `t3.medium` (2 vCPU, 4 GB RAM minimum)
     - For production: `t3.large` or `t3.xlarge`
   - **Key Pair:** Create new or select existing (download .pem file)
   - **Network Settings:**
     - Auto-assign public IP: Enable
     - Create new security group or use existing

3. **Configure Security Group:**
   - **Name:** `skillsphere-sg`
   - **Inbound Rules:**
     ```
     SSH      TCP  22    Your IP / 0.0.0.0/0
     HTTP     TCP  80    0.0.0.0/0
     HTTPS    TCP  443   0.0.0.0/0
     Custom   TCP  8080  Your IP (Jenkins)
     Custom   TCP  3001  Your IP (Grafana - optional)
     Custom   TCP  9090  Your IP (Prometheus - optional)
     ```

4. **Storage:** 30 GB gp3 (minimum)

5. **Launch Instance**

6. **Wait for instance to be in "Running" state**

### Step 2: Connect to EC2 Instance

```bash
# Set permissions on your key file
chmod 400 your-key.pem

# Connect via SSH (replace with your instance's public IP)
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
```

### Step 3: Setup EC2 Instance

```bash
# Clone your repository (or upload files)
cd /home/ubuntu
git clone <your-repo-url> skillsphere
cd skillsphere

# Make setup script executable
chmod +x scripts/setup-ec2.sh

# Run setup script
./scripts/setup-ec2.sh
```

This script will install:
- Docker & Docker Compose
- Node.js (v18)
- Java (OpenJDK 17)
- Jenkins
- Trivy (security scanner)
- Configure firewall

**⚠️ IMPORTANT:** After setup completes, log out and log back in:
```bash
exit
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
```

### Step 4: Configure Environment Variables

```bash
cd /home/ubuntu/skillsphere

# Copy environment template
cp .env.example .env

# Edit environment file
nano .env
```

Update the following in `.env`:

```bash
# Replace with your RDS connection string
DATABASE_URL="postgresql://postgres:anmol0905@skillsphere-db.cbk22084ghpg.eu-central-1.rds.amazonaws.com:5432/skillsphere?schema=public"

# Generate a strong JWT secret
JWT_SECRET="$(openssl rand -base64 32)"

# Your EC2 public IP or domain
CORS_ORIGIN="http://<EC2-PUBLIC-IP>"
NEXT_PUBLIC_API_URL="http://<EC2-PUBLIC-IP>/api/v1"

# Grafana credentials (change from default!)
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD="your-secure-password"

# For Jenkins CI/CD (if using Docker Hub)
DOCKER_USERNAME=your-dockerhub-username
EC2_HOST=<EC2-PUBLIC-IP>
```

Save and exit (Ctrl+X, Y, Enter)

### Step 5: Deploy Application

```bash
# Make deploy script executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh
```

This will:
- Build Docker images
- Start all services (frontend, backend, nginx, prometheus, grafana)
- Run health checks

**Wait 2-3 minutes for all services to start**

### Step 6: Verify Deployment

```bash
# Check running containers
docker-compose ps

# All services should show "Up" status
# Expected containers:
# - skillsphere-frontend
# - skillsphere-backend
# - skillsphere-nginx
# - skillsphere-prometheus
# - skillsphere-grafana
# - skillsphere-node-exporter
# - skillsphere-cadvisor

# Test endpoints
curl http://localhost/health              # Nginx health
curl http://localhost:5000/health         # Backend health
curl http://localhost:3000                # Frontend
```

**Access your application:**
- **Application:** `http://<EC2-PUBLIC-IP>`
- **API Docs:** `http://<EC2-PUBLIC-IP>/api-docs`
- **Grafana:** `http://<EC2-PUBLIC-IP>/grafana` (admin/your-password)
- **Prometheus:** `http://<EC2-PUBLIC-IP>/prometheus`

### Step 7: Setup Jenkins CI/CD (Optional but Recommended)

1. **Access Jenkins:**
   ```
   http://<EC2-PUBLIC-IP>:8080
   ```

2. **Get initial admin password:**
   ```bash
   sudo cat /var/lib/jenkins/secrets/initialAdminPassword
   ```

3. **Complete Jenkins Setup Wizard:**
   - Install suggested plugins
   - Create admin user
   - Keep Jenkins URL as default

4. **Install Required Plugins:**
   - Go to: Manage Jenkins → Plugins
   - Install:
     - Docker Pipeline
     - SSH Agent
     - Pipeline
     - Git

5. **Configure Jenkins Credentials:**
   - Manage Jenkins → Credentials → Global → Add Credentials

   **Add Docker Hub credentials:**
   - Kind: Username with password
   - ID: `dockerhub-credentials`
   - Username: your Docker Hub username
   - Password: your Docker Hub token

   **Add Docker Hub username (text):**
   - Kind: Secret text
   - ID: `dockerhub-username`
   - Secret: your Docker Hub username

   **Add EC2 SSH Key:**
   - Kind: SSH Username with private key
   - ID: `ec2-ssh-key`
   - Username: ubuntu
   - Private Key: Paste your .pem file content

6. **Create Jenkins Pipeline:**
   - New Item → Pipeline
   - Name: `skillsphere-deploy`
   - Pipeline → Definition: Pipeline script from SCM
   - SCM: Git
   - Repository URL: your repo URL
   - Script Path: `Jenkinsfile`
   - Save

7. **Configure Environment Variables in Jenkins:**
   - Pipeline → Configure → Environment Variables
   - Add: `EC2_HOST=<your-ec2-public-ip>`

8. **Run Pipeline:**
   - Click "Build Now"
   - Monitor build progress

### Step 8: Setup Monitoring

```bash
# Verify monitoring stack
./scripts/monitoring-setup.sh
```

**Access Grafana:**
1. Go to: `http://<EC2-PUBLIC-IP>:3001` or `http://<EC2-PUBLIC-IP>/grafana`
2. Login: admin / your-password
3. Navigate to Dashboards → SkillSphere Overview

**Pre-configured metrics:**
- CPU Usage
- Memory Usage
- Network Traffic
- Container CPU/Memory Usage
- System Metrics

## 🔒 Security Hardening (Production)

### 1. Change Default Passwords
```bash
# Grafana - change via UI on first login
# Jenkins - change via UI

# Update .env with strong passwords
nano .env
```

### 2. Restrict Security Group Access
- Limit Jenkins (8080) to your IP only
- Limit Grafana/Prometheus to your IP only
- Keep only HTTP/HTTPS open to 0.0.0.0/0

### 3. Setup SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Stop nginx container temporarily
docker-compose stop nginx

# Get SSL certificate (replace with your domain)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Update nginx config to use SSL (uncomment HTTPS sections)
nano nginx/conf.d/skillsphere.conf

# Restart nginx
docker-compose up -d nginx
```

### 4. Enable Firewall Logging
```bash
sudo ufw logging on
```

### 5. Regular Updates
```bash
# Create update script
cat > /home/ubuntu/update.sh << 'EOF'
#!/bin/bash
sudo apt-get update
sudo apt-get upgrade -y
docker-compose pull
docker-compose up -d
EOF

chmod +x /home/ubuntu/update.sh
```

## 📊 Monitoring & Logs

### View Application Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Monitor Resource Usage
```bash
# Container stats
docker stats

# Disk usage
df -h

# Memory usage
free -h

# CPU usage
htop
```

### Grafana Dashboards
- Access: `http://<EC2-PUBLIC-IP>:3001`
- Pre-configured dashboard shows:
  - System metrics (CPU, Memory, Network)
  - Container metrics
  - Application performance

### Prometheus Metrics
- Access: `http://<EC2-PUBLIC-IP>:9090`
- Query examples:
  ```
  container_memory_usage_bytes{name=~"skillsphere.*"}
  rate(container_cpu_usage_seconds_total[5m])
  ```

## 🔄 Backup & Recovery

### Automated Backups
```bash
# Make backup script executable
chmod +x scripts/backup.sh

# Run manual backup
./scripts/backup.sh

# Setup cron for daily backups (3 AM)
crontab -e
# Add: 0 3 * * * /home/ubuntu/skillsphere/scripts/backup.sh
```

### Restore from Backup
```bash
# List backups
ls -lh /home/ubuntu/backups/

# Restore uploads
tar -xzf /home/ubuntu/backups/skillsphere_backup_YYYYMMDD_HHMMSS_uploads.tar.gz
```

## 🔧 Troubleshooting

### Services Not Starting
```bash
# Check logs
docker-compose logs

# Restart specific service
docker-compose restart backend

# Rebuild and restart
docker-compose up -d --build backend
```

### Database Connection Issues
```bash
# Test RDS connectivity
docker-compose exec backend npx prisma db pull

# Check environment variables
docker-compose exec backend env | grep DATABASE_URL
```

### Nginx Errors
```bash
# Test nginx configuration
docker-compose exec nginx nginx -t

# View nginx logs
docker-compose logs nginx

# Reload nginx
docker-compose exec nginx nginx -s reload
```

### Out of Disk Space
```bash
# Clean Docker
docker system prune -a --volumes

# Clean old logs
sudo journalctl --vacuum-time=7d
```

## 📈 Scaling Considerations

For higher traffic, consider:

1. **Upgrade EC2 Instance Type:**
   - t3.large → t3.xlarge → c5.xlarge

2. **Add Load Balancer:**
   - Setup AWS ALB
   - Run multiple EC2 instances
   - Use Auto Scaling Group

3. **Separate Services:**
   - Frontend on separate instance
   - Backend on separate instance
   - Dedicated monitoring instance

4. **Use RDS Read Replicas:**
   - For read-heavy workloads

5. **Add CDN:**
   - CloudFront for static assets
   - S3 for uploads

## 🆘 Support & Maintenance

### Regular Tasks
- [ ] Weekly: Review monitoring dashboards
- [ ] Weekly: Check disk space
- [ ] Weekly: Review application logs
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review security alerts
- [ ] Monthly: Test backups

### Useful Commands
```bash
# Restart all services
docker-compose restart

# Update application
git pull origin main
docker-compose up -d --build

# View resource usage
docker stats

# Clean up
docker system prune -a
```

## 📝 Next Steps

1. ✅ Setup custom domain with Route53
2. ✅ Configure SSL certificates
3. ✅ Setup automated backups to S3
4. ✅ Configure CloudWatch for additional monitoring
5. ✅ Setup email notifications for alerts
6. ✅ Implement rate limiting
7. ✅ Setup WAF (Web Application Firewall)

---

**Congratulations! Your SkillSphere application is now deployed! 🎉**

For issues or questions, check the logs first:
```bash
docker-compose logs -f
```
