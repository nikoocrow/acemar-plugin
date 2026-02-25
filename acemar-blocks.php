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

define('ACEMAR_BLOCKS_VERSION', '1.0.4');
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
        add_action('init', [$this, 'register_blocks']);
        add_filter('block_categories_all', [$this, 'register_block_category'], 10, 2);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_frontend_scripts']);
    }
    
    public function register_blocks() {
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/featured-products');
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/product-card');
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/hero-banner');
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/featured-projects');
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/project-card');
        register_block_type(__DIR__ . '/build/samples-cta');
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/brands-showcase');
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/hero-video');
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/hero-slider');
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/hero-slide');
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/cifras-hero');
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/timeline');
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/testimonios');
        register_block_type( ACEMAR_BLOCKS_PATH . 'build/boton' );
        register_block_type( ACEMAR_BLOCKS_PATH . 'build/sedes-map' );
    }
    
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

    public function enqueue_frontend_scripts() {
        if ( has_block('acemar/cifras-hero') ) {
            wp_enqueue_script(
                'acemar-cifras-hero-frontend',
                ACEMAR_BLOCKS_URL . 'build/cifras-hero/frontend.js',
                [],
                filemtime(ACEMAR_BLOCKS_PATH . 'build/cifras-hero/frontend.js'),
                true
            );
        }

        if ( has_block('acemar/timeline') ) {
            wp_enqueue_script(
                'acemar-timeline-frontend',
                ACEMAR_BLOCKS_URL . 'build/timeline/frontend.js',
                [],
                filemtime(ACEMAR_BLOCKS_PATH . 'build/timeline/frontend.js'),
                true
            );
        }

        if ( has_block('acemar/hero-slider') ) {
            wp_enqueue_script(
                'acemar-hero-slider-frontend',
                ACEMAR_BLOCKS_URL . 'build/hero-slider/frontend.js',
                [],
                filemtime(ACEMAR_BLOCKS_PATH . 'build/hero-slider/frontend.js'),
                true
            );
        }

        // ← TESTIMONIOS DENTRO DEL MÉTODO
        if ( has_block('acemar/testimonios') ) {
            wp_enqueue_script(
                'acemar-testimonios-frontend',
                ACEMAR_BLOCKS_URL . 'build/testimonios/frontend.js',
                [],
                filemtime(ACEMAR_BLOCKS_PATH . 'build/testimonios/frontend.js'),
                true
            );
        }
    }
}

// Inicializar el plugin
Acemar_Blocks::get_instance();

/**
 * ============================================
 * SOPORTE PARA ARCHIVOS SVG
 * ============================================
 */

function acemar_blocks_allow_svg($mimes) {
    $mimes['svg'] = 'image/svg+xml';
    $mimes['svgz'] = 'image/svg+xml';
    return $mimes;
}
add_filter('upload_mimes', 'acemar_blocks_allow_svg');

function acemar_blocks_check_svg_filetype($data, $file, $filename, $mimes) {
    $filetype = wp_check_filetype($filename, $mimes);
    return [
        'ext'             => $filetype['ext'],
        'type'            => $filetype['type'],
        'proper_filename' => $data['proper_filename']
    ];
}
add_filter('wp_check_filetype_and_ext', 'acemar_blocks_check_svg_filetype', 10, 4);

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

/**
 * ============================================
 * ENCOLAR CSS DE SPLIDE
 * ============================================
 */

function acemar_blocks_enqueue_splide_css() {
    if (!is_admin()) {
        wp_enqueue_style(
            'splide-css',
            'https://cdn.jsdelivr.net/npm/@splidejs/splide@4/dist/css/splide.min.css',
            array(),
            '4.1.4'
        );
    }
}
add_action('wp_enqueue_scripts', 'acemar_blocks_enqueue_splide_css');