<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package WordPress
 * @subpackage Twenty_Nineteen
 * @since 1.0.0
 */

?>

	</div><!-- #content -->

	<footer id="colophon" class="site-footer">
		<?php get_template_part( 'template-parts/footer/footer', 'widgets' ); ?>
		<div class="site-info">
			<p>The Wing Sang Building • 51 East Pender Street • Vancouver BC V6A 1S9 Canada</p>
			<?php if ( has_nav_menu( 'social' ) ) : ?>
				<nav class="social-navigation" aria-label="<?php esc_attr_e( 'Social Links Menu', 'renniemuseum' ); ?>">
					<?php
					wp_nav_menu(
						array(
							'theme_location' => 'social',
							'menu_class'     => 'social-links-menu',
							'link_before'    => '<span class="screen-reader-text">',
							'link_after'     => '</span>' . renniemuseum_get_icon_svg( 'link' ),
							'depth'          => 1,
						)
					);
					?>
				</nav><!-- .social-navigation -->
			<?php endif; ?>
		</div><!-- .site-info -->
	</footer><!-- #colophon -->

</div><!-- #page -->

<?php wp_footer(); ?>
<link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/colorbox.css" type="text/css" />

</body>
</html>
