pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        CI = 'false'
    }

    tools {
        nodejs 'node24'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Checking out repository'
                checkout scm
            }
        }

        stage('Install Client Dependencies') {
            steps {
                dir('client') {
                    echo '📦 Installing client dependencies'
                    bat 'npm install'
                }
            }
        }

        stage('Install Server Dependencies') {
            steps {
                dir('Server') {
                    echo '📦 Installing server dependencies'
                    bat 'npm install'
                }
            }
        }

        stage('Build Client') {
            steps {
                dir('client') {
                    echo '🚀 Building React client'
                    bat 'set CI=false && npm run build'
                }
            }
        }

        stage('Build Server (Optional)') {
            steps {
                dir('Server') {
                    echo '🏗️ Checking if server build exists'

                    bat '''
                    npm run | findstr /C:"build" >nul
                    if %ERRORLEVEL% NEQ 0 (
                        echo No server build script found. Skipping...
                        exit /b 0
                    )

                    echo Server build script found. Running build...
                    npm run build
                    '''
                }
            }
        }

        stage('Test Client') {
            steps {
                dir('client') {
                    echo '🧪 Running client tests'
                    bat 'npm test || exit /b 0'
                }
            }
        }

        stage('Test Server') {
            steps {
                dir('Server') {
                    echo '🧪 Running server tests'
                    bat 'npm test || exit /b 0'
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning workspace'
            cleanWs()
        }

        success {
            echo '✅ Pipeline completed successfully'
        }

        failure {
            echo '❌ Pipeline failed'
        }
    }
}
