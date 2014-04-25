tinymce.PluginManager.add( 'horsetelex', function( editor ) {
	editor.addCommand( 'Horsetelex_Link', function() {
		window.horsetelexLink.open( editor.id );
	} );

	editor.addButton( 'horsetelex', {
		icon: 'horsetelex',
		tooltip: 'Insert/edit Horsetelex link',
		cmd: 'Horsetelex_Link',
	} );
} );
