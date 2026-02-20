/**
 * JavaScript del slider de proyectos - CORREGIDO
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Featured Projects Slider: Script cargado');
    
    const sliders = document.querySelectorAll('.acemar-featured-projects');
    console.log('Featured Projects Slider: Encontrados', sliders.length, 'sliders');
    
    sliders.forEach(function(slider, index) {
        console.log('Inicializando slider', index);
        
        const track = slider.querySelector('.acemar-featured-projects__track');
        const prevBtn = slider.querySelector('.acemar-featured-projects__nav--left');
        const nextBtn = slider.querySelector('.acemar-featured-projects__nav--right');
        const cards = track ? track.querySelectorAll('.acemar-project-card') : [];
        
        console.log('Elementos encontrados:', {
            track: !!track,
            prevBtn: !!prevBtn,
            nextBtn: !!nextBtn,
            cards: cards.length
        });
        
        if (!track || !prevBtn || !nextBtn || cards.length === 0) {
            console.log('Faltan elementos, abortando inicialización');
            return;
        }
        
        const totalCards = cards.length;
        console.log('Total de proyectos:', totalCards);
        
        // Función para verificar si necesitamos mostrar flechas
        function shouldShowArrows() {
            const sliderContainer = slider.querySelector('.acemar-featured-projects__slider');
            const sliderWidth = sliderContainer ? sliderContainer.offsetWidth : 0;
            const cardWidth = cards[0] ? cards[0].offsetWidth : 0;
            const gap = 30;
            const projectsPerView = Math.floor(sliderWidth / (cardWidth + gap));
            
            // Mostrar flechas si hay más proyectos de los que caben en la vista
            return totalCards > projectsPerView;
        }
        
        // Actualizar visibilidad de flechas
        function updateArrowsVisibility() {
            if (shouldShowArrows()) {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
                console.log('Flechas mostradas');
            } else {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                console.log('Flechas ocultas');
            }
        }
        
        // Inicializar visibilidad
        updateArrowsVisibility();
        
        let currentIndex = 0;
        
        // Función para actualizar la posición
        function updateSlider() {
            const cardWidth = cards[0].offsetWidth;
            const gap = 30;
            const offset = -(currentIndex * (cardWidth + gap));
            track.style.transform = `translateX(${offset}px)`;
            
            console.log('Slider actualizado:', {
                currentIndex: currentIndex,
                cardWidth: cardWidth,
                offset: offset
            });
            
            // Deshabilitar botones en los límites
            prevBtn.disabled = currentIndex === 0;
            
            // Calcular cuántos proyectos caben en la vista
            const sliderWidth = slider.querySelector('.acemar-featured-projects__slider').offsetWidth;
            const projectsPerView = Math.floor(sliderWidth / (cardWidth + gap));
            const maxIndex = Math.max(0, totalCards - projectsPerView);
            
            nextBtn.disabled = currentIndex >= maxIndex;
            
            console.log('Estado botones:', {
                prevDisabled: prevBtn.disabled,
                nextDisabled: nextBtn.disabled,
                maxIndex: maxIndex
            });
        }
        
        // Botón anterior
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Click en botón anterior');
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
        
        // Botón siguiente
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Click en botón siguiente');
            if (currentIndex < totalCards - 1) {
                currentIndex++;
                updateSlider();
            }
        });
        
        // Inicializar
        console.log('Inicializando slider...');
        updateSlider();
        
        // Actualizar en resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                currentIndex = 0;
                updateArrowsVisibility();
                updateSlider();
            }, 250);
        });
    });
});