import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide.min.css';

document.addEventListener('DOMContentLoaded', function() {
    const sliders = document.querySelectorAll('.acemar-hero-slider__splide');
    
    sliders.forEach((slider) => {
        const autoplay = slider.dataset.autoplay === 'true';
        const interval = parseInt(slider.dataset.interval) || 5000;
        const parent = slider.closest('.acemar-hero-slider');
        const parentHeight = parent ? parent.style.minHeight : '70vh';
        const realSlides = slider.querySelectorAll('.splide__slide:not(.splide__slide--clone)').length;
        
        // Función para obtener altura según viewport
        function getResponsiveHeight() {
            const width = window.innerWidth;
            
            if (width <= 480) {
                // Mobile: reducir altura proporcionalmente
                const vh = parseInt(parentHeight);
                return `${Math.max(50, vh * 0.7)}vh`; // Mínimo 50vh
            } else if (width <= 768) {
                // Tablet: reducir altura un poco
                const vh = parseInt(parentHeight);
                return `${Math.max(60, vh * 0.85)}vh`; // Mínimo 60vh
            }
            
            return parentHeight; // Desktop: altura original
        }
        
        const splideInstance = new Splide(slider, {
            type: realSlides > 1 ? 'loop' : 'slide',
            autoplay: realSlides > 1 ? autoplay : false,
            interval: interval,
            speed: 1000,
            pauseOnHover: true,
            arrows: realSlides > 1,
            pagination: realSlides > 1,
            fixedHeight: getResponsiveHeight(),
            breakpoints: {
                768: {
                    fixedHeight: getResponsiveHeight(),
                    arrows: false
                },
                480: {
                    fixedHeight: getResponsiveHeight()
                }
            }
        }).mount();
        
        // Actualizar altura en resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                const newHeight = getResponsiveHeight();
                splideInstance.options = {
                    fixedHeight: newHeight
                };
            }, 250);
        });
    });
});