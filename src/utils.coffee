Utils =
	isEmpty:( value )->
		if _.isString( value )
			return Utils.trim(value) is ''
			
	trim: ( value )-> $.trim(value)
	semantify: ()->
		
Edit.Utils = Utils