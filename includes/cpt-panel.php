<?php
/**
 * CPT: acemar_panel
 * Paneles Acústicos Domus
 * Campos: imagen destacada (thumbnail), título, descripción/bloques (editor nativo)
 *
 * @package AcemarBlocks
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ============================================================
// CPT: acemar_panel
// ============================================================
function acemar_register_cpt_panel() {
    register_post_type( 'acemar_panel', [
        'labels' => [
            'name'               => __( 'Paneles Domus',               'acemar-blocks' ),
            'singular_name'      => __( 'Panel Domus',                 'acemar-blocks' ),
            'add_new'            => __( 'Añadir panel',                'acemar-blocks' ),
            'add_new_item'       => __( 'Añadir nuevo panel',          'acemar-blocks' ),
            'edit_item'          => __( 'Editar panel',                'acemar-blocks' ),
            'new_item'           => __( 'Nuevo panel',                 'acemar-blocks' ),
            'view_item'          => __( 'Ver panel',                   'acemar-blocks' ),
            'search_items'       => __( 'Buscar paneles',              'acemar-blocks' ),
            'not_found'          => __( 'No se encontraron paneles',   'acemar-blocks' ),
            'not_found_in_trash' => __( 'No hay paneles en la papelera', 'acemar-blocks' ),
            'menu_name'          => __( 'Paneles Domus',               'acemar-blocks' ),
        ],
        'public'              => false,        // no aparece en búsquedas del sitio
        'publicly_queryable'  => true,         // tiene URLs propias (permalink)
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_rest'        => true,         // Gutenberg activo
        'menu_icon'           => 'dashicons-grid-view',
        'menu_position'       => 27,
        'supports'            => [ 'title', 'thumbnail', 'editor' ],
        'has_archive'         => false,
        'rewrite'             => [ 'slug' => 'paneles-domus', 'with_front' => false ],
        'description'         => __( 'Paneles Acústicos Domus para mostrar en el sitio web.', 'acemar-blocks' ),
    ] );
}
add_action( 'init', 'acemar_register_cpt_panel' );


// ============================================================
// TEMPLATE ÚNICO — servido desde el plugin
// ============================================================
function acemar_panel_template_include( $template ) {
    if ( ! is_singular( 'acemar_panel' ) ) {
        return $template;
    }

    // Buscar primero en el tema activo (permite overrides)
    $theme_tpl = locate_template( 'single-acemar_panel.php' );
    if ( $theme_tpl ) {
        return $theme_tpl;
    }

    // Template del plugin
    $plugin_tpl = ACEMAR_BLOCKS_PATH . 'templates/single-acemar_panel.php';
    if ( file_exists( $plugin_tpl ) ) {
        return $plugin_tpl;
    }

    return $template;
}
add_filter( 'template_include', 'acemar_panel_template_include' );


// ============================================================
// ESTILOS Y SCRIPTS EN LA PÁGINA SINGLE
// ============================================================
function acemar_panel_single_assets() {
    if ( ! is_singular( 'acemar_panel' ) ) return;

    // CSS del bloque paneles-grid (contiene los estilos de .acemar-panel-single)
    wp_enqueue_style(
        'acemar-paneles-grid-style',
        ACEMAR_BLOCKS_URL . 'build/paneles-grid/style-index.css',
        [],
        ACEMAR_BLOCKS_VERSION
    );

    // JS del frontend (lightbox del hero)
    wp_enqueue_script(
        'acemar-paneles-grid-frontend',
        ACEMAR_BLOCKS_URL . 'build/paneles-grid/frontend.js',
        [],
        ACEMAR_BLOCKS_VERSION,
        true
    );

    // Estilos de bloques del editor de WordPress (core blocks)
    wp_enqueue_style( 'wp-block-library' );

    // Google Fonts (Italiana + Tenor Sans, usadas en el diseño)
    if ( ! wp_style_is( 'acemar-google-fonts', 'enqueued' ) ) {
        wp_enqueue_style(
            'acemar-google-fonts',
            'https://fonts.googleapis.com/css2?family=Italiana&family=Tenor+Sans&display=swap',
            [],
            null
        );
    }
}
add_action( 'wp_enqueue_scripts', 'acemar_panel_single_assets' );


// ============================================================
// HINT ADMIN: indicar para qué sirve cada campo
// ============================================================
function acemar_panel_admin_hints() {
    $screen = get_current_screen();
    if ( ! $screen || $screen->post_type !== 'acemar_panel' ) return;
    ?>
    <style>
        #postimagediv .inside::after {
            content: "⚠ La imagen destacada es la que aparece en el grid del sitio web.";
            display: block;
            margin-top: 8px;
            font-size: 11px;
            color: #646970;
            font-style: italic;
        }
        /* Aviso arriba del editor de bloques en sidebar */
        #acemar-panel-editor-note {
            background: #f0f6fc;
            border-left: 3px solid #72aee6;
            padding: 8px 12px;
            font-size: 12px;
            color: #2271b1;
            margin-bottom: 12px;
            border-radius: 0 4px 4px 0;
        }
    </style>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Insertar nota en la sidebar del editor de bloques (si existe)
        var sidebar = document.querySelector('.editor-post-publish-panel, .interface-complementary-area');
        if (!sidebar) return;
        var note = document.createElement('div');
        note.id = 'acemar-panel-editor-note';
        note.textContent = 'Usa el editor para añadir contenido detallado: descripción, especificaciones, imágenes adicionales, etc.';
        sidebar.prepend(note);
    });
    </script>
    <?php
}
add_action( 'admin_head', 'acemar_panel_admin_hints' );
