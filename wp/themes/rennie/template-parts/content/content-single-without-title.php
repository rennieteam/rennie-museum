<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package WordPress
 * @subpackage Twenty_Nineteen
 * @since 1.0.0
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class('exhibition-show'); ?>>
	<div class="entry-content">
		<?php
		the_content(
			sprintf(
				wp_kses(
					/* translators: %s: Name of current post. Only visible to screen readers */
					__( 'Continue reading<span class="screen-reader-text"> "%s"</span>', 'renniemuseum' ),
					array(
						'span' => array(
							'class' => array(),
						),
					)
				),
				get_the_title()
			)
		);

		if(!is_singular( 'exhibitions' )) {
			wp_link_pages(
				array(
					'before' => '<div class="page-links">' . __( 'Pages:', 'renniemuseum' ),
					'after'  => '</div>',
				)
			);
		}

		?>
	</div><!-- .entry-content -->
</article><!-- #post-${ID} -->
