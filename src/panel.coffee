class Edit.Panel extends Backbone.View
	tagName: 'div'
	className: 'editor-panel'
	template: ''
	instance: null
	events:
		'click .control' : '_exec'
		
	initialize:->
		@template = _.template(template)
		@hide()
		@$el.attr("id", 'editor_panel_instance')
		$('body').append(@$el)
		@on('attach reposition', @reposition)
		@on('detach', @hide)
		@on('update', @update)
		$(window).on('scroll', @reposition)
	
	# Attach an editor instance to the panel
	
	attach:	(inst)=>
		@instance = inst
		@render()
		@$el.css( top: "-3000em", left: "-9999em" ).show()
		@trigger('attach')
		
	detach: ()->
		@instance = null
		@trigger('detach')
	
	exec: (cmd)->
		command = Edit.Commands[cmd]
		console.log(cmd, command)
		if command.exec
			command.exec()
		else 
			if command.isActive() then command.toggle(false)
			else command.toggle(true)
		
		@instance.trigger('changed')
		@
	
	hide:()-> @$el.hide()
	shoe:()-> @$el.show()
	
	reposition:()=>
		return @ if @instance is null
		coords = getPosition(@$el, @instance.$el)
		@$el.css(coords)
			
	render:()->
		unless @instance is null
			@$el.html(@template(controls: @instance.controls))

	# update display states of all controls
	
	update: ( event )=>
		if event
			event.preventDefault()
			

	# private
	
	_exec:( event )=>
		event.preventDefault()
		event.stopImmediatePropagation()
		return @ if @instance is null
		cmd = $(event.currentTarget)
			.attr('data-command')
		@exec(cmd)
	

getPosition = ( node, target )=>
	npos = node.offset()
	tpos = target.offset()
	diff = node.outerHeight()
	
	top: (tpos.top - diff), left: tpos.left
	
template = "
	<ul class='controls'>
		<% _.each(controls, function(control){ %>
		<li class='control <%= control %>'>
			<a class='control <%= control %>' data-command='<%= control %>' href='#'><%= control %></a>
		</li>
		<% }) %>
	</ul>"