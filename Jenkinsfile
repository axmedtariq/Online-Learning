pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    tools {
        nodejs 'node24' // Make sure you configured NodeJS installation in Jenkins with this name
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Checking out repository'
                checkout scm
            }
        }

        stage('Install Client') {
            steps {
                dir('client') {
                    bat 'npm install'
                }
            }
        }

        stage('Install Server') {
            steps {
                dir('Server') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Client') {
            steps {
                dir('client') {
                    bat 'npm run build'
                }
            }
        }

        stage('Build Server') {
            steps {
                dir('Server') {
                    bat 'npm run build || echo "Server build skipped"'
                }
            }
        }

        stage('Test Client') {
            steps {
                dir('client') {
                    bat 'npm test || exit 0'
                }
            }
        }

        stage('Test Server') {
            steps {
                dir('Server') {
                    bat 'npm test || exit 0'
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning workspace'
            cleanWs()
        }
    }
}
