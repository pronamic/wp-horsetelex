var wpLink;

(function($){
	var inputs = {};

	horsetelexLink = {

		init : function() {
			inputs.dialog = $('#horsetelex-link');
			inputs.submit = $('#horsetelex-link-submit');
			// URL
			inputs.url = $('#horsetelex-url-field');
			// Secondary options
			inputs.title = $('#horsetelex-title-field');
			// Advanced Options
			inputs.openInNewTab = $('#horsetelex-target-checkbox');
			inputs.name = $('#horsetelex-name-field');
			inputs.father = $('#horsetelex-father-field');
			inputs.searchSubmit = $("#horsetelex-search-submit");

			// Bind event handlers
			inputs.searchSubmit.click(function(e) {
				e.preventDefault();

				var data = {
					action: 'horsetelex_search',
					name: inputs.name.val() , 
					father: inputs.father.val()
				};

				var waiting = $("#horsetelex-search-panel .waiting").show();

				$("#horsetelex-search-results").load(ajaxurl, data, function(response) {
					waiting.hide();

					$("#horsetelex-search-results tr").click(function(e) {
						e.preventDefault();

						var $item = $(e.delegateTarget);
						var $anchor = $item.find("a");

						inputs.url.val( $anchor.attr("href") );
						inputs.title.val( $anchor.text() );
					});
				});
			});
			inputs.submit.click( function(e){
				e.preventDefault();
				horsetelexLink.update();
			});

			$('#horsetelex-link-cancel').click( function(e){
				e.preventDefault();
				horsetelexLink.close();
			});
		} ,  

		close : function() {
			tinyMCEPopup.close();
		} , 

		getAttrs : function() {
			return {
				href : inputs.url.val(),
				title : inputs.title.val(),
				target : inputs.openInNewTab.prop('checked') ? '_blank' : ''
			};
		},

		update : function() {
			horsetelexLink.mceUpdate();
		},

		mceUpdate : function() {
			var ed = tinyMCEPopup.editor,
				attrs = horsetelexLink.getAttrs(),
				e, b;

			tinyMCEPopup.restoreSelection();
			e = ed.dom.getParent(ed.selection.getNode(), 'A');

			// If the values are empty, unlink and return
			if ( ! attrs.href || attrs.href == 'http://' ) {
				if ( e ) {
					tinyMCEPopup.execCommand("mceBeginUndoLevel");
					b = ed.selection.getBookmark();
					ed.dom.remove(e, 1);
					ed.selection.moveToBookmark(b);
					tinyMCEPopup.execCommand("mceEndUndoLevel");
					horsetelexLink.close();
				}
				return;
			}

			tinyMCEPopup.execCommand("mceBeginUndoLevel");

			if (e == null) {
				ed.getDoc().execCommand("unlink", false, null);
				tinyMCEPopup.execCommand("mceInsertLink", false, "#mce_temp_url#", {skip_undo : 1});

				tinymce.each(ed.dom.select("a"), function(n) {
					if (ed.dom.getAttrib(n, 'href') == '#mce_temp_url#') {
						e = n;
						ed.dom.setAttribs(e, attrs);
					}
				});

				// Sometimes WebKit lets a user create a link where
				// they shouldn't be able to. In this case, CreateLink
				// injects "#mce_temp_url#" into their content. Fix it.
				if ( $(e).text() == '#mce_temp_url#' ) {
					ed.dom.remove(e);
					e = null;
				}
			} else {
				ed.dom.setAttribs(e, attrs);
			}

			// Don't move caret if selection was image
			if ( e && (e.childNodes.length != 1 || e.firstChild.nodeName != 'IMG') ) {
				ed.focus();
				ed.selection.select(e);
				ed.selection.collapse(0);
				tinyMCEPopup.storeSelection();
			}

			tinyMCEPopup.execCommand("mceEndUndoLevel");
			horsetelexLink.close();
		}

	};

	$(document).ready( horsetelexLink.init );
})(jQuery);
