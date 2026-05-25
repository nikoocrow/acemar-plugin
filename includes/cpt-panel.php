<?php
/**
 * CPT: acemar_panel
 * Paneles Acústicos Domus
 * Campos: imagen destacada (thumbnail), título, descripción opcional (editor nativo)
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
        'public'          => false,
        'show_ui'         => true,
        'show_in_menu'    => true,
        'show_in_rest'    => true,
        'menu_icon'       => 'dashicons-grid-view',
        'menu_position'   => 27,
        'supports'        => [ 'title', 'thumbnail', 'editor' ],
        'has_archive'     => false,
        'rewrite'         => false,
        'description'     => __( 'Paneles Acústicos Domus para mostrar en el sitio web.', 'acemar-blocks' ),
    ] );
}
add_action( 'init', 'acemar_register_cpt_panel' );


// ============================================================
// HINT ADMIN: indicar que la imagen destacada es obligatoria
// ============================================================
function acemar_panel_featured_image_notice() {
    $screen = get_current_screen();
    if ( $screen && $screen->post_type === 'acemar_panel' ) {
        echo '<style>
            #postimagediv .inside::after {
                content: "⚠ La imagen destacada es la que aparece en el grid del sitio web.";
                display: block;
                margin-top: 8px;
                font-size: 11px;
                color: #646970;
                font-style: italic;
            }
            #postdivrich .wp-editor-area-wrap::before {
                content: "Descripción opcional — no se muestra en el grid, solo en el panel administrativo.";
                display: block;
                background: #f0f6fc;
                border-left: 3px solid #72aee6;
                padding: 6px 10px;
                font-size: 11px;
                color: #2271b1;
                margin-bottom: 8px;
            }
        </style>';
    }
}
add_action( 'admin_head', 'acemar_panel_featured_image_notice' );
