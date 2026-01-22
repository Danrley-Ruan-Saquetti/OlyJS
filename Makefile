clean:
	@rm -rf dist
	@docker compose down -v
.PHONY: clean

build:
	docker compose up build -d
.PHONY: build

build_dev:
	docker compose stop dev
	docker compose up dev -d
.PHONY: build_dev

serve:
	docker compose stop serve
	docker compose up serve -d
.PHONY: serve

dev:
	docker compose stop dev serve
	docker compose up dev serve -d
.PHONY: dev

test:
	docker compose up test -d
.PHONY: test

all: build
