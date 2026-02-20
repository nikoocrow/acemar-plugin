/**
 * Frontend JavaScript para Hero Banner
 * Hace que el botón sea clickeable con el link configurado
 */

document.addEventListener('DOMContentLoaded', function() {
    // Buscar todos los hero banners
    const heroBanners = document.querySelectorAll('.acemar-hero-banner__content');
    
    heroBanners.forEach(function(banner) {
        const buttonLink = banner.getAttribute('data-button-link');
        const buttonTarget = banner.getAttribute('data-button-target');
        
        if (buttonLink) {
            const button = banner.querySelector('.wp-block-button__link');
            
            if (button) {
                button.href = buttonLink;
                button.target = buttonTarget || '_self';
                
                if (buttonTarget === '_blank') {
                    button.rel = 'noopener noreferrer';
                }
            }
        }
    });
});