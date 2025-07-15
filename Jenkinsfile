pipeline {
    agent any
    environment {
        DOCKER_BUILDKIT = 1
        COMPOSE_DOCKER_CLI_BUILD = 1
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Docker Compose') {
            steps {
                sh 'docker compose -f docker-compose.yml build --parallel'
            }
        }
        stage('Run Tests (Backend)') {
            steps {
                // Предположим, у тебя есть тесты в NestJS
                sh 'docker compose run --rm backend pnpm test'
            }
        }
        stage('Run Tests (Frontend)') {
            steps {
                // Например, есть unit-тесты во frontend
                sh 'docker compose run --rm frontend pnpm test'
            }
        }
        stage('Lint (Backend & Frontend)') {
            steps {
                sh 'docker compose run --rm backend pnpm lint'
                sh 'docker compose run --rm frontend pnpm lint'
            }
        }
        // Можно добавить деплой или архивирование артефактов
    }
    post {
        always {
            sh 'docker compose down -v'
        }
    }
}
