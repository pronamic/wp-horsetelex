/**
 * Horsetelex link
 * 
 * @see https://github.com/WordPress/WordPress/blob/3.9/wp-includes/js/wplink.js
 */
var horsetelexLink;

(function($){
	var inputs = {}, editor;

	horsetelexLink = {

		init : function() {
			inputs.wrap     = $( '#horsetelex-link-wrap' );
			inputs.dialog   = $( '#horsetelex-link' );
			inputs.backdrop = $( '#horsetelex-link-backdrop' );
			inputs.submit   = $( '#horsetelex-link-submit' );
			inputs.close    = $( '#horsetelex-link-close' );
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

				var waiting = $( "#horsetelex-search-panel .spinner" ).show();

				$( "#horsetelex-search-results" ).load( ajaxurl, data, function( response ) {
					waiting.hide();

					$( "#horsetelex-search-results tr" ).click( function( e ) {
						e.preventDefault();

						var $item = $( e.delegateTarget );
						var $anchor = $item.find( "a" );

						inputs.url.val( $anchor.attr( "href" ) );
						inputs.title.val( $anchor.text() );
					} );
				} );
			} );

			inputs.submit.click( function( e ) {
				e.preventDefault();
				horsetelexLink.update();
			});

			inputs.close.add( inputs.backdrop ).add( '#horsetelex-link-cancel a' ).click( function( event ) {
				event.preventDefault();
				horsetelexLink.close();
			} );
		} ,  
		
		open: function( editorId ) {
			var ed;
			
			horsetelexLink.range = null;

			if ( editorId ) {
				window.wpActiveEditor = editorId;
			}

			if ( ! window.wpActiveEditor ) {
				return;
			}

			this.textarea = $( '#' + window.wpActiveEditor ).get( 0 );

			if ( typeof tinymce !== 'undefined' ) {
				ed = tinymce.get( wpActiveEditor );

				if ( ed && ! ed.isHidden() ) {
					editor = ed;
				} else {
					editor = null;
				}

				if ( editor && tinymce.isIE ) {
					editor.windowManager.bookmark = editor.selection.getBookmark();
				}
			}

			if ( ! horsetelexLink.isMCE() && document.selection ) {
				this.textarea.focus();
				this.range = document.selection.createRange();
			}

			inputs.wrap.show();
			inputs.backdrop.show();
		},
		
		isMCE: function() {
			return editor && ! editor.isHidden();
		},

		close : function() {
			if ( ! horsetelexLink.isMCE() ) {
				
			} else {
				editor.focus();
			}

			inputs.wrap.hide();
			inputs.backdrop.hide();
		} , 

		getAttrs : function() {
			return {
				href : inputs.url.val(),
				title : inputs.title.val(),
				target : inputs.openInNewTab.prop('checked') ? '_blank' : ''
			};
		},

		update : function() {
			if ( horsetelexLink.isMCE() ) {
				horsetelexLink.mceUpdate();
			} else {
				
			}
		},

		getAttrs: function() {
			return {
				href: inputs.url.val(),
				title: inputs.title.val(),
				target: inputs.openInNewTab.prop( 'checked' ) ? '_blank' : ''
			};
		},

		mceUpdate: function() {
			var link,
				attrs = horsetelexLink.getAttrs();

			horsetelexLink.close();
			editor.focus();

			if ( tinymce.isIE ) {
				editor.selection.moveToBookmark( editor.windowManager.bookmark );
			}

			link = editor.dom.getParent( editor.selection.getNode(), 'a[href]' );

			// If the values are empty, unlink and return
			if ( ! attrs.href || attrs.href == 'http://' ) {
				editor.execCommand( 'unlink' );
				return;
			}

			if ( link ) {
				editor.dom.setAttribs( link, attrs );
			} else {
				editor.execCommand( 'mceInsertLink', false, attrs );
			}

			// Move the cursor to the end of the selection
			editor.selection.collapse();
		},

	};

	$( document ).ready( horsetelexLink.init );
} )( jQuery );
