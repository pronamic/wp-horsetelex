(function() {
	tinymce.create('tinymce.plugins.horsetelex', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			var disabled = true;

			// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
			ed.addCommand('horsetelex', function() {
				if ( disabled )
					return;

				ed.windowManager.open({
					id : 'horsetelex-link',
					width : 800,
					height : "auto",
					wpDialog : true,
					title : ed.getLang('advlink.link_desc')
				}, {
					plugin_url : url // Plugin absolute URL
				});
			});

			// Register example button
			ed.addButton('horsetelex', {
				title : ed.getLang('advanced.link_desc'),
				cmd : 'horsetelex'  
				// image : url + "/horsetelex.png"
			});

			ed.onNodeChange.add(function(ed, cm, n, co) {
				disabled = co && n.nodeName != 'A';
			});
		} , 

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'WordPress Horsetelex Dialog',
				author : 'Pronamic',
				authorurl : 'http://pronamic.eu/',
				infourl : '',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('horsetelex', tinymce.plugins.horsetelex);
})();