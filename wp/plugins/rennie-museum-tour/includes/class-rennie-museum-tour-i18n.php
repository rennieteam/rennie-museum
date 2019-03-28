<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       rennie.com
 * @since      1.0.0
 *
 * @package    Rennie_Museum_Tour
 * @subpackage Rennie_Museum_Tour/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Rennie_Museum_Tour
 * @subpackage Rennie_Museum_Tour/includes
 * @author     rennie <tech@rennie.com>
 */
class Rennie_Museum_Tour_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'rennie-museum-tour',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
