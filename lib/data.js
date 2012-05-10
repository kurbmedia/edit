(function() {
  var Item, addProps, ancestor, findValue, getItems, getType, getValue,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  getItems = function(node) {
    var items;
    items = [];
    node = $(node);
    node.find('> [typeof]').each(function(i, item) {
      var cname, klass;
      item = $(item);
      cname = getType(item);
      klass = new Item();
      klass.el = item;
      klass.type = cname;
      addProps(klass, item);
      return items.push(klass);
    });
    return items;
  };

  ancestor = function(node) {
    while (node.parentNode) {
      node = node.parentNode;
    }
    return node;
  };

  addProps = function(klass, node) {
    return $(node).find(' > [property]').each(function(x, prop) {
      var nklass;
      prop = $(prop);
      if (!prop.attr('typeof')) {
        return klass.set(prop.attr('property'), getValue(prop));
      } else {
        nklass = new Item();
        nklass.type = getType(prop);
        nklass.el = prop;
        addProps(klass, prop);
        return klass.set(prop.attr('property'), nklass);
      }
    });
  };

  findValue = function(node, attr) {
    var a, img, p, url, _ref;
    url = node.get(0).getAttribute(attr);
    if (!url) {
      return '';
    }
    a = ancestor(elm);
    p = node.get(0).parentNode;
    img = ((_ref = a.createElement) != null ? _ref : {
      a: document
    }).createElement('img');
    try {
      img.setAttribute('src', url);
      if (p) {
        p.insertBefore(img, elm);
      }
      url = img.src;
      if (p) {
        p.removeChild(img);
      }
    } catch (error) {

    }
    return url;
  };

  getValue = function(node) {
    node = $(node);
    if (node.get(0).getAttribute('property') === null) {
      return null;
    }
    switch (node.get(0).tagName.toUpperCase()) {
      case 'META':
        return node.attr('content') || '';
      case 'AUDIO' || 'EMBED' || 'IFRAME' || 'IMG' || 'SOURCE' || 'TRACK' || 'VIDEO':
        return findValue(node, 'src');
      case 'A' || 'AREA' || 'LINK':
        return findValue(node, 'href');
      case 'OBJECT':
        return findValue(node, 'data');
      case 'DATA':
        return node.attr('value') || '';
      default:
        return node.text();
    }
  };

  getType = function(node) {
    return $(node).attr('typeof').split('/').pop();
  };

  Item = (function(_super) {

    __extends(Item, _super);

    Item.name = 'Item';

    function Item() {
      return Item.__super__.constructor.apply(this, arguments);
    }

    Item.prototype.type = null;

    Item.prototype.el = null;

    return Item;

  })(Backbone.Model);

  jQuery.fn.schema = function() {
    return getItems(this);
  };

}).call(this);
