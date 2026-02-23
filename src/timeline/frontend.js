document.addEventListener( 'DOMContentLoaded', () => {
    document.querySelectorAll( '.acemar-timeline' ).forEach( ( timeline ) => {
        const slides     = timeline.querySelectorAll( '.acemar-timeline__slide' );
        const navItems   = timeline.querySelectorAll( '.acemar-timeline__nav-item' );
        const navTrack   = timeline.querySelector( '.acemar-timeline__nav-track' );
        const accentColor = timeline.dataset.accent || '#C9A84C';

        let current = 0;
        let isAnimating = false;

        const goTo = ( index ) => {
            if ( isAnimating || index === current ) return;
            if ( index < 0 || index >= slides.length ) return;

            isAnimating = true;

            // Desactivar actual
            slides[ current ].classList.remove( 'is-active' );
            navItems[ current ].classList.remove( 'is-active' );
            navItems[ current ].style.removeProperty( '--accent' );

            // Activar nuevo
            current = index;
            slides[ current ].classList.add( 'is-active' );
            navItems[ current ].classList.add( 'is-active' );
            navItems[ current ].style.setProperty( '--accent', accentColor );

            // Scroll en la barra de años
            navItems[ current ].scrollIntoView( {
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            } );

            setTimeout( () => { isAnimating = false; }, 700 );
        };

        // Flechas principales
        timeline.querySelector( '.acemar-timeline__arrow--prev' )
            ?.addEventListener( 'click', () => goTo( current - 1 ) );
        timeline.querySelector( '.acemar-timeline__arrow--next' )
            ?.addEventListener( 'click', () => goTo( current + 1 ) );

        // Flechas de la barra
        timeline.querySelector( '.acemar-timeline__nav-arrow--prev' )
            ?.addEventListener( 'click', () => goTo( current - 1 ) );
        timeline.querySelector( '.acemar-timeline__nav-arrow--next' )
            ?.addEventListener( 'click', () => goTo( current + 1 ) );

        // Click en años
        navItems.forEach( ( item, i ) => {
            item.addEventListener( 'click', () => goTo( i ) );
        } );

        // Swipe en mobile
        let touchStartX = 0;
        timeline.addEventListener( 'touchstart', ( e ) => {
            touchStartX = e.touches[ 0 ].clientX;
        }, { passive: true } );
        timeline.addEventListener( 'touchend', ( e ) => {
            const diff = touchStartX - e.changedTouches[ 0 ].clientX;
            if ( Math.abs( diff ) > 50 ) {
                goTo( diff > 0 ? current + 1 : current - 1 );
            }
        } );

        // Inicializar color del primero
        if ( navItems[ 0 ] ) {
            navItems[ 0 ].style.setProperty( '--accent', accentColor );
        }
    } );
} );