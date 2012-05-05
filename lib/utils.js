(function() {
  var Utils;

  Utils = {
    isEmpty: function(value) {
      if (_.isString(value)) {
        return Utils.trim(value) === '';
      }
    },
    trim: function(value) {
      return $.trim(value);
    },
    semantify: function() {}
  };

  Edit.Utils = Utils;

}).call(this);
