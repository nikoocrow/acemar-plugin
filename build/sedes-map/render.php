<?php
/**
 * render.php — Acemar: Mapa de Sedes
 *
 * Variables disponibles:
 * $attributes  array  Atributos del bloque
 * $content     string Inner blocks (no aplica aquí)
 * $block       WP_Block
 */

$titulo         = esc_html( $attributes['titulo'] ?? 'Encuentra una Sede Acemar Cerca de Ti' );
$descripcion    = esc_html( $attributes['descripcion'] ?? '' );
$api_key        = esc_attr( $attributes['googleMapsApiKey'] ?? '' );
$map_zoom       = intval( $attributes['mapZoom'] ?? 6 );
$map_center_lat = floatval( $attributes['mapCenter']['lat'] ?? 4.570868 );
$map_center_lng = floatval( $attributes['mapCenter']['lng'] ?? -74.297333 );
$sedes          = $attributes['sedes'] ?? [];
$marker_svg_url = esc_attr( $attributes['markerSvgUrl'] ?? '' );
$marker_width   = intval( $attributes['markerWidth'] ?? 40 );
$marker_height  = intval( $attributes['markerHeight'] ?? 40 );


// Sanitizar sedes
$sedes_clean = array_map( function( $sede ) {
    return [
        'id'           => esc_attr( $sede['id'] ?? '' ),
        'nombre'       => esc_html( $sede['nombre'] ?? '' ),
        'ciudad'       => esc_html( $sede['ciudad'] ?? '' ),
        'departamento' => esc_html( $sede['departamento'] ?? '' ),
        'direccion'    => esc_html( $sede['direccion'] ?? '' ),
        'telefono'     => esc_html( $sede['telefono'] ?? '' ),
        'lat'          => floatval( $sede['lat'] ?? 0 ),
        'lng'          => floatval( $sede['lng'] ?? 0 ),
        'urlDetalle'   => esc_url( $sede['urlDetalle'] ?? '' ),
        'urlContacto'  => esc_url( $sede['urlContacto'] ?? '' ),
    ];
}, $sedes );

// Pasar datos al JS del frontend
$block_id = 'acemar-sedes-map-' . wp_unique_id();
?>

<section
    id="<?php echo $block_id; ?>"
    class="acemar-sedes-map wp-block-acemar-sedes-map"
    data-map-api-key="<?php echo $api_key; ?>"
    data-map-zoom="<?php echo $map_zoom; ?>"
    data-map-center-lat="<?php echo $map_center_lat; ?>"
    data-map-center-lng="<?php echo $map_center_lng; ?>"
    data-sedes="<?php echo esc_attr( wp_json_encode( $sedes_clean ) ); ?>"
    data-marker-svg="<?php echo esc_attr( $attributes['markerSvgUrl'] ?? '' ); ?>"
    data-marker-svg="<?php echo $marker_svg_url; ?>"
    data-marker-width="<?php echo $marker_width; ?>"
    data-marker-height="<?php echo $marker_height; ?>"
>
    <!-- ── Columna izquierda ── -->
    <div class="acemar-sedes-map__panel">

        <span class="acemar-sedes-map__eyebrow">Todas las sedes</span>
        <h2 class="acemar-sedes-map__title"><?php echo $titulo; ?></h2>
        <p class="acemar-sedes-map__desc"><?php echo $descripcion; ?></p>

        <!-- Buscador -->
        <div class="acemar-sedes-map__search">
            <input
                type="text"
                id="<?php echo $block_id; ?>-search"
                class="acemar-sedes-map__search-input"
                placeholder="Buscar por ciudad o departamento..."
                autocomplete="off"
            />
            <button class="acemar-sedes-map__search-btn" aria-label="Buscar">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
            </button>
        </div>

        <!-- Listado de sedes -->
        <div class="acemar-sedes-map__list" id="<?php echo $block_id; ?>-list">
            <?php if ( empty( $sedes_clean ) ) : ?>
                <p class="acemar-sedes-map__empty">No hay sedes configuradas.</p>
            <?php else : ?>
                <?php foreach ( $sedes_clean as $sede ) : ?>
                    <div
                        class="acemar-sede-card"
                        data-sede-id="<?php echo esc_attr( $sede['id'] ); ?>"
                        data-lat="<?php echo $sede['lat']; ?>"
                        data-lng="<?php echo $sede['lng']; ?>"
                        data-ciudad="<?php echo strtolower( $sede['ciudad'] . ' ' . $sede['departamento'] ); ?>"
                    >
                        <div class="acemar-sede-card__header">
                            <h3 class="acemar-sede-card__name"><?php echo $sede['nombre']; ?></h3>
                            <?php if ( $sede['ciudad'] ) : ?>
                                <span class="acemar-sede-card__city"><?php echo $sede['ciudad'] . ', ' . $sede['departamento']; ?></span>
                            <?php endif; ?>
                        </div>

                        <div class="acemar-sede-card__info">
                            <?php if ( $sede['direccion'] ) : ?>
                                <p class="acemar-sede-card__address">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                    <?php echo $sede['direccion']; ?>
                                </p>
                            <?php endif; ?>
                            <?php if ( $sede['telefono'] ) : ?>
                                <p class="acemar-sede-card__phone">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                                    <?php echo $sede['telefono']; ?>
                                </p>
                            <?php endif; ?>
                        </div>

                        <div class="acemar-sede-card__actions">
                            <?php if ( $sede['urlContacto'] ) : ?>
                                <a href="<?php echo $sede['urlContacto']; ?>" class="acemar-btn acemar-btn--outline">
                                    Agendar Consulta
                                </a>
                            <?php endif; ?>
                            <?php if ( $sede['urlDetalle'] ) : ?>
                                <a href="<?php echo $sede['urlDetalle']; ?>" class="acemar-btn acemar-btn--solid">
                                    Ver Sede
                                </a>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>

    <!-- ── Columna derecha: Mapa ── -->
    <div class="acemar-sedes-map__map-wrapper">
        <div class="acemar-sedes-map__map" id="<?php echo $block_id; ?>-map"></div>
    </div>

</section>

<?php if ( $api_key ) : ?>
    <script>
        window.acemarSedesMapConfig = window.acemarSedesMapConfig || [];
        window.acemarSedesMapConfig.push( '<?php echo $block_id; ?>' );
    </script>
    <?php
    // Encolar Google Maps solo si hay API key
    wp_enqueue_script(
        'google-maps-api',
        'https://maps.googleapis.com/maps/api/js?key=' . $api_key . '&callback=acemarInitMaps&loading=async',
        [],
        null,
        true
    );
    ?>
<?php endif; ?>
