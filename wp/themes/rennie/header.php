<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package WordPress
 * @subpackage Twenty_Nineteen
 * @since 1.0.0
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="profile" href="https://gmpg.org/xfn/11" />
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#content"><?php _e( 'Skip to content', 'renniemuseum' ); ?></a>

		<header id="masthead" class="site-header">
			<div class="site-branding-container">
				<?php get_template_part( 'template-parts/header/site', 'branding' ); ?>
			</div><!-- .layout-wrap -->
		</header><!-- #masthead -->

	<div id="content" class="site-content">
		<?php if ( is_singular() && renniemuseum_can_show_post_thumbnail() ) : ?>
			<div class="site-featured-image">
				<?php
					renniemuseum_post_thumbnail();
					the_post();
				?>
				<div class="entry-header">
					<?php get_template_part( 'template-parts/header/entry', 'header' ); ?>
				</div><!-- .entry-header -->
				<!-- <?php rewind_posts(); ?> -->
			</div>
		<?php endif; ?>
