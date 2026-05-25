/**
 * Acemar – Paneles Acústicos Domus | frontend.js
 *
 * Grid:         imagen → lightbox individual
 *               título → link nativo (no JS)
 *
 * Single panel: imagen destacada → lightbox individual
 *               galería          → lightbox con navegación prev/next
 */

document.addEventListener('DOMContentLoaded', () => {

    const lb = buildLightbox();

    // ── Grid: imagen → lightbox ───────────────────────────────
    document.querySelectorAll('.acemar-panel-card__img-wrap[data-full]').forEach((wrap) => {
        function openWrap() {
            lb.open([{ src: wrap.dataset.full, alt: wrap.dataset.alt || '' }], 0);
        }
        wrap.addEventListener('click', openWrap);
        wrap.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openWrap(); }
        });
    });

    // ── Single: imagen destacada → lightbox ───────────────────
    const featuredWrap = document.querySelector('.acemar-panel-single__featured-wrap');
    if (featuredWrap) {
        const featuredImg = featuredWrap.querySelector('img');
        function openFeatured() {
            if (!featuredImg) return;
            lb.open([{ src: featuredImg.dataset.full || featuredImg.src, alt: featuredImg.alt || '' }], 0);
        }
        featuredWrap.addEventListener('click', openFeatured);
        featuredWrap.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFeatured(); }
        });
    }

    // ── Single: galería → lightbox con navegación ─────────────
    const galeriaItems = [...document.querySelectorAll('.acemar-panel-galeria__item')];
    if (galeriaItems.length) {
        const gallery = galeriaItems.map((item) => {
            const img = item.querySelector('img');
            return { src: img ? (img.dataset.full || img.src) : '', alt: img ? img.alt : '' };
        });

        galeriaItems.forEach((item, i) => {
            function openGal() { lb.open(gallery, i); }
            item.addEventListener('click', openGal);
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGal(); }
            });
        });
    }

    // ── Lightbox singleton ────────────────────────────────────
    function buildLightbox() {
        const el = document.createElement('div');
        el.className  = 'acemar-paneles-lightbox';
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-modal', 'true');
        el.setAttribute('aria-label', 'Imagen ampliada');
        el.hidden = true;

        el.innerHTML = `
            <div class="acemar-paneles-lightbox__backdrop"></div>
            <div class="acemar-paneles-lightbox__content">
                <img class="acemar-paneles-lightbox__img" src="" alt="">
            </div>
            <button class="acemar-paneles-lightbox__close" type="button" aria-label="Cerrar">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
            <button class="acemar-paneles-lightbox__nav acemar-paneles-lightbox__prev" type="button" aria-label="Imagen anterior" hidden>
                <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden="true">
                    <path d="M9 1L1 9L9 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button class="acemar-paneles-lightbox__nav acemar-paneles-lightbox__next" type="button" aria-label="Siguiente imagen" hidden>
                <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden="true">
                    <path d="M1 1L9 9L1 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="acemar-paneles-lightbox__counter" hidden></div>
        `;

        document.body.appendChild(el);

        const img      = el.querySelector('.acemar-paneles-lightbox__img');
        const backdrop = el.querySelector('.acemar-paneles-lightbox__backdrop');
        const closeBtn = el.querySelector('.acemar-paneles-lightbox__close');
        const prevBtn  = el.querySelector('.acemar-paneles-lightbox__prev');
        const nextBtn  = el.querySelector('.acemar-paneles-lightbox__next');
        const counter  = el.querySelector('.acemar-paneles-lightbox__counter');

        let images  = [];
        let current = 0;

        function show(index) {
            current = ((index % images.length) + images.length) % images.length;
            img.src = images[current].src;
            img.alt = images[current].alt || '';
            if (images.length > 1) {
                counter.textContent = `${current + 1} / ${images.length}`;
            }
        }

        function open(imgs, startIndex = 0) {
            images  = imgs;
            current = startIndex;
            el.hidden = false;
            document.body.style.overflow = 'hidden';

            const hasNav = images.length > 1;
            prevBtn.hidden   = !hasNav;
            nextBtn.hidden   = !hasNav;
            counter.hidden   = !hasNav;

            show(startIndex);
            closeBtn.focus();
        }

        function close() {
            el.hidden = true;
            img.src = '';
            images  = [];
            document.body.style.overflow = '';
        }

        prevBtn.addEventListener('click', () => show(current - 1));
        nextBtn.addEventListener('click', () => show(current + 1));
        backdrop.addEventListener('click', close);
        closeBtn.addEventListener('click', close);

        document.addEventListener('keydown', (e) => {
            if (el.hidden) return;
            if (e.key === 'Escape')     close();
            if (e.key === 'ArrowLeft')  show(current - 1);
            if (e.key === 'ArrowRight') show(current + 1);
        });

        // Swipe en móvil
        let touchX = null;
        el.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
        el.addEventListener('touchend',   (e) => {
            if (touchX === null) return;
            const diff = touchX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) show(diff > 0 ? current + 1 : current - 1);
            touchX = null;
        }, { passive: true });

        return { open, close };
    }
});
