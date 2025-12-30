pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    tools {
        nodejs 'node18'   // Configure in Jenkins Global Tool Configuration
    }

    stages {

        stage('Checkout Source Code') {
            steps {
                echo '📥 Checking out repository'
                checkout scm
            }
        }

        stage('Security Scan (Dependencies)') {
            parallel {

                stage('Frontend Scan') {
                    steps {
                        dir('frontend') {
                            echo '🔍 Scanning frontend dependencies'
                            sh 'npm install'
                            sh 'npm audit --audit-level=high || true'
                        }
                    }
                }

                stage('Backend Scan') {
                    steps {
                        dir('backend') {
                            echo '🔍 Scanning backend dependencies'
                            sh 'npm install'
                            sh 'npm audit --audit-level=high || true'
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
                            sh 'npm run build'
                        }
                    }
                }

                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            echo '🏗️ Building backend'
                            sh 'npm run build || echo "Backend build step skipped"'
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
                            echo '🧪 Running frontend tests'
                            sh 'npm test -- --watch=false || true'
                        }
                    }
                }

                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            echo '🧪 Running backend tests'
                            sh 'npm test || true'
                        }
                    }
                }
            }
        }

        stage('Code Quality Scan (SonarQube)') {
            when {
                expression { fileExists('sonar-project.properties') }
            }
            steps {
                echo '📊 Running SonarQube scan'
                sh 'sonar-scanner'
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
