#
# Vars
#

BIN = ./node_modules/.bin

#
# Tasks
#

node_modules: package.json
	@npm install

test: node_modules
	@${BIN}/tape -r babel-register -r babel-polyfill test/*

validate: node_modules
	@standard

clean:
	@rm -rf lib

build: clean
	babel src --out-dir lib

.PHONY: test validate release
