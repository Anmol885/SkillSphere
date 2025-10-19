#!/bin/bash

# Backup Script for SkillSphere
# Backs up uploads and creates a database dump

set -e

BACKUP_DIR="/home/ubuntu/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="skillsphere_backup_${TIMESTAMP}"

echo "📦 Starting backup: ${BACKUP_NAME}"

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Backup uploads
echo "📁 Backing up uploads..."
if [ -d "./backend/uploads" ]; then
    tar -czf ${BACKUP_DIR}/${BACKUP_NAME}_uploads.tar.gz ./backend/uploads
    echo "✅ Uploads backed up"
else
    echo "⚠️  No uploads directory found"
fi

# Backup database (if using local PostgreSQL)
# echo "🗄️ Backing up database..."
# docker-compose exec -T backend npx prisma db pull
# echo "✅ Database schema backed up"

# Backup environment files
echo "🔐 Backing up environment files..."
tar -czf ${BACKUP_DIR}/${BACKUP_NAME}_config.tar.gz .env* || true

# Clean old backups (keep last 7 days)
echo "🧹 Cleaning old backups..."
find ${BACKUP_DIR} -name "skillsphere_backup_*" -mtime +7 -delete

echo "✅ Backup completed: ${BACKUP_DIR}/${BACKUP_NAME}_*"
echo "📊 Backup size:"
du -sh ${BACKUP_DIR}/${BACKUP_NAME}_*
