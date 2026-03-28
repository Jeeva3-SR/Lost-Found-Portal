pipeline {
    agent any
    
    environment {
        AZURE_WEBAPP_NAME_BACKEND  = 'academicconnect-api'
        AZURE_WEBAPP_NAME_FRONTEND = 'academicconnect-web'
        AZURE_RESOURCE_GROUP       = 'academicconnect-rg'
        NODE_VERSION               = '18'
    }
    
    tools {
        nodejs "${NODE_VERSION}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend') {
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }
        
        stage('Deploy Backend to Azure') {
            steps {
                dir('backend') {
                    sh '''
                        zip -r ../backend.zip . -x "node_modules/*" "uploads/*"
                    '''
                }
                withCredentials([azureServicePrincipal('azure-sp-credentials')]) {
                    sh '''
                        az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID
                        az webapp deploy --resource-group $AZURE_RESOURCE_GROUP --name $AZURE_WEBAPP_NAME_BACKEND --src-path backend.zip --type zip
                    '''
                }
            }
        }
        
        stage('Deploy Frontend to Azure') {
            steps {
                dir('frontend') {
                    sh '''
                        cd dist && zip -r ../../frontend.zip .
                    '''
                }
                withCredentials([azureServicePrincipal('azure-sp-credentials')]) {
                    sh '''
                        az webapp deploy --resource-group $AZURE_RESOURCE_GROUP --name $AZURE_WEBAPP_NAME_FRONTEND --src-path frontend.zip --type zip
                    '''
                }
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
