.PHONY: status up restart down pull stop commands mongo mariadb Ory_Hydra rest-service portainer

status:
	docker ps -a --format "table {{.Names}}\t{{.ID}}\t{{.Status}}\t{{.Command}}\t{{.Ports}}"

USERNAME := $(shell whoami)

UP=docker-compose up -d

service:
	$(UP) rest-service

min:
	$(UP) mongo mariadb  Ory_Hydra
	$(UP) portainer

up:
	make min
	sleep 5
	make service

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