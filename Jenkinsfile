pipeline {
    agent {label 'PARALLELPUBLISHING'}
    
    parameters{
        string(name: 'branch', defaultValue: 'develop', description: '')
        booleanParam(defaultValue: false, description: 'Node Install', name: 'NodeInstall')
        booleanParam(defaultValue: false, description: 'Only trigger run pm2', name: 'RunPm2')
    }
    
    environment {
        GIT_ENDPOINT = "https://github.com"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "${params.branch}"]],
                        extensions: [[$class: 'WipeWorkspace']],
                        userRemoteConfigs: [[credentialsId: 'sonarsuccesssoftware', url: "${GIT_ENDPOINT}//fmitech/parallel-publishing-tools.git"]]]
                    )
                    
                }
            }
        }
		
        stage('Deploy') {
            steps {
                script {
                    nodejs(nodeJSInstallationName: 'node14170') {
                        sh "node -v"
                        if (params.RunPm2) {
                            sh "cd /var/www/frontend/pp-tools-dev/ && /home/ppdeploy/.nvm/versions/node/v14.17.0/bin/pm2 start index.dev.js && /home/ppdeploy/.nvm/versions/node/v14.17.0/bin/pm2 save"
                        } else {
                            sh "node -v"

                            if (params.NodeInstall) {
                                sh "npm install"
                                sh "cp -Rf ./node_modules /jenkins/workspace/"
                            } else {
                                sh "cp -Rf /jenkins/workspace/node_modules ."
                            }
                    
                            sh "npm run build-testing"
                            sh "rm -rf /var/www/frontend/pp-tools-dev/*"
                            sh "ls -lia /var/www/frontend/pp-tools-dev/"
                            sh "cp -vRT dist/ /var/www/frontend/pp-tools-dev/"
                            sh "cp /var/www/frontend/index.dev.js /var/www/frontend/pp-tools-dev/index.dev.js"
                            sh "cd /var/www/frontend/pp-tools-dev/ && npm i && /home/ppdeploy/.nvm/versions/node/v14.17.0/bin/pm2 stop index.dev.js && /home/ppdeploy/.nvm/versions/node/v14.17.0/bin/pm2 save"
                            sh "cd /var/www/frontend/pp-tools-dev/ && /home/ppdeploy/.nvm/versions/node/v14.17.0/bin/pm2 start index.dev.js && /home/ppdeploy/.nvm/versions/node/v14.17.0/bin/pm2 save"
                        }
                    }
                }
            }
        }
    }
    
    post { 
        always { 
            cleanWs()
        }
    }
}
