<?php
/**
 * The template for displaying image attachments
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
				// Start the loop.
				while ( have_posts() ) :
					the_post();
			?>

				<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

					<header class="entry-header">
						<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
					</header><!-- .entry-header -->

					<div class="entry-content">

						<figure class="entry-attachment wp-block-image">
							<?php
								/**
								 * Filter the default renniemuseum image attachment size.
								 *
								 * @since Twenty Sixteen 1.0
								 *
								 * @param string $image_size Image size. Default 'large'.
								 */
								$image_size = apply_filters( 'renniemuseum_attachment_size', 'full' );

								echo wp_get_attachment_image( get_the_ID(), $image_size );
							?>

							<figcaption class="wp-caption-text"><?php the_excerpt(); ?></figcaption>

						</figure><!-- .entry-attachment -->

						<?php
							the_content();
							wp_link_pages(
								array(
									'before'      => '<div class="page-links"><span class="page-links-title">' . __( 'Pages:', 'renniemuseum' ) . '</span>',
									'after'       => '</div>',
									'link_before' => '<span>',
									'link_after'  => '</span>',
									'pagelink'    => '<span class="screen-reader-text">' . __( 'Page', 'renniemuseum' ) . ' </span>%',
									'separator'   => '<span class="screen-reader-text">, </span>',
								)
							);
						?>
					</div><!-- .entry-content -->
				</article><!-- #post-## -->

				<?php
					// Parent post navigation.
					the_post_navigation(
						array(
							'prev_text' => _x( '<span class="meta-nav">Published in</span><br><span class="post-title">%title</span>', 'Parent post link', 'renniemuseum' ),
						)
					);

					// If comments are open or we have at least one comment, load up the comment template.
					if ( comments_open() || get_comments_number() ) {
						comments_template();
					}

				// End the loop.
				endwhile;
			?>

		</main><!-- .site-main -->
	</section><!-- .content-area -->

<?php
get_footer();
