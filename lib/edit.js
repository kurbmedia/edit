(function() {
  var Edit, getCursorPosition, getPosition, getSelection, instance, makeTab, murder,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    _this = this;

  instance = null;

  Edit = (function(_super) {

    __extends(Edit, _super);

    Edit.name = 'Edit';

    function Edit() {
      this._swapTabs = __bind(this._swapTabs, this);

      this._saveState = __bind(this._saveState, this);

      this._reposition = __bind(this._reposition, this);

      this._paste = __bind(this._paste, this);

      this._keydown = __bind(this._keydown, this);

      this._exec = __bind(this._exec, this);

      this.update = __bind(this.update, this);

      this.paste = __bind(this.paste, this);

      this.exec = __bind(this.exec, this);

      this.content = __bind(this.content, this);
      return Edit.__super__.constructor.apply(this, arguments);
    }

    Edit.prototype.tagName = 'div';

    Edit.prototype.className = 'editor-toolbar';

    Edit.prototype.instance = null;

    Edit.prototype.defaults = {
      multiline: true,
      markup: true,
      placeholder: "",
      plugins: {
        format: ['bold', 'italic']
      },
      assets: false
    };

    Edit.prototype.events = {
      'click ul.tab-nav a': '_swapTabs'
    };

    Edit.prototype.selection = null;

    Edit.prototype._pastebin = null;

    Edit.prototype._tabs = null;

    Edit.prototype.initialize = function() {
      this.render();
      this.hide();
      if ($('#editor_paste_bin').length === 0) {
        $('body').append($("<div id='editor_paste_bin' contenteditable='true'></div>"));
      }
      this._pastebin = $('#editor_paste_bin');
      this.on('active', this.show);
      this.on('inactive', this.hide);
      $(window).on('scrollstop', this._reposition);
      instance = this;
      return this;
    };

    Edit.prototype.activate = function(node, options) {
      if (options == null) {
        options = {};
      }
      if (this.instance !== null && this.instance === $(node)) {
        return this;
      }
      this.deactivate();
      this.instance = $(node);
      this._setOptions(options);
      this.instance.attr('contenteditable', true).addClass('editing').off('.edit').on('paste.edit', this._paste).on('keydown.edit', this._keydown).on('click.edit keyup.edit', this.update).on('blur.edit', this._saveState);
      if (this.options.multiline) {
        this.instance.addClass('multiline-editable');
      }
      this._initPlugins();
      this.trigger('active');
      return this;
    };

    Edit.prototype.content = function() {
      var clone, result;
      if (this.instance === null) {
        return '';
      }
      result = this.instance.html();
      if (this.options.markup) {
        clone = this.instance.clone();
        Edit.Util.semantify(clone);
        result = clone.html();
      } else {
        if (this.options.multiline) {
          result = Edit.Util.trim(Edit.Util.stripTags(this.instance.html().replace(/<div>/g, '\n').replace(/<\/div>/g, '')));
        } else {
          result = Edit.Util.trim(Edit.Util.stripTags(this.instance.html()));
        }
      }
      return result;
    };

    Edit.prototype.deactivate = function() {
      this.trigger("inactive");
      if (this.instance !== null) {
        this.instance.html(this.content());
        return this.instance.off('.edit').removeAttr('contenteditable').removeClass('editing multiline-editable');
      }
    };

    Edit.prototype.exec = function(cmd) {
      var command;
      if (this.instance === null) {
        return false;
      }
      command = Edit.Commands[cmd];
      if (command.exec) {
        command.exec.apply(this);
      } else {
        if (command.isActive()) {
          command.toggle(false);
        } else {
          command.toggle(true);
        }
      }
      this._changed();
      this.update();
      return this;
    };

    Edit.prototype.hide = function() {
      return this.$el.hide();
    };

    Edit.prototype.show = function() {
      this.$el.css({
        top: "-3000em",
        left: "-9999em"
      }).show();
      return this._reposition();
    };

    Edit.prototype.paste = function(content) {
      content || (content = this._pastebin.html());
      this.restoreSelection();
      this.instance.focus();
      this._pastebin.empty();
      this.saveSelection();
      document.execCommand('insertHTML', false, content);
      return this.restoreSelection();
    };

    Edit.prototype.restoreSelection = function() {
      var internal;
      if (this.selection === null) {
        return true;
      }
      if (window.getSelection) {
        internal = window.getSelection();
        internal.removeAllRanges();
        internal.addRange(this.selection);
      } else if (document.selection && this.selection.select) {
        this.selection.select();
      }
      return this;
    };

    Edit.prototype.saveSelection = function() {
      return this.selection = getSelection();
    };

    Edit.prototype.selectAll = function() {
      var node, range;
      if (this.instance === null) {
        return this;
      }
      node = this.instance.get(0);
      if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
      } else {
        range = document.createRange();
        range.selectNodeContents(node);
      }
      this.restoreSelection(range);
      return this;
    };

    Edit.prototype.update = function(event) {
      if (event && event.type === 'click') {
        event.stopImmediatePropagation();
        if ($(window).scrollTop() > 0) {
          this._reposition(true);
        }
      }
      return this.$('.control').removeClass('active').each(function() {
        var cmd, link;
        link = $(this);
        cmd = link.attr('data-command');
        if (Edit.Commands[cmd] && Edit.Commands[cmd].isActive && Edit.Commands[cmd].isActive()) {
          link.addClass('active');
          if (link.hasClass("disabled")) {
            return link.removeClass('disabled').addClass('enabled');
          }
        } else {
          if (link.hasClass('enabled')) {
            return link.addClass('disabled').removeClass("enabled");
          }
        }
      });
    };

    Edit.prototype._addPanel = function(name, plugin) {
      var plugin_id;
      plugin_id = "editor_plugin_" + name;
      this._tabs[name] = plugin;
      this.$('ul.tab-nav').append(makeTab({
        name: name,
        id: "#" + plugin_id,
        title: plugin.tabTitle
      }));
      return this.$el.append(plugin.render().el);
    };

    Edit.prototype._changed = function() {
      this.trigger('changed');
      return this.instance.trigger('changed');
    };

    Edit.prototype._exec = function(event) {
      var cmd, link;
      murder(event);
      link = $(event.currentTarget);
      if (!link.hasClass('disabled')) {
        cmd = link.attr('data-command');
        return this.exec(cmd);
      }
    };

    Edit.prototype._initPlugins = function() {
      var tablist,
        _this = this;
      this.$el.empty();
      tablist = $("<ul class='tab-nav'></ul>");
      this.$el.append(tablist);
      this._tabs = {};
      _.each(this.options.plugins, function(options, name) {
        var plugin;
        if (plugin = Edit.Plugin.load(name)) {
          _this._addPanel(name, new plugin(options));
          return plugin.editor = _this;
        }
      });
      return this.$('ul.tab-nav li:first, div.tool-panel:first').addClass("active");
    };

    Edit.prototype._keydown = function(event) {
      if (!this.options.multiline && event.keyCode === 13) {
        murder(event);
        return false;
      }
      if (event.keyCode === 8 && Edit.Util.isEmpty() && this.instance.find('p, li').length === 1) {
        return event.preventDefault();
      }
    };

    Edit.prototype._paste = function(event) {
      this.saveSelection();
      this._pastebin.focus();
      return setTimeout(this.paste, 10);
    };

    Edit.prototype._reposition = function(event) {
      var coords;
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      if (this.instance === null) {
        return this;
      }
      coords = getPosition(this.$el, this.instance);
      if ((event && event.type === 'scrollstop') || event === true) {
        this.$el.animate(coords, 500);
      } else {
        this.$el.css(coords);
      }
      return false;
    };

    Edit.prototype._setOptions = function(passed) {
      if (!passed.multiline) {
        passed.multiline = !Edit.Util.isInline(this.instance.get(0));
      }
      return this.options = _.defaults(passed, this.defaults);
    };

    Edit.prototype._saveState = function(event) {
      event.preventDefault();
      return this.saveSelection();
    };

    Edit.prototype._swapTabs = function(event) {
      var link;
      murder(event);
      link = $(event.currentTarget);
      this.$('div.tool-panel.active, ul.tab-nav li.active').removeClass("active");
      link.parent('li').addClass('active');
      _.each(this._tabs, function(plugin, name) {
        return plugin.trigger('inactive');
      });
      return this._tabs[link.attr('data-plugin')].trigger('active');
    };

    return Edit;

  })(Backbone.View);

  _.extend(Edit, {
    _instance: function() {
      return instance;
    }
  });

  getSelection = function() {
    var internal, selection;
    selection = null;
    if (window.getSelection) {
      internal = window.getSelection();
      selection = internal.rangeCount > 0 ? internal.getRangeAt(0) : null;
    } else if (document.selection && document.selection.createRange) {
      selection = document.selection.createRange();
    }
    return selection;
  };

  getCursorPosition = function() {
    var marker, nrange, position, range;
    range = getSelection();
    if (range === null) {
      return null;
    }
    marker = $("<span/>");
    nrange = document.createRange();
    nrange.setStart(range.endContainer, range.endOffset);
    nrange.insertNode(marker.get(0));
    position = marker.offset();
    marker.remove();
    return position;
  };

  getPosition = function(node, target) {
    var cpos, diff, npos, tpos;
    npos = node.offset();
    tpos = target.offset();
    diff = node.outerHeight(true);
    if ($(window).scrollTop() > 0) {
      cpos = getCursorPosition();
      if (cpos !== null) {
        tpos.top = (getCursorPosition().top - $(window).scrollTop()) - 20;
      }
    }
    return {
      top: tpos.top - diff,
      left: tpos.left
    };
  };

  murder = function(event) {
    event.preventDefault();
    return event.stopImmediatePropagation();
  };

  makeTab = function(options) {
    return _.template("<li><a href='<%= id %>' data-plugin='<%= name %>'><%= title %></a></li>")(options);
  };

  this.Edit = window.Edit = Edit;

}).call(this);
