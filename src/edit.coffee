panel = undefined

class Edit extends Backbone.View
	tagName: 'div'
	className: 'editable'
	multiLine: true
	markup: true
	controls: ['bold', 'italic', 'link', 'image']
	
	initialize:->
		panel ||= new Edit.Panel()
		@render()
		@$el.one('click.edit', @activate)
		
	activate: ( event = null )=>
		unless event is null
			event.preventDefault() 
			event.stopImmediatePropagation()
			
		@$el.addClass('editing')
		@_unbindEvents()
		@$el.on('keydown.edit', @_onKeyDown)
			.on('click.edit', @_update)
			.attr('contenteditable', 'true')
			
		$('html').one 'click', ( event )=> 
			if event.currentTarget != @el
				@deactivate()
		panel.attach(this)

	deactivate:( event = null )=> 
		unless event is null
			event.preventDefault()
			
		@_unbindEvents()
		@$el.removeClass('editing')
			.removeAttr('contenteditable')
			.one('click.edit', @activate)
		
		@trigger('changed')
		panel.detach()
	
	# private
		
	_onKeyDown:( event )=>
		
		# prevent adding new lines in single-line editables
		
		if !@multiLine && event.keyCode is 13
			event.stopPropagation()
			event.preventDefault()
			return

		# Do not allow back-spacing empty nodes. 
		# This causes issues with generating new paragraphs.
		
		if event.keyCode is 8 && Edit.Util.isEmpty() && @$el.find('p, li').length is 1
			event.preventDefault()

	_unbindEvents:()-> @$el.off('.edit')
	
	_update: (event)=>
		event.preventDefault()
		event.stopImmediatePropagation()
		panel.trigger('update')
	
@Edit = window.Edit = Edit