SHELL := /bin/bash 

up:
	@if [[ `docker images | grep sessionapi` ]]; then \
		docker-compose up -V --force-recreate -d; \
	else \
		echo no; \
	fi

down:
	@docker-compose down

image:
	@docker build . -t sessionapi --no-cache

env:
	@echo API_SERVER_PORT=3000 > .env
	@echo MONGO_CONTAINER_PORT=27017 >> .env
	@echo LDAP_GENERIC_USERNAME=gen_username >> .env
	@echo LDAP_GENERIC_PASSWORD=gen_password_123_! >> .env
