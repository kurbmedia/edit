(function() {
  var Plugin, cache,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Plugin = (function(_super) {

    __extends(Plugin, _super);

    Plugin.name = 'Plugin';

    function Plugin() {
      this._show = __bind(this._show, this);

      this._hide = __bind(this._hide, this);

      this._exec = __bind(this._exec, this);

      this._editor = __bind(this._editor, this);

      this.exec = __bind(this.exec, this);
      return Plugin.__super__.constructor.apply(this, arguments);
    }

    Plugin.add = function(name, plugin) {
      return cache[name] = plugin;
    };

    Plugin.load = function(name) {
      return cache[name];
    };

    Plugin.prototype.tagName = 'div';

    Plugin.prototype.className = 'tool-panel';

    Plugin.prototype.defaults = {};

    Plugin.prototype.tabTitle = 'Missing Title';

    Plugin.prototype.editor = null;

    Plugin.prototype.template = "";

    Plugin.prototype.exec = function(cmd) {
      return this._editor().exec(cmd);
    };

    Plugin.prototype.initialize = function() {
      this.options = _.defaults(this.options, this.defaults);
      this.on("inactive", this._hide);
      this.on("active", this._show);
      return this;
    };

    Plugin.prototype.render = function() {
      Plugin.__super__.render.apply(this, arguments);
      this.$el.html(this.template());
      return this;
    };

    Plugin.prototype._editor = function() {
      return this.editor || (this.editor = Edit._instance());
    };

    Plugin.prototype._exec = function(event) {
      var cmd, link;
      event.preventDefault();
      event.stopImmediatePropagation();
      link = $(event.currentTarget);
      if (!link.hasClass('disabled')) {
        cmd = link.attr('data-command');
        return this.exec(cmd);
      }
    };

    Plugin.prototype._hide = function() {
      return this.$el.hide();
    };

    Plugin.prototype._show = function() {
      return this.$el.show();
    };

    return Plugin;

  })(Backbone.View);

  cache = {};

  Edit.Plugin = Plugin;

}).call(this);
