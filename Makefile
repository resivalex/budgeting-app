.PHONY: up down restart logs dev-up dev-down

# Production targets
up:
	docker network create traefik || true
	docker-compose up -d

down:
	docker-compose down

restart: down up

logs:
	docker-compose logs -f

# Development targets
dev-up:
	docker-compose -f docker-compose.dev.yml up

dev-down:
	docker-compose -f docker-compose.dev.yml down
