/**
 * Acemar – Selector de Muestras | Frontend
 * Tabs, carga REST, grilla y lightbox.
 */

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.acemar-selector-muestras[data-tipo]').forEach(initSelector);
    initLightbox();
});

// ============================================================
// INIT SELECTOR
// ============================================================
function initSelector(wrapper) {
    const tipo      = wrapper.dataset.tipo;
    const accent    = wrapper.dataset.accent || '#C8A96A';
    const tabs      = Array.from(wrapper.querySelectorAll('.acemar-selector-muestras__tab'));
    const panels    = Array.from(wrapper.querySelectorAll('.acemar-selector-muestras__panel'));
    const restBase  = (window.acemarRest?.root || '/wp-json/') + 'acemar/v1/muestras';

    // Cache de resultados por slug
    const cache = {};

    // Activar pestaña
    function activateTab(index) {
        tabs.forEach((t, i) => {
            const isActive = i === index;
            t.classList.toggle('is-active', isActive);
            t.style.backgroundColor = '';
            t.style.borderColor     = '';
        });
        panels.forEach((p, i) => {
            p.classList.toggle('is-active', i === index);
        });

        const slug = tabs[index]?.dataset.slug;
        if (slug) loadMuestras(panels[index], tipo, slug);
    }

    // Cargar muestras desde REST
    async function loadMuestras(panel, tipo, categoriaSlug) {
        const grid = panel.querySelector('.acemar-selector-muestras__grid');
        if (!grid) return;

        const key = `${tipo}__${categoriaSlug}`;
        if (cache[key]) {
            renderGrid(grid, cache[key]);
            return;
        }

        grid.innerHTML = `<div class="acemar-selector-muestras__loading">Cargando muestras</div>`;

        try {
            const url = `${restBase}?tipo=${encodeURIComponent(tipo)}&categoria=${encodeURIComponent(categoriaSlug)}&per_page=100`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Error REST');
            const data = await res.json();
            cache[key] = data;
            renderGrid(grid, data);
        } catch (err) {
            grid.innerHTML = `<div class="acemar-selector-muestras__empty">No se pudieron cargar las muestras.</div>`;
        }
    }

    // Renderizar grilla
    function renderGrid(grid, items) {
        if (!items || items.length === 0) {
            grid.innerHTML = `<div class="acemar-selector-muestras__empty">No hay muestras en esta colección.</div>`;
            return;
        }

        grid.innerHTML = items.map((item, idx) => `
            <div
                class="acemar-selector-muestras__item"
                data-index="${idx}"
                data-full="${item.full || item.thumb}"
                data-nombre="${item.nombre}"
                role="button"
                tabindex="0"
                aria-label="Ver ${item.nombre}"
            >
                <div class="acemar-selector-muestras__item-img-wrap">
                    ${item.thumb
                        ? `<img
                                class="acemar-selector-muestras__item-img"
                                src="${item.thumb}"
                                alt="${item.nombre}"
                                loading="lazy"
                            />`
                        : `<div class="acemar-selector-muestras__item-img" style="background:#ddd;"></div>`
                    }
                </div>
                <p class="acemar-selector-muestras__item-nombre">${item.nombre}</p>
            </div>
        `).join('');

        // Click en cada item → abrir lightbox
        grid.querySelectorAll('.acemar-selector-muestras__item').forEach(item => {
            item.addEventListener('click', () => openLightbox(grid, parseInt(item.dataset.index)));
            item.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(grid, parseInt(item.dataset.index));
                }
            });
        });
    }

    // Eventos de tabs
    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => activateTab(i));
    });

    // Activar primera pestaña al iniciar
    activateTab(0);
}


// ============================================================
// LIGHTBOX
// ============================================================
function initLightbox() {
    // Crear el lightbox una sola vez
    const lb = document.createElement('div');
    lb.className = 'acemar-sm-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = `
        <div class="acemar-sm-lightbox__overlay"></div>
        <div class="acemar-sm-lightbox__content">
            <button class="acemar-sm-lightbox__close" aria-label="Cerrar">&#x2715;</button>
            <button class="acemar-sm-lightbox__nav acemar-sm-lightbox__nav--prev" aria-label="Anterior">&#8249;</button>
            <img class="acemar-sm-lightbox__img" src="" alt="" />
            <p class="acemar-sm-lightbox__nombre"></p>
            <button class="acemar-sm-lightbox__nav acemar-sm-lightbox__nav--next" aria-label="Siguiente">&#8250;</button>
        </div>
    `;
    document.body.appendChild(lb);

    let currentGrid  = null;
    let currentIndex = 0;

    const imgEl    = lb.querySelector('.acemar-sm-lightbox__img');
    const nombreEl = lb.querySelector('.acemar-sm-lightbox__nombre');

    function getItems() {
        if (!currentGrid) return [];
        return Array.from(currentGrid.querySelectorAll('.acemar-selector-muestras__item'));
    }

    function show(index) {
        const items = getItems();
        if (!items[index]) return;
        currentIndex = index;

        const item = items[index];
        imgEl.src    = item.dataset.full;
        imgEl.alt    = item.dataset.nombre;
        nombreEl.textContent = item.dataset.nombre;
    }

    window.openLightbox = function(grid, index) {
        currentGrid = grid;
        show(index);
        lb.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        lb.querySelector('.acemar-sm-lightbox__close').focus();
    };

    function closeLightbox() {
        lb.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    lb.querySelector('.acemar-sm-lightbox__overlay').addEventListener('click', closeLightbox);
    lb.querySelector('.acemar-sm-lightbox__close').addEventListener('click', closeLightbox);

    lb.querySelector('.acemar-sm-lightbox__nav--prev').addEventListener('click', () => {
        const items = getItems();
        show((currentIndex - 1 + items.length) % items.length);
    });

    lb.querySelector('.acemar-sm-lightbox__nav--next').addEventListener('click', () => {
        const items = getItems();
        show((currentIndex + 1) % items.length);
    });

    // Teclado
    document.addEventListener('keydown', e => {
        if (!lb.classList.contains('is-open')) return;
        const items = getItems();
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowLeft')  show((currentIndex - 1 + items.length) % items.length);
        if (e.key === 'ArrowRight') show((currentIndex + 1) % items.length);
    });
}