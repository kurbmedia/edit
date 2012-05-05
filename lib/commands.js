(function() {
  var Commands, checkState;

  checkState = function(cmd) {
    return document.queryCommandState(cmd, false, true);
  };

  Commands = {
    bold: {
      isActive: function() {
        return checkState('bold', false, true);
      },
      toggle: function() {
        return document.execCommand('bold', false, true);
      }
    },
    indent: {
      exec: function() {
        if (checkState('insertOrderedList', false, true) || checkState('insertUnorderedList', false, true)) {
          return document.execCommand('indent', false, true);
        }
      }
    },
    italic: {
      isActive: function() {
        return checkState('italic', false, true);
      },
      toggle: function() {
        return document.execCommand('italic', false, true);
      }
    },
    link: {
      exec: function() {
        Commands.removeFormat();
        return document.execCommand('createLink', false, window.prompt('URL:', 'http://'));
      }
    },
    ol: {
      isActive: function() {
        return checkState('insertOrderedList', false, true);
      },
      exec: function() {
        return document.execCommand('insertOrderedList', false, true);
      }
    },
    outdent: {
      exec: function() {
        if (checkState('insertOrderedList', false, true) || checkState('insertUnorderedList', false, true)) {
          return document.execCommand('outdent', false, true);
        }
      }
    },
    unlink: {
      exec: function() {
        Commands.removeFormat();
        return document.execCommand('unlink', false, null);
      }
    },
    ul: {
      isActive: function() {
        return checkState('insertUnorderedList', false, true);
      },
      exec: function() {
        return document.execCommand('insertUnorderedList', false, true);
      }
    },
    removeFormat: function() {
      return document.execCommand('removeFormat', false, true);
    }
  };

  Edit.Commands = Commands;

}).call(this);
