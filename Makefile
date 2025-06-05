.PHONY: help
help:
	@echo "Available make commands:"
	@echo "  make install   - Install npm dependencies"
	@echo "  make dev       - Run the development server (npm run dev)"
	@echo "  make start     - Start the app (npm start)"
	@echo "  make clean     - Delete node_modules"

.PHONY: install
install:
	npm install

.PHONY: dev
dev:
	npm run dev

.PHONY: start
start:
	npm start

.PHONY: clean
clean:
	rm -rf node_modules
