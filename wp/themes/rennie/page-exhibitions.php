<?php

/**
 * Template Name: Exhibitions
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
  * @package WordPress
 * @subpackage Twenty_Nineteen
 * @since 1.0.0
 */

 get_header(); ?>

<div id="primary" class="content-area-full">
  <main id="main" class="site-main" role="main">
    <?php
      // Custom Post Query
      $args = array (
        'post_type' => 'exhibitions',
        'post_parent' => 0,
        'posts_per_page' => -1
      );

      $the_query = new WP_Query($args);
      while( $the_query->have_posts() ) : $the_query->the_post();
				get_template_part( 'template-parts/content/content', 'excerpt-exhibitions' );
      endwhile;

      wp_reset_postdata();
    ?>
  </main><!-- #main -->
</div><!-- #primary -->

<?php get_footer(); ?>
