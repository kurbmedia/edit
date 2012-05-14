(function() {
  var Utils;

  Utils = {
    isInline: function(node) {
      return $(node).is('h1, h2, h3, h4, h5, h6, span, strong, em');
    },
    isText: function(node) {
      return $(node).get(0).nodeType === Node.TEXT_NODE;
    },
    isEmpty: function(value) {
      if (_.isString(value)) {
        return Utils.trim(value) === '';
      } else {
        return $.isEmptyObject(value);
      }
    },
    murder: function(event) {
      event.preventDefault();
      return event.stopImmediatePropagation();
    },
    replace: function(node, current, replacer) {
      if (_.isArray(current)) {
        _.each(current, function(tag, i) {
          var repl;
          repl = _.isArray(replacer) ? replacer[i] : replacer;
          return Utils.replace(node, tag, repl);
        });
      } else {
        $(node).find(current).each(function() {
          var content;
          content = $(this).html();
          return $(this).replaceWith($(document.createElement(replacer)).html(content));
        });
      }
      return $(node);
    },
    trim: function(value) {
      return $.trim(value);
    },
    semantify: function(content) {
      var node;
      node = $(document.createElement('div')).html(content);
      Utils.replace(node, ['i', 'b', 'div'], ['em', 'strong', 'p']);
      node.find('span').each(function() {
        if (this.firstChild) {
          $(this.firstChild).unwrap();
        }
        return true;
      });
      node.find('p, ul, ol').each(function() {
        while ($(this).parent().is('p')) {
          $(this).unwrap();
        }
        return true;
      });
      node.find('ul > ul, ul > ol, ol > ul, ol > ol').each(function() {
        var list;
        list = $(this);
        if (list.prev()) {
          list.prev().append(this);
          if (!list.parent().is('li')) {
            return list.wrap("<li />");
          }
        } else {
          return $(this).wrap($('<li />'));
        }
      });
      (function() {
        var child, children, para, wrap, _i, _len;
        para = [];
        wrap = function() {
          var currp, p, _i, _len;
          if (para.length) {
            p = $(document.createElement('p')).insertBefore(para[0]);
            for (_i = 0, _len = para.length; _i < _len; _i++) {
              currp = para[_i];
              $(currp).remove().appendTo(p);
            }
            return para = [];
          }
        };
        children = _.clone(node.get(0).childNodes);
        for (_i = 0, _len = children.length; _i < _len; _i++) {
          child = children[_i];
          if (!$(child).is('p, ul, ol') && !(child.nodeType === Node.TEXT_NODE && /^\s*$/.exec(child.data))) {
            para.push(child);
          } else {
            wrap();
          }
        }
        return wrap();
      })();
      if (node.find('p').length > 1) {
        node.find('p').each(function(i, para) {
          para = $(para);
          if (para.is(':empty')) {
            return para.remove();
          }
        });
      }
      return node;
    },
    stripTags: function(content, allowed) {
      var ctags, tags;
      allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
      tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
      ctags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
      return content.replace(ctags, '').replace(tags, function(xx, yy) {
        if (_.indexOf(allowed, '<' + yy.toLowerCase() + '>') > -1) {
          return xx;
        } else {
          return '';
        }
      });
    }
  };

  Edit.Util = Utils;

}).call(this);
