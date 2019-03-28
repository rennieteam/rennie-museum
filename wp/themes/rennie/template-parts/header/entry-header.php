<?php
/**
 * Displays the post header
 *
 * @package WordPress
 * @subpackage Twenty_Nineteen
 * @since 1.0.0
 */

?>

<?php renniemuseum_posted_on(); ?>
<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>

<?php if ( ! is_page() ) : ?>
<div class="entry-meta">
	<?php renniemuseum_posted_by($post->post_author); ?>
	<?php
	// Edit post link.
		edit_post_link(
			'<span class="edit-link">' . renniemuseum_get_icon_svg( 'edit', 16 ),
			'</span>'
		);
	?>
</div><!-- .meta-info -->
<?php endif; ?>
