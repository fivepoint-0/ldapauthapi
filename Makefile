SHELL := /bin/bash 
.DEFAULT_GOAL := all

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

all: env image