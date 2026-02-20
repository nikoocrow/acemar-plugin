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