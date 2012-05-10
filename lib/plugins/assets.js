(function() {
  var Assets,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Assets = (function(_super) {

    __extends(Assets, _super);

    Assets.name = 'Assets';

    function Assets() {
      this.template = __bind(this.template, this);
      return Assets.__super__.constructor.apply(this, arguments);
    }

    Assets.prototype.tabTitle = 'Assets';

    Assets.prototype.items = null;

    Assets.prototype.initialize = function() {
      Assets.__super__.initialize.apply(this, arguments);
      this.items = new Edit.Assets();
      this.items.url = this.options.url;
      this.items.fetch();
      return this;
    };

    Assets.prototype.template = function() {
      return _.template("		<ul class='controls'>			<li><a href='#' class='control image' data-command='image'>Image</a></li>			<li><a href='#' class='control link' data-command='link'>Link</a></li>		</ul>	")();
    };

    return Assets;

  })(Edit.Plugin);

  Edit.Assets = (function(_super) {

    __extends(Assets, _super);

    Assets.name = 'Assets';

    function Assets() {
      return Assets.__super__.constructor.apply(this, arguments);
    }

    Assets.prototype.model = Edit.Asset;

    return Assets;

  })(Backbone.Collection);

  Edit.Asset = (function(_super) {

    __extends(Asset, _super);

    Asset.name = 'Asset';

    function Asset() {
      return Asset.__super__.constructor.apply(this, arguments);
    }

    Asset.prototype.defaults = {
      title: '',
      source: '',
      type: 'file'
    };

    return Asset;

  })(Backbone.Model);

  Edit.Plugin.add("assets", Assets);

}).call(this);
