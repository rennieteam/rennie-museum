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

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<div class="content-card">

		<div class="entry-content">
			<?php renniemuseum_post_thumbnail(); ?>

			<?php
			echo '<h4 class="content-card-date">' .  get_the_date( $format, $post_id ) . '</h4>';
			the_title('<h3 class="content-card-title">', '</h3>' );
			echo '<p class="content-card-author">By ' . get_the_author() .  '</p>';

			the_excerpt(
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

			echo '<a class="content-card-more" href="'. get_permalink($post->ID) . '">Read more.</a>';
			?>
		</div><!-- .entry-content -->
	</div><!-- .content-card -->

</article><!-- #post-${ID} -->
