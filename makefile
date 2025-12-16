build:
	docker compose up build -d
.PHONY: build

build_dev:
	docker compose up build_dev -d
.PHONY: build_dev

serve:
	docker compose up serve -d
.PHONY: build_dev

all: build_dev
