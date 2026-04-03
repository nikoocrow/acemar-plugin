import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    InspectorControls,
    RichText,
} from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    SelectControl,
    ToggleControl,
    ColorPicker,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

const TIPO_OPTIONS = [
    { label: 'Selector de Acabados',      value: 'acabado'    },
    { label: 'Selector de Terminaciones', value: 'terminacion' },
    { label: 'Selector de Colores',       value: 'color'      },
];

const Edit = ({ attributes, setAttributes }) => {
    const {
        titulo, descripcion, tipoSelector,
        etiquetaTab1, slugTab1,
        etiquetaTab2, slugTab2, mostrarTab2,
        etiquetaTab3, slugTab3, mostrarTab3,
        colorAccent,
    } = attributes;

    const blockProps = useBlockProps({ className: 'acemar-selector-muestras' });

    const tabs = [
        { label: etiquetaTab1, slug: slugTab1 },
        ...(mostrarTab2 ? [{ label: etiquetaTab2, slug: slugTab2 }] : []),
        ...(mostrarTab3 ? [{ label: etiquetaTab3, slug: slugTab3 }] : []),
    ];

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Tipo de selector', 'acemar-blocks')} initialOpen={true}>
                    <SelectControl
                        label={__('¿Qué tipo de selector es?', 'acemar-blocks')}
                        value={tipoSelector}
                        options={TIPO_OPTIONS}
                        onChange={(v) => setAttributes({ tipoSelector: v })}
                    />
                </PanelBody>

                <PanelBody title={__('Textos', 'acemar-blocks')} initialOpen={false}>
                    <TextControl
                        label={__('Título', 'acemar-blocks')}
                        value={titulo}
                        onChange={(v) => setAttributes({ titulo: v })}
                    />
                    <TextControl
                        label={__('Descripción', 'acemar-blocks')}
                        value={descripcion}
                        onChange={(v) => setAttributes({ descripcion: v })}
                    />
                </PanelBody>

                <PanelBody title={__('Pestaña 1', 'acemar-blocks')} initialOpen={false}>
                    <TextControl
                        label={__('Etiqueta visible', 'acemar-blocks')}
                        value={etiquetaTab1}
                        onChange={(v) => setAttributes({ etiquetaTab1: v })}
                    />
                    <TextControl
                        label={__('Slug de la colección', 'acemar-blocks')}
                        value={slugTab1}
                        onChange={(v) => setAttributes({ slugTab1: v })}
                        help={__('Slug del término en la taxonomía "Colecciones".', 'acemar-blocks')}
                    />
                </PanelBody>

                <PanelBody title={__('Pestaña 2', 'acemar-blocks')} initialOpen={false}>
                    <ToggleControl
                        label={__('Mostrar pestaña 2', 'acemar-blocks')}
                        checked={mostrarTab2}
                        onChange={(v) => setAttributes({ mostrarTab2: v })}
                    />
                    {mostrarTab2 && (
                        <>
                            <TextControl
                                label={__('Etiqueta visible', 'acemar-blocks')}
                                value={etiquetaTab2}
                                onChange={(v) => setAttributes({ etiquetaTab2: v })}
                            />
                            <TextControl
                                label={__('Slug de la colección', 'acemar-blocks')}
                                value={slugTab2}
                                onChange={(v) => setAttributes({ slugTab2: v })}
                            />
                        </>
                    )}
                </PanelBody>

                <PanelBody title={__('Pestaña 3', 'acemar-blocks')} initialOpen={false}>
                    <ToggleControl
                        label={__('Mostrar pestaña 3', 'acemar-blocks')}
                        checked={mostrarTab3}
                        onChange={(v) => setAttributes({ mostrarTab3: v })}
                    />
                    {mostrarTab3 && (
                        <>
                            <TextControl
                                label={__('Etiqueta visible', 'acemar-blocks')}
                                value={etiquetaTab3}
                                onChange={(v) => setAttributes({ etiquetaTab3: v })}
                            />
                            <TextControl
                                label={__('Slug de la colección', 'acemar-blocks')}
                                value={slugTab3}
                                onChange={(v) => setAttributes({ slugTab3: v })}
                            />
                        </>
                    )}
                </PanelBody>

                <PanelBody title={__('Color de acento', 'acemar-blocks')} initialOpen={false}>
                    <p style={{ fontSize: '12px', marginBottom: '8px', color: '#757575' }}>
                        {__('Color del tab activo y detalles decorativos.', 'acemar-blocks')}
                    </p>
                    <ColorPicker
                        color={colorAccent}
                        onChange={(v) => setAttributes({ colorAccent: v })}
                        enableAlpha={false}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="acemar-sm__header">
                    <RichText
                        tagName="h2"
                        className="acemar-sm__titulo"
                        value={titulo}
                        onChange={(v) => setAttributes({ titulo: v })}
                        placeholder={__('Título del selector…', 'acemar-blocks')}
                    />
                    <span
                        className="acemar-sm__accent-line"
                        style={{ backgroundColor: colorAccent }}
                    />
                    <RichText
                        tagName="p"
                        className="acemar-sm__descripcion"
                        value={descripcion}
                        onChange={(v) => setAttributes({ descripcion: v })}
                        placeholder={__('Descripción…', 'acemar-blocks')}
                    />
                </div>

                <div className="acemar-sm__tabs">
                    {tabs.map((tab, i) => (
                        <button
                            key={i}
                            className={`acemar-selector-muestras__tab ${i === 0 ? 'is-active' : ''}`}
                            style={i === 0 ? { backgroundColor: colorAccent, borderColor: colorAccent } : {}}
                        >
                            <span className="acemar-sm__tab-label">{tab.label || `Pestaña ${i + 1}`}</span>
                            {!tab.slug && (
                                <span className="acemar-sm__tab-warning"> ⚠ sin slug</span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="acemar-sm__grid-placeholder">
                    <div className="acemar-sm__grid-placeholder-inner">
                        <span className="dashicons dashicons-art" />
                        <p>
                            {__('Las muestras se cargarán desde el CPT ', 'acemar-blocks')}
                            <strong>acemar_muestra</strong>
                            {__(' según el tipo ', 'acemar-blocks')}
                            <strong>{tipoSelector}</strong>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

registerBlockType(metadata.name, {
    edit: Edit,
    save: () => null,
});