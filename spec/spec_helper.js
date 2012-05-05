(function(){

	window.helper = {
		node: function(){
			return $('#test_editor');
		},
		
		edit: function(){
			helper.node().html('<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sagittis metus elit. Nulla tincidunt lorem tristique velit feugiat vehicula.</p>')
			return new Edit({ el: $('#test_editor') });
		}
	};
	
})();