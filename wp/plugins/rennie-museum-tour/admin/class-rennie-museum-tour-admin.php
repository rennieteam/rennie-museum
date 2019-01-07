<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       rennie.com
 * @since      1.0.0
 *
 * @package    Rennie_Museum_Tour
 * @subpackage Rennie_Museum_Tour/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Rennie_Museum_Tour
 * @subpackage Rennie_Museum_Tour/admin
 * @author     rennie <tech@rennie.com>
 */
class Rennie_Museum_Tour_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		$CSSfiles = scandir(dirname(__FILE__) . '/build/static/css/');
		foreach($CSSfiles as $filename) {
			if(strpos($filename,'.css')&&!strpos($filename,'.css.map')) {
				wp_enqueue_style( 'tour', plugin_dir_url( __FILE__ ) . 'build/static/css/' . $filename, array(), mt_rand(10,1000), 'all' );
			}
		}

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/rennie-museum-tour-admin.css', array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		foreach(scandir(dirname(__FILE__) . '/build/static/js/') as $filename) {
			if(strpos($filename,'.js')&&!strpos($filename,'.js.map')) {
				wp_enqueue_script($filename, plugin_dir_url( __FILE__ ) . 'build/static/js/' . $filename, '', mt_rand(10,1000), true);
			}
		}

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/rennie-museum-tour-admin.js', array( 'jquery' ), $this->version, false );
	}

		/**
	 * Register the administration menu for this plugin into the WordPress Dashboard menu.
	 *
	 * @since    1.0.0
	 */
	public function add_plugin_admin_menu() {
		/*
		 * Add a settings page for this plugin to the Settings menu.
		 *
		 * NOTE:  Alternative menu locations are available via WordPress administration menu functions.
		 *
		 *        Administration Menus: http://codex.wordpress.org/Administration_Menus
		 *
		 */
		add_menu_page( 'Tours', 'Tours', 'manage_options', 'tours', array($this, 'display_plugin_setup_page'), 'dashicons-tickets-alt', 3);
	}

	 /**
	 * Add settings action link to the plugins page.
	 *
	 * @since    1.0.0
	 */
	public function add_action_links( $links ) {
		/*
		*  Documentation : https://codex.wordpress.org/Plugin_API/Filter_Reference/plugin_action_links_(plugin_file_name)
		    */
		$settings_link = array(
			'<a href="' . admin_url( 'options-general.php?page=' . $this->plugin_name ) . '">' . __('Settings', $this->plugin_name) . '</a>',
		);
		return array_merge(  $settings_link, $links );

	}

	/**
	 * Render the settings page for this plugin.
	 *
	 * @since    1.0.0
	 */
	public function display_plugin_setup_page() {
		include_once( 'partials/rennie-museum-tour-admin-display.php' );
	}

	/**
	*  Save the plugin options
	*
	*
	* @since    1.0.0
	*/
	public function options_update() {
		register_setting( $this->plugin_name, $this->plugin_name, array($this, 'validate') );
	}


	/**
	 * Validate all options fields
	 *
	 * @since    1.0.0
	 */
	public function validate($input) {
		// All checkboxes inputs
		$valid = array();

		return $valid;
	}


}
