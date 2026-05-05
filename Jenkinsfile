pipeline {
    agent any

    environment {
        EC2_HOST = "65.2.168.251"
        EC2_USER = "ubuntu"
        APP_DIR = "/home/ubuntu/EMS-Devops"
    }

    stages {
        stage('Deploy to EC2') {
    steps {
        sh '''
ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} << EOF
set -e
cd ${APP_DIR}

git fetch origin main
git reset --hard origin/main

docker-compose down
docker-compose up --build -d
docker ps
EOF
'''
    }
}

        stage('Verify Deployment') {
            steps {
                sh '''
ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} << EOF
docker ps
curl -I http://localhost:3000 || true
curl http://localhost:5000/health || true
curl http://localhost:5002/health || true
EOF
'''
            }
        }
    }
}