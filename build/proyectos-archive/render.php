<?php
/**
 * Render callback: Proyectos – Archivo
 *
 * @var array  $attributes Atributos del bloque
 * @var string $content    Contenido inner blocks (vacío, SSR puro)
 * @var WP_Block $block    Instancia del bloque
 */
defined( 'ABSPATH' ) || exit;

$titulo    = ! empty( $attributes['titulo'] )    ? $attributes['titulo']    : '';
$subtitulo = ! empty( $attributes['subtitulo'] ) ? $attributes['subtitulo'] : '';

// ── Taxonomías: solo términos con proyectos asignados ──────────────────────────
$segmentos    = get_terms( [ 'taxonomy' => 'acemar_segmento',    'hide_empty' => true ] );
$usos         = get_terms( [ 'taxonomy' => 'acemar_uso',         'hide_empty' => true ] );
$tipos_madera = get_terms( [ 'taxonomy' => 'acemar_tipo_madera', 'hide_empty' => true ] );

// ── Query inicial: todos los proyectos ────────────────────────────────────────
$proyectos = get_posts( [
    'post_type'      => 'acemar_proyecto',
    'posts_per_page' => -1,
    'post_status'    => 'publish',
    'orderby'        => 'menu_order date',
    'order'          => 'ASC',
] );

// ── Align class ───────────────────────────────────────────────────────────────
$align_class = ! empty( $attributes['align'] ) ? 'align' . $attributes['align'] : '';
?>

<section
    class="acemar-proyectos-archive wp-block-acemar-proyectos-archive <?php echo esc_attr( $align_class ); ?>"
    data-rest-url="<?php echo esc_url( rest_url( 'acemar/v1/proyectos' ) ); ?>"
>

    <?php if ( $titulo ) : ?>
        <div class="acemar-proyectos-archive__header">
            <h2 class="acemar-proyectos-archive__titulo"><?php echo esc_html( $titulo ); ?></h2>
            <?php if ( $subtitulo ) : ?>
                <p class="acemar-proyectos-archive__subtitulo"><?php echo esc_html( $subtitulo ); ?></p>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <!-- ── FILTROS ─────────────────────────────────────────── -->
    <div class="acemar-proyectos-archive__filters" role="search" aria-label="<?php esc_attr_e( 'Filtrar proyectos', 'acemar-blocks' ); ?>">

        <?php
        $dropdowns = [
            'segmento'    => [ 'label' => __( 'Segmentos',       'acemar-blocks' ), 'terms' => $segmentos ],
            'uso'         => [ 'label' => __( 'Usos',            'acemar-blocks' ), 'terms' => $usos ],
            'tipo_madera' => [ 'label' => __( 'Tipos de madera', 'acemar-blocks' ), 'terms' => $tipos_madera ],
        ];

        foreach ( $dropdowns as $key => $data ) :
            if ( is_wp_error( $data['terms'] ) || empty( $data['terms'] ) ) continue;
        ?>
            <div class="acemar-filter__wrapper">
                <button
                    class="acemar-filter__trigger"
                    aria-expanded="false"
                    aria-haspopup="listbox"
                    data-filter="<?php echo esc_attr( $key ); ?>"
                    type="button"
                >
                    <span class="acemar-filter__label"><?php echo esc_html( $data['label'] ); ?></span>
                    <svg class="acemar-filter__arrow" width="12" height="7" viewBox="0 0 12 7" fill="none" aria-hidden="true">
                        <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <ul class="acemar-filter__dropdown" role="listbox" data-filter="<?php echo esc_attr( $key ); ?>">
                    <li
                        class="acemar-filter__option acemar-filter__option--reset is-selected"
                        role="option"
                        data-value=""
                        aria-selected="true"
                    ><?php esc_html_e( 'Todos', 'acemar-blocks' ); ?></li>
                    <?php foreach ( $data['terms'] as $term ) : ?>
                        <li
                            class="acemar-filter__option"
                            role="option"
                            data-value="<?php echo esc_attr( $term->slug ); ?>"
                            aria-selected="false"
                        ><?php echo esc_html( $term->name ); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endforeach; ?>

        <button class="acemar-filter__reset-all" type="button" aria-label="<?php esc_attr_e( 'Limpiar filtros', 'acemar-blocks' ); ?>" style="display:none;">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <?php esc_html_e( 'Limpiar', 'acemar-blocks' ); ?>
        </button>

    </div><!-- /.acemar-proyectos-archive__filters -->

    <!-- ── ESTADO (loading / sin resultados) ──────────────── -->
    <div class="acemar-proyectos-archive__state" aria-live="polite" aria-atomic="true" hidden></div>

    <!-- ── GRID MASONRY ────────────────────────────────────── -->
    <div class="acemar-proyectos-archive__grid" id="acemar-proyectos-grid">

        <?php if ( empty( $proyectos ) ) : ?>
            <p class="acemar-proyectos-archive__empty">
                <?php esc_html_e( 'Aún no hay proyectos publicados.', 'acemar-blocks' ); ?>
            </p>
        <?php else : ?>
            <?php foreach ( $proyectos as $proyecto ) :
                $img   = get_the_post_thumbnail_url( $proyecto->ID, 'large' );
                $title = get_the_title( $proyecto );
                $link  = get_permalink( $proyecto );
            ?>
              <article class="acemar-proyecto-card" data-id="<?php echo esc_attr( $proyecto->ID ); ?>">
                <a href="<?php echo esc_url( $link ); ?>" class="acemar-proyecto-card__link" aria-label="<?php echo esc_attr( $title ); ?>">

                    <?php if ( $img ) : ?>
                        <img class="acemar-proyecto-card__img" src="<?php echo esc_url( $img ); ?>" alt="<?php echo esc_attr( $title ); ?>" loading="lazy" />
                    <?php else : ?>
                        <div class="acemar-proyecto-card__placeholder" aria-hidden="true">...</div>
                    <?php endif; ?>

                    <div class="acemar-proyecto-card__overlay" aria-hidden="true">
                        <span class="acemar-proyecto-card__name"><?php echo esc_html( $title ); ?></span>
                    </div>

                    <div class="acemar-proyecto-card__info">
                        <h3 class="acemar-proyecto-card__info-title"><?php echo esc_html( $title ); ?></h3>
                        <span class="acemar-proyecto-card__info-divider" aria-hidden="true"></span>
                        <?php $excerpt = get_the_excerpt( $proyecto ); if ( $excerpt ) : ?>
                            <p class="acemar-proyecto-card__info-excerpt"><?php echo esc_html( $excerpt ); ?></p>
                        <?php endif; ?>
                    </div>

                </a>
            </article>
            <?php endforeach; ?>
        <?php endif; ?>

    </div><!-- /#acemar-proyectos-grid -->

</section>
