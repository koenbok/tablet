bootstrap:
	@test -d ./node_modules || yarn

build: bootstrap
	@rm -Rf dist
	./node_modules/.bin/tsc

test: bootstrap
	./node_modules/.bin/jest --watch

docs: bootstrap
	./node_modules/.bin/typedoc --out dist/docs