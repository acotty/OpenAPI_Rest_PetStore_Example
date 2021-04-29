.PHONY: status up restart down pull stop commands mongo mariadb Ory_Hydra rest-service portainer

status:
	docker ps -a --format "table {{.Names}}\t{{.ID}}\t{{.Status}}\t{{.Command}}\t{{.Ports}}"

USERNAME := $(shell whoami)

UP=docker-compose up -d

migrate:
	docker stop hydra-migrate
	docker rm hydra-migrate
	$(UP) hydra-migrate

services:
	$(UP) mongo mariadb postgresd
	$(UP) rest-service
	
mariadb:
	$(UP) mariadb 
	$(UP) portainer

postgres:
	$(UP) postgresd
	$(UP) portainer

mysql:
	$(UP) portainer mysql

up:
	$(UP) portainer mysql
	sleep 10
	$(UP) keycloak

up2:
	$(UP) portainer mariadb
	$(UP) wso2am-analytics-worker wso2is-as-km wso2api-manager wso2am-analytics-dashboard
	$(UP) adminer 

service:
	sleep 5
	make service

portainer:
	$(UP) portainer

restart:
	docker-compose stop
	docker-compose start mongo mariadb
	sleep 1
	docker-compose start rest-service
	sleep 1
	docker-compose start portainer
down:
	docker-compose down --remove-orphans --volumes
pull:
	docker-compose pull
stop:
	docker-compose stop

restservicerebuild:
	sudo chown -R $(USERNAME) *
	docker stop service-model
	sleep 5
	docker rm service-model
	sleep 5
	docker rmi gaming-service-models_service-model
	yarn run server-build
	$(UP) service-model
	sudo chown -R $(USERNAME) *

commands:
	@echo "================================================"
	@echo "make commands:                                  "
	@echo "    up                 down                     "
	@echo "    restart            pull                     "
	@echo "    stop               service                  "
	@echo "    status             restservicerebuild       "
	@echo "================================================"