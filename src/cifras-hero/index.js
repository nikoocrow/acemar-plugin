import { registerBlockType } from '@wordpress/blocks';
import {
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    useBlockProps,
    ColorPalette
} from '@wordpress/block-editor';
import {
    Button,
    PanelBody,
    RangeControl,
    TextControl,
    SelectControl,
    ColorIndicator
} from '@wordpress/components';
import metadata from './block.json';
import './editor.scss';
import './style.scss';

const MAX_CIFRAS = 7;

const Edit = ( { attributes, setAttributes } ) => {
    const {
        backgroundImageUrl,
        backgroundImageId,
        overlayOpacity,
        minHeight,
        contentAlign,
        accentColor,
        cifras,
    } = attributes;

    const blockProps = useBlockProps( {
        className: 'acemar-cifras-hero alignfull',
        style: { minHeight: `${ minHeight }px`, position: 'relative' },
    } );

    const updateCifra = ( index, field, value ) => {
        const updated = cifras.map( ( c, i ) =>
            i === index ? { ...c, [ field ]: value } : c
        );
        setAttributes( { cifras: updated } );
    };

    const addCifra = () => {
        if ( cifras.length >= MAX_CIFRAS ) return;
        setAttributes( {
            cifras: [ ...cifras, { icon: '', number: '0', suffix: '+', label: 'Label' } ]
        } );
    };

    const removeCifra = ( index ) => {
        setAttributes( { cifras: cifras.filter( ( _, i ) => i !== index ) } );
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title="Imagen de fondo" initialOpen={ true }>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={ ( media ) => setAttributes( {
                                backgroundImageUrl: media.url,
                                backgroundImageId: media.id,
                            } ) }
                            allowedTypes={ [ 'image' ] }
                            value={ backgroundImageId }
                            render={ ( { open } ) => (
                                <div>
                                    { backgroundImageUrl && (
                                        <div style={ { marginBottom: '10px' } }>
                                            <img
                                                src={ backgroundImageUrl }
                                                style={ { width: '100%', height: '80px', objectFit: 'cover', borderRadius: '2px' } }
                                                alt=""
                                            />
                                            <Button
                                                onClick={ () => setAttributes( { backgroundImageUrl: '', backgroundImageId: 0 } ) }
                                                isDestructive
                                                variant="link"
                                            >
                                                Eliminar imagen
                                            </Button>
                                        </div>
                                    ) }
                                    <Button onClick={ open } variant="primary" style={ { width: '100%' } }>
                                        { backgroundImageUrl ? 'Cambiar imagen' : 'Seleccionar imagen' }
                                    </Button>
                                </div>
                            ) }
                        />
                    </MediaUploadCheck>
                </PanelBody>

                <PanelBody title="Configuración" initialOpen={ false }>
                    <RangeControl
                        label="Opacidad del overlay"
                        value={ overlayOpacity }
                        onChange={ ( value ) => setAttributes( { overlayOpacity: value } ) }
                        min={ 0 }
                        max={ 1 }
                        step={ 0.1 }
                    />
                    <RangeControl
                        label="Altura mínima (px)"
                        value={ minHeight }
                        onChange={ ( value ) => setAttributes( { minHeight: value } ) }
                        min={ 200 }
                        max={ 900 }
                        step={ 10 }
                    />
                    <SelectControl
                        label="Alineación del contenido"
                        value={ contentAlign }
                        options={ [
                            { label: 'Izquierda', value: 'flex-start' },
                            { label: 'Centro',    value: 'center' },
                            { label: 'Derecha',   value: 'flex-end' },
                        ] }
                        onChange={ ( value ) => setAttributes( { contentAlign: value } ) }
                    />
                </PanelBody>

                <PanelBody title="Color de iconos y cifras" initialOpen={ false }>
                    <p style={ { marginBottom: '8px', fontSize: '12px' } }>
                        Color actual: <ColorIndicator colorValue={ accentColor } />
                    </p>
                    <ColorPalette
                        colors={ [
                            { name: 'Dorado Acemar', color: '#C9A84C' },
                            { name: 'Blanco',        color: '#ffffff' },
                            { name: 'Amarillo',      color: '#f5c518' },
                            { name: 'Naranja',       color: '#e8732a' },
                        ] }
                        value={ accentColor }
                        onChange={ ( value ) => setAttributes( { accentColor: value } ) }
                    />
                </PanelBody>

                <PanelBody title={ `Cifras (${ cifras.length }/${ MAX_CIFRAS })` } initialOpen={ true }>
                    { cifras.map( ( cifra, index ) => (
                        <div
                            key={ index }
                            style={ {
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                padding: '12px',
                                marginBottom: '12px',
                                background: '#f9f9f9'
                            } }
                        >
                            <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } }>
                                <strong style={ { fontSize: '12px' } }>Cifra { index + 1 }</strong>
                                <Button
                                    onClick={ () => removeCifra( index ) }
                                    isDestructive
                                    variant="link"
                                    style={ { fontSize: '11px' } }
                                >
                                    Eliminar
                                </Button>
                            </div>

                            <p style={ { fontSize: '11px', color: '#666', marginBottom: '6px' } }>Icono (URL o SVG)</p>
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={ ( media ) => updateCifra( index, 'icon', media.url ) }
                                    allowedTypes={ [ 'image' ] }
                                    value={ cifra.icon }
                                    render={ ( { open } ) => (
                                        <div style={ { marginBottom: '8px' } }>
                                            { cifra.icon && (
                                                <img
                                                    src={ cifra.icon }
                                                    style={ { width: '40px', height: '40px', objectFit: 'contain', display: 'block', marginBottom: '4px' } }
                                                    alt=""
                                                />
                                            ) }
                                            <Button onClick={ open } variant="secondary" style={ { width: '100%', fontSize: '11px' } }>
                                                { cifra.icon ? 'Cambiar icono' : 'Subir icono' }
                                            </Button>
                                            { cifra.icon && (
                                                <Button
                                                    onClick={ () => updateCifra( index, 'icon', '' ) }
                                                    isDestructive
                                                    variant="link"
                                                    style={ { fontSize: '11px' } }
                                                >
                                                    Quitar icono
                                                </Button>
                                            ) }
                                        </div>
                                    ) }
                                />
                            </MediaUploadCheck>

                            <TextControl
                                label="Número"
                                value={ cifra.number }
                                onChange={ ( value ) => updateCifra( index, 'number', value ) }
                                placeholder="500"
                            />
                            <TextControl
                                label="Sufijo"
                                value={ cifra.suffix }
                                onChange={ ( value ) => updateCifra( index, 'suffix', value ) }
                                placeholder="+"
                            />
                            <TextControl
                                label="Etiqueta"
                                value={ cifra.label }
                                onChange={ ( value ) => updateCifra( index, 'label', value ) }
                                placeholder="Países"
                            />
                        </div>
                    ) ) }

                    { cifras.length < MAX_CIFRAS && (
                        <Button
                            onClick={ addCifra }
                            variant="secondary"
                            style={ { width: '100%' } }
                        >
                            + Agregar cifra
                        </Button>
                    ) }
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                { backgroundImageUrl ? (
                    <div
                        className="acemar-cifras-hero__bg"
                        style={ { backgroundImage: `url(${ backgroundImageUrl })` } }
                    />
                ) : (
                    <div className="acemar-cifras-hero__bg is-empty">
                        📷 Selecciona una imagen de fondo en el panel lateral
                    </div>
                ) }

                <div
                    className="acemar-cifras-hero__overlay"
                    style={ { backgroundColor: `rgba(0,0,0,${ overlayOpacity })` } }
                />

                <div
                    className="acemar-cifras-hero__content"
                    style={ { justifyContent: contentAlign } }
                >
                    { cifras.map( ( cifra, index ) => (
                        <div key={ index } className="acemar-cifras-hero__item">
                            { cifra.icon && (
                                <img
                                    src={ cifra.icon }
                                    className="acemar-cifras-hero__icon"
                                    style={ { filter: `drop-shadow(0 0 0 ${ accentColor })` } }
                                    alt=""
                                />
                            ) }
                            <div
                                className="acemar-cifras-hero__number"
                                style={ { color: accentColor } }
                            >
                                { cifra.number }{ cifra.suffix }
                            </div>
                            <div className="acemar-cifras-hero__label">
                                { cifra.label }
                            </div>
                        </div>
                    ) ) }
                </div>
            </div>
        </>
    );
};

const Save = ( { attributes } ) => {
    const {
        backgroundImageUrl,
        overlayOpacity,
        minHeight,
        contentAlign,
        accentColor,
        cifras,
    } = attributes;

    const blockProps = useBlockProps.save( {
        className: 'acemar-cifras-hero alignfull',
        style: { minHeight: `${ minHeight }px`, position: 'relative' },
    } );

    return (
        <div { ...blockProps }>
            { backgroundImageUrl && (
                <div
                    className="acemar-cifras-hero__bg"
                    style={ { backgroundImage: `url(${ backgroundImageUrl })` } }
                />
            ) }
            <div
                className="acemar-cifras-hero__overlay"
                style={ { backgroundColor: `rgba(0,0,0,${ overlayOpacity })` } }
            />
            <div
                className="acemar-cifras-hero__content"
                style={ { justifyContent: contentAlign } }
            >
                { cifras.map( ( cifra, index ) => (
                    <div
                        key={ index }
                        className="acemar-cifras-hero__item"
                        data-number={ cifra.number }
                    >
                        { cifra.icon && (
                            <img
                                src={ cifra.icon }
                                className="acemar-cifras-hero__icon"
                                alt=""
                                style={ { filter: `brightness(0) saturate(100%) invert(73%) sepia(50%) saturate(500%) hue-rotate(5deg)` } }
                            />
                        ) }
                        <div
                            className="acemar-cifras-hero__number"
                            style={ { color: accentColor } }
                            data-target={ cifra.number }
                        >
                            0{ cifra.suffix }
                        </div>
                        <h5 className="acemar-cifras-hero__label">
                            { cifra.label }
                        </h5>
                    </div>
                ) ) }
            </div>
        </div>
    );
};

registerBlockType( metadata.name, {
    edit: Edit,
    save: Save,
} );