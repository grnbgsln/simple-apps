pipeline {
    agent { label 'dev-gerin' }

    stages {
        stage('Pull SCM') {
            steps {
                git branch: 'main', url: 'https://github.com/grnbgsln/simple-apps.git'
            }
        }
        
        stage('Build') {
            steps {
                sh'''
                cd app
                npm install
                '''
            }
        }
        
        stage('Testing') {
            steps {
                sh'''
                cd app
                npm test
                npm run test:coverage
                '''
            }
        }
        
        stage('Code Review') {
            steps {
                sh'''
                cd app
            sonar-scanner \
                -Dsonar.projectKey=simple-test \
                -Dsonar.sources=. \
                -Dsonar.host.url=http://172.23.8.121:9000 \
                -Dsonar.login=sqp_83246bd5ed691a9b57e588da0d2ad59fc18b7f29
                '''
            }
        }
        
        stage('Deploy') {
            steps {
                sh'''
                docker compose up --build -d
                '''
            }
        }
        
        stage('Backup') {
            steps {
                 sh 'docker compose push' 
            }
        }
    }
}