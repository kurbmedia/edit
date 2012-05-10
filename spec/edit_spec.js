
describe("the Edit class", function() {
  it("is a class", function() {
    return expect(Edit).toBeDefined();
  });
  return it("extends Backbone.View", function() {
    return expect(Edit.prototype.render).toBeDefined();
  });
});

describe("An editor instance", function() {
  var editor, node;
  editor = node = null;
  beforeEach(function() {
    editor = helper.edit();
    return node = helper.node();
  });
  describe('on activating a node', function() {
    beforeEach(function() {
      return editor.activate(node);
    });
    it("activates the editor for that element", function() {
      return expect(node).toHaveAttr('contenteditable');
    });
    return it("adds the class editable to its element", function() {
      return expect(node).toHaveClass('editing');
    });
  });
  return describe('on de-activating a node', function() {
    beforeEach(function() {
      editor.activate(node);
      return editor.deactivate(node);
    });
    it("deactivates editing for that instance", function() {
      return expect(node).toNotHaveAttr('contenteditable');
    });
    return it("adds the class editable to its element", function() {
      return expect(node).toNotHaveClass('editing');
    });
  });
});
