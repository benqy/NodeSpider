(function(){
  var events = require('events'),
      http = require('http'),
      path = require('path'),
      url = require('url'),
      util = require('util');

  function HttpAgent(urls, options) {
    events.EventEmitter.call(this);

    options = options || {};
    if (urls && Array.isArray(urls)) {
      options.urls = urls;
    }

    this.url = '';
    this.options = {};

    var self = this;

    this._running = false;
    this._visited = [];
    this._unvisited = options.urls || [];

    this.addListener('error', function (e) {
    });
  }

  util.inherits(HttpAgent, events.EventEmitter);

  HttpAgent.prototype.addUrl = function(url) {
    if (url) {
      this._unvisited = this._unvisited.concat(url);
    }
  };

  HttpAgent.prototype.start = function () {
    if (!this._running) {
      this._running = true;
      this.emit('start', null, this);
      this.next();
    }
  };

  HttpAgent.prototype.stop = function () {
    if (this._running) {
      this._running = false;
      this.emit('stop', null, this);
    }
  };

  HttpAgent.prototype.next = function (url) {
    if (this._running) {
      var index = this._unvisited.indexOf(url);
      if (index !== -1) {
        this._unvisited = this._unvisited.splice(index, 1);  
      }

      var shouldVisit = url || this._unvisited.length > 0;

      if (shouldVisit) {
        this.url = url || this._unvisited.shift();
        this._load(this.url);
      }
      else {
        this.stop();
      }
    }
  };

  HttpAgent.prototype._load = function (url) {

    var self = this;
    $.ajax({
      url:url
    })
    .done(function( data ) {
      self.current = url;
      self._visited.unshift(url);
      self.emit('next', null, {
        url:url,
        html:data
      });
    })
    .fail(function() {
      self.emit('next',null,{
        error:true,
        url:url
      });
    });
  };
  window.HttpAgent = HttpAgent;
})();