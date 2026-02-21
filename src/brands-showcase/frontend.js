/**
 * JavaScript para loop infinito perfecto del marquee
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Brands Showcase: Script cargado');
    
    const containers = document.querySelectorAll('.acemar-brands-showcase__container');
    
    containers.forEach(container => {
        const track = container.querySelector('.acemar-brands-showcase__track');
        
        if (!track || !track.classList.contains('is-animated')) {
            return;
        }
        
        const logos = Array.from(track.querySelectorAll('.acemar-brands-showcase__logo'));
        const originalLogoCount = logos.length / 2; // Ya están duplicados desde PHP
        
        console.log('Total logos en el DOM:', logos.length);
        console.log('Logos originales:', originalLogoCount);
        
        // Si hay muy pocos logos, clonar más veces
        if (originalLogoCount < 6) {
            console.log('Pocos logos detectados, clonando más...');
            
            // Clonar todos los logos 2 veces más
            const allLogosClone = logos.map(logo => logo.cloneNode(true));
            allLogosClone.forEach(clone => track.appendChild(clone));
            
            console.log('Logos después de clonar:', track.children.length);
        }
        
        // Calcular ancho total del track
        setTimeout(() => {
            const trackWidth = track.scrollWidth;
            const containerWidth = container.offsetWidth;
            
            console.log('Ancho del track:', trackWidth);
            console.log('Ancho del container:', containerWidth);
            
            // Ajustar la animación para que sea perfecta
            const speed = track.dataset.speed || 30;
            const percentage = originalLogoCount < 6 ? 25 : 50; // 25% si clonamos 4x, 50% si clonamos 2x
            
            track.style.setProperty('--marquee-distance', `-${percentage}%`);
            track.style.animationDuration = `${speed}s`;
            
            console.log('Animación configurada:', speed + 's', percentage + '%');
        }, 100);
    });
});