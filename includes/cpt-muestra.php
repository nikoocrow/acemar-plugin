<?php
/**
 * CPT: acemar_muestra
 * Tipo de selector: acabado | terminacion | color
 *
 * @package AcemarBlocks
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ============================================================
// CPT: acemar_muestra
// ============================================================
function acemar_register_cpt_muestra() {
    register_post_type( 'acemar_muestra', [
        'labels' => [
            'name'               => __( 'Muestras',           'acemar-blocks' ),
            'singular_name'      => __( 'Muestra',            'acemar-blocks' ),
            'add_new'            => __( 'Añadir muestra',      'acemar-blocks' ),
            'add_new_item'       => __( 'Añadir nueva muestra','acemar-blocks' ),
            'edit_item'          => __( 'Editar muestra',      'acemar-blocks' ),
            'new_item'           => __( 'Nueva muestra',       'acemar-blocks' ),
            'view_item'          => __( 'Ver muestra',         'acemar-blocks' ),
            'search_items'       => __( 'Buscar muestras',     'acemar-blocks' ),
            'not_found'          => __( 'No se encontraron muestras', 'acemar-blocks' ),
            'menu_name'          => __( 'Muestras',            'acemar-blocks' ),
        ],
        'public'              => false,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_rest'        => true,
        'menu_icon'           => 'dashicons-art',
        'menu_position'       => 25,
        'supports'            => [ 'title', 'thumbnail' ],
        'taxonomies'          => [ 'acemar_tipo_muestra', 'acemar_categoria_muestra' ],
        'has_archive'         => false,
        'rewrite'             => false,
    ] );
}
add_action( 'init', 'acemar_register_cpt_muestra' );


// ============================================================
// TAXONOMÍA 1: Tipo de selector (acabado | terminacion | color)
// ============================================================
function acemar_register_tax_tipo_muestra() {
    register_taxonomy( 'acemar_tipo_muestra', 'acemar_muestra', [
        'labels' => [
            'name'          => __( 'Tipo de selector', 'acemar-blocks' ),
            'singular_name' => __( 'Tipo',             'acemar-blocks' ),
            'add_new_item'  => __( 'Añadir tipo',       'acemar-blocks' ),
            'edit_item'     => __( 'Editar tipo',        'acemar-blocks' ),
        ],
        'hierarchical'      => true,
        'public'            => false,
        'show_ui'           => true,
        'show_in_rest'      => true,
        'show_admin_column' => true,
        'rewrite'           => false,
    ] );
}
add_action( 'init', 'acemar_register_tax_tipo_muestra' );


// ============================================================
// TAXONOMÍA 2: Categoría / Colección (Abanico Exterior, etc.)
// ============================================================
function acemar_register_tax_categoria_muestra() {
    register_taxonomy( 'acemar_categoria_muestra', 'acemar_muestra', [
        'labels' => [
            'name'          => __( 'Colecciones',     'acemar-blocks' ),
            'singular_name' => __( 'Colección',       'acemar-blocks' ),
            'add_new_item'  => __( 'Añadir colección', 'acemar-blocks' ),
            'edit_item'     => __( 'Editar colección', 'acemar-blocks' ),
        ],
        'hierarchical'      => true,
        'public'            => false,
        'show_ui'           => true,
        'show_in_rest'      => true,
        'show_admin_column' => true,
        'rewrite'           => false,
    ] );
}
add_action( 'init', 'acemar_register_tax_categoria_muestra' );


// ============================================================
// REST ENDPOINT: /wp-json/acemar/v1/muestras
// Devuelve muestras filtradas por tipo y/o categoría
// ============================================================
function acemar_register_rest_muestras() {
    register_rest_route( 'acemar/v1', '/muestras', [
        'methods'             => 'GET',
        'callback'            => 'acemar_rest_get_muestras',
        'permission_callback' => '__return_true',
        'args'                => [
            'tipo'      => [ 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ],
            'categoria' => [ 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ],
            'per_page'  => [ 'type' => 'integer', 'default' => 100 ],
        ],
    ] );
}
add_action( 'rest_api_init', 'acemar_register_rest_muestras' );

function acemar_rest_get_muestras( WP_REST_Request $request ) {
    $tax_query = [ 'relation' => 'AND' ];

    if ( $request->get_param('tipo') ) {
        $tax_query[] = [
            'taxonomy' => 'acemar_tipo_muestra',
            'field'    => 'slug',
            'terms'    => $request->get_param('tipo'),
        ];
    }

    if ( $request->get_param('categoria') ) {
        $tax_query[] = [
            'taxonomy' => 'acemar_categoria_muestra',
            'field'    => 'slug',
            'terms'    => $request->get_param('categoria'),
        ];
    }

    $query = new WP_Query( [
        'post_type'      => 'acemar_muestra',
        'posts_per_page' => $request->get_param('per_page'),
        'post_status'    => 'publish',
        'tax_query'      => count( $tax_query ) > 1 ? $tax_query : [],
        'orderby'        => 'title',
        'order'          => 'ASC',
    ] );

    $items = [];
    foreach ( $query->posts as $post ) {
        $thumb_id  = get_post_thumbnail_id( $post->ID );
        $thumb_url = $thumb_id ? wp_get_attachment_image_url( $thumb_id, 'large' ) : '';
        $full_url  = $thumb_id ? wp_get_attachment_image_url( $thumb_id, 'full' )  : '';

        $categorias = wp_get_post_terms( $post->ID, 'acemar_categoria_muestra', [ 'fields' => 'names' ] );

        $items[] = [
            'id'         => $post->ID,
            'nombre'     => get_the_title( $post ),
            'thumb'      => $thumb_url,
            'full'       => $full_url,
            'categorias' => $categorias,
        ];
    }

    return rest_ensure_response( $items );
}