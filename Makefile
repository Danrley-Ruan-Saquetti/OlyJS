clean:
	@rm -rf build native/build web/build
	@docker compose down
.PHONY: clean

build:
	docker compose up engine-build -d
	docker compose up web-build -d
.PHONY: build

build_dev:
	docker compose up engine-build -d
	docker compose up web-dev -d
.PHONY: build_dev

serve:
	docker compose up serve -d
.PHONY: serve

dev:
	make build_dev
	make serve
.PHONY: dev

all: build
