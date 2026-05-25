/**
 * Acemar – Paneles Acústicos Domus | frontend.js
 *
 * Grid: tarjetas son <a> → navegación nativa, sin JS necesario.
 * Single panel: lightbox al hacer click en la imagen hero.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── Lightbox en single panel ──────────────────────────────
    const hero = document.querySelector('.acemar-panel-single__hero');
    if (!hero) return;

    const heroImg = hero.querySelector('.acemar-panel-single__hero-img');
    if (!heroImg) return;

    const lb = buildLightbox();

    hero.addEventListener('click', () => {
        const src = heroImg.dataset.full || heroImg.src;
        const alt = heroImg.alt || '';
        lb.open(src, alt);
    });

    hero.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const src = heroImg.dataset.full || heroImg.src;
            lb.open(src, heroImg.alt || '');
        }
    });

    // ── Lightbox builder ──────────────────────────────────────
    function buildLightbox() {
        const el = document.createElement('div');
        el.className = 'acemar-paneles-lightbox';
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
        `;

        document.body.appendChild(el);

        const img      = el.querySelector('.acemar-paneles-lightbox__img');
        const backdrop = el.querySelector('.acemar-paneles-lightbox__backdrop');
        const closeBtn = el.querySelector('.acemar-paneles-lightbox__close');

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
