<?php
/*
Plugin Name: Horsetelex
Plugin URI: http://www.happywp.com/plugins/horsetelex/
Description: Allow easily linking to Horsetelex pages.

Version: 1.0.0
Requires at least: 3.0

Author: Pronamic
Author URI: http://www.pronamic.eu/

Text Domain: horsetelex
Domain Path: /languages/

License: GPL
*/

function horsetelex_admin_enqueue_scripts(){
	wp_enqueue_style( 'horsetelex-link', plugins_url( 'css/horsetelex-link.css', __FILE__ ) );

	wp_enqueue_script( 'horsetelex-link', plugins_url( 'js/horsetelex-link.js', __FILE__ ), array( 'jquery' ), '1.0.0' );
}

add_action( 'admin_enqueue_scripts', 'horsetelex_admin_enqueue_scripts' );

function horsetelex_get_host_name() {
	$host_name = 'www.horsetelex.com';

	if ( get_option( 'WPLANG', WPLANG ) == 'nl_NL' ) {
		$host_name = 'www.horsetelex.nl';
	}

	return $host_name;
}

function horsetelex_management_page() {
	?>
	<div class="wrap">
		<?php screen_icon(); ?>

		<h2>
			<?php _e( 'Horsetelex', 'horsetelex' ); ?>
		</h2>

		<?php 

		$url = sprintf( 'http://%s/horses/jsonsearch', horsetelex_get_host_name() );

		$response = wp_remote_post( $url, array(
			'body' => array(
				'names'    => 'Totilas', // Naam
				's'        => '', // Vader
				'd'        => '', // Moeder
				'ds'       => '', // Moeders vader
				'reg'      => '', // Stamboek nummer
				'year'     => '', // Jaar
				'studbook' => '', // Stamboek
			),
		) );

		if ( is_wp_error( $response ) ) {
			echo 'Something went wrong!';
		} else {
			$body = $response['body'];

			$data = json_decode( $body );

			// @codingStandardsIgnoreStart
			var_dump( $data );
			// @codingStandardsIgnoreEnd
		}

		?>
	</div>
	<?php
}

function horsetelex_admin_menu() {
	add_management_page(
		__( 'Horsetelex' , 'horsetelex' ), // page_title
		__( 'Horsetelex' , 'horsetelex' ), // menu_title
		'read', // capability
		'horsetelex', // menu_slug
		'horsetelex_management_page' //  function
	);
}

add_action( 'admin_menu', 'horsetelex_admin_menu' );

function horsetelex_init() {
	$rel_path = dirname( plugin_basename( __FILE__ ) ) . '/languages/';

	load_plugin_textdomain( 'horsetelex', false, $rel_path );

	// Don't bother doing this stuff if the current user lacks permissions
	if ( ! current_user_can( 'edit_posts' ) && ! current_user_can( 'edit_pages' ) ) {
		return;
	}

	// Add only in Rich Editor mode
	if ( get_user_option( 'rich_editing' ) == 'true' ) {
		add_filter( 'mce_external_plugins', 'horsetelex_tinymce_plugin' );
		add_filter( 'mce_buttons', 'horsetelex_mce_buttons' );
	}
}

function horsetelex_mce_buttons( $buttons ) {
	array_push( $buttons, 'separator', 'horsetelex' );

	return $buttons;
}

function horsetelex_tinymce_plugin( $plugin_array ) {
	$plugin_array['horsetelex'] = plugins_url( 'tinymce/horsetelex/editor_plugin.js', __FILE__ );

	return $plugin_array;
}

add_action( 'init', 'horsetelex_init' );

//

/**
 * Horsetelex link dialog
 * 
 * @see https://github.com/WordPress/WordPress/blob/3.9/wp-includes/class-wp-editor.php#L1377
 */
function horsetelex_link_dialog() {
	?>
	<div id="horsetelex-link-backdrop" style="display: none"></div>

	<div id="horsetelex-link-wrap" class="wp-core-ui" style="display:none;">
		<form id="horsetelex-link" tabindex="-1">
			<?php wp_nonce_field( 'internal-linking', '_ajax_linking_nonce', false ); ?>

			<div id="horsetelex-link-modal-title">
				<?php _e( 'Insert/edit Horsetelex link', 'horsetelex' ) ?>
				<div id="horsetelex-link-close" tabindex="0"></div>
			</div>

			<div id="horsetelex-selector">
				<div id="horsetelex-options">
					<p class="howto">
						<?php _e( 'Enter the destination URL', 'horsetelex' ); ?>
					</p>

					<div>
						<label><span><?php _e( 'URL', 'horsetelex' ); ?></span><input id="horsetelex-url-field" type="text" tabindex="10" name="href" /></label>
					</div>
					<div>
						<label><span><?php _e( 'Title', 'horsetelex' ); ?></span><input id="horsetelex-title-field" type="text" tabindex="20" name="linktitle" /></label>
					</div>
					<div class="link-target">
						<label><input type="checkbox" id="horsetelex-target-checkbox" tabindex="30" checked="checked" /> <?php _e( 'Open link in a new window/tab' ); ?></label>
					</div>
				</div>

				<?php $show_internal = '1' == get_user_setting( 'wplink', '0' ); ?>

				<div id="horsetelex-search-panel">
					<div class="horsetelex-search-wrapper">
						<label>
							<span><?php _e( 'Search', 'horsetelex' ); ?></span>
							<input type="search" id="horsetelex-name-field" tabindex="60" autocomplete="off" />
						</label>
						
						<label>
							<span><?php _e( 'Father', 'horsetelex' ); ?></span>
							<input type="search" id="horsetelex-father-field" tabindex="61" autocomplete="off" />
						</label>

						<input type="submit" value="<?php esc_attr_e( 'Search' ); ?>" class="button-secondary" id="horsetelex-search-submit" name="horsetelex-search-submit" />

						<span class="spinner"></span>
					</div>
					<div id="horsetelex-search-results" class="query-results">
						
					</div>
				</div>
			</div>

			<div class="submitbox">
				<div id="horsetelex-link-update">
					<input type="submit" tabindex="100" value="<?php esc_attr_e( 'Add Link' ); ?>" class="button-primary" id="horsetelex-link-submit" name="horsetelex-link-submit">
				</div>

				<div id="horsetelex-link-cancel">
					<a class="submitdelete deletion" href="#"><?php _e( 'Cancel' ); ?></a>
				</div>
			</div>
		</form>
	</div>
	<?php 
}

function horsetelex_after_wp_tiny_mce( $mce_settings ) {
	horsetelex_link_dialog();
}

add_action( 'after_wp_tiny_mce', 'horsetelex_after_wp_tiny_mce' );

function horsetelex_wp_ajax_search() {
	$url = sprintf( 'http://%s/horses/jsonsearch', horsetelex_get_host_name() );

	$names = filter_input( INPUT_POST, 'name', FILTER_SANITIZE_STRING );
	$father = filter_input( INPUT_POST, 'father', FILTER_SANITIZE_STRING );

	$response = wp_remote_post( $url, array(
		'body' => array(
			'names'    => $names, // Naam
			's'        => $father, // Vader
			'd'        => '', // Moeder
			'ds'       => '', // Moeders vader
			'reg'      => '', // Stamboek nummer
			'year'     => '', // Jaar
			'studbook' => '', // Stamboek
			'page'     => '0',
		),
	) );

	if ( is_wp_error( $response ) ) {
		echo 'Something went wrong!';
	} else {
		$body = $response['body'];

		$data = json_decode( $body );

		if ( is_array( $data ) ) {
			array_shift( $data );

			?>
			<table>
				<thead>
					<tr>
						<th scope="col"><?php _e( 'Name', 'horsetelex' ); ?></th>
						<th scope="col"><?php _e( 'Father', 'horsetelex' ); ?></th>
						<th scope="col"><?php _e( 'Mother', 'horsetelex' ); ?></th>
						<th scope="col"><?php _e( 'Mothers father', 'horsetelex' ); ?></th>
						<th scope="col"><?php _e( 'Year', 'horsetelex' ); ?></th>
						
					</tr>
				</thead>

				<tbody>

					<?php foreach ( $data as $row ) : ?>

						<tr>
							<?php 

							$url = sprintf(
								'http://%s/horses/pedigree/%s',
								horsetelex_get_host_name(),
								$row->id
							);

							?>
							<td>
								<a href="<?php echo esc_attr( $url ); ?>"><?php echo esc_html( $row->name ); ?></a>
							</td>
							<td>
								 <?php echo esc_html( $row->s_name ); ?>
							</td>
							<td>
								 <?php echo esc_html( $row->d_name ); ?>
							</td>
							<td>
								 <?php echo esc_html( $row->ds_name ); ?>
							</td>
							<td>
								 <?php echo esc_html( $row->year ); ?>
							</td>
						</tr>

					<?php endforeach; ?>

				</tbody>
			</table>
			<?php 
		}
	}

	wp_die();
}

add_action( 'wp_ajax_horsetelex_search', 'horsetelex_wp_ajax_search' );
