/*
 * searchtools.js
 * ~~~~~~~~~~~~~~~~
 *
 * Sphinx JavaScript utilities for the full-text search.
 *
 * :copyright: Copyright 2007-2021 by the Sphinx team, see AUTHORS.
 * :license: BSD, see LICENSE for details.
 *
 */

// We load searchindex.js so we define this.setIndex to get the data.
var Search = {
  setIndex : function(index) {
    Redirect.setIndex(index);
  },
}

var Redirect = {
  _index : null,
  _queued_query : null,
  _pulse_status : -1,

  init : function() {
      var params = $.getQueryParameters();
      if (params.q) {
          var query = params.q[0];
          this.performSearch(query);
      } else {
          var out = $('#search-results');
          var p = $('<p>No query ID provided. Use <code>?q=theId</code> to redirec.</p>').appendTo(out);
      }
  },

  setIndex : function(index) {
    var q;
    this._index = index;
	console.log("setIndex(", index, ")")
    if ((q = this._queued_query) !== null) {
      this._queued_query = null;
	  console.log("  queued_query:", q)
      this.query(q);
    }
  },

  hasIndex : function() {
      return this._index !== null;
  },

  deferQuery : function(query) {
      this._queued_query = query;
  },

  stopPulse : function() {
      this._pulse_status = 0;
  },

  startPulse : function() {
    console.log("startPulse")
    if (this._pulse_status >= 0)
        return;
    function pulse() {
      var i;
      this._pulse_status = (this._pulse_status + 1) % 4;
      var dotString = '';
      for (i = 0; i < this._pulse_status; i++)
        dotString += '.';
      Redirect.dots.text(dotString);
      if (this._pulse_status > -1)
        window.setTimeout(pulse, 500);
    }
    pulse();
  },

  /**
   * perform a search for ID (or wait until index is loaded)
   */
  performSearch : function(query) {
    // create the required interface elements
    this.out = $('#search-results');
    this.title = $('<h2>' + _('Searching') + '</h2>').appendTo(this.out);
    this.dots = $('<span></span>').appendTo(this.title);

    $('#search-progress').text(_('Preparing search...'));
    this.startPulse();

    // index already loaded, the browser was quick!
    if (this.hasIndex())
      this.query(query);
    else
      this.deferQuery(query);
  },

  /**
   * execute search (requires search index to be loaded)
   */
  query : function(query) {
    console.log("query(", query, ")");

    var objects = this._index.objects;
    console.log("objects:", objects);
    var result = Redirect.performObjectSearch(query);
      if (result) {
        var requestUrl = "";
        var linkUrl = "";
        if (DOCUMENTATION_OPTIONS.BUILDER === 'dirhtml') {
          // dirhtml builder
          var dirname = result[0] + '/';
          if (dirname.match(/\/index\/$/)) {
            dirname = dirname.substring(0, dirname.length-6);
          } else if (dirname == 'index/') {
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
        console.log("fullUrl:", fullUrl)
        window.location.replace(fullUrl);
      } else {
        Redirect.stopPulse();
        Redirect.title.text(_('ID not found') + ": " + query);
      }
  },

  /**
   * search for object names
   */
  performObjectSearch : function(query) {
    console.log("performObjectSearch(", query, ")")
    var docnames = this._index.docnames;
    var objects = this._index.objects;
    var objnames = this._index.objnames;

    for (var prefix in objects) {
       for (var i = 0; i != objects[prefix].length; ++i) {
          var entry = objects[prefix][i];
          var name = entry[4];
          var fullname = (prefix ? prefix + '.' : '') + name;
          var objname = objnames[entry[1]][2];
          var anchor = entry[3];
          if (anchor === '')
            anchor = fullname;
          else if (anchor == '-')
            anchor = objnames[entry[1]][1] + '-' + fullname;
          console.log("Candidate: fullname=%s, objname=%s, anchor=%s",
            fullname, objname, anchor)
          if (anchor == query) {
           console.log("Found it!")
           return [docnames[entry[0]], '#' + anchor];
          }
      }
    }
    return null;
  },
};

$(document).ready(function() {
  Redirect.init();
});
