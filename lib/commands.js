(function() {
  var Commands, checkNode, checkState, getParent;

  checkState = function(cmd) {
    return document.queryCommandState(cmd, false, true);
  };

  checkNode = function(node) {
    var parent;
    parent = getParent();
    if (parent === null) {
      return false;
    }
    return parent.is(node);
  };

  getParent = function() {
    var check, selection;
    check = null;
    if (document.selection) {
      check = $(document.selection.createRange().parentElement());
    } else {
      selection = window.getSelection();
      if (selection.rangeCount > 0) {
        check = $(selection.getRangeAt(0).startContainer.parentNode);
      } else {
        return null;
      }
    }
    return check;
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
      isActive: function() {
        return checkNode('a');
      },
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
      isActive: function() {
        return checkNode('a');
      },
      exec: function() {
        var link;
        Commands.removeFormat();
        document.execCommand('Unlink', false, null);
        if (checkNode('a') && getParent()) {
          link = getParent();
          return link.replaceWith(link.html());
        }
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
