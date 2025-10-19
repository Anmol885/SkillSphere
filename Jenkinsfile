pipeline {
    agent any

    environment {
        // Docker Hub credentials (configure in Jenkins)
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        DOCKER_USERNAME = credentials('dockerhub-username')

        // Application configuration
        APP_NAME = 'skillsphere'
        BACKEND_IMAGE = "${DOCKER_USERNAME}/${APP_NAME}-backend"
        FRONTEND_IMAGE = "${DOCKER_USERNAME}/${APP_NAME}-frontend"

        // Version tag (using build number or git commit)
        VERSION = "${env.BUILD_NUMBER}"
        GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD || echo 'latest'", returnStdout: true).trim()

        // Deployment directory on EC2
        DEPLOY_DIR = '/home/ubuntu/skillsphere'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "🔄 Checking out code..."
                    checkout scm
                }
            }
        }

        stage('Environment Setup') {
            steps {
                script {
                    echo "🔧 Setting up environment..."
                    sh '''
                        echo "Node version: $(node --version)"
                        echo "NPM version: $(npm --version)"
                        echo "Docker version: $(docker --version)"
                    '''
                }
            }
        }

        stage('Backend - Install & Test') {
            steps {
                script {
                    echo "📦 Installing backend dependencies..."
                    dir('backend') {
                        sh '''
                            npm ci
                            npx prisma generate
                        '''

                        // Run tests if available
                        // sh 'npm test'
                    }
                }
            }
        }

        stage('Frontend - Install & Build') {
            steps {
                script {
                    echo "📦 Installing frontend dependencies..."
                    dir('frontend') {
                        sh '''
                            npm ci
                        '''

                        // Run linter
                        sh 'npm run lint || true'

                        // Run tests if available
                        // sh 'npm test'
                    }
                }
            }
        }

        stage('Docker - Build Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        script {
                            echo "🐳 Building backend Docker image..."
                            dir('backend') {
                                sh """
                                    docker build \
                                        -t ${BACKEND_IMAGE}:${VERSION} \
                                        -t ${BACKEND_IMAGE}:${GIT_COMMIT_SHORT} \
                                        -t ${BACKEND_IMAGE}:latest \
                                        .
                                """
                            }
                        }
                    }
                }

                stage('Build Frontend Image') {
                    steps {
                        script {
                            echo "🐳 Building frontend Docker image..."
                            dir('frontend') {
                                sh """
                                    docker build \
                                        -t ${FRONTEND_IMAGE}:${VERSION} \
                                        -t ${FRONTEND_IMAGE}:${GIT_COMMIT_SHORT} \
                                        -t ${FRONTEND_IMAGE}:latest \
                                        .
                                """
                            }
                        }
                    }
                }
            }
        }

        stage('Docker - Security Scan') {
            steps {
                script {
                    echo "🔍 Scanning Docker images for vulnerabilities..."

                    // Using Trivy for security scanning (install on Jenkins server)
                    sh """
                        trivy image --exit-code 0 --severity HIGH,CRITICAL ${BACKEND_IMAGE}:latest || true
                        trivy image --exit-code 0 --severity HIGH,CRITICAL ${FRONTEND_IMAGE}:latest || true
                    """
                }
            }
        }

        stage('Docker - Push to Registry') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo "📤 Pushing Docker images to registry..."

                    docker.withRegistry('', DOCKER_CREDENTIALS_ID) {
                        sh """
                            docker push ${BACKEND_IMAGE}:${VERSION}
                            docker push ${BACKEND_IMAGE}:${GIT_COMMIT_SHORT}
                            docker push ${BACKEND_IMAGE}:latest

                            docker push ${FRONTEND_IMAGE}:${VERSION}
                            docker push ${FRONTEND_IMAGE}:${GIT_COMMIT_SHORT}
                            docker push ${FRONTEND_IMAGE}:latest
                        """
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo "🚀 Deploying to EC2 instance..."

                    // SSH to EC2 and deploy
                    sshagent(['ec2-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@\${EC2_HOST} '
                                cd ${DEPLOY_DIR}

                                # Pull latest code
                                git pull origin main

                                # Pull latest Docker images
                                docker pull ${BACKEND_IMAGE}:latest
                                docker pull ${FRONTEND_IMAGE}:latest

                                # Update docker-compose to use new images
                                export BACKEND_IMAGE=${BACKEND_IMAGE}:latest
                                export FRONTEND_IMAGE=${FRONTEND_IMAGE}:latest

                                # Stop and remove old containers
                                docker-compose down

                                # Start new containers
                                docker-compose up -d

                                # Clean up old images
                                docker image prune -f

                                # Health check
                                sleep 10
                                curl -f http://localhost/health || exit 1
                            '
                        """
                    }
                }
            }
        }

        stage('Health Check') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo "🏥 Running health checks..."

                    sshagent(['ec2-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@\${EC2_HOST} '
                                # Check if containers are running
                                docker ps | grep skillsphere

                                # Check backend health
                                curl -f http://localhost:5000/health

                                # Check frontend
                                curl -f http://localhost:3000

                                # Check nginx
                                curl -f http://localhost/health
                            '
                        """
                    }
                }
            }
        }

        stage('Smoke Tests') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo "🧪 Running smoke tests..."

                    // Basic smoke tests
                    sh """
                        curl -f http://\${EC2_HOST}/health
                        curl -f http://\${EC2_HOST}/api/v1/auth/login -X POST -H "Content-Type: application/json" -d '{}' || true
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'

            // Send notifications (configure email/Slack)
            // emailext (
            //     subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
            //     body: "Build succeeded: ${env.BUILD_URL}",
            //     to: 'your-email@example.com'
            // )
        }

        failure {
            echo '❌ Pipeline failed!'

            // Send failure notifications
            // emailext (
            //     subject: "FAILURE: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
            //     body: "Build failed: ${env.BUILD_URL}",
            //     to: 'your-email@example.com'
            // )
        }

        always {
            echo '🧹 Cleaning up...'

            // Clean workspace
            cleanWs()

            // Remove dangling images
            sh 'docker image prune -f || true'
        }
    }
}
