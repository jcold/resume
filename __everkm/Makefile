# everkm-publish 用本机二进制，不在本目录用 npm 安装。
EVERKM := /Users/dayu/.local/bin/everkm-publish

.PHONY: build theme

# 仓库根下一级 {side}/index.md → /{side}/index.html
SIDES := $(shell find .. -mindepth 2 -maxdepth 2 -name index.md ! -path '*/.*/*' -exec dirname {} \; | xargs -n1 basename)
START_FLAGS := $(foreach s,$(SIDES),--start-urls /$(s)/index.html)

theme:
	$(MAKE) -C theme/resume build

build: theme
	@test -n "$(strip $(SIDES))" || { echo "no {side}/index.md"; exit 1; }
	$(EVERKM) serve --work-dir .. --theme resume --export $(START_FLAGS)
