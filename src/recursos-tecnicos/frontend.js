/**
 * Acemar – Recursos Técnicos | Frontend Filter
 * Inicializa el filtro de categorías con 4 estilos posibles.
 */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.acemar-rt-filter-placeholder').forEach(initFilter);
});

function initFilter(placeholder) {
    const style     = placeholder.dataset.filterStyle;
    const rawCats   = placeholder.dataset.categorias || '';
    const cats      = rawCats.split(',').map(c => c.trim()).filter(Boolean);

    if (!style || cats.length === 0) return;

    // Cards del mismo bloque
    const grid  = placeholder.closest('.acemar-recursos-tecnicos__right')
                             .querySelector('.acemar-recursos-tecnicos__grid');
    const cards = Array.from(grid.querySelectorAll('.acemar-recurso-card'));

    // Contar cards por categoría
    const counts = {};
    cats.forEach(c => { counts[c] = 0; });
    cards.forEach(card => {
        const cat = card.dataset.categoria;
        if (cat && counts[cat] !== undefined) counts[cat]++;
    });

    // Construir el filtro según el estilo
    const filterEl = buildFilter(style, cats, counts, cards.length);
    placeholder.replaceWith(filterEl);

    // Función de filtrado
    function applyFilter(value) {
        let visible = 0;
        cards.forEach(card => {
            const match = !value || card.dataset.categoria === value;
            card.style.display = match ? '' : 'none';
            if (match) visible++;
        });

        // Mensaje vacío
        let empty = grid.querySelector('.acemar-rt-no-results');
        if (visible === 0) {
            if (!empty) {
                empty = document.createElement('p');
                empty.className = 'acemar-rt-no-results';
                empty.textContent = 'Sin resultados para esta categoría';
                grid.appendChild(empty);
            }
            empty.style.display = 'block';
        } else if (empty) {
            empty.style.display = 'none';
        }
    }

    // Eventos según estilo
    if (style === 'dropdown') {
        filterEl.querySelector('select').addEventListener('change', e => {
            applyFilter(e.target.value === 'all' ? '' : e.target.value);
        });
    } else {
        filterEl.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                filterEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyFilter(btn.dataset.filter === 'all' ? '' : btn.dataset.filter);
            });
        });
    }
}

function buildFilter(style, cats, counts, total) {
    const wrap = document.createElement('div');
    wrap.className = `acemar-rt-filter acemar-rt-filter--${style}`;

    if (style === 'pills') {
        wrap.innerHTML = `
            <button class="active" data-filter="all">Todos</button>
            ${cats.map(c => `<button data-filter="${c}">${c}</button>`).join('')}
        `;
    }

    else if (style === 'tabs') {
        wrap.innerHTML = `
            <button class="active" data-filter="all">Todos</button>
            ${cats.map(c => `<button data-filter="${c}">${c}</button>`).join('')}
        `;
    }

    else if (style === 'dropdown') {
        wrap.innerHTML = `
            <div class="acemar-rt-filter__dropdown-wrap">
                <select>
                    <option value="all">Todas las categorías</option>
                    ${cats.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
            </div>
        `;
    }

    else if (style === 'chips') {
        wrap.innerHTML = `
            <button class="active" data-filter="all">Todos <span class="count">${total}</span></button>
            ${cats.map(c => `
                <button data-filter="${c}">
                    ${c} <span class="count">${counts[c] || 0}</span>
                </button>
            `).join('')}
        `;
    }

    return wrap;
}