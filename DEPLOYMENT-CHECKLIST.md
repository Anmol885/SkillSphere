# SkillSphere Deployment Checklist ✅

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment Checklist

### Local Preparation
- [ ] All code committed to Git repository
- [ ] `.gitignore` configured properly
- [ ] Environment variables documented in `.env.example`
- [ ] Database migrations tested locally
- [ ] Application tested locally with Docker
- [ ] All tests passing (if applicable)
- [ ] Docker images build successfully
- [ ] No hardcoded secrets in code

### AWS Account Setup
- [ ] AWS account created and configured
- [ ] IAM user with EC2 permissions created
- [ ] Billing alerts configured
- [ ] AWS CLI installed (optional)

### Domain & SSL (Optional but Recommended)
- [ ] Domain name registered
- [ ] Route53 hosted zone created
- [ ] SSL certificate plan (Let's Encrypt recommended)

## AWS Infrastructure Setup

### EC2 Instance
- [ ] EC2 instance launched (Ubuntu 22.04, t3.medium minimum)
- [ ] Instance has public IP assigned
- [ ] SSH key pair created and downloaded (.pem file)
- [ ] Key file permissions set: `chmod 400 your-key.pem`

### Security Group Configuration
- [ ] Port 22 (SSH) - Your IP only
- [ ] Port 80 (HTTP) - 0.0.0.0/0
- [ ] Port 443 (HTTPS) - 0.0.0.0/0
- [ ] Port 8080 (Jenkins) - Your IP only
- [ ] Port 3001 (Grafana) - Your IP only (optional)
- [ ] Port 9090 (Prometheus) - Your IP only (optional)

### RDS Database (Already Done)
- [x] PostgreSQL RDS instance created
- [x] Database accessible from EC2
- [x] Security group allows EC2 connection
- [x] Connection string tested

## EC2 Instance Setup

### Initial Connection
- [ ] Successfully SSH into EC2: `ssh -i key.pem ubuntu@<IP>`
- [ ] System updated: `sudo apt-get update && sudo apt-get upgrade -y`

### Software Installation
- [ ] Docker installed and running
- [ ] Docker Compose installed
- [ ] Node.js installed (v18+)
- [ ] Java installed (OpenJDK 17)
- [ ] Jenkins installed and running
- [ ] Trivy installed (security scanner)
- [ ] Git installed
- [ ] User added to docker group
- [ ] Logged out and back in after docker group add

### Verify Installations
```bash
docker --version          # ✓ Docker
docker-compose --version  # ✓ Docker Compose
node --version           # ✓ Node.js v18+
npm --version            # ✓ NPM
java --version           # ✓ Java 17
jenkins --version        # ✓ Jenkins
trivy --version          # ✓ Trivy
```

## Application Deployment

### Code Deployment
- [ ] Repository cloned to `/home/ubuntu/skillsphere`
- [ ] All deployment scripts executable (`chmod +x scripts/*.sh`)
- [ ] `.env` file created from `.env.example`
- [ ] Database URL updated in `.env`
- [ ] JWT secret generated and set
- [ ] CORS origin set to EC2 IP or domain
- [ ] Frontend API URL set correctly
- [ ] Grafana admin password changed from default

### Environment Variables Check
```bash
# Verify critical environment variables
cat .env | grep -E "DATABASE_URL|JWT_SECRET|CORS_ORIGIN|NEXT_PUBLIC_API_URL"
```

- [ ] DATABASE_URL contains correct RDS connection
- [ ] JWT_SECRET is strong and unique
- [ ] CORS_ORIGIN matches your domain/IP
- [ ] NEXT_PUBLIC_API_URL is correct

### Docker Deployment
- [ ] `docker-compose.yml` configured correctly
- [ ] `./scripts/deploy.sh` executed successfully
- [ ] All containers started and running
- [ ] No error messages in deployment output

### Verify Running Services
```bash
docker-compose ps
```

Expected containers (all "Up"):
- [ ] skillsphere-frontend
- [ ] skillsphere-backend
- [ ] skillsphere-nginx
- [ ] skillsphere-prometheus
- [ ] skillsphere-grafana
- [ ] skillsphere-node-exporter
- [ ] skillsphere-cadvisor

### Health Checks
- [ ] Backend health: `curl http://localhost:5000/health`
- [ ] Frontend accessible: `curl http://localhost:3000`
- [ ] Nginx health: `curl http://localhost/health`
- [ ] Application accessible: `http://<EC2-IP>`
- [ ] API docs accessible: `http://<EC2-IP>/api-docs`

## Jenkins CI/CD Setup

### Jenkins Access
- [ ] Jenkins accessible: `http://<EC2-IP>:8080`
- [ ] Initial admin password retrieved
- [ ] Jenkins setup wizard completed
- [ ] Admin user created
- [ ] Recommended plugins installed

### Additional Plugins
- [ ] Docker Pipeline plugin installed
- [ ] SSH Agent plugin installed
- [ ] Pipeline plugin installed
- [ ] Git plugin installed

### Credentials Configuration
- [ ] Docker Hub credentials added (ID: `dockerhub-credentials`)
- [ ] Docker Hub username added (ID: `dockerhub-username`)
- [ ] EC2 SSH key added (ID: `ec2-ssh-key`)

### Pipeline Setup
- [ ] New pipeline job created: `skillsphere-deploy`
- [ ] Pipeline configured with Git SCM
- [ ] Repository URL set
- [ ] Jenkinsfile path configured
- [ ] Environment variables set (EC2_HOST)
- [ ] Test build executed successfully

## Monitoring Setup

### Prometheus
- [ ] Prometheus accessible: `http://<EC2-IP>:9090`
- [ ] Targets showing as "UP" in Prometheus
- [ ] Metrics being collected
- [ ] Configuration file correct

### Grafana
- [ ] Grafana accessible: `http://<EC2-IP>:3001`
- [ ] Login successful with admin credentials
- [ ] Default password changed
- [ ] Prometheus datasource configured automatically
- [ ] "SkillSphere Overview" dashboard visible
- [ ] Metrics displaying correctly

### Monitoring Verification
- [ ] CPU metrics visible
- [ ] Memory metrics visible
- [ ] Container metrics visible
- [ ] Network metrics visible
- [ ] No "N/A" or error messages

## Security Hardening

### Passwords & Secrets
- [ ] Grafana default password changed
- [ ] Jenkins admin password is strong
- [ ] JWT_SECRET is cryptographically random
- [ ] Database password is strong
- [ ] All passwords documented securely (NOT in Git)

### Security Group Refinement
- [ ] Jenkins (8080) restricted to your IP only
- [ ] Grafana (3001) restricted to your IP only
- [ ] Prometheus (9090) restricted to your IP only
- [ ] SSH (22) restricted to your IP (recommended)
- [ ] Only HTTP/HTTPS open to public

### Firewall
- [ ] UFW enabled on EC2
- [ ] Required ports allowed
- [ ] Unnecessary ports blocked
- [ ] Firewall status: `sudo ufw status`

### SSL/TLS (Production)
- [ ] Domain DNS pointing to EC2 IP
- [ ] Let's Encrypt certificates obtained
- [ ] Nginx configured for HTTPS
- [ ] HTTP redirects to HTTPS
- [ ] SSL certificates auto-renewal configured

## Backup & Recovery

### Backup Configuration
- [ ] Backup script executable: `./scripts/backup.sh`
- [ ] Backup directory created: `/home/ubuntu/backups`
- [ ] Manual backup tested successfully
- [ ] Cron job for daily backups configured
- [ ] Backup retention policy set (7 days)

### Test Backup
```bash
./scripts/backup.sh
ls -lh /home/ubuntu/backups/
```

- [ ] Backup files created
- [ ] Uploads backed up
- [ ] Configuration backed up

### Recovery Plan
- [ ] Backup restore procedure documented
- [ ] Recovery tested (optional but recommended)

## Application Testing

### User Registration & Login
- [ ] Registration page loads
- [ ] New user can register
- [ ] Email validation works
- [ ] Password hashing works
- [ ] User can login
- [ ] JWT token issued correctly

### Course Management
- [ ] User can add course
- [ ] Course displays in dashboard
- [ ] Course can be edited
- [ ] Course can be deleted
- [ ] Progress updates work
- [ ] Certificate upload works

### Analytics
- [ ] Analytics page loads
- [ ] Charts display data
- [ ] Statistics calculate correctly
- [ ] No console errors

### API Testing
- [ ] Swagger UI accessible: `http://<EC2-IP>/api-docs`
- [ ] API endpoints documented
- [ ] Authentication works
- [ ] CORS configured correctly

## Performance & Load Testing (Optional)

### Basic Performance
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Images load properly
- [ ] No memory leaks observed

### Resource Usage
```bash
docker stats
```

- [ ] CPU usage reasonable (< 70% average)
- [ ] Memory usage acceptable (< 80%)
- [ ] No container restarts
- [ ] Disk space sufficient (> 20% free)

## Documentation

### Update Documentation
- [ ] README.md updated with EC2 IP/domain
- [ ] DEPLOYMENT.md reviewed
- [ ] Environment variables documented
- [ ] Architecture diagram updated (if needed)

### Team Handoff (if applicable)
- [ ] Access credentials shared securely
- [ ] SSH keys provided
- [ ] Documentation shared
- [ ] Monitoring access granted

## Post-Deployment

### Monitoring & Maintenance
- [ ] Set up monitoring alerts
- [ ] Configure log retention
- [ ] Schedule regular backups
- [ ] Plan for security updates
- [ ] Document maintenance procedures

### Monitoring Schedule
- [ ] Daily: Check Grafana dashboard
- [ ] Daily: Review application logs
- [ ] Weekly: Review disk space
- [ ] Weekly: Check backup success
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review security

### Communication
- [ ] Deployment status communicated to team
- [ ] Known issues documented
- [ ] Support process defined
- [ ] Escalation path defined

## Final Verification

### End-to-End Test
1. [ ] Visit application homepage
2. [ ] Register new user
3. [ ] Login with new user
4. [ ] Add a course with certificate
5. [ ] View analytics
6. [ ] Check monitoring dashboard
7. [ ] Verify all functionality works

### External Access Test
- [ ] Application accessible from different network
- [ ] Mobile responsive design works
- [ ] Different browsers tested (Chrome, Firefox, Safari)
- [ ] API accessible externally

### Disaster Recovery Test (Optional)
- [ ] Stop all containers: `docker-compose down`
- [ ] Start all containers: `docker-compose up -d`
- [ ] Verify application recovers
- [ ] Data integrity maintained

## Sign-Off

**Deployment completed by:** ___________________

**Date:** ___________________

**EC2 Public IP:** ___________________

**Domain (if applicable):** ___________________

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

## Quick Reference

**Application URLs:**
- Application: `http://<EC2-IP>`
- API Docs: `http://<EC2-IP>/api-docs`
- Jenkins: `http://<EC2-IP>:8080`
- Grafana: `http://<EC2-IP>:3001`
- Prometheus: `http://<EC2-IP>:9090`

**SSH Access:**
```bash
ssh -i your-key.pem ubuntu@<EC2-IP>
```

**View Logs:**
```bash
cd /home/ubuntu/skillsphere
docker-compose logs -f
```

**Restart Application:**
```bash
docker-compose restart
```

**Emergency Stop:**
```bash
docker-compose down
```

---

**Deployment Status:**
- [ ] In Progress
- [ ] Completed
- [ ] Production Ready

**Next Steps:**
1. ___________________
2. ___________________
3. ___________________
