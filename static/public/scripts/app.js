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
require.register("collections/Counters", function(exports, require, module) {
var CountersCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = CountersCollection = (function(_super) {
  __extends(CountersCollection, _super);

  function CountersCollection() {
    _ref = CountersCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  CountersCollection.prototype.model = require('models/Counters');

  return CountersCollection;

})(Backbone.Collection);

});

;require.register("initialize", function(exports, require, module) {
require('lib/helpers');

require('routers/main');

$(function() {
  return Backbone.history.start({
    pushState: true
  });
});

});

;require.register("lib/helpers", function(exports, require, module) {
Swag.Config.partialsPath = '../views/templates/';

});

;require.register("models/Counter", function(exports, require, module) {
var CounterModel, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = CounterModel = (function(_super) {
  __extends(CounterModel, _super);

  function CounterModel() {
    _ref = CounterModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return CounterModel;

})(Backbone.Model);

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

;require.register("routers/main", function(exports, require, module) {
var HomeView, MainRouter, activateView, main, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

HomeView = require("../views/home");

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
    '': "home",
    'counters/new': 'createCounter'
  };

  MainRouter.prototype.home = function() {
    return activateView(HomeView);
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

  HomeView.prototype.render = function() {
    this.$el.html(this.template());
    return this;
  };

  HomeView.prototype.events = {
    "click .btn-primary": "requestLink"
  };

  HomeView.prototype.requestLink = function() {
    var originalLink;
    originalLink = this.$el.find("input").val();
    console.log("requesting", originalLink);
    return $.get("/api/findSong", {
      originalLink: originalLink
    }).done(function(res) {
      return console.log("res was", res);
    });
  };

  return HomeView;

})(Backbone.View);

});

;require.register("views/templates/home", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<!-- .home -->\n<div class='row-fluid band pinkband'>\n    <div class='row-fluid'>\n        <h3>Enter a URL for a Song:</h3>\n        <input type=\"text\"></input>\n        <div class='btn btn-primary btn-large' style='margin-top: 30px'>Create Link</div>\n    </div>\n</div>\n";
  });
});

;
//# sourceMappingURL=app.js.map