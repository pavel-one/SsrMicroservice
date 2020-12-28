init:
	bash bin/init.sh
build:
	docker-compose up --build -d
up:
	docker-compose up -d
down:
	docker-compose stop
exec:
	docker-compose exec app bash
status:
	docker-compose ps
rm:
	docker-compose rm
restart:
	make down && make up