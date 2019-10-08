<?php
/**
 * rennie museum functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WordPress
 * @subpackage Twenty_Nineteen
 * @since 1.0.0
 */

/**
 * rennie museum only works in WordPress 4.7 or later.
 */
if ( version_compare( $GLOBALS['wp_version'], '4.7', '<' ) ) {
	require get_template_directory() . '/inc/back-compat.php';
	return;
}

if ( ! function_exists( 'renniemuseum_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function renniemuseum_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on rennie museum, use a find and replace
		 * to change 'renniemuseum' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'renniemuseum', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );
		set_post_thumbnail_size( 1568, 9999 );

		// This theme uses wp_nav_menu() in two locations.
		register_nav_menus(
			array(
				'menu-1' => __( 'Primary', 'renniemuseum' ),
				'footer' => __( 'Footer Menu', 'renniemuseum' ),
				'social' => __( 'Social Links Menu', 'renniemuseum' ),
			)
		);

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support(
			'html5',
			array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
			)
		);

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support(
			'custom-logo',
			array(
				'height'      => 190,
				'width'       => 190,
				'flex-width'  => false,
				'flex-height' => false,
			)
		);

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		// Add support for Block Styles.
		add_theme_support( 'wp-block-styles' );

		// Add support for full and wide align images.
		add_theme_support( 'align-wide' );

		// Add support for editor styles.
		add_theme_support( 'editor-styles' );

		// Enqueue editor styles.
		add_editor_style( 'style-editor.css' );

		// Add custom editor font sizes.
		add_theme_support(
			'editor-font-sizes',
			array(
				array(
					'name'      => __( 'Small', 'renniemuseum' ),
					'shortName' => __( 'S', 'renniemuseum' ),
					'size'      => 19.5,
					'slug'      => 'small',
				),
				array(
					'name'      => __( 'Normal', 'renniemuseum' ),
					'shortName' => __( 'M', 'renniemuseum' ),
					'size'      => 22,
					'slug'      => 'normal',
				),
				array(
					'name'      => __( 'Large', 'renniemuseum' ),
					'shortName' => __( 'L', 'renniemuseum' ),
					'size'      => 36.5,
					'slug'      => 'large',
				),
				array(
					'name'      => __( 'Huge', 'renniemuseum' ),
					'shortName' => __( 'XL', 'renniemuseum' ),
					'size'      => 49.5,
					'slug'      => 'huge',
				),
			)
		);

		// Add support for responsive embedded content.
		add_theme_support( 'responsive-embeds' );
	}
endif;
add_action( 'after_setup_theme', 'renniemuseum_setup' );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function renniemuseum_widgets_init() {

	register_sidebar(
		array(
			'name'          => __( 'Footer', 'renniemuseum' ),
			'id'            => 'sidebar-1',
			'description'   => __( 'Add widgets here to appear in your footer.', 'renniemuseum' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);

}
add_action( 'widgets_init', 'renniemuseum_widgets_init' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width Content width.
 */
function renniemuseum_content_width() {
	// This variable is intended to be overruled from themes.
	// Open WPCS issue: {@link https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards/issues/1043}.
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
	$GLOBALS['content_width'] = apply_filters( 'renniemuseum_content_width', 640 );
}
add_action( 'after_setup_theme', 'renniemuseum_content_width', 0 );

/**
 * Enqueue scripts and styles.
 */
function renniemuseum_scripts() {
	wp_enqueue_style( 'renniemuseum-style', get_stylesheet_uri(), array(), wp_get_theme()->get( 'Version' ) );

	wp_style_add_data( 'renniemuseum-style', 'rtl', 'replace' );

	if ( has_nav_menu( 'menu-1' ) ) {
		wp_enqueue_script( 'renniemuseum-loadimages', get_theme_file_uri( '/js/imagesloaded.pkgd.js' ), array(), '1.0', true );
		wp_enqueue_script( 'renniemuseum-priority-menu', get_theme_file_uri( '/js/priority-menu.js' ), array(), '1.0', true );
	}

	wp_enqueue_style( 'renniemuseum-print-style', get_template_directory_uri() . '/print.css', array(), wp_get_theme()->get( 'Version' ), 'print' );
}
add_action( 'wp_enqueue_scripts', 'renniemuseum_scripts' );

/**
 * Fix skip link focus in IE11.
 *
 * This does not enqueue the script because it is tiny and because it is only for IE11,
 * thus it does not warrant having an entire dedicated blocking script being loaded.
 *
 * @link https://git.io/vWdr2
 */
function renniemuseum_skip_link_focus_fix() {
	// The following is minified via `terser --compress --mangle -- js/skip-link-focus-fix.js`.
	?>
	<script>
	/(trident|msie)/i.test(navigator.userAgent)&&document.getElementById&&window.addEventListener&&window.addEventListener("hashchange",function(){var t,e=location.hash.substring(1);/^[A-z0-9_-]+$/.test(e)&&(t=document.getElementById(e))&&(/^(?:a|select|input|button|textarea)$/i.test(t.tagName)||(t.tabIndex=-1),t.focus())},!1);
	</script>
	<?php
}
add_action( 'wp_print_footer_scripts', 'renniemuseum_skip_link_focus_fix' );

/**
 * Enqueue supplemental block editor styles.
 */
function renniemuseum_editor_customizer_styles() {

	wp_enqueue_style( 'renniemuseum-editor-customizer-styles', get_theme_file_uri( '/style-editor-customizer.css' ), false, '1.0', 'all' );

	if ( 'custom' === get_theme_mod( 'primary_color' ) ) {
		// Include color patterns.
		require_once get_parent_theme_file_path( '/inc/color-patterns.php' );
		wp_add_inline_style( 'renniemuseum-editor-customizer-styles', renniemuseum_custom_colors_css() );
	}
}
add_action( 'enqueue_block_editor_assets', 'renniemuseum_editor_customizer_styles' );

/**
 * Display custom color CSS in customizer and on frontend.
 */
function renniemuseum_colors_css_wrap() {

	// Only include custom colors in customizer or frontend.
	if ( ( ! is_customize_preview() && 'default' === get_theme_mod( 'primary_color', 'default' ) ) || is_admin() ) {
		return;
	}

	require_once get_parent_theme_file_path( '/inc/color-patterns.php' );

	$primary_color = 199;
	if ( 'default' !== get_theme_mod( 'primary_color', 'default' ) ) {
		$primary_color = get_theme_mod( 'primary_color_hue', 199 );
	}
	?>

	<style type="text/css" id="custom-theme-colors" <?php echo is_customize_preview() ? 'data-hue="' . absint( $primary_color ) . '"' : ''; ?>>
		<?php echo renniemuseum_custom_colors_css(); ?>
	</style>
	<?php
}
add_action( 'wp_head', 'renniemuseum_colors_css_wrap' );

// Register Custom Post Type
function create_exhibitions() {

	$labels = array(
		'name'                  => _x( 'Exhibitions', 'Post Type General Name', 'text_domain' ),
		'singular_name'         => _x( 'Exhibition', 'Post Type Singular Name', 'text_domain' ),
		'menu_name'             => __( 'Exhibitions', 'text_domain' ),
		'name_admin_bar'        => __( 'exhibitions', 'text_domain' ),
		'archives'              => __( 'exhibitions', 'text_domain' ),
		'attributes'            => __( 'Item Attributes', 'text_domain' ),
		'parent_item'           => __( 'Parent Item:', 'textdomain' ),
		'parent_item_colon'     => __( 'Parent Item:', 'text_domain' ),
		'all_items'             => __( 'All Items', 'text_domain' ),
		'add_new_item'          => __( 'Add New Item', 'text_domain' ),
		'add_new'               => __( 'Add New', 'text_domain' ),
		'new_item'              => __( 'New Item', 'text_domain' ),
		'edit_item'             => __( 'Edit Item', 'text_domain' ),
		'update_item'           => __( 'Update Item', 'text_domain' ),
		'view_item'             => __( 'View Item', 'text_domain' ),
		'view_items'            => __( 'View Items', 'text_domain' ),
		'search_items'          => __( 'Search Item', 'text_domain' ),
		'not_found'             => __( 'Not found', 'text_domain' ),
		'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
		'featured_image'        => __( 'Featured Image', 'text_domain' ),
		'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
		'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
		'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
		'insert_into_item'      => __( 'Insert into item', 'text_domain' ),
		'uploaded_to_this_item' => __( 'Uploaded to this item', 'text_domain' ),
		'items_list'            => __( 'Items list', 'text_domain' ),
		'items_list_navigation' => __( 'Items list navigation', 'text_domain' ),
		'filter_items_list'     => __( 'Filter items list', 'text_domain' ),
	);
	$rewrite = array(
		'slug'                  => 'exhibitions',
		'with_front'            => false,
		'pages'                 => false,
		'feeds'                 => false,
	);

	$args = array(
		'label'                 => __( 'Exhibitions', 'text_domain' ),
		'description'           => __( 'Rennie Museum Exhibitions', 'text_domain' ),
		'labels'                => $labels,
		'supports'              => array( 'title', 'editor', 'thumbnail', 'custom-fields', 'page-attributes', 'excerpt'),
		'hierarchical'          => true,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 5,
		'menu_icon'             => 'dashicons-admin-customizer',
		'show_in_admin_bar'     => true,
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => false,
		'exclude_from_search'   => false,
		'publicly_queryable'    => true,
		'rewrite'               => $rewrite,
		'capability_type'       => 'page',
		'show_in_rest'       => true,
    'rest_base'          => 'exhibitions',
		'rest_controller_class' => 'WP_REST_Posts_Controller',
	);
	register_post_type( 'exhibitions', $args );

}
add_action( 'init', 'create_exhibitions', 0 );

// Add Meta boxes to Exhibitions
function register_date_meta_boxes() {
	add_meta_box( 'meta-box-id', __( 'Run Date', 'textdomain' ), 'date_meta_boxes_callback', 'exhibitions', 'side', 'high' );
}
add_action( 'add_meta_boxes', 'register_date_meta_boxes' );

function date_meta_boxes_callback( $post ) {
	wp_nonce_field( 'start_date_meta', 'start_date_meta_nonce' );
	$stat_date = get_post_meta( $post->ID, '_start_date_meta_key', true );
	echo '<label for="start_date_field">Start Date</label> ';
	echo '<input type="text" id="start-date-id" class="start-date-id date_picker" name="start_date_field" value="' . esc_attr( $stat_date ) . '" size="25" />';
	echo "<script>document.addEventListener('DOMContentLoaded', function(event) { var start = new Pikaday({ field: document.getElementById('start-date-id'), format: 'DD/MM/YY' });});</script>";

	echo '<br/>';
	wp_nonce_field( 'end_date_meta', 'end_date_meta_nonce' );
	$end_date = get_post_meta( $post->ID, '_end_date_meta_key', true );
	echo '<label for="end_date_field">End Date</label> ';
	echo '<input type="text" id="end-date-id" class="end-date-id date_picker" name="end_date_field" value="' . esc_attr( $end_date ) . '" size="25" />';
	echo "<script>document.addEventListener('DOMContentLoaded', function(event) { var end = new Pikaday({ field: document.getElementById('end-date-id'), format: 'DD/MM/YY' });});</script>";
};

function save_date_meta_box( $post_id ) {

	if ( ! isset( $_POST['start_date_meta_nonce'] ) || ! isset( $_POST['end_date_meta_nonce'] ) ) {
		return;
	}

	if ( ! wp_verify_nonce( $_POST['start_date_meta_nonce'], 'start_date_meta' ) ||  ! wp_verify_nonce( $_POST['end_date_meta_nonce'], 'end_date_meta' ) ) {
		return;
	}

	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	// Check the user's permissions.
	if ( isset( $_POST['post_type'] ) && 'page' == $_POST['post_type'] ) {
		if ( ! current_user_can( 'edit_page', $post_id ) ) {
			return;
		}
	} else {
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}
	}

	if ( ! isset( $_POST['start_date_field'] ) || ! isset( $_POST['end_date_field'] ) ) {
		return;
	}

	// Sanitize user input.
	$start_date = sanitize_text_field( $_POST['start_date_field'] );
	update_post_meta( $post_id, '_start_date_meta_key', $start_date );

	$end_date = sanitize_text_field( $_POST['end_date_field'] );
	update_post_meta( $post_id, '_end_date_meta_key', $end_date );
}

add_action( 'save_post', 'save_date_meta_box' );

function enqueue_datepicker() {
	wp_enqueue_script('pika', 'https://cdn.jsdelivr.net/npm/pikaday/pikaday.js');
	wp_enqueue_style('pika-style', 'https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css');
}

add_action('admin_enqueue_scripts', 'enqueue_datepicker');

/**
 * SVG Icons class.
 */
require get_template_directory() . '/classes/class-renniemuseum-svg-icons.php';

/**
 * Custom Comment Walker template.
 */
require get_template_directory() . '/classes/class-renniemuseum-walker-comment.php';

/**
 * Enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * SVG Icons related functions.
 */
require get_template_directory() . '/inc/icon-functions.php';

/**
 * Custom template tags for the theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';


add_action('wp_enqueue_scripts', 'mytheme_scripts');

function mytheme_scripts() {
  wp_dequeue_script( 'gallery_lightbox_js' );
  wp_deregister_script( 'gallery_lightbox_js' );
	wp_enqueue_script( 'gallery_lightbox_js', get_theme_file_uri( '/js/gallery.colorbox.init.js' ), array(), '1.1', true );
}
