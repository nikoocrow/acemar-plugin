import { registerBlockType } from '@wordpress/blocks';
import {
    InspectorControls,
    useBlockProps,
    ColorPalette
} from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    RangeControl,
    ToggleControl,
    SelectControl,
    ColorIndicator
} from '@wordpress/components';
import metadata from './block.json';
import './editor.scss';
import './style.scss';

const COLORS = [
    { name: 'Dorado Acemar', color: '#C9A84C' },
    { name: 'Blanco',        color: '#ffffff' },
    { name: 'Negro',         color: '#000000' },
    { name: 'Transparente',  color: 'transparent' },
];

const Edit = ( { attributes, setAttributes } ) => {
    const {
        label, url, target, borderRadius,
        borderColor, hoverBg, hoverTextColor,
        textColor, bgColor, fontSize,
        paddingX, paddingY, align
    } = attributes;

    const blockProps = useBlockProps( {
        className: 'acemar-boton-wrapper',
        style: { textAlign: align }
    } );

    const btnStyle = {
        borderRadius: `${ borderRadius }px`,
        border: `2px solid ${ borderColor }`,
        color: textColor,
        background: bgColor,
        fontSize: `${ fontSize }px`,
        padding: `${ paddingY }px ${ paddingX }px`,
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title="Contenido" initialOpen={ true }>
                    <TextControl
                        label="Label del botón"
                        value={ label }
                        onChange={ ( val ) => setAttributes( { label: val } ) }
                        placeholder="Leer artículo"
                    />
                    <TextControl
                        label="URL"
                        value={ url }
                        onChange={ ( val ) => setAttributes( { url: val } ) }
                        placeholder="https://... o /pagina-interna"
                    />
                    <ToggleControl
                        label="Abrir en nueva pestaña"
                        checked={ target === '_blank' }
                        onChange={ ( val ) => setAttributes( { target: val ? '_blank' : '_self' } ) }
                    />
                    <SelectControl
                        label="Alineación"
                        value={ align }
                        options={ [
                            { label: 'Izquierda', value: 'left' },
                            { label: 'Centro',    value: 'center' },
                            { label: 'Derecha',   value: 'right' },
                        ] }
                        onChange={ ( val ) => setAttributes( { align: val } ) }
                    />
                </PanelBody>

                <PanelBody title="Estilo" initialOpen={ false }>
                    <RangeControl
                        label="Border radius (px)"
                        value={ borderRadius }
                        onChange={ ( val ) => setAttributes( { borderRadius: val } ) }
                        min={ 0 }
                        max={ 50 }
                        step={ 1 }
                    />
                    <RangeControl
                        label="Tamaño de fuente (px)"
                        value={ fontSize }
                        onChange={ ( val ) => setAttributes( { fontSize: val } ) }
                        min={ 10 }
                        max={ 30 }
                        step={ 1 }
                    />
                    <RangeControl
                        label="Padding horizontal (px)"
                        value={ paddingX }
                        onChange={ ( val ) => setAttributes( { paddingX: val } ) }
                        min={ 8 }
                        max={ 80 }
                        step={ 2 }
                    />
                    <RangeControl
                        label="Padding vertical (px)"
                        value={ paddingY }
                        onChange={ ( val ) => setAttributes( { paddingY: val } ) }
                        min={ 4 }
                        max={ 40 }
                        step={ 2 }
                    />
                </PanelBody>

                <PanelBody title="Colores" initialOpen={ false }>
                    <p style={ { fontSize: '12px', marginBottom: '4px' } }>
                        Color del borde <ColorIndicator colorValue={ borderColor } />
                    </p>
                    <ColorPalette
                        colors={ COLORS }
                        value={ borderColor }
                        onChange={ ( val ) => setAttributes( { borderColor: val } ) }
                    />
                    <p style={ { fontSize: '12px', marginBottom: '4px', marginTop: '12px' } }>
                        Color del texto <ColorIndicator colorValue={ textColor } />
                    </p>
                    <ColorPalette
                        colors={ COLORS }
                        value={ textColor }
                        onChange={ ( val ) => setAttributes( { textColor: val } ) }
                    />
                    <p style={ { fontSize: '12px', marginBottom: '4px', marginTop: '12px' } }>
                        Fondo del botón <ColorIndicator colorValue={ bgColor } />
                    </p>
                    <ColorPalette
                        colors={ COLORS }
                        value={ bgColor }
                        onChange={ ( val ) => setAttributes( { bgColor: val } ) }
                    />
                    <p style={ { fontSize: '12px', marginBottom: '4px', marginTop: '12px' } }>
                        Fondo hover <ColorIndicator colorValue={ hoverBg } />
                    </p>
                    <ColorPalette
                        colors={ COLORS }
                        value={ hoverBg }
                        onChange={ ( val ) => setAttributes( { hoverBg: val } ) }
                    />
                    <p style={ { fontSize: '12px', marginBottom: '4px', marginTop: '12px' } }>
                        Texto hover <ColorIndicator colorValue={ hoverTextColor } />
                    </p>
                    <ColorPalette
                        colors={ COLORS }
                        value={ hoverTextColor }
                        onChange={ ( val ) => setAttributes( { hoverTextColor: val } ) }
                    />
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                <span className="acemar-boton" style={ btnStyle }>
                    { label }
                </span>
            </div>
        </>
    );
};

const Save = ( { attributes } ) => {
    const {
        label, url, target, borderRadius,
        borderColor, hoverBg, hoverTextColor,
        textColor, bgColor, fontSize,
        paddingX, paddingY, align
    } = attributes;

    const blockProps = useBlockProps.save( {
        className: 'acemar-boton-wrapper',
        style: { textAlign: align },
    } );

    return (
        <div { ...blockProps }>
            <a
                href={ url || '#' }
                target={ target }
                rel={ target === '_blank' ? 'noopener noreferrer' : undefined }
                className="acemar-boton"
                style={ {
                    borderRadius: `${ borderRadius }px`,
                    border: `2px solid ${ borderColor }`,
                    color: textColor,
                    background: bgColor,
                    fontSize: `${ fontSize }px`,
                    padding: `${ paddingY }px ${ paddingX }px`,
                    '--hover-bg': hoverBg,
                    '--hover-text': hoverTextColor,
                    '--border-color': borderColor,
                } }
            >
                { label }
            </a>
        </div>
    );
};

registerBlockType( metadata.name, {
    edit: Edit,
    save: Save,
} );