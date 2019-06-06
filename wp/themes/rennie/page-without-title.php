<?php

/**
 * Template Name: Default without Title
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
      while ( have_posts() ) :
				the_post();
				get_template_part( 'template-parts/content/content', 'single-without-title' );
      endwhile;
    ?>
  </main><!-- #main -->
</div><!-- #primary -->

<?php get_footer(); ?>
