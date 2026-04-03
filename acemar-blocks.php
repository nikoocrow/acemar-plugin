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

// ── Includes ──────────────────────────────────────────────────────
require_once ACEMAR_BLOCKS_PATH . 'includes/cpt-proyecto.php';
require_once ACEMAR_BLOCKS_PATH . 'includes/cpt-muestra.php';
require_once ACEMAR_BLOCKS_PATH . 'includes/rest-proyectos.php';


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
        add_action('wp_footer', [$this, 'inject_selector_css'], 1);
        add_action('wp_footer', [$this, 'inject_caracteristicas_css'], 1);
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
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/boton');
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/sedes-map');
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/recursos-tecnicos');
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/recurso-card');
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/seccion-sostenibilidad');
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/proyectos-archive');
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/selector-muestras');
        register_block_type(ACEMAR_BLOCKS_PATH . 'build/caracteristicas-imagen');
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

        if ( has_block('acemar/testimonios') ) {
            wp_enqueue_script(
                'acemar-testimonios-frontend',
                ACEMAR_BLOCKS_URL . 'build/testimonios/frontend.js',
                [],
                filemtime(ACEMAR_BLOCKS_PATH . 'build/testimonios/frontend.js'),
                true
            );
        }

        if ( has_block('acemar/proyectos-archive') ) {
            wp_localize_script(
                'acemar-proyectos-archive-view-script',
                'acemar_rest',
                [
                    'nonce' => wp_create_nonce('wp_rest'),
                ]
            );
        }

        // Selector Muestras
        wp_enqueue_style(
            'acemar-selector-muestras-style',
            ACEMAR_BLOCKS_URL . 'build/selector-muestras/style-index.css',
            [],
            filemtime(ACEMAR_BLOCKS_PATH . 'build/selector-muestras/style-index.css')
        );
        wp_localize_script(
            'acemar-selector-muestras-view-script',
            'acemarRest',
            [
                'root'  => esc_url_raw( rest_url() ),
                'nonce' => wp_create_nonce('wp_rest'),
            ]
        );
    }

    /**
     * Inyecta CSS del selector de muestras al final del body
     */
    public function inject_selector_css() {
        $css_file = ACEMAR_BLOCKS_PATH . 'build/selector-muestras/style-index.css';
        if ( file_exists($css_file) ) {
            $css = file_get_contents($css_file);
            if ($css) {
                echo '<style id="acemar-selector-muestras-inline">' . $css . '</style>';
            }
        }
    }

    /**
     * Inyecta CSS crítico del bloque características-imagen al final del body
     * Necesario para que los íconos SVG respeten el tamaño definido
     */
    public function inject_caracteristicas_css() {
        if ( ! has_block('acemar/caracteristicas-imagen') ) return;
        echo '<style id="acemar-caracteristicas-inline">
            .acemar-caracteristicas-imagen { display: grid !important; grid-template-columns: 1fr 1fr !important; align-items: center !important; gap: 0 !important; width: 100% !important; }
            .acemar-ci--fondo-blanco { background: #ffffff !important; }
            .acemar-ci--fondo-gris   { background: #f5f3ef !important; }
            .acemar-ci--fondo-negro  { background: #1a1a1a !important; }
            .acemar-ci__col-iconos { padding: 5rem 4rem 5rem 5rem !important; }
            .acemar-ci--imagen-izquierda .acemar-ci__col-iconos { padding: 5rem 5rem 5rem 4rem !important; }
            .acemar-ci__titulo { font-family: "Cormorant Garamond", serif !important; font-size: clamp(1.5rem, 2.5vw, 2.2rem) !important; font-weight: 400 !important; color: #1a1a1a !important; margin: 0 0 2rem !important; }
            .acemar-ci--fondo-negro .acemar-ci__titulo { color: #ffffff !important; }
            .acemar-ci__grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 2.5rem 3rem !important; }
            .acemar-ci__item { display: flex !important; flex-direction: column !important; align-items: flex-start !important; gap: 0.75rem !important; }
            .acemar-ci__item img,
            .acemar-ci__icono { width: 52px !important; height: 52px !important; max-width: 52px !important; max-height: 52px !important; object-fit: contain !important; display: block !important; flex-shrink: 0 !important; }
            .acemar-ci--fondo-negro .acemar-ci__item img,
            .acemar-ci--fondo-negro .acemar-ci__icono { filter: invert(1) brightness(2) !important; }
            .acemar-ci__texto { font-size: 0.72rem !important; font-weight: 700 !important; letter-spacing: 0.1em !important; text-transform: uppercase !important; color: #1a1a1a !important; line-height: 1.4 !important; }
            .acemar-ci--fondo-negro .acemar-ci__texto { color: #ffffff !important; }
            .acemar-ci__col-imagen { position: relative !important; height: 100% !important; min-height: 480px !important; overflow: hidden !important; }
            .acemar-ci__imagen { width: 100% !important; height: 100% !important; object-fit: cover !important; display: block !important; }
            @media (max-width: 900px) {
                .acemar-caracteristicas-imagen { grid-template-columns: 1fr !important; }
                .acemar-ci__col-iconos { padding: 3rem 1.5rem !important; order: 2 !important; }
                .acemar-ci__col-imagen { min-height: 300px !important; order: 1 !important; }
                .acemar-ci__grid { gap: 2rem 1.5rem !important; }
            }
        </style>';
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