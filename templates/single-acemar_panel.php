<?php
/**
 * Template: Single Panel Acústico Domus
 *
 * Puede sobreescribirse colocando un archivo single-acemar_panel.php
 * en la raíz del tema activo.
 *
 * @package AcemarBlocks
 */

defined( 'ABSPATH' ) || exit;

get_header();

if ( have_posts() ) :
    while ( have_posts() ) :
        the_post();

        $has_thumb = has_post_thumbnail();
        $thumb_id  = get_post_thumbnail_id();
        $full_url  = $has_thumb ? get_the_post_thumbnail_url( null, 'full' )  : '';
        $large_url = $has_thumb ? get_the_post_thumbnail_url( null, '1536x1536' ) : '';
        $large_url = $large_url ?: $full_url;
        $alt       = $thumb_id  ? get_post_meta( $thumb_id, '_wp_attachment_image_alt', true ) : '';
        $alt       = $alt ?: get_the_title();
        $has_content = trim( get_the_content() ) !== '';

        // URL "Volver" — intenta referer, sino la home
        $back_url = wp_get_referer();
        if ( ! $back_url || strpos( $back_url, home_url() ) === false ) {
            $back_url = home_url( '/' );
        }
?>

<main class="acemar-panel-single" id="main-content">

    <?php if ( $has_thumb ) : ?>
    <!-- ── Hero ───────────────────────────────────────── -->
    <div
        class="acemar-panel-single__hero"
        role="button"
        tabindex="0"
        aria-label="<?php printf( esc_attr__( 'Ampliar imagen: %s', 'acemar-blocks' ), get_the_title() ); ?>"
    >
        <img
            class="acemar-panel-single__hero-img"
            src="<?php echo esc_url( $large_url ); ?>"
            data-full="<?php echo esc_url( $full_url ); ?>"
            alt="<?php echo esc_attr( $alt ); ?>"
            loading="eager"
        >
        <span class="acemar-panel-single__hero-hint" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/>
                <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M8 11h6M11 8v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
        </span>
    </div>
    <?php endif; ?>

    <!-- ── Contenedor central ─────────────────────────── -->
    <div class="acemar-panel-single__container">

        <!-- Volver -->
        <nav class="acemar-panel-single__nav" aria-label="<?php esc_attr_e( 'Navegación de vuelta', 'acemar-blocks' ); ?>">
            <a href="<?php echo esc_url( $back_url ); ?>" class="acemar-panel-single__back">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <?php esc_html_e( 'Volver', 'acemar-blocks' ); ?>
            </a>
        </nav>

        <!-- Título -->
        <header class="acemar-panel-single__header">
            <h1 class="acemar-panel-single__title"><?php the_title(); ?></h1>
        </header>

        <?php if ( $has_content ) : ?>
        <!-- Contenido (bloques Gutenberg) -->
        <div class="acemar-panel-single__content">
            <?php the_content(); ?>
        </div>
        <?php endif; ?>

    </div><!-- /.acemar-panel-single__container -->

</main>

<?php
    endwhile;
endif;

get_footer();
