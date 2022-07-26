import os
from sphinx.util.fileutil import copy_asset_file


def on_config_inited(app, config) -> None:
	path = os.path.abspath(os.path.dirname(__file__))
	app.config.templates_path.append(path)
	app.config.html_additional_pages['redirect'] = 'redirect.html_t'


def on_build_finished(app, exc) -> None:
	# https://www.sphinx-doc.org/en/master/development/theming.html#add-your-own-static-files-to-the-build-assets
	if app.builder.format != 'html':
		return
	if exc is not None:
		return
	staticdir = os.path.join(app.builder.outdir, '_static')
	path = os.path.abspath(os.path.dirname(__file__))
	copy_asset_file(os.path.join(path, 'redirecttools.js'), staticdir)


def setup(app):
	app.connect('config-inited', on_config_inited)
	app.connect('build-finished', on_build_finished)

	return {
		'version': '0.1',
		'env_version': 1,
		'parallel_read_safe': True,
		'parallel_write_safe': True,
	}
