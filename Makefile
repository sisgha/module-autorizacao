dev-setup:

	$(shell (cd devops/development; find . -type f -name "*.example" -exec sh -c 'cp -n {} $$(basename {} .example)' \;))

	$(shell sudo docker network create sisgea-net 2>/dev/null)

dev-up:
	make dev-setup;
	sudo docker compose --file devops/development/docker-compose.yml -p sisgea-module-autorizacao up -d --remove-orphans;

dev-shell:
	make dev-up;
	sudo docker compose --file devops/development/docker-compose.yml -p sisgea-module-autorizacao exec sisgea-module-autorizacao bash;

dev-down:
	sudo docker compose --file devops/development/docker-compose.yml -p sisgea-module-autorizacao stop

dev-logs:
	sudo docker compose --file devops/development/docker-compose.yml -p sisgea-module-autorizacao logs -f
