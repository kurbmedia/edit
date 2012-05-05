(function() {
  var Edit, panel,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  panel = void 0;

  Edit = (function(_super) {

    __extends(Edit, _super);

    Edit.name = 'Edit';

    function Edit() {
      this._update = __bind(this._update, this);

      this._onKeyDown = __bind(this._onKeyDown, this);

      this.deactivate = __bind(this.deactivate, this);

      this.activate = __bind(this.activate, this);
      return Edit.__super__.constructor.apply(this, arguments);
    }

    Edit.prototype.tagName = 'div';

    Edit.prototype.className = 'editable';

    Edit.prototype.multiLine = true;

    Edit.prototype.markup = true;

    Edit.prototype.controls = ['bold', 'italic', 'link', 'image'];

    Edit.prototype.initialize = function() {
      panel || (panel = new Edit.Panel());
      this.render();
      return this.$el.one('click.edit', this.activate);
    };

    Edit.prototype.activate = function(event) {
      var _this = this;
      if (event == null) {
        event = null;
      }
      if (event !== null) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      this.$el.addClass('editing');
      this._unbindEvents();
      this.$el.on('keydown.edit', this._onKeyDown).on('click.edit', this._update).attr('contenteditable', 'true');
      $('html').one('click', function(event) {
        if (event.currentTarget !== _this.el) {
          return _this.deactivate();
        }
      });
      return panel.attach(this);
    };

    Edit.prototype.deactivate = function(event) {
      if (event == null) {
        event = null;
      }
      if (event !== null) {
        event.preventDefault();
      }
      this._unbindEvents();
      this.$el.removeClass('editing').removeAttr('contenteditable').one('click.edit', this.activate);
      this.trigger('changed');
      return panel.detach();
    };

    Edit.prototype._onKeyDown = function(event) {
      if (!this.multiLine && event.keyCode === 13) {
        event.stopPropagation();
        event.preventDefault();
        return;
      }
      if (event.keyCode === 8 && Edit.Util.isEmpty() && this.$el.find('p, li').length === 1) {
        return event.preventDefault();
      }
    };

    Edit.prototype._unbindEvents = function() {
      return this.$el.off('.edit');
    };

    Edit.prototype._update = function(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return panel.trigger('update');
    };

    return Edit;

  })(Backbone.View);

  this.Edit = window.Edit = Edit;

}).call(this);
