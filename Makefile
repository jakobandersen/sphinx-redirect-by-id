help:
	@echo "See the Makefile."

.PHONY: build
build:
	rm -rf dist
	python3 -m build

.PHONY: upload-test
upload-test:
	python3 -m twine upload --repository testpypi dist/*
