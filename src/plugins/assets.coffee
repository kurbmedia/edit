class Assets extends Edit.Plugin
	tabTitle: 'Assets'
	items: null
	
	initialize:()->
		super
		@items = new Edit.Assets()
		@items.url = @options.url
		@items.on('fetch', @parse)
		@items.fetch( success: @parse )
		@
		
	template:()=> _.template("
		<div id='edit_asset_tree'>
			<h4>Assets</h4>
			<ul class='treeview'></ul>
		</div>
		<div id='edit_asset_upload'>
			<h4>Upload Assets</h4>
		</div>")()
	
	parse:(coll, response)=>
		@$('ul.treeview').find("a")
			.each( ()-> $(this).off('click.edit') )
		@$('ul.treeview').empty()
		@items.each (item)=>
			litm = $("<li></li>")
			link = $("<a></a>")
			link.attr("href", item.get('source'))
				.text(item.get("name"))
				.addClass(item.get('type'))
				.attr('data-asset-id', item.id)
			litm.append(link)
			link.on('click.edit', @_selection)
			@$('ul.treeview').append(litm)
			
	_selection:(event)=>
		Edit.Util.murder(event)
		link = $(event.currentTarget)
		Edit.instance.trigger('asset:select', link, @items.get(link.attr('data-asset-id')))

class Edit.Asset extends Backbone.Model
	defaults:
		name: ''
		source: ''
		type: 'file'
		
class Edit.Assets extends Backbone.Collection
	model: Edit.Asset


Edit.Plugin.add("assets", Assets)