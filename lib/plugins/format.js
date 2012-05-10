(function() {
  var Format,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Format = (function(_super) {

    __extends(Format, _super);

    Format.name = 'Format';

    function Format() {
      this.template = __bind(this.template, this);
      return Format.__super__.constructor.apply(this, arguments);
    }

    Format.prototype.tabTitle = 'Format';

    Format.prototype.defaults = {
      controls: ['bold', 'italic', 'link', 'unlink']
    };

    Format.prototype.initialize = function() {
      return Format.__super__.initialize.apply(this, arguments);
    };

    Format.prototype.events = {
      'click a.control': '_exec'
    };

    Format.prototype.template = function() {
      return _.template("		<ul class='controls'>			<% _.each(options, function(control){ %>			<li><a href='#' class='control <%= control %>' data-command='<%= control %>'><%= control %></a></li>			<% }); %>		</ul>")({
        options: this.options.controls
      });
    };

    return Format;

  })(Edit.Plugin);

  Edit.Plugin.add('format', Format);

}).call(this);
