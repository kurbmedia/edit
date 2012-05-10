describe("Edit.Utils", ()->
	util = Edit.Util

	it("is an object", ()->
		expect(Edit.Util)
			.toBeDefined()
	)
	
	describe(".isInline", ()->
		inline = block = null
		
		beforeEach(()->
			inline = helper.mknode('em')
			block  = helper.mknode('p')
		)
		
		it('returns true if the node is inline', ()->
			expect(Edit.Util.isInline(inline))
				.toBe(true);
		)
		
		it('returns false if the node is a block element', ()->
			expect(util.isInline(block))
				.toBe(false);
		)
		
	)
	
	describe(".isText", ()->
		text = node = null
		
		beforeEach(()->
			node = $('<p>abcd</p>')
			text = node.get(0).childNodes[0]
		)
		
		it('returns true if the node is a text node', ()->
			expect(util.isText(text))
				.toBe(true)
		)
		
		it('returns false if the node is a dom node', ()->
			expect(util.isText(node))
				.toBe(false)
		)
	)
	
	describe(".isEmpty", ()->
		
		describe("when the value is a string", ()->
			it('returns true if the value is a empty string', ()->
				expect(util.isEmpty(''))
					.toBe(true)
			)

			it('returns false if value is not an empty string', ()->
				expect(util.isEmpty("not empty!"))
					.toBe(false)
			)
		)
		
		describe('when the value is an object', ()->
			it('returns false if value is not an empty object', ()->
				expect(util.isEmpty({ imnot: 'empty' }))
					.toBe(false)
			)

			it('returns true if value is an empty object', ()->
				expect(util.isEmpty({}))
					.toBe(true)
			)
		)
	)
	
	describe(".replace", ()->
		
		clean = dirty = cleaned = null
		
		beforeEach(()->
			clean = helper.content(true);
			dirty = helper.content(false);
		)
		
		describe("when passed an array of replacements", ()->

			beforeEach(()->
				cleaned = util.replace(dirty, ['b', 'i'], ['strong', 'em'])
			)
			
			it('replaces all instances of each item in the array', ()->
				expect(cleaned.html())
					.toEqual(clean.html())
				expect(cleaned)
					.toContain('strong')
			)
			
		)
		
		describe('when passed a single object', ()->

			beforeEach(()->
				cleaned = $(util.replace(dirty, 'b', 'strong'))
			)
			
			it('replaces all instances the passed item', ()->
				expect(cleaned)
					.toContain('strong')
				expect(cleaned)
					.toNotContain('b')
			)
		)
	)
	
	describe('.trim', ()->
		
		it('removes whitespace from the end of a string', ()->
			expect(util.trim("with space "))
				.toEqual("with space")
		)
		
		it('removes whitespace from the beginning of a string', ()->
			expect(util.trim(" with space"))
				.toEqual("with space")
		)
	)
	
	describe('.semantify', ()->
		
		list  = paras  = null
		clist = cparas = null
		
		beforeEach(()->
			list   = util.semantify("<ul><ul></ul><li>item</li></ul>").html()
			paras  = util.semantify("<p><p>Nested</p> Within another</p>").html()
			clist  = "<ul><li><ul></ul></li><li>item</li></ul>"
			cparas = "<p>Nested</p><p> Within another</p>"
		)
		
		it('fixes invalid list nesting', ()->
			expect(list)
				.toEqual(clist)
		)
		
		it('fixes invalid paragraph nesting', ()->
			expect(paras)
				.toEqual(cparas)
		)
		
		it('fixes removes empty paragraphs', ()->
			expect(paras)
				.toEqual(cparas)
		)
		
	)
	
	describe('.stripTags', ()->
		
		it('strips all html from a string', ()->
			expect(util.stripTags("<p>text</p>"))
				.toEqual('text')
		)
	)
)
