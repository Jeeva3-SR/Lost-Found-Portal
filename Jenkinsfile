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
                // Stop PM2 first
                sh '''
                    sudo -u Jeeva bash -c "pm2 delete academicconnect-api 2>/dev/null || true"
                    sudo -u Jeeva bash -c "pm2 kill 2>/dev/null || true"
                '''

                // Sync files (without deleting uploads or .env)
                sh '''
                    sudo mkdir -p /var/www/academicconnect/backend
                    sudo mkdir -p /var/www/academicconnect/frontend
                    sudo mkdir -p /var/www/academicconnect/backend/uploads

                    sudo rsync -a --delete --exclude='uploads' --exclude='.env' --exclude='node_modules' backend/ /var/www/academicconnect/backend/
                    sudo rsync -a --delete frontend/dist/ /var/www/academicconnect/frontend/

                    cd backend && sudo cp -r node_modules /var/www/academicconnect/backend/ 2>/dev/null || true
                    cd ..

                    sudo cp /var/www/academicconnect/.env /var/www/academicconnect/backend/.env 2>/dev/null || true

                    sudo chown -R Jeeva:Jeeva /var/www/academicconnect
                '''

                // Start PM2 fresh as user Jeeva
                sh '''
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
    }
}
