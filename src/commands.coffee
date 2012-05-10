checkState = (cmd)-> document.queryCommandState(cmd, false, true)
checkNode  = (node)->
	parent = getParent()
	return false if parent is null
	parent.is(node)

getParent = ()->
	check = null
	if (document.selection)
		check = $(document.selection.createRange().parentElement())
	else
		selection = window.getSelection()
		if selection.rangeCount > 0
			check = $(selection.getRangeAt(0).startContainer.parentNode)
		else return null
	check
			
Commands   =
	bold:
		isActive: ()-> checkState('bold', false, true)
		toggle: ()-> document.execCommand('bold', false, true)

	indent:
		exec: ()->
			if checkState('insertOrderedList', false, true) || checkState('insertUnorderedList', false, true)
				document.execCommand('indent', false, true)

	italic:
		isActive: ()-> checkState('italic', false, true)
		toggle: ()-> document.execCommand('italic', false, true)

	link:
		isActive: ()-> checkNode('a')
		exec: ()->
			Commands.removeFormat()
			document.execCommand('createLink', false, 
				window.prompt('URL:', 'http://'))
				
	ol:
		isActive: ()-> checkState('insertOrderedList', false, true)
		exec: ()-> document.execCommand('insertOrderedList', false, true)

	outdent:
		exec: ()->
			if checkState('insertOrderedList', false, true) || checkState('insertUnorderedList', false, true)
				document.execCommand('outdent', false, true)

	unlink:
		isActive: ()-> checkNode('a')
		exec: ()->
			Commands.removeFormat()
			document.execCommand('Unlink', false, null)
			if checkNode('a') && getParent()
				link = getParent()
				link.replaceWith(link.html())

	ul: 
		isActive: ()-> checkState('insertUnorderedList', false, true)
		exec: ()-> document.execCommand('insertUnorderedList', false, true)

	removeFormat: ()-> document.execCommand('removeFormat', false, true)


Edit.Commands = Commands