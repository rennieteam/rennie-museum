<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package WordPress
 * @subpackage Twenty_Nineteen
 * @since 1.0.0
 */

get_header();
?>

	<section id="primary" class="content-area">
		<main id="main" class="site-main">

			<?php
			/* Start the Loop */
			while ( have_posts() ) :
				the_post();
				get_template_part( 'template-parts/content/content', 'single' );

				if ( is_singular( 'post' ) ) {
					posts_nav_link();
					// Previous/next post navigation.
					the_post_navigation(
						array(
							'next_text' => '<span>' . __( 'Next', 'renniemuseum' ) . '</span>' . renniemuseum_get_icon_svg( 'arrow-right', 12 ),
							'prev_text' => renniemuseum_get_icon_svg( 'arrow-left', 12 ) . '<span>' . __( 'Previous', 'renniemuseum' ) .'</span>',
						)
					);
				}
			endwhile; // End of the loop.
			?>

		</main><!-- #main -->
	</section><!-- #primary -->

<?php
get_footer();
