describe("the Edit class", function() {
  
	it("is a class", function() {
		expect(Edit).toBeDefined();
	});

	it("extends Backbone.View", function() {
		expect(Edit.prototype.render).toBeDefined();
	});

});

describe("An editor", function() {
  
	var editor, node, panel;
	
	beforeEach(function(){
		editor = helper.edit();
		node   = helper.node();
		panel  = $('#editor_panel_instance');
	}); 

	it("adds the class editable to its element", function() {
		expect(node.hasClass('editable'))
			.toBeTruthy();
  });

	describe('on element click', function(){
		
		beforeEach(function(){
			node.click();
		});
		
		it("activates the editor for that element", function(){
			expect(node.attr('contenteditable'))
				.toEqual('true');
		});
		
		it("displays the panel for modifying styles", function(){
			expect(panel.is(':hidden'))
				.toBeFalsy();
		});

	});

});