getItems = (node)->
	items = []
	node  = $(node)
	node.find('> [typeof]').each (i, item)->
		item  = $(item)
		cname = getType(item)
		klass = new Item()
		klass.el 	 = item
		klass.type = cname
		addProps(klass, item)
		items.push(klass)
	items

ancestor = (node)->
	node = node.parentNode while node.parentNode
	node
			
addProps = (klass, node)->
	$(node).find(' > [property]').each (x, prop)->
		prop = $(prop)
		unless prop.attr('typeof')
			klass.set( prop.attr('property'), getValue(prop) )
		else
			nklass = new Item()
			nklass.type = getType(prop)
			nklass.el = prop 
			addProps( klass, prop)
			klass.set( prop.attr('property'), nklass )

findValue = (node, attr)->
	url = node.get(0).getAttribute(attr);
	return '' unless url
	a 	= ancestor(elm);
	p 	= node.get(0).parentNode;
	img = (a.createElement ? a : document).createElement('img')
	try
		img.setAttribute('src', url);
		p.insertBefore(img, elm) if p
		url = img.src;
		p.removeChild(img) if (p)
	catch error
	url

getValue = ( node )->
	node = $(node)
	return null if node.get(0).getAttribute('property') == null
	switch node.get(0).tagName.toUpperCase()
		when'META' then return node.attr('content') || ''
		when 'AUDIO' || 'EMBED' || 'IFRAME' || 'IMG' || 'SOURCE' || 'TRACK' || 'VIDEO'
		then return findValue( node, 'src' )
		when 'A' || 'AREA' || 'LINK'
		then return findValue(node, 'href')
		when 'OBJECT' then return findValue(node, 'data')
		when 'DATA' then return node.attr('value') || ''
		else return node.text()

getType = (node)-> $(node).attr('typeof').split('/').pop()

class Item extends Backbone.Model
	type: null
	el: null
	

jQuery.fn.schema = ()-> getItems( this )