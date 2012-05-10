
describe("Edit.Utils", function() {
  var util;
  util = Edit.Util;
  it("is an object", function() {
    return expect(Edit.Util).toBeDefined();
  });
  describe(".isInline", function() {
    var block, inline;
    inline = block = null;
    beforeEach(function() {
      inline = helper.mknode('em');
      return block = helper.mknode('p');
    });
    it('returns true if the node is inline', function() {
      return expect(Edit.Util.isInline(inline)).toBe(true);
    });
    return it('returns false if the node is a block element', function() {
      return expect(util.isInline(block)).toBe(false);
    });
  });
  describe(".isText", function() {
    var node, text;
    text = node = null;
    beforeEach(function() {
      node = $('<p>abcd</p>');
      return text = node.get(0).childNodes[0];
    });
    it('returns true if the node is a text node', function() {
      return expect(util.isText(text)).toBe(true);
    });
    return it('returns false if the node is a dom node', function() {
      return expect(util.isText(node)).toBe(false);
    });
  });
  describe(".isEmpty", function() {
    describe("when the value is a string", function() {
      it('returns true if the value is a empty string', function() {
        return expect(util.isEmpty('')).toBe(true);
      });
      return it('returns false if value is not an empty string', function() {
        return expect(util.isEmpty("not empty!")).toBe(false);
      });
    });
    return describe('when the value is an object', function() {
      it('returns false if value is not an empty object', function() {
        return expect(util.isEmpty({
          imnot: 'empty'
        })).toBe(false);
      });
      return it('returns true if value is an empty object', function() {
        return expect(util.isEmpty({})).toBe(true);
      });
    });
  });
  describe(".replace", function() {
    var clean, cleaned, dirty;
    clean = dirty = cleaned = null;
    beforeEach(function() {
      clean = helper.content(true);
      return dirty = helper.content(false);
    });
    describe("when passed an array of replacements", function() {
      beforeEach(function() {
        return cleaned = util.replace(dirty, ['b', 'i'], ['strong', 'em']);
      });
      return it('replaces all instances of each item in the array', function() {
        expect(cleaned.html()).toEqual(clean.html());
        return expect(cleaned).toContain('strong');
      });
    });
    return describe('when passed a single object', function() {
      beforeEach(function() {
        return cleaned = $(util.replace(dirty, 'b', 'strong'));
      });
      return it('replaces all instances the passed item', function() {
        expect(cleaned).toContain('strong');
        return expect(cleaned).toNotContain('b');
      });
    });
  });
  describe('.trim', function() {
    it('removes whitespace from the end of a string', function() {
      return expect(util.trim("with space ")).toEqual("with space");
    });
    return it('removes whitespace from the beginning of a string', function() {
      return expect(util.trim(" with space")).toEqual("with space");
    });
  });
  describe('.semantify', function() {
    var clist, cparas, list, paras;
    list = paras = null;
    clist = cparas = null;
    beforeEach(function() {
      list = util.semantify("<ul><ul></ul><li>item</li></ul>").html();
      paras = util.semantify("<p><p>Nested</p> Within another</p>").html();
      clist = "<ul><li><ul></ul></li><li>item</li></ul>";
      return cparas = "<p>Nested</p><p> Within another</p>";
    });
    it('fixes invalid list nesting', function() {
      return expect(list).toEqual(clist);
    });
    it('fixes invalid paragraph nesting', function() {
      return expect(paras).toEqual(cparas);
    });
    return it('fixes removes empty paragraphs', function() {
      return expect(paras).toEqual(cparas);
    });
  });
  return describe('.stripTags', function() {
    return it('strips all html from a string', function() {
      return expect(util.stripTags("<p>text</p>")).toEqual('text');
    });
  });
});
