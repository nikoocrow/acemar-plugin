/**
 * webpack.config.js
 * 
 * EXPLICACIÓN: @wordpress/scripts compila automáticamente los archivos,
 * pero necesita saber dónde están los archivos fuente.
 * Este archivo le dice que compile cada bloque por separado.
 */

const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
    ...defaultConfig,
    entry: {
        'featured-products/index':      path.resolve(__dirname, 'src/featured-products/index.js'),
        'product-card/index':           path.resolve(__dirname, 'src/product-card/index.js'),
        'hero-banner/index':            path.resolve(__dirname, 'src/hero-banner/index.js'),
        'hero-banner/frontend':         path.resolve(__dirname, 'src/hero-banner/frontend.js'),
        'featured-projects/index':      path.resolve(__dirname, 'src/featured-projects/index.js'),
        'featured-projects/frontend':   path.resolve(__dirname, 'src/featured-projects/frontend.js'),
        'project-card/index':           path.resolve(__dirname, 'src/project-card/index.js'),
        'samples-cta/index':            path.resolve(__dirname, 'src/samples-cta/index.js'),
        'brands-showcase/index':        path.resolve(__dirname, 'src/brands-showcase/index.js'),
        'brands-showcase/frontend':     path.resolve(__dirname, 'src/brands-showcase/frontend.js'),
        'hero-slider/index':            path.resolve(__dirname, 'src/hero-slider/index.js'),
        'hero-slider/frontend':         path.resolve(__dirname, 'src/hero-slider/frontend.js'),
        'hero-slide/index':             path.resolve(__dirname, 'src/hero-slide/index.js'),
        'hero-video/index':             path.resolve(__dirname, 'src/hero-video/index.js'),
        'cifras-hero/index':            path.resolve(__dirname, 'src/cifras-hero/index.js'), 
        'cifras-hero/frontend':         path.resolve(__dirname, 'src/cifras-hero/frontend.js'),
    },
    output: {
        ...defaultConfig.output,
        path: path.resolve(__dirname, 'build'),
    },
};