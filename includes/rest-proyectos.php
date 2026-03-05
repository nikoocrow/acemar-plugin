<?php
/**
 * REST Endpoint: /wp-json/acemar/v1/proyectos
 * Archivo: acemar-blocks/includes/rest-proyectos.php
 */
defined( 'ABSPATH' ) || exit;

add_action( 'rest_api_init', 'acemar_register_rest_proyectos' );
function acemar_register_rest_proyectos() {
    register_rest_route( 'acemar/v1', '/proyectos', [
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => 'acemar_rest_proyectos_handler',
        'permission_callback' => '__return_true',
        'args' => [
            'segmento'    => [ 'type' => 'string', 'default' => '', 'sanitize_callback' => 'sanitize_text_field' ],
            'uso'         => [ 'type' => 'string', 'default' => '', 'sanitize_callback' => 'sanitize_text_field' ],
            'tipo_madera' => [ 'type' => 'string', 'default' => '', 'sanitize_callback' => 'sanitize_text_field' ],
        ],
    ] );
}

function acemar_rest_proyectos_handler( WP_REST_Request $request ) {
    $tax_query = [ 'relation' => 'AND' ];

    $map = [
        'segmento'    => 'acemar_segmento',
        'uso'         => 'acemar_uso',
        'tipo_madera' => 'acemar_tipo_madera',
        
    ];

    foreach ( $map as $param => $taxonomy ) {
        $value = $request->get_param( $param );
        if ( $value ) {
            $tax_query[] = [
                'taxonomy' => $taxonomy,
                'field'    => 'slug',
                'terms'    => $value,
            ];
        }
    }

    $query = new WP_Query( [
        'post_type'      => 'acemar_proyecto',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'orderby'        => 'menu_order date',
        'order'          => 'ASC',
        'tax_query'      => count( $tax_query ) > 1 ? $tax_query : [],
    ] );

    $projects = array_map( function ( $post ) {
        return [
            'id'        => $post->ID,
            'title'     => get_the_title( $post ),
            'permalink' => get_permalink( $post ),
            'thumbnail' => get_the_post_thumbnail_url( $post, 'large' ) ?: '',
            'excerpt'   => get_the_excerpt( $post ),
        ];
    }, $query->posts );

    return rest_ensure_response( $projects );
}
