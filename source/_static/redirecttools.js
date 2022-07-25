/*
 * redirecthtools.js
 * ~~~~~~~~~~~~~~~~~
 *
 * Sphinx JavaScript utilities for redirecting to an entity given
 * its anchor.
 * Based on searchtools.js and uses searchindex.js as data source.
 *
 * :copyright: Copyright 2021-2022 by Jakob Lykke Andersen.
 * :license: BSD, see LICENSE for details.
 *
 */

"use strict";

// We load searchindex.js so we define this.setIndex to get the data.
var Search = {
  setIndex: (index) => Redirect.setIndex(index),
}

var Redirect = {
  _index: null,
  _queued_query: null,

  init: function() {
      const query = new URLSearchParams(window.location.search).get("q");
      if(query) {
          Redirect.performSearch(query);
      } else {
          const out = document.getElementById('search-results');
          out.innerHTML = '<p>No query ID provided. Use <code>?q=theId</code> to redirect.</p>';
      }
  },

  setIndex: function(index) {
    var q;
    this._index = index;
    if((q = this._queued_query) !== null) {
      this._queued_query = null;
      this.query(q);
    }
  },

  hasIndex: function() {
      return this._index !== null;
  },

  deferQuery: function(query) {
      this._queued_query = query;
  },

  /**
   * perform a search for ID (or wait until index is loaded)
   */
  performSearch: function(query) {
    // create the required interface elements
    this.out = document.getElementById('search-results');
    this.title = document.createElement('h2');
	this.out.appendChild(this.title);
    this.title.innerHTML = _('Searching') + '...';

    // index already loaded, the browser was quick!
    if(this.hasIndex())
      this.query(query);
    else
      this.deferQuery(query);
  },

  /**
   * execute search (requires search index to be loaded)
   */
  query: function(query) {
    var objects = this._index.objects;
    var result = Redirect.performObjectSearch(query);
    if(result) {
      var requestUrl = "";
      var linkUrl = "";
      if(DOCUMENTATION_OPTIONS.BUILDER === 'dirhtml') {
        // dirhtml builder
        var dirname = result[0] + '/';
        if(dirname.match(/\/index\/$/)) {
          dirname = dirname.substring(0, dirname.length-6);
        } else if(dirname == 'index/') {
          dirname = '';
        }
        requestUrl = DOCUMENTATION_OPTIONS.URL_ROOT + dirname;
        linkUrl = requestUrl;
      } else {
        // normal html builders
        requestUrl = DOCUMENTATION_OPTIONS.URL_ROOT + result[0] + DOCUMENTATION_OPTIONS.FILE_SUFFIX;
        linkUrl = result[0] + DOCUMENTATION_OPTIONS.LINK_SUFFIX;
      }
      var fullUrl = linkUrl + result[1];
      window.location.replace(fullUrl);
    } else {
      this.title.innerHTML = _('ID not found') + ": " + query;
    }
  },

  /**
   * search for object names
   */
  performObjectSearch: function(query) {
    var docnames = this._index.docnames;
    var objects = this._index.objects;
    var objnames = this._index.objnames;

    for(var prefix in objects) {
      for(var i = 0; i != objects[prefix].length; ++i) {
        var entry = objects[prefix][i];
        var name = entry[4];
        var fullname = (prefix ? prefix + '.' : '') + name;
        var objname = objnames[entry[1]][2];
        var anchor = entry[3];
        if(anchor === '')
          anchor = fullname;
        else if(anchor == '-')
          anchor = objnames[entry[1]][1] + '-' + fullname;
        if(anchor == query) {
         return [docnames[entry[0]], '#' + anchor];
        }
      }
    }
    return null;
  },
};

_ready(Redirect.init);
