help:
	@echo "See the Makefile."

.PHONY: build
build:
	rm -rf dist
	python3 -m build

.PHONY: upload-test
upload-test:
	python3 -m twine upload --repository testpypi dist/*

PHONY: upload-real
upload-real:
	python3 -m twine upload dist/*
