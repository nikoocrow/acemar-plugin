document.addEventListener( 'DOMContentLoaded', () => {
    document.querySelectorAll( '.acemar-testimonios' ).forEach( ( block ) => {
        const track       = block.querySelector( '.acemar-testimonios__track' );
        const cards       = Array.from( block.querySelectorAll( '.acemar-testimonios__card' ) );
        const btnPrev     = block.querySelector( '.acemar-testimonios__arrow--prev' );
        const btnNext     = block.querySelector( '.acemar-testimonios__arrow--next' );
        const autoplay    = block.dataset.autoplay === 'true';
        const speed       = parseInt( block.dataset.speed ) || 4000;

        const total       = cards.length;
        let autoplayTimer = null;
        let current       = 0;

        const getVisible = () => {
            if ( window.innerWidth <= 768 ) return 1;
            if ( window.innerWidth <= 1024 ) return 2;
            return 3;
        };

        const getCardWidth = () => {
            // Ancho real de la primera card incluyendo el gap
            const card = cards[ 0 ];
            if ( ! card ) return 0;
            const gap = 24;
            return card.offsetWidth + gap;
        };

        const getMax = () => Math.max( 0, total - getVisible() );

        const goTo = ( index ) => {
            current = Math.max( 0, Math.min( index, getMax() ) );
            track.style.transform = `translateX(-${ current * getCardWidth() }px)`;
        };

        btnPrev?.addEventListener( 'click', () => {
            goTo( current - 1 );
            resetAutoplay();
        } );

        btnNext?.addEventListener( 'click', () => {
            // Si llegó al final vuelve al inicio
            const next = current >= getMax() ? 0 : current + 1;
            goTo( next );
            resetAutoplay();
        } );

        const startAutoplay = () => {
            if ( ! autoplay ) return;
            autoplayTimer = setInterval( () => {
                const next = current >= getMax() ? 0 : current + 1;
                goTo( next );
            }, speed );
        };

        const resetAutoplay = () => {
            clearInterval( autoplayTimer );
            startAutoplay();
        };

        // Swipe mobile
        let touchStartX = 0;
        block.addEventListener( 'touchstart', ( e ) => {
            touchStartX = e.touches[ 0 ].clientX;
        }, { passive: true } );
        block.addEventListener( 'touchend', ( e ) => {
            const diff = touchStartX - e.changedTouches[ 0 ].clientX;
            if ( Math.abs( diff ) > 50 ) {
                const next = diff > 0
                    ? ( current >= getMax() ? 0 : current + 1 )
                    : Math.max( 0, current - 1 );
                goTo( next );
                resetAutoplay();
            }
        } );

        // Resize
       window.addEventListener( 'resize', () => {
            track.style.transition = 'none';
            goTo( 0 ); // ← reset al inicio al cambiar tamaño
            setTimeout( () => {
                track.style.transition = 'transform 0.5s ease';
            }, 50 );
        } );

        startAutoplay();
    } );
} );