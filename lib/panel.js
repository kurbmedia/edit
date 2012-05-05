(function() {
  var getPosition, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    _this = this;

  Edit.Panel = (function(_super) {

    __extends(Panel, _super);

    Panel.name = 'Panel';

    function Panel() {
      this._exec = __bind(this._exec, this);

      this.update = __bind(this.update, this);

      this.reposition = __bind(this.reposition, this);

      this.attach = __bind(this.attach, this);
      return Panel.__super__.constructor.apply(this, arguments);
    }

    Panel.prototype.tagName = 'div';

    Panel.prototype.className = 'editor-panel';

    Panel.prototype.template = '';

    Panel.prototype.instance = null;

    Panel.prototype.events = {
      'click .control': '_exec'
    };

    Panel.prototype.initialize = function() {
      this.template = _.template(template);
      this.hide();
      this.$el.attr("id", 'editor_panel_instance');
      $('body').append(this.$el);
      this.on('attach reposition', this.reposition);
      this.on('detach', this.hide);
      this.on('update', this.update);
      return $(window).on('scroll', this.reposition);
    };

    Panel.prototype.attach = function(inst) {
      this.instance = inst;
      this.render();
      this.$el.css({
        top: "-3000em",
        left: "-9999em"
      }).show();
      return this.trigger('attach');
    };

    Panel.prototype.detach = function() {
      this.instance = null;
      return this.trigger('detach');
    };

    Panel.prototype.exec = function(cmd) {
      var command;
      command = Edit.Commands[cmd];
      console.log(cmd, command);
      if (command.exec) {
        command.exec();
      } else {
        if (command.isActive()) {
          command.toggle(false);
        } else {
          command.toggle(true);
        }
      }
      this.instance.trigger('changed');
      return this;
    };

    Panel.prototype.hide = function() {
      return this.$el.hide();
    };

    Panel.prototype.shoe = function() {
      return this.$el.show();
    };

    Panel.prototype.reposition = function() {
      var coords;
      if (this.instance === null) {
        return this;
      }
      coords = getPosition(this.$el, this.instance.$el);
      return this.$el.css(coords);
    };

    Panel.prototype.render = function() {
      if (this.instance !== null) {
        return this.$el.html(this.template({
          controls: this.instance.controls
        }));
      }
    };

    Panel.prototype.update = function(event) {
      if (event) {
        return event.preventDefault();
      }
    };

    Panel.prototype._exec = function(event) {
      var cmd;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (this.instance === null) {
        return this;
      }
      cmd = $(event.currentTarget).attr('data-command');
      return this.exec(cmd);
    };

    return Panel;

  })(Backbone.View);

  getPosition = function(node, target) {
    var diff, npos, tpos;
    npos = node.offset();
    tpos = target.offset();
    diff = node.outerHeight();
    return {
      top: tpos.top - diff,
      left: tpos.left
    };
  };

  template = "	<ul class='controls'>		<% _.each(controls, function(control){ %>		<li class='control <%= control %>'>			<a class='control <%= control %>' data-command='<%= control %>' href='#'><%= control %></a>		</li>		<% }) %>	</ul>";

}).call(this);
