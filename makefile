SHELL	:= /bin/bash

CURRENT_VERSION	= $(shell node -p 'require("./package.json").version')

UMD_BUILD_FILES = \
	trint-player.js \
	trint-player.min.js

CLI_SUCCESS	= \033[1;32m✔
CLI_RESET	= \033[0m

default:	dev

# Development

watch:
	npm run watch

dev:	node_modules clean watch

# Build

dist:	node_modules clean $(UMD_BUILD_FILES)

trint-player.js:
	@NODE_ENV=development $$(npm bin)/rollup src/trint-player --config=rollup.config.js --output=dist/$@
	@echo -e "$(CLI_SUCCESS) Built $@$(CLI_RESET)"

trint-player.min.js:
	@NODE_ENV=production $$(npm bin)/rollup src/trint-player --config=rollup.config.js --output=dist/$@
	@echo -e "$(CLI_SUCCESS) Built $@$(CLI_RESET)"

# Release

release:
	dist
	npm run patch-release

# Other

clean:
	@rm -rf -- dist

cleanall:
	@rm -rf -- node_modules dist

# Dependencies

node_modules: package.json
	@npm install --ignore-scripts
	@/usr/bin/touch $@
