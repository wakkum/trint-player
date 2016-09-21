SHELL:=/bin/bash --login

# Default task

default:	dev

# Define some env vars

NODE_VERSION=6.2.2

export NVM_BIN=$(HOME)/.nvm/versions/node/v$(NODE_VERSION)/bin
export NVM_DIR=$(HOME)/.nvm
export NVM_PATH=$(HOME)/.nvm/versions/node/v$(NODE_VERSION)/lib/node
export PATH:=$(NVM_BIN):$(PATH)

$(NVM_BIN):
	source $(NVM_DIR)/nvm.sh; nvm install $(NODE_VERSION)

node:	$(NVM_BIN)

# Init

init: cleanall node_modules

# Dev

dev: node_modules
	STYLEGUIDE_URI=`./static` \
	$(NVM_BIN)/node ./node_modules/webpack-dev-server/bin/webpack-dev-server.js

# Build

dist:	node_modules clean
	$(NVM_BIN)/node ./node_modules/webpack/bin/webpack.js -b --optimize-minimize --bail --config webpack.build.config.js
	cp -p ./static/index.html ./dist/index.html

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

node_modules: node package.json
	$(NVM_BIN)/npm --cache-min 86400 --cache-max 432000 install
