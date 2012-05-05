checkState = (cmd)-> document.queryCommandState(cmd, false, true)
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
		exec: ()->
			Commands.removeFormat()
			document.execCommand('unlink', false, null)

	ul: 
		isActive: ()-> checkState('insertUnorderedList', false, true)
		exec: ()-> document.execCommand('insertUnorderedList', false, true)

	removeFormat: ()-> document.execCommand('removeFormat', false, true)


Edit.Commands = Commands