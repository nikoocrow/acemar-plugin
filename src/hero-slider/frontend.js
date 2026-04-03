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

        new Splide(slider, {
            type: realSlides > 1 ? 'loop' : 'slide',
            autoplay: realSlides > 1 ? autoplay : false,
            interval: interval,
            speed: 1000,
            pauseOnHover: true,
            arrows: realSlides > 1,
            pagination: realSlides > 1,
            fixedHeight: parentHeight,
            breakpoints: {
                768: {
                    arrows: false
                }
            }
        }).mount();
    });
});
