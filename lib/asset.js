(function() {
  var Asset,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Asset = (function(_super) {

    __extends(Asset, _super);

    Asset.name = 'Asset';

    function Asset() {
      return Asset.__super__.constructor.apply(this, arguments);
    }

    Asset.prototype.defaults = {
      type: 'file',
      url: null,
      name: ''
    };

    return Asset;

  })(Backbone.Model);

}).call(this);
