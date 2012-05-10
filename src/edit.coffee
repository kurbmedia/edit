class Edit extends Backbone.View
	tagName: 'div'
	className: 'editor-toolbar'	
	instance: null
	defaults: 
		multiline: true
		markup: true
		placeholder: ""
		controls: ['bold', 'italic', 'link']
	
	events: 
		'click a.control' : '_exec'
		
	selection: null
	_pastebin: null
	
	initialize:-> 
		@render()
		@hide()
		if $('#editor_paste_bin').length is 0
			$('body').append($("<div id='editor_paste_bin' contenteditable='true'></div>"))
		@_pastebin = $('#editor_paste_bin')
		@on('active', @show)
		@on('inactive', @hide)
		$(window).on('scrollstop', @_reposition)
		@
	
	# Make a dom element editable.
	
	activate: (node, options = {})->
		
		# Don't activate an already active instance
		
		if @instance != null and @instance is $(node)
			return @
		
		# deactivate any existing instances
		@deactivate()

		# Set the instance to the target node, then make it editable
		# and bind any necessary events
		
		@instance = $(node)
		@_setOptions(options)

		@instance.attr('contenteditable', true)
			.addClass('editing')
			.off('.edit')
			.on('paste.edit', @_paste)
			.on('keydown.edit', @_keydown)
			.on('click.edit keyup.edit', @update)
			.on('blur.edit', @_saveState)
		
		@instance.addClass('multiline-editable') if @options.multiline
		@trigger('active')
		@
	
	# Gets the sanitized content for the current instance.
	content: ()=>
		return '' if @instance is null
		result = @instance.html()
		
		if @options.markup
			clone = @instance.clone()
			Edit.Util.semantify( clone )
			result = clone.html()
		else
			if @options.multiline
				result = Edit.Util.trim( Edit.Util.stripTags( 
					@instance.html().replace(/<div>/g, '\n')
						.replace(/<\/div>/g, '')))
			else
				result = Edit.Util.trim( Edit.Util.stripTags( @instance.html() ) )
		result
	
	# Remove edit functionality from an element. 
		
	deactivate: ()->
		@trigger("inactive")
		unless @instance is null
			@instance.html(@content())
			@instance.off('.edit')
				.removeAttr('contenteditable')
				.removeClass('editing multiline-editable')

	# Execute a command on the current instance
	
	exec:(cmd)=>
		return false if @instance is null
		command = Edit.Commands[cmd]
		if command.exec then command.exec.apply(this)
		else 
			if command.isActive() then command.toggle(false) 
			else command.toggle(true)
		@_changed()
		@update()
		@
	
	
	hide:()-> @$el.hide();
	show:()-> 
		@$el.css( top: "-3000em", left: "-9999em" ).show()
		@_reposition()
			
	
	# Paste content into the current instance. 
	# Generally content is from the pastebin node, but can be passed directly for custom implementation

	paste:(content)=>
		content ||= @_pastebin.html()
		@restoreSelection()
		@instance.focus()
		document.execCommand('insertHTML', false, content)
		@_pastebin.empty()
	
	# Restore the currently saved selection. Skip if null

	restoreSelection:()->
		return true if @selection is null
		if window.getSelection
			internal = window.getSelection()
			internal.removeAllRanges()
			internal.addRange(@selection);
		else if document.selection && @selection.select
			@selection.select()
		@
	
	# Save the current dom selection for use later
	
	saveSelection:()->
		@selection = null
		if window.getSelection
			internal = window.getSelection()
			@selection = if internal.rangeCount > 0 then internal.getRangeAt(0) else null
		else if document.selection && document.selection.createRange
			@selection = document.selection.createRange()
		@selection
	
	# Select all of the content within an editable instance
	
	selectAll:()->
		return @ if @instance is null
		node = @instance.get(0)
		if document.body.createTextRange # IE < 9
			range = document.body.createTextRange()
			range.moveToElementText(node)
			range.select()
		else
			range = document.createRange()
			range.selectNodeContents(node)
		@restoreSelection(range)
		@
	
	# Update the states of any toolbar buttons/items. 
	# Also force event propagation to stop so blur events or disabling events on surrounding
	# items do not de-activate the editable. 

	update:(event)=>
		if event && event.type is 'click'
			event.stopImmediatePropagation()
		@$('.control').removeClass('active')
			.each(()->
				cmd = $(this).attr('data-command')
				if Edit.Commands[cmd] && Edit.Commands[cmd].isActive && Edit.Commands[cmd].isActive()
					$(this).addClass('active')
			)
	
	#-----------------------------------------
	# private
	#-----------------------------------------
	
	# Triggers a changed event, on both the editor and the instance
	
	_changed:()->
		@trigger('changed')
		@instance.trigger('changed')
	
	# Internal exec command for binding to control clicks
	# Events here are explicitly halted to try and retain focus on the editable node
	
	_exec:( event )=>
		event.preventDefault()
		event.stopImmediatePropagation()
		link = $(event.currentTarget)
		unless link.hasClass('disabled')
			cmd  = link.attr('data-command')
			@exec(cmd)
	
	# Handle key-down to prevent newlines in nodes which aren't multi-line editable
	# as well as to prevent "clearing" instances of all content
	
	_keydown:(event)=>
		if !@options.multiline && event.keyCode is 13
			event.stopPropagation()
			event.preventDefault()
			return false
		if event.keyCode is 8 && Edit.Util.isEmpty() && @instance.find('p, li').length is 1
			event.preventDefault()
	
	# Capture a paste event, directing the paste to the hidden pastebin
	
	_paste:(event)=>
		@saveSelection()
		@_pastebin.focus()
		setTimeout(@paste, 10)
	
	# Move the instance to line up with the editable node
	
	_reposition:(event)=>
		if event
			event.preventDefault()
		return @ if @instance is null
		coords = getPosition(@$el, @instance)
		@$el.css(coords)
		return false
		
	# Options for an item are passed on each activation, update local copy and 
	# set some sensible defaults.
		
	_setOptions:(passed)->
		unless passed.multiline
			passed.multiline = !Edit.Util.isInline(@instance.get(0))
		@options = $.extend({}, @defaults, passed)
		
	# Saves the current 'state' of an editable on blur. 
	# This includes the current selection for manipulation later
	_saveState:(event)=>
		event.preventDefault()
		@saveSelection()


getPosition = ( node, target )->
	npos = node.offset()
	tpos = target.offset()
	diff = node.outerHeight(true)
	top: (tpos.top - diff), left: tpos.left

@Edit = window.Edit = Edit