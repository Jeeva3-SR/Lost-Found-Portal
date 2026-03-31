pipeline {
    agent any

    tools {
        nodejs '20'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Backend') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Install & Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    # Stop only this app
                    sudo -u Jeeva pm2 delete academicconnect-api 2>/dev/null || true

                    # Create directories
                    sudo mkdir -p /var/www/academicconnect/backend
                    sudo mkdir -p /var/www/academicconnect/frontend
                    sudo mkdir -p /var/www/academicconnect/backend/uploads

                    # Sync files
                    sudo rsync -a --delete --exclude='uploads' --exclude='.env' backend/ /var/www/academicconnect/backend/
                    sudo rsync -a --delete frontend/dist/ /var/www/academicconnect/frontend/

                    # Install production dependencies
                    sudo -u Jeeva bash -c "cd /var/www/academicconnect/backend && npm ci --production"

                    # Copy env if exists
                    [ -f /var/www/academicconnect/.env ] && sudo cp /var/www/academicconnect/.env /var/www/academicconnect/backend/.env

                    # Fix permissions
                    sudo chown -R Jeeva:Jeeva /var/www/academicconnect

                    # Start app
                    sudo -u Jeeva bash -c "cd /var/www/academicconnect/backend && pm2 start server.js --name academicconnect-api && pm2 save"
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed.'
        }
        always {
            cleanWs()
        }
    }
}