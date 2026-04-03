<?php
/**
 * render.php — Selector de Muestras
 */

$titulo      = $attributes['titulo']      ?? 'Selector de muestras';
$descripcion = $attributes['descripcion'] ?? '';
$tipo        = $attributes['tipoSelector'] ?? 'acabado';
$accent      = $attributes['colorAccent'] ?? '#C8A96A';

$tabs = [];
$tabs[] = [
    'label' => $attributes['etiquetaTab1'] ?? 'Colección 1',
    'slug'  => $attributes['slugTab1']     ?? '',
];
if ( ! empty( $attributes['mostrarTab2'] ) ) {
    $tabs[] = [
        'label' => $attributes['etiquetaTab2'] ?? 'Colección 2',
        'slug'  => $attributes['slugTab2']     ?? '',
    ];
}
if ( ! empty( $attributes['mostrarTab3'] ) ) {
    $tabs[] = [
        'label' => $attributes['etiquetaTab3'] ?? 'Colección 3',
        'slug'  => $attributes['slugTab3']     ?? '',
    ];
}

$wrapper_attrs = get_block_wrapper_attributes([
    'class'       => 'acemar-selector-muestras',
    'data-tipo'   => esc_attr( $tipo ),
    'data-accent' => esc_attr( $accent ),
    'style'       => '--sm-accent:' . esc_attr( $accent ) . ';',
]);
?>

<div <?php echo $wrapper_attrs; ?>>
<style>
.acemar-selector-muestras__tab {
    position: relative !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0.75rem 2rem !important;
    background: transparent !important;
    border: 1px solid var(--sm-accent, #C8A96A) !important;
    border-radius: 0 !important;
    cursor: pointer !important;
    transition: background 0.25s ease, color 0.25s ease !important;
    overflow: hidden !important;
}
.acemar-selector-muestras__tab .acemar-sm__tab-number {
    display: none !important;
}
.acemar-selector-muestras__tab .acemar-sm__tab-label {
    font-size: 0.75rem !important;
    font-weight: 600 !important;
    letter-spacing: 0.1em !important;
    text-transform: uppercase !important;
    color: #1a1a1a !important;
    text-align: center !important;
    line-height: 1 !important;
    display: block !important;
    transition: color 0.25s ease !important;
}
.acemar-selector-muestras__tab:hover {
    background: var(--sm-accent, #C8A96A) !important;
    border-color: var(--sm-accent, #C8A96A) !important;
}
.acemar-selector-muestras__tab:hover .acemar-sm__tab-label {
    color: #1a1a1a !important;
}
.acemar-selector-muestras__tab.is-active {
    background: var(--sm-accent, #C8A96A) !important;
    border-color: var(--sm-accent, #C8A96A) !important;
}
.acemar-selector-muestras__tab.is-active .acemar-sm__tab-label {
    color: #1a1a1a !important;
}
.acemar-selector-muestras__tabs {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: wrap !important;
    justify-content: center !important;
    gap: 1rem !important;
    width: 100% !important;
}
</style>

    <!-- Header -->
    <div class="acemar-selector-muestras__header">
        <h2 class="acemar-selector-muestras__titulo">
            <?php echo esc_html( $titulo ); ?>
        </h2>
        <span class="acemar-selector-muestras__accent-line"
              style="background-color: <?php echo esc_attr( $accent ); ?>;"></span>
        <?php if ( $descripcion ) : ?>
            <p class="acemar-selector-muestras__descripcion">
                <?php echo esc_html( $descripcion ); ?>
            </p>
        <?php endif; ?>
    </div>

    <!-- Body -->
    <div class="acemar-selector-muestras__body">

        <!-- Tabs -->
        <div class="acemar-selector-muestras__tabs" role="tablist">
            <?php foreach ( $tabs as $i => $tab ) : ?>
                <button
                    class="acemar-selector-muestras__tab<?php echo $i === 0 ? ' is-active' : ''; ?>"
                    role="tab"
                    aria-selected="<?php echo $i === 0 ? 'true' : 'false'; ?>"
                    aria-controls="acemar-sm-panel-<?php echo esc_attr( $i ); ?>"
                    data-slug="<?php echo esc_attr( $tab['slug'] ); ?>"
                >
                    <span class="acemar-sm__tab-number"><?php echo $i + 1; ?></span>
                    <span class="acemar-sm__tab-label"><?php echo esc_html( $tab['label'] ); ?></span>
                </button>
            <?php endforeach; ?>
        </div>

        <!-- Paneles -->
        <div class="acemar-selector-muestras__panels">
            <?php foreach ( $tabs as $i => $tab ) : ?>
                <div
                    id="acemar-sm-panel-<?php echo esc_attr( $i ); ?>"
                    class="acemar-selector-muestras__panel<?php echo $i === 0 ? ' is-active' : ''; ?>"
                    role="tabpanel"
                >
                    <h3 class="acemar-selector-muestras__panel-titulo">
                        <?php echo esc_html( $tab['label'] ); ?>
                    </h3>
                    <div class="acemar-selector-muestras__grid">
                        <div class="acemar-selector-muestras__loading">
                            <?php esc_html_e( 'Cargando muestras', 'acemar-blocks' ); ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

    </div>

</div>