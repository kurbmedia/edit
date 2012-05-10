class Assets extends Edit.Plugin
	tabTitle: 'Assets'
	items: null
	
	initialize:()->
		super
		@items = new Edit.Assets()
		@items.url = @options.url
		@items.fetch()
		@
		
	template:()=> _.template("
		<ul class='controls'>
			<li><a href='#' class='control image' data-command='image'>Image</a></li>
			<li><a href='#' class='control link' data-command='link'>Link</a></li>
		</ul>
	")()


class Edit.Assets extends Backbone.Collection
	model: Edit.Asset

class Edit.Asset extends Backbone.Model
	defaults:
		title: ''
		source: ''
		type: 'file'

Edit.Plugin.add("assets", Assets)