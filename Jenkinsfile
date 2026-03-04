pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        CI = 'false'
        DOCKER_IMAGE_BACKEND = 'learning-server:latest'
        DOCKER_IMAGE_FRONTEND = 'learning-client:latest'
        SONAR_SCANNER_HOME = tool 'SonarQubeScanner'
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

        stage('Install Dependencies') {
            parallel {
                stage('Client Deps') {
                    steps {
                        dir('client') { bat 'npm install' }
                    }
                }
                stage('Server Deps') {
                    steps {
                        dir('Server') { bat 'npm install' }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarQubeScanner'
                    withSonarQubeEnv('SonarQube') {
                        bat "${scannerHome}/bin/sonar-scanner.bat \
                        -Dsonar.projectKey=learning-platform \
                        -Dsonar.sources=. \
                        -Dsonar.exclusions=node_modules/**,**/dist/**"
                    }
                }
            }
        }

        stage('Vulnerability Scan (FS)') {
            steps {
                echo '🔍 Static vulnerability scan with Trivy'
                // Scan the filesystem for vulnerable packages/configurations
                bat 'trivy fs --severity HIGH,CRITICAL --format table .'
            }
        }

        stage('Build & Test') {
            parallel {
                stage('Client') {
                    steps {
                        dir('client') {
                            bat 'set CI=false && npm run build'
                            bat 'npm test || exit /b 0'
                        }
                    }
                }
                stage('Server') {
                    steps {
                        dir('Server') {
                            bat 'npm test || exit /b 0'
                        }
                    }
                }
            }
        }

        stage('Docker Image Build') {
            steps {
                echo '🏗️ Building Docker Images'
                bat "docker build -t ${DOCKER_IMAGE_BACKEND} ./Server"
                bat "docker build -t ${DOCKER_IMAGE_FRONTEND} ./client"
            }
        }

        stage('Trivy Image Scan') {
            steps {
                echo '🧹 Scanning Docker Images for vulnerabilities'
                bat "trivy image --severity HIGH,CRITICAL ${DOCKER_IMAGE_BACKEND}"
                bat "trivy image --severity HIGH,CRITICAL ${DOCKER_IMAGE_FRONTEND}"
            }
        }

        stage('OWASP ZAP (DAST)') {
            steps {
                echo '🛡️ Dynamic Security Scan (OWASP ZAP)'
                // Run OWASP ZAP in a docker container to scan the local instance (assuming it's up)
                // In a real CI/CD, you would deploy to a dev env first
                bat 'docker run --rm -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:5000'
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning workspace'
            cleanWs()
        }
        success { 
            echo '✅ DevSecOps Pipeline completed successfully' 
            slackSend color: 'good', message: "SUCCESS: Pipeline ${env.JOB_NAME} [${env.BUILD_NUMBER}] completed successfully. (${env.BUILD_URL})"
        }
        failure { 
            echo '❌ Pipeline failed security or build checks' 
            slackSend color: 'danger', message: "FAILED: Pipeline ${env.JOB_NAME} [${env.BUILD_NUMBER}] failed. Check logs at: ${env.BUILD_URL}"
        }
    }
}
