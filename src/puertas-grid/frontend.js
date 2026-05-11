/**
 * Acemar – Puertas Grid | frontend.js
 * Slider por tarjeta + lightbox singleton.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── Lightbox (singleton creado una sola vez) ──────────────
    const lb = buildLightbox();

    // ── Inicializar sliders ───────────────────────────────────
    document.querySelectorAll('.acemar-puerta-card__slider').forEach((slider) => {
        const count = parseInt(slider.dataset.count, 10) || 0;
        if (count === 0) return;

        let current = 0;

        const slides  = slider.querySelectorAll('.acemar-puerta-card__slide');
        const bullets = slider.querySelectorAll('.acemar-puerta-card__bullet');
        const prev    = slider.querySelector('.acemar-puerta-card__arrow--prev');
        const next    = slider.querySelector('.acemar-puerta-card__arrow--next');

        function goTo(index) {
            slides[current].classList.remove('is-active');
            bullets[current]?.classList.remove('is-active');
            bullets[current]?.setAttribute('aria-selected', 'false');

            current = (index + count) % count;

            slides[current].classList.add('is-active');
            bullets[current]?.classList.add('is-active');
            bullets[current]?.setAttribute('aria-selected', 'true');
        }

        prev?.addEventListener('click', (e) => {
            e.stopPropagation();
            goTo(current - 1);
        });

        next?.addEventListener('click', (e) => {
            e.stopPropagation();
            goTo(current + 1);
        });

        bullets.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                goTo(parseInt(btn.dataset.index, 10));
            });
        });

        // ── Abrir lightbox al hacer click en la imagen ────────
        slider.addEventListener('click', () => {
            const activeSlide = slides[current];
            const img = activeSlide?.querySelector('.acemar-puerta-card__img');
            if (!img) return;
            const src = img.dataset.full || img.src;
            const alt = img.alt || '';
            lb.open(src, alt);
        });

        // ── Swipe táctil ──────────────────────────────────────
        let touchStartX = null;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            if (touchStartX === null) return;
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                goTo(diff > 0 ? current + 1 : current - 1);
            }
            touchStartX = null;
        }, { passive: true });
    });

    // ── Lightbox builder ──────────────────────────────────────
    function buildLightbox() {
        const el = document.createElement('div');
        el.className = 'acemar-puertas-lightbox';
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-modal', 'true');
        el.setAttribute('aria-label', 'Imagen ampliada');
        el.hidden = true;

        el.innerHTML = `
            <div class="acemar-puertas-lightbox__backdrop"></div>
            <div class="acemar-puertas-lightbox__content">
                <img class="acemar-puertas-lightbox__img" src="" alt="">
            </div>
            <button class="acemar-puertas-lightbox__close" type="button" aria-label="Cerrar">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        `;

        document.body.appendChild(el);

        const img      = el.querySelector('.acemar-puertas-lightbox__img');
        const backdrop = el.querySelector('.acemar-puertas-lightbox__backdrop');
        const closeBtn = el.querySelector('.acemar-puertas-lightbox__close');

        function open(src, alt) {
            img.src = src;
            img.alt = alt;
            el.hidden = false;
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        }

        function close() {
            el.hidden = true;
            img.src = '';
            document.body.style.overflow = '';
        }

        backdrop.addEventListener('click', close);
        closeBtn.addEventListener('click', close);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !el.hidden) close();
        });

        return { open, close };
    }
});
