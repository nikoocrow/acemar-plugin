import { registerBlockType } from '@wordpress/blocks';
import {
    InnerBlocks,
    useBlockProps,
    InspectorControls,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import {
    PanelBody,
    TextControl,
    ToggleControl,
    SelectControl,
    __experimentalDivider as Divider,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

const FILTER_STYLE_OPTIONS = [
    { label: 'A — Pills (cápsulas doradas)',     value: 'pills' },
    { label: 'B — Underline Tabs (línea dorada)', value: 'tabs' },
    { label: 'C — Dropdown elegante',             value: 'dropdown' },
    { label: 'D — Chips con contador',            value: 'chips' },
];

const Edit = ({ attributes, setAttributes, clientId }) => {
    const {
        titulo, descripcion, botonTexto, botonUrl,
        mostrarTexto, mostrarFiltro, filterStyle, categorias,
    } = attributes;

    const blockProps = useBlockProps({
        className: [
            'acemar-recursos-tecnicos',
            mostrarTexto ? '' : 'acemar-recursos-tecnicos--solo-cards',
        ].filter(Boolean).join(' '),
    });

    const cardCount = useSelect((select) => {
        const { getBlocksByClientId } = select('core/block-editor');
        const innerBlocks = getBlocksByClientId(clientId)[0]?.innerBlocks || [];
        return innerBlocks.length;
    }, [clientId]);

    const TEMPLATE = [
        ['acemar/recurso-card', {}],
        ['acemar/recurso-card', {}],
        ['acemar/recurso-card', {}],
    ];

    const maxCards = mostrarFiltro ? 50 : 8;
    const canAddMore = cardCount < maxCards;

    // Preview del filtro en el editor
    const cats = categorias.split(',').map(c => c.trim()).filter(Boolean);

    const FilterPreview = () => {
        if (!mostrarFiltro || cats.length === 0) return null;

        if (filterStyle === 'pills') {
            return (
                <div className="acemar-rt-filter acemar-rt-filter--pills">
                    <button className="active">Todos</button>
                    { cats.map(c => <button key={c}>{ c }</button>) }
                </div>
            );
        }
        if (filterStyle === 'tabs') {
            return (
                <div className="acemar-rt-filter acemar-rt-filter--tabs">
                    <button className="active">Todos</button>
                    { cats.map(c => <button key={c}>{ c }</button>) }
                </div>
            );
        }
        if (filterStyle === 'dropdown') {
            return (
                <div className="acemar-rt-filter acemar-rt-filter--dropdown">
                    <div className="acemar-rt-filter__dropdown-wrap">
                        <select disabled>
                            <option>Todas las categorías</option>
                            { cats.map(c => <option key={c}>{ c }</option>) }
                        </select>
                    </div>
                </div>
            );
        }
        if (filterStyle === 'chips') {
            return (
                <div className="acemar-rt-filter acemar-rt-filter--chips">
                    <button className="active">Todos <span className="count">{ cardCount }</span></button>
                    { cats.map(c => <button key={c}>{ c } <span className="count">–</span></button>) }
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <InspectorControls>
                {/* ── Configuración general ── */}
                <PanelBody title="Configuración" initialOpen={ true }>
                    <ToggleControl
                        label="Mostrar columna de texto"
                        checked={ mostrarTexto }
                        onChange={ (val) => setAttributes({ mostrarTexto: val }) }
                        help={ mostrarTexto ? 'Con título, descripción y botón' : 'Solo cards' }
                    />
                    <ToggleControl
                        label="Mostrar filtro de categorías"
                        checked={ mostrarFiltro }
                        onChange={ (val) => setAttributes({ mostrarFiltro: val }) }
                        help={ mostrarFiltro ? 'El filtro aparece sobre las cards' : 'Sin filtro' }
                    />
                </PanelBody>

                {/* ── Texto y botón ── */}
                { mostrarTexto && (
                    <PanelBody title="Texto y botón" initialOpen={ false }>
                        <TextControl
                            label="Título"
                            value={ titulo }
                            onChange={ (val) => setAttributes({ titulo: val }) }
                            placeholder="RECURSOS TÉCNICOS"
                        />
                        <TextControl
                            label="Descripción"
                            value={ descripcion }
                            onChange={ (val) => setAttributes({ descripcion: val }) }
                            placeholder="Descripción..."
                        />
                        <Divider />
                        <TextControl
                            label="Texto del botón"
                            value={ botonTexto }
                            onChange={ (val) => setAttributes({ botonTexto: val }) }
                            placeholder="RECURSOS TÉCNICOS"
                        />
                        <TextControl
                            label="URL del botón"
                            value={ botonUrl }
                            onChange={ (val) => setAttributes({ botonUrl: val }) }
                            placeholder="https://..."
                        />
                    </PanelBody>
                ) }

                {/* ── Filtro ── */}
                { mostrarFiltro && (
                    <PanelBody title="Filtro de categorías" initialOpen={ true }>
                        <SelectControl
                            label="Estilo del filtro"
                            value={ filterStyle }
                            options={ FILTER_STYLE_OPTIONS }
                            onChange={ (val) => setAttributes({ filterStyle: val }) }
                        />
                        <Divider />
                        <TextControl
                            label="Categorías"
                            value={ categorias }
                            onChange={ (val) => setAttributes({ categorias: val }) }
                            placeholder="Paneles, Acústicos, Puertas..."
                            help="Separadas por coma. Estas mismas opciones aparecen en cada card para asignar su categoría."
                        />
                    </PanelBody>
                ) }
            </InspectorControls>

            <div { ...blockProps }>
                { mostrarTexto && (
                    <div className="acemar-recursos-tecnicos__left">
                        <p className="acemar-recursos-tecnicos__titulo">{ titulo }</p>
                        <p className="acemar-recursos-tecnicos__desc">{ descripcion }</p>
                        <a className="acemar-recursos-tecnicos__btn" href={ botonUrl }>
                            { botonTexto }
                        </a>
                    </div>
                ) }

                <div className="acemar-recursos-tecnicos__right">
                    { mostrarFiltro && <FilterPreview /> }
                    <div className="acemar-recursos-tecnicos__grid">
                        <InnerBlocks
                            template={ TEMPLATE }
                            allowedBlocks={ ['acemar/recurso-card'] }
                            templateLock={ false }
                            renderAppender={ canAddMore ? () => <InnerBlocks.ButtonBlockAppender /> : false }
                        />
                    </div>
                    { cardCount >= maxCards && (
                        <div style={{
                            textAlign: 'center',
                            padding: '10px',
                            background: '#fff3cd',
                            color: '#856404',
                            borderRadius: '6px',
                            marginTop: '10px',
                            fontSize: '13px',
                        }}>
                            ⚠️ Máximo { maxCards } cards alcanzado
                        </div>
                    ) }
                </div>
            </div>
        </>
    );
};

const Save = ({ attributes }) => {
    const {
        titulo, descripcion, botonTexto, botonUrl,
        mostrarTexto, mostrarFiltro, filterStyle, categorias,
    } = attributes;

    const blockProps = useBlockProps.save({
        className: [
            'acemar-recursos-tecnicos',
            mostrarTexto ? '' : 'acemar-recursos-tecnicos--solo-cards',
        ].filter(Boolean).join(' '),
        'data-filter-style': mostrarFiltro ? filterStyle : '',
        'data-categorias': mostrarFiltro ? categorias : '',
    });

    return (
        <div { ...blockProps }>
            { mostrarTexto && (
                <div className="acemar-recursos-tecnicos__left">
                    <p className="acemar-recursos-tecnicos__titulo">{ titulo }</p>
                    <p className="acemar-recursos-tecnicos__desc">{ descripcion }</p>
                    <a className="acemar-recursos-tecnicos__btn" href={ botonUrl }>
                        { botonTexto }
                    </a>
                </div>
            ) }
            <div className="acemar-recursos-tecnicos__right">
                { mostrarFiltro && (
                    <div
                        className="acemar-rt-filter-placeholder"
                        data-filter-style={ filterStyle }
                        data-categorias={ categorias }
                    />
                ) }
                <div className="acemar-recursos-tecnicos__grid">
                    <InnerBlocks.Content />
                </div>
            </div>
        </div>
    );
};

registerBlockType(metadata.name, {
    edit: Edit,
    save: Save,
});