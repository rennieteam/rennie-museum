<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              rennie.com
 * @since             1.0.0
 * @package           Rennie_Museum_Tour
 *
 * @wordpress-plugin
 * Plugin Name:       Rennie Museum Tour
 * Plugin URI:        rennie.com
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.0.0
 * Author:            rennie
 * Author URI:        rennie.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       rennie-museum-tour
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'PLUGIN_NAME_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-rennie-museum-tour-activator.php
 */
function activate_rennie_museum_tour() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-rennie-museum-tour-activator.php';
	Rennie_Museum_Tour_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-rennie-museum-tour-deactivator.php
 */
function deactivate_rennie_museum_tour() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-rennie-museum-tour-deactivator.php';
	Rennie_Museum_Tour_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_rennie_museum_tour' );
register_deactivation_hook( __FILE__, 'deactivate_rennie_museum_tour' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-rennie-museum-tour.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_rennie_museum_tour() {

	$plugin = new Rennie_Museum_Tour();
	$plugin->run();

}
run_rennie_museum_tour();
