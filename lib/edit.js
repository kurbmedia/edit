(function() {
  var Edit, getPosition,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Edit = (function(_super) {

    __extends(Edit, _super);

    Edit.name = 'Edit';

    function Edit() {
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
      controls: ['bold', 'italic', 'link']
    };

    Edit.prototype.events = {
      'click a.control': '_exec'
    };

    Edit.prototype.selection = null;

    Edit.prototype._pastebin = null;

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
      document.execCommand('insertHTML', false, content);
      return this._pastebin.empty();
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
      var internal;
      this.selection = null;
      if (window.getSelection) {
        internal = window.getSelection();
        this.selection = internal.rangeCount > 0 ? internal.getRangeAt(0) : null;
      } else if (document.selection && document.selection.createRange) {
        this.selection = document.selection.createRange();
      }
      return this.selection;
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
      }
      return this.$('.control').removeClass('active').each(function() {
        var cmd;
        cmd = $(this).attr('data-command');
        if (Edit.Commands[cmd] && Edit.Commands[cmd].isActive && Edit.Commands[cmd].isActive()) {
          return $(this).addClass('active');
        }
      });
    };

    Edit.prototype._changed = function() {
      this.trigger('changed');
      return this.instance.trigger('changed');
    };

    Edit.prototype._exec = function(event) {
      var cmd, link;
      event.preventDefault();
      event.stopImmediatePropagation();
      link = $(event.currentTarget);
      if (!link.hasClass('disabled')) {
        cmd = link.attr('data-command');
        return this.exec(cmd);
      }
    };

    Edit.prototype._keydown = function(event) {
      if (!this.options.multiline && event.keyCode === 13) {
        event.stopPropagation();
        event.preventDefault();
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
      if (event) {
        event.preventDefault();
      }
      if (this.instance === null) {
        return this;
      }
      coords = getPosition(this.$el, this.instance);
      this.$el.css(coords);
      return false;
    };

    Edit.prototype._setOptions = function(passed) {
      if (!passed.multiline) {
        passed.multiline = !Edit.Util.isInline(this.instance.get(0));
      }
      return this.options = $.extend({}, this.defaults, passed);
    };

    Edit.prototype._saveState = function(event) {
      event.preventDefault();
      return this.saveSelection();
    };

    return Edit;

  })(Backbone.View);

  getPosition = function(node, target) {
    var diff, npos, tpos;
    npos = node.offset();
    tpos = target.offset();
    diff = node.outerHeight(true);
    return {
      top: tpos.top - diff,
      left: tpos.left
    };
  };

  this.Edit = window.Edit = Edit;

}).call(this);
