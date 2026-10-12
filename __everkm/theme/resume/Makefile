.PHONY: build fe-install

fe-install:
	pnpm i

build:
	@if [ ! -d node_modules ]; then pnpm i; fi
	pnpm run build:jsrender
