class Format extends Edit.Plugin
	tabTitle: 'Format'
	defaults: 
		controls: ['bold', 'italic', 'link', 'unlink']
		
	initialize:()-> super
	events: 
		'click a.control' : '_exec'
		
	template:()=> 
		_.template("
		<ul class='controls'>
			<% _.each(options, function(control){ %>
			<li><a href='#' class='control <%= control %>' data-command='<%= control %>'><%= control %></a></li>
			<% }); %>
		</ul>")( options: @options.controls )
		
Edit.Plugin.add('format', Format)