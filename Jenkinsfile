pipeline {
    agent any
    stages {
        stage('Pull Code') {
            steps {
                git branch: 'ashish-dev', credentialsId: '10', url: 'https://github.com/kcmobile/nosy-store-admin-ng18.git'
            }
        }
        stage('Build and Deploy') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose pull'
                sh 'docker-compose up -d'
            }
        }
    }
}
