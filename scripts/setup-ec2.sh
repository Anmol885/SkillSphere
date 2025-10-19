#!/bin/bash

# EC2 Instance Setup Script
# Run this script on your fresh Ubuntu EC2 instance

set -e

echo "🚀 Setting up EC2 instance for SkillSphere..."

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install essential tools
echo "🔧 Installing essential tools..."
sudo apt-get install -y \
    curl \
    wget \
    git \
    vim \
    htop \
    net-tools \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "✅ Docker installed"
else
    echo "✅ Docker already installed"
fi

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose installed"
else
    echo "✅ Docker Compose already installed"
fi

# Install Node.js (for Jenkins)
echo "📦 Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "✅ Node.js installed: $(node --version)"
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# Install Java (for Jenkins)
echo "☕ Installing Java..."
if ! command -v java &> /dev/null; then
    sudo apt-get install -y openjdk-17-jdk
    echo "✅ Java installed"
else
    echo "✅ Java already installed"
fi

# Install Jenkins
echo "🔧 Installing Jenkins..."
if ! command -v jenkins &> /dev/null; then
    sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
        https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
    echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]" \
        https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
        /etc/apt/sources.list.d/jenkins.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y jenkins
    sudo systemctl enable jenkins
    sudo systemctl start jenkins
    echo "✅ Jenkins installed"
    echo "📝 Initial admin password:"
    sudo cat /var/lib/jenkins/secrets/initialAdminPassword
else
    echo "✅ Jenkins already installed"
fi

# Install Trivy (security scanner)
echo "🔍 Installing Trivy..."
if ! command -v trivy &> /dev/null; then
    wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
    echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
    sudo apt-get update
    sudo apt-get install -y trivy
    echo "✅ Trivy installed"
else
    echo "✅ Trivy already installed"
fi

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 8080/tcp  # Jenkins
sudo ufw --force enable
echo "✅ Firewall configured"

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /home/ubuntu/skillsphere
sudo chown -R ubuntu:ubuntu /home/ubuntu/skillsphere
echo "✅ Application directory created"

# Enable Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Display versions
echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "📋 Installed versions:"
echo "   - Docker: $(docker --version)"
echo "   - Docker Compose: $(docker-compose --version)"
echo "   - Node.js: $(node --version)"
echo "   - NPM: $(npm --version)"
echo "   - Java: $(java --version | head -n 1)"
echo "   - Jenkins: Installed (http://$(curl -s ifconfig.me):8080)"
echo ""
echo "🔐 Security Groups Required:"
echo "   - Port 22 (SSH)"
echo "   - Port 80 (HTTP)"
echo "   - Port 443 (HTTPS)"
echo "   - Port 8080 (Jenkins)"
echo ""
echo "⚠️  IMPORTANT: Log out and log back in for Docker group changes to take effect!"
echo "   Run: exit"
echo ""
