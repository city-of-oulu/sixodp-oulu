<?php
/**
 * The template for displaying pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages and that
 * other "pages" on your WordPress site will use a different template.
 *
 * Template Name: Oletuspohja valikolla
 *
 * @package WordPress
 * @subpackage Sixodp
 */

$post = get_queried_object();
$grandparent_id = get_post_grandparent_id($post->ID);
$parent_page = get_page($grandparent_id);
get_header(); ?>

<div id="primary" class="content-area">
  <main id="main" class="site-main" role="main">
    <div class="wrapper">
      <div class="container">
        <?php

          while ( have_posts() ) :       
            get_template_part( 'partials/headingbar' );
            include(locate_template( 'partials/sidebar.php' ));
            the_post();
            get_template_part( 'partials/content' );

          endwhile;
          
        ?>
      </div>
    </div>
  </main><!-- .site-main -->

</div><!-- .content-area -->
<?php get_footer(); ?>