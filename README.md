# Redirect By ID for Sphinx

This extension originated as part of the discussion in
https://github.com/sphinx-doc/sphinx/issues/9574.

When building a Sphinx project into HTML, the permalinks on entities still
contains the specific page the entity is located on, along with the ID of the
entity. If the pages are later restructured and entities are moved to different
pages, the old permalinks will be dead.

This extension adds a new page `redirect.html` which can be given an ID. The
page will use the existing search index of the project to redirect to the page
where the entity is located.
For example, if you have a page `api.html` where a Python function `f` is
documented, then its permalink may be `https://example.com/api.html#f`. If you
then browse to `https://example.api.html?q=f` you will be redirected to
`https://example.com/api.html#f`.
If the entry is not found, then it redirects to search.html page with the same
question string.

## Installation

1. Install the extension:

     python3 -m pip install sphinx-redirect-by-id

2. Add it to `conf.py`:

   ```py
   extensions = [
       'sphinx_redirect_by_id',
   ]
   ```
