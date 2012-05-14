(function() {
  var Assets,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Assets = (function(_super) {

    __extends(Assets, _super);

    Assets.name = 'Assets';

    function Assets() {
      this._selection = __bind(this._selection, this);

      this.parse = __bind(this.parse, this);

      this.template = __bind(this.template, this);
      return Assets.__super__.constructor.apply(this, arguments);
    }

    Assets.prototype.tabTitle = 'Assets';

    Assets.prototype.items = null;

    Assets.prototype.initialize = function() {
      Assets.__super__.initialize.apply(this, arguments);
      this.items = new Edit.Assets();
      this.items.url = this.options.url;
      this.items.on('fetch', this.parse);
      this.items.fetch({
        success: this.parse
      });
      return this;
    };

    Assets.prototype.template = function() {
      return _.template("		<div id='edit_asset_tree'>			<h4>Assets</h4>			<ul class='treeview'></ul>		</div>		<div id='edit_asset_upload'>			<h4>Upload Assets</h4>		</div>")();
    };

    Assets.prototype.parse = function(coll, response) {
      var _this = this;
      this.$('ul.treeview').find("a").each(function() {
        return $(this).off('click.edit');
      });
      this.$('ul.treeview').empty();
      return this.items.each(function(item) {
        var link, litm;
        litm = $("<li></li>");
        link = $("<a></a>");
        link.attr("href", item.get('source')).text(item.get("name")).addClass(item.get('type')).attr('data-asset-id', item.id);
        litm.append(link);
        link.on('click.edit', _this._selection);
        return _this.$('ul.treeview').append(litm);
      });
    };

    Assets.prototype._selection = function(event) {
      var link;
      Edit.Util.murder(event);
      link = $(event.currentTarget);
      return Edit.instance.trigger('asset:select', link, this.items.get(link.attr('data-asset-id')));
    };

    return Assets;

  })(Edit.Plugin);

  Edit.Asset = (function(_super) {

    __extends(Asset, _super);

    Asset.name = 'Asset';

    function Asset() {
      return Asset.__super__.constructor.apply(this, arguments);
    }

    Asset.prototype.defaults = {
      name: '',
      source: '',
      type: 'file'
    };

    return Asset;

  })(Backbone.Model);

  Edit.Assets = (function(_super) {

    __extends(Assets, _super);

    Assets.name = 'Assets';

    function Assets() {
      return Assets.__super__.constructor.apply(this, arguments);
    }

    Assets.prototype.model = Edit.Asset;

    return Assets;

  })(Backbone.Collection);

  Edit.Plugin.add("assets", Assets);

}).call(this);
