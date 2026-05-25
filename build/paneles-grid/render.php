<?php
/**
 * Render callback: Paneles Acústicos Domus – Grid
 *
 * @var array    $attributes
 * @var string   $content
 * @var WP_Block $block
 */
defined( 'ABSPATH' ) || exit;

$titulo      = ! empty( $attributes['titulo'] )     ? $attributes['titulo']     : '';
$columnas    = ! empty( $attributes['columnas'] )   ? absint( $attributes['columnas'] ) : 3;
$align_class = ! empty( $attributes['align'] )      ? 'align' . $attributes['align'] : '';
$alineacion  = ! empty( $attributes['alineacion'] ) ? $attributes['alineacion'] : 'left';
$text_class  = 'is-align-' . sanitize_html_class( $alineacion );

// Limitar columnas entre 2 y 4
$columnas = max( 2, min( 4, $columnas ) );

$paneles = get_posts( [
    'post_type'      => 'acemar_panel',
    'posts_per_page' => -1,
    'post_status'    => 'publish',
    'orderby'        => 'menu_order',
    'order'          => 'ASC',
] );
?>

<section
    class="acemar-paneles-grid wp-block-acemar-paneles-grid <?php echo esc_attr( $align_class . ' ' . $text_class ); ?>"
    style="--paneles-cols: <?php echo esc_attr( $columnas ); ?>;"
>

    <?php if ( $titulo ) : ?>
        <div class="acemar-paneles-grid__header">
            <h2 class="acemar-paneles-grid__titulo"><?php echo esc_html( $titulo ); ?></h2>
        </div>
    <?php endif; ?>

    <?php if ( empty( $paneles ) ) : ?>
        <p class="acemar-paneles-grid__empty">
            <?php esc_html_e( 'Aún no hay paneles publicados.', 'acemar-blocks' ); ?>
        </p>
    <?php else : ?>

        <div class="acemar-paneles-grid__grid">
            <?php foreach ( $paneles as $panel ) :

                $title      = get_the_title( $panel );
                $thumb_url  = get_the_post_thumbnail_url( $panel->ID, 'large' );
                $full_url   = get_the_post_thumbnail_url( $panel->ID, 'full' );
                $thumb_id   = get_post_thumbnail_id( $panel->ID );
                $alt        = $thumb_id ? get_post_meta( $thumb_id, '_wp_attachment_image_alt', true ) : '';
                $alt        = $alt ?: $title;

                if ( ! $thumb_url ) {
                    $thumb_url = null;
                    $full_url  = null;
                }
            ?>
                <article
                    class="acemar-panel-card<?php echo $thumb_url ? ' has-image' : ''; ?>"
                    <?php if ( $thumb_url ) : ?>
                        data-full="<?php echo esc_url( $full_url ?: $thumb_url ); ?>"
                        data-alt="<?php echo esc_attr( $alt ); ?>"
                        role="button"
                        tabindex="0"
                        aria-label="<?php printf( esc_attr__( 'Ver imagen: %s', 'acemar-blocks' ), $title ); ?>"
                    <?php endif; ?>
                >

                    <div class="acemar-panel-card__img-wrap">
                        <?php if ( $thumb_url ) : ?>
                            <img
                                class="acemar-panel-card__img"
                                src="<?php echo esc_url( $thumb_url ); ?>"
                                alt="<?php echo esc_attr( $alt ); ?>"
                                loading="lazy"
                                draggable="false"
                            >
                            <div class="acemar-panel-card__overlay" aria-hidden="true">
                                <svg class="acemar-panel-card__zoom-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/>
                                    <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                                    <path d="M8 11h6M11 8v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                                </svg>
                            </div>
                        <?php else : ?>
                            <div class="acemar-panel-card__placeholder"></div>
                        <?php endif; ?>
                    </div>

                    <div class="acemar-panel-card__body">
                        <h3 class="acemar-panel-card__title"><?php echo esc_html( $title ); ?></h3>
                    </div>

                </article>
            <?php endforeach; ?>
        </div><!-- /.acemar-paneles-grid__grid -->

    <?php endif; ?>

</section>
