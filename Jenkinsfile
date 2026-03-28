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
                // Copy built files to deployment directory
                sh '''
                    sudo rm -rf /var/www/academicconnect/backend
                    sudo rm -rf /var/www/academicconnect/frontend
                    sudo mkdir -p /var/www/academicconnect/backend
                    sudo mkdir -p /var/www/academicconnect/frontend

                    sudo cp -r backend/* /var/www/academicconnect/backend/
                    sudo cp -r backend/node_modules /var/www/academicconnect/backend/
                    sudo cp -r frontend/dist/* /var/www/academicconnect/frontend/

                    sudo cp /var/www/academicconnect/.env /var/www/academicconnect/backend/.env 2>/dev/null || true
                '''

                // Restart backend via PM2
                sh '''
                    cd /var/www/academicconnect/backend
                    pm2 delete academicconnect-api 2>/dev/null || true
                    pm2 start server.js --name "academicconnect-api"
                    pm2 save
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
    }
}
