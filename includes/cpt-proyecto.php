<?php
/**
 * CPT: acemar_proyecto + Taxonomías
 * Archivo: acemar-blocks/includes/cpt-proyecto.php
 */
defined( 'ABSPATH' ) || exit;

// ── CPT ──────────────────────────────────────────────────────
add_action( 'init', 'acemar_register_cpt_proyecto', 0 );
function acemar_register_cpt_proyecto() {
    register_post_type( 'acemar_proyecto', [
        'labels' => [
            'name'               => 'Proyectos',
            'singular_name'      => 'Proyecto',
            'add_new'            => 'Añadir proyecto',
            'add_new_item'       => 'Añadir nuevo proyecto',
            'edit_item'          => 'Editar proyecto',
            'new_item'           => 'Nuevo proyecto',
            'view_item'          => 'Ver proyecto',
            'search_items'       => 'Buscar proyectos',
            'not_found'          => 'No se encontraron proyectos',
            'not_found_in_trash' => 'No hay proyectos en la papelera',
            'menu_name'          => 'Proyectos',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'has_archive'   => false,
        'supports'      => [ 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' ],
        'menu_icon'     => 'dashicons-hammer',
        'menu_position' => 25,
        'rewrite'       => [ 'slug' => 'proyectos', 'with_front' => false ],
    ] );
}

// ── Taxonomías ────────────────────────────────────────────────
add_action( 'init', 'acemar_register_taxonomias_proyecto', 0 );
function acemar_register_taxonomias_proyecto() {

    $taxonomias = [
        'acemar_segmento' => [
            'labels'  => [ 'name' => 'Segmentos', 'singular_name' => 'Segmento', 'add_new_item' => 'Añadir segmento' ],
            'slug'    => 'segmento',
            'terms'   => [
                'Residencial unifamiliar', 'Residencial multifamiliar',
                'Vivienda de interés social (VIS)', 'Vivienda de interés prioritario (VIP)',
                'Hospitalario', 'Clínico', 'Educativo (colegios)', 'Educativo (universidades)',
                'Institucional público', 'Institucional privado', 'Hotelero',
                'Turístico y recreativo', 'Comercial (centros comerciales)', 'Retail',
                'Oficinas corporativas', 'Industrial', 'Logístico y bodegas',
                'Infraestructura de transporte', 'Aeropuertos', 'Terminales terrestres',
                'Cultural (museos, teatros)', 'Religioso', 'Deportivo', 'Gobernamental',
                'Mixto (uso mixto)', 'Restaurantes y gastronomía', 'Salud especializada',
                'Laboratorios', 'Data centers', 'Espacios públicos y urbanismo',
                'Remodelaciones y adecuaciones', 'Proyectos sostenibles (LEED / EDGE)',
            ],
        ],
        'acemar_uso' => [
            'labels'  => [ 'name' => 'Usos', 'singular_name' => 'Uso', 'add_new_item' => 'Añadir uso' ],
            'slug'    => 'uso-proyecto',
            'terms'   => [ 'Cielos rasos', 'Revestimientos', 'Fachadas', 'Puertas', 'Pisos', 'Chapillas' ],
        ],
        'acemar_tipo_madera' => [
            'labels'  => [ 'name' => 'Tipos de madera', 'singular_name' => 'Tipo de madera', 'add_new_item' => 'Añadir tipo' ],
            'slug'    => 'tipo-madera',
            'terms'   => [
                'Flormorado', 'Cedro', 'Nogal', 'Roble', 'Caoba', 'Teca',
                'Guayacán', 'Algarrobo', 'Sapan', 'Chanul', 'Abarco', 'Pino', 'Cerezo',
            ],
        ],
    ];

    foreach ( $taxonomias as $taxonomy => $data ) {
        register_taxonomy( $taxonomy, 'acemar_proyecto', [
            'labels'            => $data['labels'],
            'hierarchical'      => true,
            'show_ui'           => true,
            'show_in_rest'      => true,
            'show_admin_column' => true,
            'rewrite'           => [ 'slug' => $data['slug'] ],
        ] );

        // Pre-insertar términos si no existen (solo si la taxonomía ya está registrada)
        if ( taxonomy_exists( $taxonomy ) ) {
            foreach ( $data['terms'] as $term_name ) {
                if ( ! term_exists( $term_name, $taxonomy ) ) {
                    wp_insert_term( $term_name, $taxonomy );
                }
            }
        }
    }
}
