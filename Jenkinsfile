pipeline {
    agent any

    environment {
        EC2_HOST = "65.2.168.251"
        EC2_USER = "ubuntu"
        APP_DIR = "/home/ubuntu/EMS_Devops"
    }

    stages {
        stage('Deploy to EC2') {
            steps {
                sh '''
ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} << EOF
set -e
cd ${APP_DIR}
git pull origin main

if command -v docker-compose >/dev/null 2>&1; then
    docker-compose down
    docker-compose up --build -d
else
    docker compose down
    docker compose up --build -d
fi

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