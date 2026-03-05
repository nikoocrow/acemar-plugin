/**
 * Acemar – Proyectos Archive | frontend.js
 * Dropdowns, filtros combinados, AJAX al REST endpoint, rebuild del grid.
 */

document.addEventListener('DOMContentLoaded', () => {
    const block = document.querySelector('.acemar-proyectos-archive');
    if (!block) return;

    const grid      = block.querySelector('.acemar-proyectos-archive__grid');
    const stateEl   = block.querySelector('.acemar-proyectos-archive__state');
    const resetBtn  = block.querySelector('.acemar-filter__reset-all');
    const restUrl   = block.dataset.restUrl;

    // ── Estado de filtros ─────────────────────────────────────
    const filters = { segmento: '', uso: '', tipo_madera: '' };

    const LABELS = {
        segmento:    'Segmentos',
        uso:         'Usos',
        tipo_madera: 'Tipos de madera',
    };

    // ── Helpers ───────────────────────────────────────────────
    const esc = (str) => {
        const d = document.createElement('div');
        d.appendChild(document.createTextNode(str));
        return d.innerHTML;
    };

    const hasActiveFilter = () => Object.values(filters).some(Boolean);

    function buildCard(p) {
        const img = p.thumbnail
            ? `<img class="acemar-proyecto-card__img" src="${esc(p.thumbnail)}" alt="${esc(p.title)}" loading="lazy">`
            : `<div class="acemar-proyecto-card__placeholder" aria-hidden="true">...</div>`;

        const excerpt = p.excerpt
            ? `<p class="acemar-proyecto-card__info-excerpt">${esc(p.excerpt)}</p>`
            : '';

        return `
            <article class="acemar-proyecto-card" data-id="${p.id}">
                <a href="${esc(p.permalink)}" class="acemar-proyecto-card__link" aria-label="${esc(p.title)}">
                    ${img}
                    <div class="acemar-proyecto-card__overlay" aria-hidden="true">
                        <span class="acemar-proyecto-card__name">${esc(p.title)}</span>
                    </div>
                    <div class="acemar-proyecto-card__info">
                        <h3 class="acemar-proyecto-card__info-title">${esc(p.title)}</h3>
                        <span class="acemar-proyecto-card__info-divider" aria-hidden="true"></span>
                        ${excerpt}
                    </div>
                </a>
            </article>`;
    }

    // ── Fetch proyectos ───────────────────────────────────────
    let controller = null;

    function fetchProyectos() {
        if (controller) controller.abort();
        controller = new AbortController();

        grid.classList.add('is-loading');
        stateEl.hidden = true;
        stateEl.classList.remove('is-loading');

        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });

        const url = restUrl + (params.toString() ? '?' + params.toString() : '');

        fetch(url, { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error('Network error');
                return res.json();
            })
            .then((projects) => {
                grid.classList.remove('is-loading');
                grid.innerHTML = '';
                stateEl.hidden = true;

                if (!projects.length) {
                    stateEl.textContent = 'No se encontraron proyectos para los filtros seleccionados.';
                    stateEl.hidden = false;
                    return;
                }

                // Insertar con stagger animation
                projects.forEach((p, i) => {
                    const wrapper = document.createElement('div');
                    wrapper.innerHTML = buildCard(p);
                    const card = wrapper.firstElementChild;
                    card.style.animationDelay = `${i * 0.04}s`;
                    grid.appendChild(card);
                });
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;
                grid.classList.remove('is-loading');
                stateEl.textContent = 'Ocurrió un error al cargar los proyectos.';
                stateEl.hidden = false;
            });
    }

    // ── Dropdowns: abrir/cerrar ───────────────────────────────
    function closeAll() {
        block.querySelectorAll('.acemar-filter__trigger').forEach((btn) => {
            btn.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
        });
        block.querySelectorAll('.acemar-filter__dropdown').forEach((dd) => {
            dd.classList.remove('is-open');
        });
    }

    block.addEventListener('click', (e) => {
        const trigger = e.target.closest('.acemar-filter__trigger');
        if (trigger) {
            e.stopPropagation();
            const key = trigger.dataset.filter;
            const dropdown = block.querySelector(`.acemar-filter__dropdown[data-filter="${key}"]`);
            const isOpen = dropdown.classList.contains('is-open');
            closeAll();
            if (!isOpen) {
                dropdown.classList.add('is-open');
                trigger.classList.add('is-open');
                trigger.setAttribute('aria-expanded', 'true');
            }
            return;
        }

        // ── Seleccionar opción ────────────────────────────────
        const option = e.target.closest('.acemar-filter__option');
        if (option) {
            e.stopPropagation();
            const dropdown = option.closest('.acemar-filter__dropdown');
            const key      = dropdown.dataset.filter;
            const value    = option.dataset.value;

            // Actualizar visual
            dropdown.querySelectorAll('.acemar-filter__option').forEach((o) => {
                o.classList.remove('is-selected');
                o.setAttribute('aria-selected', 'false');
            });
            option.classList.add('is-selected');
            option.setAttribute('aria-selected', 'true');

            // Actualizar label del trigger
            const labelEl = block.querySelector(`.acemar-filter__trigger[data-filter="${key}"] .acemar-filter__label`);
            labelEl.textContent = value ? option.textContent.trim() : LABELS[key];

            closeAll();

            // Actualizar estado y fetch
            filters[key] = value;
            resetBtn.style.display = hasActiveFilter() ? '' : 'none';
            fetchProyectos();
        }
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', closeAll);

    // Tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAll();
    });

    // ── Reset all ─────────────────────────────────────────────
    resetBtn.addEventListener('click', () => {
        Object.keys(filters).forEach((k) => { filters[k] = ''; });

        block.querySelectorAll('.acemar-filter__option').forEach((o) => {
            o.classList.remove('is-selected');
            o.setAttribute('aria-selected', 'false');
        });
        block.querySelectorAll('.acemar-filter__option--reset').forEach((o) => {
            o.classList.add('is-selected');
            o.setAttribute('aria-selected', 'true');
        });

        Object.keys(LABELS).forEach((key) => {
            const labelEl = block.querySelector(`.acemar-filter__trigger[data-filter="${key}"] .acemar-filter__label`);
            if (labelEl) labelEl.textContent = LABELS[key];
        });

        resetBtn.style.display = 'none';
        fetchProyectos();
    });
});
