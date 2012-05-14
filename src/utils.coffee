Utils =
	
	# checks to see if a node is an inline element
	isInline: (node)-> $(node).is('h1, h2, h3, h4, h5, h6, span, strong, em')
	
	# Checks to see if a node is a text node
	isText: (node)-> $(node).get(0).nodeType is Node.TEXT_NODE
	
	# Checks to see if a value is empty
	
	isEmpty:( value )->
		if _.isString( value )
			Utils.trim(value) is ''
		else
		 $.isEmptyObject( value )
	
	# Completely kill an event
	
	murder: (event)->
		event.preventDefault()
		event.stopImmediatePropagation()
	
	# Replace a html node with a different one
	replace: ( node, current, replacer )->
		if _.isArray( current )
			_.each( current, (tag, i)-> 
				repl = if _.isArray(replacer) then replacer[i] else replacer
				Utils.replace( node, tag, repl)
			)
		else
			$(node).find(current).each(()-> 
				content = $(this).html()
				$(this).replaceWith $(document.createElement(replacer)).html( content )
			)
			
		$(node)
	
	# Trim a text / html value
	
	trim: ( value )-> $.trim(value)
	
	# Replace un-semantic nodes such as div's, b's and i's created by 
	# execCommand with their semantic counterparts
	
	semantify: ( content )->
		node = $(document.createElement('div')).html(content)
		Utils.replace(node, ['i', 'b', 'div'], ['em', 'strong', 'p'])
		
		node.find('span').each(()-> 
			if this.firstChild
				$(this.firstChild).unwrap()
			true
		)
		
		node.find('p, ul, ol').each(()-> 
			while $(this).parent().is('p')
				$(this).unwrap() 
			true
		)

		# Cleanup list nesting
		
		node.find('ul > ul, ul > ol, ol > ul, ol > ol').each ()->
			list = $(this)
			if list.prev() 
				list.prev().append(this)
				unless list.parent().is('li')
					list.wrap("<li />")
			else $(this).wrap($('<li />'))

		# Cleanup awkward nesting of paragraphs and lists. 
		# Make sure paragraphs are properly created and semantic.
		
		do ()->
			para = []
			wrap = ()->
				if para.length
					p = $(document.createElement('p')).insertBefore(para[0])
					for currp in para
						$(currp).remove().appendTo(p) 
					para = []
			
			children = _.clone( node.get(0).childNodes );
			for child in children
				if !$(child).is('p, ul, ol') && !(child.nodeType is Node.TEXT_NODE && (/^\s*$/).exec(child.data)) 
				then para.push(child)
				else wrap()
		
			wrap()
		
		if node.find('p').length > 1
			node.find('p').each((i, para)->
				para = $(para)
				para.remove() if para.is(':empty')
			)
		
		node
	
	# Remove all html from a passed string
	
	stripTags: ( content, allowed )-> 
		allowed = (((allowed || "") + "")
			.toLowerCase()
			.match(/<[a-z][a-z0-9]*>/g) || [])
			.join('');
		
		tags  = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
		ctags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
		content.replace(ctags, '')
			.replace(tags, (xx, yy)->
				if _.indexOf( allowed, '<' + yy.toLowerCase() + '>') > - 1 
				then xx else ''
			)
		
Edit.Util = Utils