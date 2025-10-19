# SkillSphere - Complete Project Structure

## 📁 Directory Tree

```
DevOps_Project/
│
├── 📄 README.md                      # Main project documentation
├── 📄 DEPLOYMENT.md                  # Comprehensive deployment guide
├── 📄 DEPLOYMENT-CHECKLIST.md        # Step-by-step deployment checklist
├── 📄 DEPLOYMENT-SUMMARY.md          # Overview of all deployment files
├── 📄 QUICK-START.md                 # Quick reference guide
├── 📄 PROJECT-STRUCTURE.md           # This file
├── 📄 .env.example                   # Environment variables template
├── 📄 .gitignore                     # Git ignore rules
├── 📄 docker-compose.yml             # Complete service orchestration
├── 📄 Jenkinsfile                    # CI/CD pipeline definition
│
├── 📂 backend/                       # Node.js/Express Backend
│   ├── 📄 Dockerfile                 # Backend container definition
│   ├── 📄 .dockerignore              # Docker build exclusions
│   ├── 📄 .env                       # Development environment (gitignored)
│   ├── 📄 .env.production            # Production template
│   ├── 📄 package.json               # Backend dependencies
│   ├── 📄 tsconfig.json              # TypeScript configuration
│   │
│   ├── 📂 src/
│   │   ├── 📄 server.ts              # Application entry point
│   │   ├── 📄 app.ts                 # Express app configuration
│   │   │
│   │   ├── 📂 config/
│   │   │   ├── database.ts           # Prisma client
│   │   │   └── env.ts                # Environment config
│   │   │
│   │   ├── 📂 controllers/
│   │   │   ├── auth.controller.ts    # Authentication logic
│   │   │   ├── courses.controller.ts # Course management
│   │   │   ├── analytics.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   └── notifications.controller.ts
│   │   │
│   │   ├── 📂 routes/
│   │   │   ├── auth.routes.ts        # Auth endpoints
│   │   │   ├── courses.routes.ts     # Course endpoints
│   │   │   ├── analytics.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   └── notifications.routes.ts
│   │   │
│   │   ├── 📂 middleware/
│   │   │   ├── auth.ts               # JWT verification
│   │   │   ├── errorHandler.ts       # Global error handling
│   │   │   └── upload.ts             # File upload (Multer)
│   │   │
│   │   └── 📂 utils/
│   │       ├── jwt.ts                # JWT utilities
│   │       ├── password.ts           # Password hashing
│   │       └── validation.ts         # Zod schemas
│   │
│   ├── 📂 prisma/
│   │   └── schema.prisma             # Database schema (User, Course, Certificate)
│   │
│   └── 📂 uploads/                   # User-uploaded certificates
│       └── .gitkeep
│
├── 📂 frontend/                      # Next.js 15 Frontend
│   ├── 📄 Dockerfile                 # Frontend container definition
│   ├── 📄 .dockerignore              # Docker build exclusions
│   ├── 📄 .env.local                 # Development environment
│   ├── 📄 .env.production            # Production template
│   ├── 📄 package.json               # Frontend dependencies
│   ├── 📄 tsconfig.json              # TypeScript configuration
│   ├── 📄 next.config.ts             # Next.js configuration
│   ├── 📄 tailwind.config.ts         # Tailwind CSS config
│   │
│   ├── 📂 app/                       # Next.js 15 App Router
│   │   ├── 📄 layout.tsx             # Root layout (Auth, Theme providers)
│   │   ├── 📄 page.tsx               # Landing page
│   │   ├── 📄 globals.css            # Global styles
│   │   │
│   │   ├── 📂 login/
│   │   │   └── page.tsx              # Login page
│   │   │
│   │   ├── 📂 register/
│   │   │   └── page.tsx              # Registration page
│   │   │
│   │   ├── 📂 dashboard/
│   │   │   └── page.tsx              # Main dashboard
│   │   │
│   │   ├── 📂 analytics/
│   │   │   └── page.tsx              # Analytics & charts
│   │   │
│   │   └── 📂 profile/
│   │       └── page.tsx              # User profile
│   │
│   ├── 📂 components/
│   │   ├── 📄 Navbar.tsx             # Navigation component
│   │   ├── 📄 AddCourseDialog.tsx    # Course creation modal
│   │   ├── 📄 CertificateViewer.tsx  # Certificate display
│   │   │
│   │   └── 📂 ui/                    # Shadcn UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── dialog.tsx
│   │       └── ... (12+ components)
│   │
│   ├── 📂 contexts/
│   │   ├── AuthContext.tsx           # Authentication state
│   │   └── ThemeContext.tsx          # Light/Dark theme
│   │
│   ├── 📂 lib/
│   │   ├── 📄 utils.ts               # Utility functions
│   │   │
│   │   └── 📂 api/
│   │       ├── client.ts             # Axios instance
│   │       ├── auth.ts               # Auth API calls
│   │       ├── courses.ts            # Course API calls
│   │       ├── analytics.ts          # Analytics API
│   │       └── user.ts               # User API calls
│   │
│   └── 📂 public/                    # Static assets
│       └── *.svg
│
├── 📂 nginx/                         # Nginx Configuration
│   ├── 📄 nginx.conf                 # Main nginx config
│   │                                 # - Worker processes
│   │                                 # - Gzip compression
│   │                                 # - Security headers
│   │
│   └── 📂 conf.d/
│       └── 📄 skillsphere.conf       # Application routing
│                                     # - Reverse proxy rules
│                                     # - Rate limiting
│                                     # - SSL ready (commented)
│                                     # - Grafana/Prometheus routing
│
├── 📂 prometheus/                    # Prometheus Monitoring
│   └── 📄 prometheus.yml             # Scrape configurations
│                                     # - Prometheus self-monitoring
│                                     # - Node Exporter (system metrics)
│                                     # - cAdvisor (container metrics)
│                                     # - Backend metrics endpoint
│
├── 📂 grafana/                       # Grafana Dashboards
│   ├── 📂 provisioning/
│   │   ├── 📂 datasources/
│   │   │   └── prometheus.yml        # Auto-configure Prometheus
│   │   │
│   │   └── 📂 dashboards/
│   │       └── dashboard.yml         # Dashboard provider
│   │
│   └── 📂 dashboards/
│       └── skillsphere-overview.json # Pre-built dashboard
│                                     # - CPU/Memory gauges
│                                     # - Network traffic graphs
│                                     # - Container resource usage
│
└── 📂 scripts/                       # Deployment Scripts
    ├── 📄 setup-ec2.sh               # EC2 instance setup
    │                                 # - Install Docker, Node, Java
    │                                 # - Install Jenkins
    │                                 # - Configure firewall
    │                                 # - Setup directories
    │
    ├── 📄 deploy.sh                  # Application deployment
    │                                 # - Build Docker images
    │                                 # - Start services
    │                                 # - Run health checks
    │
    ├── 📄 backup.sh                  # Automated backups
    │                                 # - Backup uploads
    │                                 # - Backup configuration
    │                                 # - Cleanup old backups
    │
    └── 📄 monitoring-setup.sh        # Monitoring verification
                                      # - Check Prometheus
                                      # - Verify Grafana
                                      # - Display access URLs
```

## 🗂️ File Count Summary

### Source Code
- **Backend TypeScript files:** 19
- **Frontend TypeScript/TSX files:** 30+
- **Total Components:** 20+

### Configuration Files
- **Docker:** 4 files (2 Dockerfiles, 2 .dockerignore)
- **Nginx:** 2 files
- **Prometheus:** 1 file
- **Grafana:** 3 files
- **Jenkins:** 1 file (Jenkinsfile)

### Scripts
- **Deployment scripts:** 4 shell scripts

### Documentation
- **Markdown files:** 6 comprehensive guides

### Environment Files
- **Templates:** 3 (.env.example, .env.production templates)

## 📊 Component Breakdown

### Backend Components (Node.js/Express)
```
Controllers (5)     Routes (5)        Middleware (3)
├─ auth            ├─ auth           ├─ auth (JWT)
├─ courses         ├─ courses        ├─ errorHandler
├─ analytics       ├─ analytics      └─ upload (Multer)
├─ user            ├─ user
└─ notifications   └─ notifications
```

### Frontend Components (Next.js/React)
```
Pages (6)          Components (15+)   Contexts (2)
├─ Landing         ├─ Navbar          ├─ AuthContext
├─ Login           ├─ AddCourseDialog └─ ThemeContext
├─ Register        ├─ CertificateViewer
├─ Dashboard       └─ UI Components
├─ Analytics           ├─ Button
└─ Profile             ├─ Card
                       ├─ Input
                       ├─ Dialog
                       ├─ Table
                       └─ ... (10+ more)
```

### Infrastructure Services
```
Docker Containers (8)
├─ skillsphere-frontend    (Next.js app)
├─ skillsphere-backend     (Express API)
├─ skillsphere-nginx       (Reverse proxy)
├─ skillsphere-prometheus  (Metrics collection)
├─ skillsphere-grafana     (Dashboards)
├─ skillsphere-node-exporter (System metrics)
├─ skillsphere-cadvisor    (Container metrics)
└─ External: PostgreSQL RDS (Already configured)
```

## 🔌 Port Mapping

### Application Ports
| Service | Internal | External | Purpose |
|---------|----------|----------|---------|
| Frontend | 3000 | - | Next.js dev/prod |
| Backend | 5000 | - | Express API |
| Nginx | - | 80/443 | Reverse proxy |
| Jenkins | - | 8080 | CI/CD |

### Monitoring Ports
| Service | Internal | External | Purpose |
|---------|----------|----------|---------|
| Prometheus | 9090 | 9090 | Metrics server |
| Grafana | 3000 | 3001 | Dashboards |
| Node Exporter | 9100 | - | System metrics |
| cAdvisor | 8080 | - | Container metrics |

## 🔗 Service Dependencies

```
┌─────────────┐
│   Nginx     │ ◄─── Entry point (Port 80/443)
│  (Gateway)  │
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
   ▼       ▼
┌──────┐ ┌──────────┐
│Front │ │ Backend  │
│ end  │ │   API    │
└──────┘ └────┬─────┘
              │
              ▼
         ┌─────────┐
         │   RDS   │
         │ (Postgres)
         └─────────┘

Monitoring Stack:
┌───────────┐     ┌────────────┐
│Prometheus │ ◄── │  Grafana   │
└─────┬─────┘     └────────────┘
      │
  ┌───┴────┐
  │        │
  ▼        ▼
┌────┐  ┌────────┐
│Node│  │cAdvisor│
│Exp.│  │        │
└────┘  └────────┘
```

## 📦 Docker Volumes

```
Persistent Data Storage:
├─ backend-uploads/       → /app/uploads (Backend certificates)
├─ prometheus-data/       → /prometheus (Metrics history)
└─ grafana-data/         → /var/lib/grafana (Dashboards, users)
```

## 🌐 Network Architecture

```
skillsphere-network (Bridge Network)
│
├─ frontend:3000
├─ backend:5000
├─ nginx:80
├─ prometheus:9090
├─ grafana:3000
├─ node-exporter:9100
└─ cadvisor:8080

External Connections:
└─ PostgreSQL RDS (outside container network)
```

## 🔐 Environment Variables Map

### Backend (.env)
```bash
DATABASE_URL          → Prisma ORM
JWT_SECRET           → Authentication
JWT_EXPIRES_IN       → Token lifetime
PORT                 → Server port
NODE_ENV             → Environment mode
CORS_ORIGIN          → Allowed origins
UPLOAD_MODE          → local or s3
UPLOAD_DIR           → Upload path
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL  → Backend API endpoint
NEXT_PUBLIC_GOOGLE_CLIENT_ID → OAuth (optional)
```

### Docker Compose (.env)
```bash
DATABASE_URL         → Passed to backend
JWT_SECRET          → Passed to backend
CORS_ORIGIN         → Passed to backend
NEXT_PUBLIC_API_URL → Passed to frontend
GRAFANA_ADMIN_USER  → Grafana login
GRAFANA_ADMIN_PASSWORD → Grafana security
DOCKER_USERNAME     → CI/CD (Docker Hub)
EC2_HOST           → CI/CD (deployment target)
```

## 📝 Configuration Files Purpose

### Docker
- `Dockerfile` (backend) → Multi-stage Node.js build
- `Dockerfile` (frontend) → Optimized Next.js build
- `docker-compose.yml` → Orchestrate all 8 services
- `.dockerignore` → Exclude node_modules, .env

### Nginx
- `nginx.conf` → Global settings, gzip, security headers
- `skillsphere.conf` → Routing, rate limiting, SSL ready

### Monitoring
- `prometheus.yml` → Define scrape targets
- `datasources/prometheus.yml` → Auto-configure Grafana
- `dashboards/*.json` → Pre-built visualizations

### CI/CD
- `Jenkinsfile` → Complete pipeline (build → test → deploy)

### Scripts
- `setup-ec2.sh` → One-time server setup
- `deploy.sh` → Deploy/update application
- `backup.sh` → Automated backups
- `monitoring-setup.sh` → Verify monitoring

## 🎯 Key Features by Component

### Frontend
✅ Server-side rendering (Next.js)
✅ Light/Dark theme toggle
✅ Responsive design (Tailwind CSS)
✅ JWT authentication
✅ Protected routes
✅ File upload (certificates)
✅ Data visualization (Recharts)

### Backend
✅ RESTful API design
✅ JWT authentication
✅ Prisma ORM
✅ Input validation (Zod)
✅ File upload handling
✅ Swagger documentation
✅ Security headers (Helmet)
✅ CORS configuration

### DevOps
✅ Full containerization
✅ Multi-stage Docker builds
✅ Service orchestration
✅ Reverse proxy (Nginx)
✅ CI/CD pipeline (Jenkins)
✅ Monitoring stack (Prometheus + Grafana)
✅ Automated backups
✅ Health checks
✅ Auto-restart policies

## 📈 Lines of Code Estimate

```
Backend:
  TypeScript      ~1,500 lines
  Configuration   ~300 lines

Frontend:
  TypeScript/TSX  ~2,500 lines
  CSS            ~500 lines
  Configuration   ~200 lines

Infrastructure:
  Docker         ~150 lines
  Nginx          ~200 lines
  Prometheus     ~80 lines
  Grafana        ~150 lines
  Jenkins        ~200 lines
  Scripts        ~400 lines

Documentation:
  Markdown       ~2,000 lines

Total: ~8,000+ lines
```

## 🚀 Deployment Flow

```
Developer → Git Push
    ↓
Jenkins Webhook Trigger
    ↓
┌──────────────────┐
│  Build Stage     │ npm install, tests
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Docker Build    │ Create images
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Security Scan    │ Trivy vulnerability check
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Push Registry   │ Docker Hub
└────────┬─────────┘
         ↓
┌──────────────────┐
│   Deploy EC2     │ SSH, pull, restart
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Health Check    │ Verify deployment
└────────┬─────────┘
         ↓
    ✅ Success!
```

## 🎓 Learning Resources

Each component teaches:

- **Docker:** Containerization, multi-stage builds
- **Docker Compose:** Service orchestration
- **Nginx:** Reverse proxy, load balancing
- **Jenkins:** CI/CD pipelines
- **Prometheus:** Metrics collection
- **Grafana:** Data visualization
- **Next.js:** Modern React framework
- **Express:** RESTful API design
- **Prisma:** Type-safe ORM
- **AWS EC2:** Cloud deployment

---

**This structure represents a production-ready, full-stack application with complete DevOps automation!** 🎉
