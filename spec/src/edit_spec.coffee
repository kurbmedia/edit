describe("the Edit class", ()->
  
	it("is a class", ()->
		expect(Edit).toBeDefined()
	)

	it("extends Backbone.View", ()->
		expect(Edit.prototype.render)
			.toBeDefined()
	)

)

describe("An editor instance", ()->
	editor = node = null
	
	beforeEach(()->
		editor = helper.edit()
		node   = helper.node()
	)

	describe('on activating a node', ()->
		
		beforeEach(()->
			editor.activate(node)
		)
		
		it("activates the editor for that element", ()->
			expect(node)
				.toHaveAttr('contenteditable')
		)
		
		it("adds the class editable to its element", ()->
			expect(node)
				.toHaveClass('editing')
	  )
	)
	
	describe('on de-activating a node', ()->
		
		beforeEach(()->
			editor.activate(node)
			editor.deactivate(node)
		)
		
		it("deactivates editing for that instance", ()->
			expect(node)
				.toNotHaveAttr('contenteditable')
		)
		
		it("adds the class editable to its element", ()->
			expect(node)
				.toNotHaveClass('editing')
	  )
	)
)