import os
import sys

# the path addition is probably not needed when installed by pip
sys.path.append(os.path.abspath('../../'))
extensions = [
	'sphinx_redirect_by_id',
]
