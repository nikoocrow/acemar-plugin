<?php
/**
 * Render callback: Puertas – Grid
 *
 * @var array    $attributes
 * @var string   $content
 * @var WP_Block $block
 */
defined( 'ABSPATH' ) || exit;

$titulo      = ! empty( $attributes['titulo'] ) ? $attributes['titulo'] : '';
$align_class = ! empty( $attributes['align'] )  ? 'align' . $attributes['align'] : '';

$puertas = get_posts( [
    'post_type'      => 'acemar_puerta',
    'posts_per_page' => -1,
    'post_status'    => 'publish',
    'orderby'        => 'title',
    'order'          => 'ASC',
] );
?>

<section class="acemar-puertas-grid wp-block-acemar-puertas-grid <?php echo esc_attr( $align_class ); ?>">

    <?php if ( $titulo ) : ?>
        <div class="acemar-puertas-grid__header">
            <h2 class="acemar-puertas-grid__titulo"><?php echo esc_html( $titulo ); ?></h2>
        </div>
    <?php endif; ?>

    <?php if ( empty( $puertas ) ) : ?>
        <p class="acemar-puertas-grid__empty">
            <?php esc_html_e( 'Aún no hay puertas publicadas.', 'acemar-blocks' ); ?>
        </p>
    <?php else : ?>

        <div class="acemar-puertas-grid__grid">
            <?php foreach ( $puertas as $puerta ) :

                $title        = get_the_title( $puerta );
                $imagenes_raw = get_post_meta( $puerta->ID, '_acemar_puerta_imagenes', true );
                $ids          = $imagenes_raw
                    ? array_values( array_filter( array_map( 'absint', explode( ',', $imagenes_raw ) ) ) )
                    : [];

                $images = [];
                foreach ( $ids as $img_id ) {
                    $thumb_url = wp_get_attachment_image_url( $img_id, 'large' );
                    $full_url  = wp_get_attachment_image_url( $img_id, 'full' );
                    if ( ! $thumb_url ) continue;
                    $alt      = get_post_meta( $img_id, '_wp_attachment_image_alt', true );
                    $images[] = [
                        'thumb' => $thumb_url,
                        'full'  => $full_url ?: $thumb_url,
                        'alt'   => $alt ?: $title,
                    ];
                }

                $count = count( $images );
            ?>
                <article class="acemar-puerta-card">

                    <div class="acemar-puerta-card__slider" data-count="<?php echo esc_attr( $count ); ?>">

                        <div class="acemar-puerta-card__slides">
                            <?php if ( empty( $images ) ) : ?>
                                <div class="acemar-puerta-card__slide is-active" data-index="0">
                                    <div class="acemar-puerta-card__placeholder"></div>
                                </div>
                            <?php else : ?>
                                <?php foreach ( $images as $i => $img ) : ?>
                                    <div class="acemar-puerta-card__slide<?php echo $i === 0 ? ' is-active' : ''; ?>" data-index="<?php echo esc_attr( $i ); ?>">
                                        <img
                                            class="acemar-puerta-card__img"
                                            src="<?php echo esc_url( $img['thumb'] ); ?>"
                                            data-full="<?php echo esc_url( $img['full'] ); ?>"
                                            alt="<?php echo esc_attr( $img['alt'] ); ?>"
                                            loading="<?php echo $i === 0 ? 'eager' : 'lazy'; ?>"
                                            draggable="false"
                                        >
                                    </div>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>

                        <?php if ( $count > 1 ) : ?>
                            <button class="acemar-puerta-card__arrow acemar-puerta-card__arrow--prev" type="button" aria-label="<?php esc_attr_e( 'Imagen anterior', 'acemar-blocks' ); ?>">
                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
                                    <path d="M7 1L1 7L7 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <button class="acemar-puerta-card__arrow acemar-puerta-card__arrow--next" type="button" aria-label="<?php esc_attr_e( 'Siguiente imagen', 'acemar-blocks' ); ?>">
                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
                                    <path d="M1 1L7 7L1 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <div class="acemar-puerta-card__bullets" role="tablist">
                                <?php for ( $i = 0; $i < $count; $i++ ) : ?>
                                    <button
                                        class="acemar-puerta-card__bullet<?php echo $i === 0 ? ' is-active' : ''; ?>"
                                        type="button"
                                        data-index="<?php echo esc_attr( $i ); ?>"
                                        role="tab"
                                        aria-label="<?php printf( esc_attr__( 'Imagen %d', 'acemar-blocks' ), $i + 1 ); ?>"
                                        aria-selected="<?php echo $i === 0 ? 'true' : 'false'; ?>"
                                    ></button>
                                <?php endfor; ?>
                            </div>
                        <?php endif; ?>

                    </div><!-- /.acemar-puerta-card__slider -->

                    <div class="acemar-puerta-card__body">
                        <h3 class="acemar-puerta-card__title"><?php echo esc_html( $title ); ?></h3>
                    </div>

                </article>
            <?php endforeach; ?>
        </div><!-- /.acemar-puertas-grid__grid -->

    <?php endif; ?>

</section>
