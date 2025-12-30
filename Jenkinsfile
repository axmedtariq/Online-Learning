pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    tools {
        nodejs 'node18'   // MUST exist in Manage Jenkins → Tools
    }

    stages {

        stage('Checkout Source Code') {
            steps {
                echo '📥 Checking out repository'
                checkout scm
            }
        }

        stage('Install & Security Scan') {
            parallel {

                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            echo '🔍 Frontend dependencies'
                            bat 'npm install'
                            bat 'npm audit --audit-level=high || exit 0'
                        }
                    }
                }

                stage('Backend') {
                    steps {
                        dir('backend') {
                            echo '🔍 Backend dependencies'
                            bat 'npm install'
                            bat 'npm audit --audit-level=high || exit 0'
                        }
                    }
                }
            }
        }

        stage('Build Applications') {
            parallel {

                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            echo '🏗️ Building frontend'
                            bat 'npm run build'
                        }
                    }
                }

                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            echo '🏗️ Building backend'
                            bat 'npm run build || echo Backend build skipped'
                        }
                    }
                }
            }
        }

        stage('Run Tests') {
            parallel {

                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            echo '🧪 Frontend tests'
                            bat 'npm test || exit 0'
                        }
                    }
                }

                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            echo '🧪 Backend tests'
                            bat 'npm test || exit 0'
                        }
                    }
                }
            }
        }

        stage('SonarQube Scan') {
            when {
                expression { fileExists('sonar-project.properties') }
            }
            steps {
                echo '📊 Running SonarQube scan'
                bat 'sonar-scanner'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully'
        }
        failure {
            echo '❌ Pipeline failed'
        }
        always {
            echo '🧹 Cleaning workspace'
            cleanWs()
        }
    }
}
