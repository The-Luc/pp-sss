#!/bin/bash

func_init(){
	env=$ENV;
	cd /home/ppdeploy/jenkins/workspace/dev-pp-tools
	sudo chmod +x deploy.sh
	echo 'init'
}

func_installEVN(){
	nvm install 14.17.0
	echo 'installEVN'
}

func_build(){
	cd /home/ppdeploy/jenkins/workspace/dev-pp-tools
	case "$env" in

	1)  echo "dev"
		npm run build-testing
		;;
	2)  echo  "qa"
		npm run build-qa
		;;
	esac
	echo 'build'
}

func_deploy(){
	case "$env" in

	1)  echo "dev"
		rm -rf /var/www/frontend/pp-tools-dev/*
		cp -vRT /home/ppdeploy/jenkins/workspace/dev-pp-tools/dist/ /var/www/frontend/pp-tools-dev/
		cd /var/www/frontend/pp-tools-dev
		npm i
		cp ../index.dev.js ./
		pm2 start index.dev.js
		;;
	2)  echo  "qa"
		rm -rf /var/www/frontend/pp-tools-dev/*
		cp -vRT /home/ppdeploy/jenkins/workspace/dev-pp-tools/dist/ /var/www/frontend/pp-tools-qa/
		cd /var/www/frontend/pp-tools-qa
		npm i
		cp ../index.dev.js ./
		pm2 start index.dev.js
		;;
	esac
	echo 'deploy'
}

#
# Main
func_init;
func_installEVN;
func_build;
func_deploy;

