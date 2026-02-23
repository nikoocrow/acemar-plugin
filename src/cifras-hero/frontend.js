document.addEventListener( 'DOMContentLoaded', () => {
    const items = document.querySelectorAll( '.acemar-cifras-hero__number[data-target]' );

    if ( ! items.length ) return;

    const animateCount = ( el ) => {
        const target = parseFloat( el.dataset.target );
        const suffix = el.textContent.replace( /[0-9.]/g, '' ).trim();
        const isDecimal = el.dataset.target.includes( '.' );
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval( () => {
            step++;
            current += increment;
            if ( step >= steps ) {
                current = target;
                clearInterval( timer );
            }
            el.textContent = ( isDecimal ? current.toFixed( 1 ) : Math.floor( current ) ) + suffix;
        }, duration / steps );
    };

    const observer = new IntersectionObserver( ( entries ) => {
        entries.forEach( ( entry ) => {
            if ( entry.isIntersecting ) {
                animateCount( entry.target );
                observer.unobserve( entry.target );
            }
        } );
    }, { threshold: 0.3 } );

    items.forEach( ( el ) => observer.observe( el ) );
} );