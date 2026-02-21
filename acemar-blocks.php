<?php
/**
 * Plugin Name: Acemar Blocks
 * Description: Bloques de Gutenberg personalizados para Acemar
 * Version: 1.0.0
 * Author: Nicolas Castro
 * Text Domain: acemar-blocks
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ACEMAR_BLOCKS_VERSION', '1.0.0');
define('ACEMAR_BLOCKS_PATH', plugin_dir_path(__FILE__));
define('ACEMAR_BLOCKS_URL', plugin_dir_url(__FILE__));

class Acemar_Blocks {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        // Registrar bloques cuando WordPress se inicializa
        add_action('init', [$this, 'register_blocks']);
        
        // Registrar categoría personalizada de bloques
        add_filter('block_categories_all', [$this, 'register_block_category'], 10, 2);
    }
    
    /**
     * Registra todos los bloques del plugin
     * El método moderno usa block.json para la configuración
     */
  public function register_blocks() {
    // Registrar el bloque contenedor (Featured Products)
    register_block_type(ACEMAR_BLOCKS_PATH . 'build/featured-products');
    
    // Registrar el bloque de tarjeta individual (Product Card)
    register_block_type(ACEMAR_BLOCKS_PATH . 'build/product-card');
    
    // Registrar el bloque Hero Banner
    register_block_type(ACEMAR_BLOCKS_PATH . 'build/hero-banner');

    // Registrar el bloque contenedor (Featured Projects)
    register_block_type(ACEMAR_BLOCKS_PATH . 'build/featured-projects');

    // Registrar el bloque de tarjeta individual (Project Card)
    register_block_type(ACEMAR_BLOCKS_PATH . 'build/project-card');

    // Samples CTA Block
    register_block_type(__DIR__ . '/build/samples-cta');

    // Brands Showcase Block
    register_block_type(ACEMAR_BLOCKS_PATH . 'build/brands-showcase');

    }
    
    /**
     * Registra una categoría personalizada para los bloques de Acemar
     */
    public function register_block_category($categories, $post) {
        return array_merge(
            [
                [
                    'slug'  => 'acemar',
                    'title' => __('Acemar', 'acemar-blocks'),
                    'icon'  => 'star-filled',
                ],
            ],
            $categories
        );
    }
    
}

// Inicializar el plugin
Acemar_Blocks::get_instance();

// Inicializar el plugin
Acemar_Blocks::get_instance();

/**
 * ============================================
 * SOPORTE PARA ARCHIVOS SVG
 * ============================================
 */

/**
 * Permitir subir archivos SVG
 */
function acemar_blocks_allow_svg($mimes) {
    $mimes['svg'] = 'image/svg+xml';
    $mimes['svgz'] = 'image/svg+xml';
    return $mimes;
}
add_filter('upload_mimes', 'acemar_blocks_allow_svg');

/**
 * Verificar tipo de archivo SVG
 */
function acemar_blocks_check_svg_filetype($data, $file, $filename, $mimes) {
    $filetype = wp_check_filetype($filename, $mimes);
    
    return [
        'ext'             => $filetype['ext'],
        'type'            => $filetype['type'],
        'proper_filename' => $data['proper_filename']
    ];
}
add_filter('wp_check_filetype_and_ext', 'acemar_blocks_check_svg_filetype', 10, 4);

/**
 * Corregir preview de SVG en media library
 */
function acemar_blocks_fix_svg_display() {
    echo '<style>
        .attachment-266x266, .thumbnail img {
            width: 100% !important;
            height: auto !important;
        }
        img[src$=".svg"] {
            width: 100%;
            height: auto;
        }
    </style>';
}
add_action('admin_head', 'acemar_blocks_fix_svg_display');

/**
 * Agregar dimensiones SVG para WordPress
 */
function acemar_blocks_fix_svg_metadata($data, $id) {
    $attachment = get_post($id);
    
    if ($attachment && $attachment->post_mime_type === 'image/svg+xml') {
        $svg_path = get_attached_file($id);
        
        if (file_exists($svg_path)) {
            $svg = simplexml_load_file($svg_path);
            
            if ($svg !== false) {
                $width = 0;
                $height = 0;
                
                if (isset($svg['width']) && isset($svg['height'])) {
                    $width = floatval($svg['width']);
                    $height = floatval($svg['height']);
                } elseif (isset($svg['viewBox'])) {
                    $viewBox = explode(' ', $svg['viewBox']);
                    if (count($viewBox) === 4) {
                        $width = floatval($viewBox[2]);
                        $height = floatval($viewBox[3]);
                    }
                }
                
                if ($width && $height) {
                    $data['width'] = $width;
                    $data['height'] = $height;
                }
            }
        }
    }
    
    return $data;
}
add_filter('wp_update_attachment_metadata', 'acemar_blocks_fix_svg_metadata', 10, 2);