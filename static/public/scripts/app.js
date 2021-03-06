(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("initialize", function(exports, require, module) {
require('lib/helpers');

require('routers/main');

window.iOS = Boolean(navigator.userAgent.match(/(iPad|iPhone|iPod)/g));

$(function() {
  return Backbone.history.start({
    pushState: true
  });
});

});

;require.register("lib/helpers", function(exports, require, module) {
Swag.Config.partialsPath = '../views/templates/';

});

;require.register("models/home", function(exports, require, module) {
var HomeModel, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = HomeModel = (function(_super) {
  __extends(HomeModel, _super);

  function HomeModel() {
    _ref = HomeModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return HomeModel;

})(Backbone.Model);

});

;require.register("models/song", function(exports, require, module) {
var Song, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Song = (function(_super) {
  __extends(Song, _super);

  function Song() {
    _ref = Song.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Song.prototype.url = function() {
    return "/api/songInfo/" + (this.get('id'));
  };

  return Song;

})(Backbone.Model);

});

;require.register("routers/main", function(exports, require, module) {
var HomeView, MainRouter, Song, SongView, activateView, main, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

HomeView = require("../views/home");

Song = require("../models/song");

SongView = require("../views/song");

activateView = function(ViewCls) {
  var homeView;
  homeView = new ViewCls().render();
  return $("section.app").empty().append(homeView.el);
};

MainRouter = (function(_super) {
  __extends(MainRouter, _super);

  function MainRouter() {
    _ref = MainRouter.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  MainRouter.prototype.routes = {
    'song/:sid': "song",
    '': "home"
  };

  MainRouter.prototype.home = function() {
    return activateView(HomeView);
  };

  MainRouter.prototype.song = function(sid) {
    var song, songView;
    song = new Song({
      id: sid
    });
    songView = new SongView({
      model: song
    }).render();
    return $("section.app").empty().append(songView.el);
  };

  MainRouter.prototype.createCounter = function() {
    return $("section.app").empty().append('<p>create</p>');
  };

  return MainRouter;

})(Backbone.Router);

main = new MainRouter();

module.exports = main;

});

;require.register("views/home", function(exports, require, module) {
var HomeModel, HomeView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

HomeModel = require('../models/home');

module.exports = HomeView = (function(_super) {
  __extends(HomeView, _super);

  function HomeView() {
    _ref = HomeView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HomeView.prototype.model = new HomeModel();

  HomeView.prototype.template = require('views/templates/home');

  HomeView.prototype.initialize = function() {
    return this.disabled = false;
  };

  HomeView.prototype.render = function() {
    var _this = this;
    this.$el.html(this.template());
    setTimeout(function() {
      return _this.$("input").focus();
    }, 500);
    return this;
  };

  HomeView.prototype.events = {
    "click .btn-primary": "requestLink",
    "submit form": "requestLink"
  };

  HomeView.prototype.requestLink = function(e) {
    var originalLink,
      _this = this;
    e.preventDefault();
    originalLink = this.$el.find("input").val();
    if (originalLink.length === 0) {
      return;
    }
    if (this.disabled) {
      return;
    }
    this.disabled = true;
    return $.get("/api/findSong", {
      originalLink: originalLink
    }).done(function(res) {
      return window.location.href = "/song/" + res;
    }).fail(function(res) {
      _this.$(".search-fail").slideDown();
      _this.disabled = false;
      _this.$(".btn-primary").attr("disabled", "disabled");
      return _this.$("input").on("keydown", function() {
        _this.$(".search-fail").slideUp();
        return _this.$(".btn-primary").removeAttr("disabled");
      });
    });
  };

  return HomeView;

})(Backbone.View);

});

;require.register("views/song", function(exports, require, module) {
var SongView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = SongView = (function(_super) {
  __extends(SongView, _super);

  function SongView() {
    _ref = SongView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SongView.prototype.template = require('views/templates/song');

  SongView.prototype.initialize = function() {
    this.listenTo(this.model, "sync", this.render, this);
    return this.model.fetch();
  };

  SongView.prototype.events = {
    "click .rdio-open": "rememberRdio",
    "click .spotify-open": "rememberSpotify",
    "click .forget-preference": "forgetPreference"
  };

  SongView.prototype.render = function() {
    var ctx, pref,
      _this = this;
    pref = typeof localStorage !== "undefined" && localStorage !== null ? localStorage.SONGLINK_SERVICE_PREFERENCE : void 0;
    ctx = _(this.model.attributes).clone();
    if (ctx.rdio_track != null) {
      if (window.iOS) {
        ctx.rdio_link = ctx.rdio_track.shortUrl.replace("http:\/\/", "rdio:\/\/");
      } else {
        ctx.rdio_link = "http://rdio.com" + ctx.rdio_track.url;
      }
    }
    ctx.redirecting = false;
    if (this.model.get("rdio_track") && pref === "rdio") {
      ctx.redirecting = true;
      ctx.redirect_preference = "Rdio";
    }
    if (this.model.get("spotify_track") && pref === "spotify") {
      ctx.redirecting = true;
      ctx.redirect_preference = "Spotify";
    }
    if (ctx.rdio_track) {
      ctx.album_img = ctx.rdio_track.icon400 || ctx.rdio_track.icon;
    }
    this.$el.html(this.template(ctx));
    if (ctx.redirecting) {
      setTimeout(function() {
        return _this.$(".redirect-notify").slideDown();
      }, 1000);
      setTimeout(function() {
        return _this.doRedirect(ctx);
      }, 4000);
    }
    return this;
  };

  SongView.prototype.doRedirect = function(ctx) {
    var pref;
    if (localStorage.SONGLINK_SERVICE_PREFERENCE == null) {
      return;
    }
    pref = localStorage.SONGLINK_SERVICE_PREFERENCE;
    if (pref === "rdio") {
      window.location.href = ctx.rdio_link;
      return;
    }
    if (pref === "spotify") {
      window.location.href = ctx.spotify_track.href;
      this.$(".redirect-notify h3").text("Redirect Complete.");
    }
  };

  SongView.prototype.rememberRdio = function() {
    localStorage.SONGLINK_SERVICE_PREFERENCE = "rdio";
    return true;
  };

  SongView.prototype.rememberSpotify = function() {
    localStorage.SONGLINK_SERVICE_PREFERENCE = "spotify";
    return true;
  };

  SongView.prototype.forgetPreference = function(e) {
    delete localStorage.SONGLINK_SERVICE_PREFERENCE;
    this.$(".redirect-notify").slideUp();
    return e.preventDefault();
  };

  return SongView;

})(Backbone.View);

});

;require.register("views/templates/home", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<!-- .home -->\n<div class='row-fluid band pinkband'>\n    <div class='row-fluid'>\n        <h4>Enter a URL for a Song:</h4>\n        <div class='row-fluid'>\n            <form class='song-url-form'>\n                <div class='search-fail'>\n                    Did not understand that link. Songlink supports Rdio and Spotify links.\n                </div>\n                <input type=\"text\"></input>\n            </form>\n            <div class='btn btn-primary btn-large' style='margin-top: 30px'>Create Link</div>\n        </div>\n    </div>\n</div>\n";
  });
});

;require.register("views/templates/song", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <div class='row-fluid redirect-notify' style='margin-bottom: 30px; text-align: center; display: none;'>\n                <div class='span12'>\n                    <h3>Redirecting to ";
  if (stack1 = helpers.redirect_preference) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.redirect_preference; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "...</h3>\n                    <h4>(<a href='#' class='forget-preference'>Forget Preference</a>)</h4>\n                </div>\n            </div>\n        ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                <div class='span4'>\n                    <img src=\"";
  if (stack1 = helpers.album_img) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.album_img; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" style=''></img>\n                </div>\n            ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                            <h3>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h3>\n                        ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                            <h4>by ";
  if (stack1 = helpers.artist_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.artist_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h4>\n                        ";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                            <a href=\"";
  if (stack1 = helpers.rdio_link) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.rdio_link; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class='btn btn-lg btn-info rdio-open' style='margin-bottom: 20px;'>Open in Rdio</a>\n                        ";
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                            <a href=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.spotify_track),stack1 == null || stack1 === false ? stack1 : stack1.href)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class='btn btn-lg btn-success spotify-open' style='margin-bottom: 20px'>Open in Spotify</a>\n                        ";
  return buffer;
  }

  buffer += "<!-- .song -->\n<div class='row-fluid band pinkband'>\n    <div class='row-fluid'>\n        ";
  stack1 = helpers['if'].call(depth0, depth0.redirecting, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        <div class='row-fluid'>\n            ";
  stack1 = helpers['if'].call(depth0, depth0.rdio_track, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            <div class='span8'>\n                <div class='row-fluid'>\n                    <div class='row-fluid'>\n                        ";
  stack1 = helpers['if'].call(depth0, depth0.title, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                        ";
  stack1 = helpers['if'].call(depth0, depth0.artist_name, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                    </div>\n                    <div class='row-fluid'>\n                        ";
  stack1 = helpers['if'].call(depth0, depth0.rdio_track, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                        ";
  stack1 = helpers['if'].call(depth0, depth0.spotify_track, {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n";
  return buffer;
  });
});

;
//# sourceMappingURL=app.js.map