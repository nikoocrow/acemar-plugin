<?php
/**
 * Template: Single Panel Acústico Domus
 *
 * Layout:
 *   1. Hero (meta _acemar_panel_hero_id) — banner full-width
 *   2. Características (texto) + Imagen destacada (derecha, lightbox)
 *   3. Galería de Aplicaciones (título + párrafo + grid)
 *   4. Contenido Gutenberg (opcional)
 *
 * Override: copiar este archivo al root del tema activo.
 *
 * @package AcemarBlocks
 */

defined( 'ABSPATH' ) || exit;

get_header();

if ( have_posts() ) :
    while ( have_posts() ) :
        the_post();

        $post_id = get_the_ID();

        // ── Hero ───────────────────────────────────────────────
        $hero_id  = absint( get_post_meta( $post_id, '_acemar_panel_hero_id', true ) );
        $hero_url = $hero_id ? wp_get_attachment_image_url( $hero_id, 'full' ) : '';
        $hero_alt = $hero_id ? ( get_post_meta( $hero_id, '_wp_attachment_image_alt', true ) ?: get_the_title() ) : '';

        // ── Imagen destacada (características) ─────────────────
        $has_thumb  = has_post_thumbnail();
        $thumb_id   = get_post_thumbnail_id();
        $thumb_lg   = $has_thumb ? get_the_post_thumbnail_url( null, 'large' )   : '';
        $thumb_full = $has_thumb ? get_the_post_thumbnail_url( null, 'full' )    : '';
        $thumb_alt  = $thumb_id  ? ( get_post_meta( $thumb_id, '_wp_attachment_image_alt', true ) ?: get_the_title() ) : get_the_title();

        // ── Características ────────────────────────────────────
        $caract_raw = get_post_meta( $post_id, '_acemar_panel_caracteristicas', true );
        $caract     = $caract_raw ? json_decode( $caract_raw, true ) : [];
        $caract     = is_array( $caract ) ? $caract : [];

        // ── Galería ────────────────────────────────────────────
        $gal_titulo = get_post_meta( $post_id, '_acemar_panel_galeria_titulo', true );
        $gal_texto  = get_post_meta( $post_id, '_acemar_panel_galeria_texto',  true );
        $gal_raw    = get_post_meta( $post_id, '_acemar_panel_galeria_ids',    true );
        $gal_ids    = $gal_raw
            ? array_values( array_filter( array_map( 'absint', explode( ',', $gal_raw ) ) ) )
            : [];

        // ── Contenido editor ───────────────────────────────────
        $has_content = trim( get_the_content() ) !== '';

        // URL volver
        $back_url = wp_get_referer();
        if ( ! $back_url || strpos( $back_url, home_url() ) === false ) {
            $back_url = home_url( '/' );
        }

        $show_caract_section = $has_thumb || ! empty( $caract );
        $show_galeria        = ! empty( $gal_ids ) || $gal_titulo || $gal_texto;
?>

<main class="acemar-panel-single" id="main-content">

    <?php if ( $hero_url ) : ?>
    <!-- ════ 1. HERO ════════════════════════════════════════ -->
    <div class="acemar-panel-single__hero">
        <img
            class="acemar-panel-single__hero-img"
            src="<?php echo esc_url( $hero_url ); ?>"
            alt="<?php echo esc_attr( $hero_alt ); ?>"
            loading="eager"
        >
    </div>
    <?php endif; ?>

    <!-- ════ CONTAINER ══════════════════════════════════════ -->
    <div class="acemar-panel-single__container">

        <!-- Volver -->
        <nav class="acemar-panel-single__nav" aria-label="Navegación de vuelta">
            <a href="<?php echo esc_url( $back_url ); ?>" class="acemar-panel-single__back">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <?php esc_html_e( 'Volver', 'acemar-blocks' ); ?>
            </a>
        </nav>

        <?php if ( $show_caract_section ) : ?>
        <!-- ════ 2. CARACTERÍSTICAS + IMAGEN DESTACADA ══════ -->
        <section class="acemar-panel-caract">

            <!-- Columna texto (izquierda) -->
            <div class="acemar-panel-caract__content">

                <h1 class="acemar-panel-caract__title"><?php the_title(); ?></h1>

                <?php if ( ! empty( $caract ) ) : ?>
                <ul class="acemar-panel-caract__list" aria-label="<?php esc_attr_e( 'Características del panel', 'acemar-blocks' ); ?>">
                    <?php foreach ( $caract as $item ) : ?>
                        <li class="acemar-panel-caract__item"><?php echo esc_html( $item ); ?></li>
                    <?php endforeach; ?>
                </ul>
                <?php endif; ?>

            </div>

            <?php if ( $has_thumb ) : ?>
            <!-- Columna imagen (derecha) con lightbox -->
            <div class="acemar-panel-caract__img-col">
                <div
                    class="acemar-panel-single__featured-wrap"
                    role="button"
                    tabindex="0"
                    aria-label="<?php printf( esc_attr__( 'Ampliar imagen: %s', 'acemar-blocks' ), get_the_title() ); ?>"
                >
                    <img
                        class="acemar-panel-single__featured-img"
                        src="<?php echo esc_url( $thumb_lg ); ?>"
                        data-full="<?php echo esc_url( $thumb_full ); ?>"
                        alt="<?php echo esc_attr( $thumb_alt ); ?>"
                        loading="eager"
                    >
                    <span class="acemar-panel-single__feat-hint" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/>
                            <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                            <path d="M8 11h6M11 8v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                        </svg>
                    </span>
                </div>
            </div>
            <?php elseif ( ! $hero_url ) : ?>
            <!-- Sin hero ni thumbnail: mostrar solo el título -->
            <div class="acemar-panel-caract__img-col"></div>
            <?php endif; ?>

        </section>
        <?php elseif ( ! $hero_url ) : ?>
        <!-- Sin hero ni características: título solo -->
        <header style="margin-bottom:48px;">
            <h1 class="acemar-panel-caract__title" style="margin-bottom:0"><?php the_title(); ?></h1>
        </header>
        <?php endif; ?>

        <?php if ( $show_galeria ) : ?>
        <!-- ════ 3. GALERÍA DE APLICACIONES ════════════════ -->
        <section class="acemar-panel-galeria">

            <?php if ( $gal_titulo || $gal_texto ) : ?>
            <div class="acemar-panel-galeria__header">
                <?php if ( $gal_titulo ) : ?>
                    <h2 class="acemar-panel-galeria__titulo"><?php echo esc_html( $gal_titulo ); ?></h2>
                <?php endif; ?>
                <?php if ( $gal_texto ) : ?>
                    <p class="acemar-panel-galeria__texto"><?php echo esc_html( $gal_texto ); ?></p>
                <?php endif; ?>
            </div>
            <?php endif; ?>

            <?php if ( ! empty( $gal_ids ) ) : ?>
            <div class="acemar-panel-galeria__grid">
                <?php foreach ( $gal_ids as $img_id ) :
                    $img_md   = wp_get_attachment_image_url( $img_id, 'medium_large' );
                    $img_full = wp_get_attachment_image_url( $img_id, 'full' );
                    if ( ! $img_md ) continue;
                    $img_alt  = get_post_meta( $img_id, '_wp_attachment_image_alt', true ) ?: '';
                ?>
                    <div
                        class="acemar-panel-galeria__item"
                        role="button"
                        tabindex="0"
                        aria-label="<?php echo $img_alt ? esc_attr( $img_alt ) : esc_attr__( 'Ver imagen', 'acemar-blocks' ); ?>"
                    >
                        <img
                            class="acemar-panel-galeria__img"
                            src="<?php echo esc_url( $img_md ); ?>"
                            data-full="<?php echo esc_url( $img_full ?: $img_md ); ?>"
                            alt="<?php echo esc_attr( $img_alt ); ?>"
                            loading="lazy"
                            draggable="false"
                        >
                        <div class="acemar-panel-galeria__overlay" aria-hidden="true">
                            <svg class="acemar-panel-galeria__zoom" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/>
                                <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                                <path d="M8 11h6M11 8v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                            </svg>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>

        </section>
        <?php endif; ?>

        <?php if ( $has_content ) : ?>
        <!-- ════ 4. CONTENIDO GUTENBERG ════════════════════ -->
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
