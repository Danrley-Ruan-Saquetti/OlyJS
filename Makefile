clean:
	@rm -rf dist
	@docker compose down -v
.PHONY: clean

build:
	docker compose up build -d
.PHONY: build

build_dev:
	docker compose up dev -d
.PHONY: build_dev

serve:
	docker compose up serve -d
.PHONY: serve

dev:
	make build_dev
	make serve
.PHONY: dev

all: build
