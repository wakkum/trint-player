SHELL	:= /bin/bash

CURRENT_VERSION	= $(shell node -p 'require("./package.json").version')

UMD_BUILD_FILES = \
	trint-player.js \
	trint-player.min.js

CLI_SUCCESS	= \033[1;32m✔
CLI_RESET	= \033[0m

# Development

default:	build

# Build

build:	node_modules clean lib $(UMD_BUILD_FILES) babel.min.js

lib:
	@$$(npm bin)/babel src --ignore __tests__ --out-dir $@
	@echo -e "$(CLI_SUCCESS) Built $@$(CLI_RESET)"

trint-player.js:
	@NODE_ENV=development BABEL_ENV=rollup $$(npm bin)/rollup src/trint-player --config=rollup.config.js --output=dist/$@
	@echo -e "$(CLI_SUCCESS) Built $@$(CLI_RESET)"

trint-player.min.js:
	@NODE_ENV=production BABEL_ENV=rollup $$(npm bin)/rollup src/trint-player --config=rollup.config.js --output=dist/$@
	@echo -e "$(CLI_SUCCESS) Built $@$(CLI_RESET)"

babel.min.js: node_modules/babel-standalone/babel.min.js
	@cp $< $@

# Other

clean:
	@rm -rf -- lib dist

# Dependencies

node_modules: package.json
	@npm install --ignore-scripts
	@/usr/bin/touch $@
