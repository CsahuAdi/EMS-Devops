pipeline {
    agent any

    stages {
        stage('Build Docker Images') {
            steps {
                sh 'eval $(minikube docker-env) && docker build -t event-service:latest ./event-service'
                sh 'eval $(minikube docker-env) && docker build -t registration-service:latest ./registration-service'
                sh 'eval $(minikube docker-env) && docker build -t frontend:latest ./frontend'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'kubectl get pods'
                sh 'kubectl get services'
            }
        }
    }
}