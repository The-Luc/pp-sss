pipeline {
    agent {label 'PARALLELPUBLISHING'}

    parameters{
        booleanParam(defaultValue: false, description: 'Node Install', name: 'NodeInstall')
        booleanParam(defaultValue: false, description: 'Only trigger run pm2', name: 'RunPm2')
    }

    stages {
        stage('Copy Dependencies') {
            when {
                anyOf {
                    expression { params.NodeInstall != true }
                }
            }
            steps {
                script {
                    nodejs(nodeJSInstallationName: 'node14170') {
                        sh "cp -Rf /jenkins/workspace/node_modules ."
                    }
                }
            }
        }
        stage('Install Dependencies') {
            when {
                allOf {
                    anyOf {
                        expression { params.NodeInstall == true }
                        changeset "package-lock.json"
                        changeset "package.json"
                    }
                    anyOf {
                        branch 'develop'
                        branch 'qa'
                    }
                }
            }
            steps {
                script {
                    nodejs(nodeJSInstallationName: 'node14170') {
                        sh "npm install"
                        sh "cp -Rf ./node_modules /jenkins/workspace/"
                    }
                }
            }
        }

        stage('Lint') {
            when {
                anyOf {
                    expression { !(env.CHANGE_TARGET) == false }
                    branch 'develop'
                    branch 'qa'
                }
            }
            steps {
                script {
                    nodejs(nodeJSInstallationName: 'node14170') {
                        sh "npm run lint"
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'qa'
                }
            }
            stages {
                stage('Deploy-DEV') {
                    when { branch 'develop' }
                    steps {
                        script {
                            nodejs(nodeJSInstallationName: 'node14170') {
                                if (params.RunPm2) {
                                    sh "cd /var/www/frontend/pp-tools-dev/ && /home/ppdeploy/.nvm/versions/node/v14.17.0/bin/pm2 start index.dev.js && /home/ppdeploy/.nvm/versions/node/v14.17.0/bin/pm2 save"
                                } else {
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

                stage('Deploy-QA') {
                    when { branch 'qa' }
                    steps {
                        script {
                            nodejs(nodeJSInstallationName: 'node14170') {
                                if (params.RunPm2) {
                                    sh "cd /var/www/frontend/pp-tools-qa/ && /home/ppdeploy/.nvm/versions/node/v14.17.0/bin/pm2 start index.qa.js && /home/ppdeploy/.nvm/versions/node/v14.17.0/bin/pm2 save"
                                } else {
                                    sh "npm run build-qa"
                                    sh "rm -rf /var/www/frontend/pp-tools-qa/*"
                                    sh "ls -lia /var/www/frontend/pp-tools-qa/"
                                    sh "cp -vRT dist/ /var/www/frontend/pp-tools-qa/"
                                    sh "cp /var/www/frontend/index.qa.js /var/www/frontend/pp-tools-qa/index.qa.js"
                                    sh "cd /var/www/frontend/pp-tools-qa/ && npm i && /home/ppdeploy/.nvm/versions/node/v14.17.0/bin/pm2 stop index.qa.js && /home/ppdeploy/.nvm/versions/node/v14.17.0/bin/pm2 save"
                                    sh "cd /var/www/frontend/pp-tools-qa/ && /home/ppdeploy/.nvm/versions/node/v14.17.0/bin/pm2 start index.qa.js && /home/ppdeploy/.nvm/versions/node/v14.17.0/bin/pm2 save"
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Sonar-DEV') {
            when { branch 'develop' }
            steps {
                script {
                    sh "/jenkins/sonar-scanner/bin/sonar-scanner -Dsonar.projectKey=parallel-publishing-tools -Dsonar.branch.name=develop -Dsonar.host.url=https://sonar.successsoftware.global -Dsonar.login=7a6a5d675e00f15f417b7a277812bf6618a16c83"
                }
            }
        }

        stage('Sonar-QA') {
            when { branch 'qa' }
            steps {
                script {
                    sh "/jenkins/sonar-scanner/bin/sonar-scanner -Dsonar.projectKey=parallel-publishing-tools -Dsonar.branch.name=qa -Dsonar.host.url=https://sonar.successsoftware.global -Dsonar.login=7a6a5d675e00f15f417b7a277812bf6618a16c83"
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
