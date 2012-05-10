class Plugin extends Backbone.View
	@add: (name, plugin)-> cache[name] = plugin
	@load: (name)-> cache[name]
	
	tagName: 'div'
	className: 'tool-panel'
	defaults: {}
	
	# Title used in the tab-bar
	tabTitle: 'Missing Title'
	
	# Editor instance for reference
	editor: null
	
	# Template used to render content and controls for this plugin
	template: ""
	
	exec: (cmd)=> @_editor().exec(cmd)

	initialize:()-> 
		@options = _.defaults( @options, @defaults )
		@on("inactive", @_hide)
		@on("active", @_show)
		@
		
	render:()-> 
		super
		@$el.html( @template() )
		@
	
	#-----------------------------------------
	# private
	#-----------------------------------------
	
	# Gets the active editor instance
	
	_editor:()=> @editor ||= Edit._instance()
	
	# Internal exec command for binding to control clicks
	# Events here are explicitly halted to try and retain focus on the editable node
	
	_exec:( event )=>
		event.preventDefault()
		event.stopImmediatePropagation()
		link = $(event.currentTarget)
		unless link.hasClass('disabled')
			cmd  = link.attr('data-command')
			@exec(cmd)

	# Hide the plugin's panel element
	
	_hide:()=> @$el.hide()
	
	# Show the plugin's panel element
	
	_show:()=> @$el.show()

cache = {}

Edit.Plugin = Plugin