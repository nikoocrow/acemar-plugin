import { registerBlockType } from '@wordpress/blocks';
import {
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    RichText,
    useBlockProps,
    ColorPalette
} from '@wordpress/block-editor';
import {
    Button,
    PanelBody,
    TextControl,
    TextareaControl,
    RangeControl,
    ToggleControl,
    ColorIndicator
} from '@wordpress/components';
import metadata from './block.json';
import './editor.scss';
import './style.scss';

const Edit = ( { attributes, setAttributes } ) => {
    const { titulo, testimonios, cardBg, accentColor, autoplay, autoplaySpeed } = attributes;

    const blockProps = useBlockProps( {
        className: 'acemar-testimonios alignfull',
    } );

    const updateTestimonio = ( index, field, value ) => {
        const updated = testimonios.map( ( t, i ) =>
            i === index ? { ...t, [ field ]: value } : t
        );
        setAttributes( { testimonios: updated } );
    };

    const addTestimonio = () => {
        setAttributes( {
            testimonios: [
                ...testimonios,
                { nombre: 'Nombre', cargo: 'Cargo / Empresa', testimonio: '"Testimonio..."', fotoUrl: '', fotoId: 0 }
            ]
        } );
    };

    const removeTestimonio = ( index ) => {
        setAttributes( { testimonios: testimonios.filter( ( _, i ) => i !== index ) } );
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title="Configuración" initialOpen={ true }>
                    <TextControl
                        label="Título de la sección"
                        value={ titulo }
                        onChange={ ( val ) => setAttributes( { titulo: val } ) }
                    />
                    <ToggleControl
                        label="Autoplay"
                        checked={ autoplay }
                        onChange={ ( val ) => setAttributes( { autoplay: val } ) }
                    />
                    { autoplay && (
                        <RangeControl
                            label="Velocidad autoplay (ms)"
                            value={ autoplaySpeed }
                            onChange={ ( val ) => setAttributes( { autoplaySpeed: val } ) }
                            min={ 1000 }
                            max={ 8000 }
                            step={ 500 }
                        />
                    ) }
                </PanelBody>

                <PanelBody title="Colores" initialOpen={ false }>
                    <p style={ { fontSize: '12px', marginBottom: '4px' } }>
                        Fondo cards <ColorIndicator colorValue={ cardBg } />
                    </p>
                    <ColorPalette
                        colors={ [
                            { name: 'Gris oscuro', color: '#2d2d2d' },
                            { name: 'Negro', color: '#1a1a1a' },
                            { name: 'Gris', color: '#444444' },
                        ] }
                        value={ cardBg }
                        onChange={ ( val ) => setAttributes( { cardBg: val } ) }
                    />
                    <p style={ { fontSize: '12px', marginBottom: '4px', marginTop: '12px' } }>
                        Color acento <ColorIndicator colorValue={ accentColor } />
                    </p>
                    <ColorPalette
                        colors={ [
                            { name: 'Dorado Acemar', color: '#C9A84C' },
                            { name: 'Blanco', color: '#ffffff' },
                        ] }
                        value={ accentColor }
                        onChange={ ( val ) => setAttributes( { accentColor: val } ) }
                    />
                </PanelBody>

                <PanelBody title={ `Testimonios (${ testimonios.length })` } initialOpen={ true }>
                    { testimonios.map( ( t, index ) => (
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
                            <div style={ { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } }>
                                <strong style={ { fontSize: '12px' } }>Testimonio { index + 1 }</strong>
                                <Button
                                    onClick={ () => removeTestimonio( index ) }
                                    isDestructive
                                    variant="link"
                                    style={ { fontSize: '11px' } }
                                >
                                    Eliminar
                                </Button>
                            </div>

                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={ ( media ) => {
                                        const updated = testimonios.map( ( item, i ) =>
                                            i === index ? { ...item, fotoUrl: media.url, fotoId: media.id } : item
                                        );
                                        setAttributes( { testimonios: updated } );
                                    } }
                                    allowedTypes={ [ 'image' ] }
                                    value={ t.fotoId }
                                    render={ ( { open } ) => (
                                        <div style={ { marginBottom: '8px' } }>
                                            { t.fotoUrl && (
                                                <img
                                                    src={ t.fotoUrl }
                                                    style={ { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%', display: 'block', marginBottom: '4px' } }
                                                    alt=""
                                                />
                                            ) }
                                            <Button onClick={ open } variant="secondary" style={ { width: '100%', fontSize: '11px' } }>
                                                { t.fotoUrl ? 'Cambiar foto' : 'Subir foto' }
                                            </Button>
                                        </div>
                                    ) }
                                />
                            </MediaUploadCheck>

                            <TextControl
                                label="Nombre"
                                value={ t.nombre }
                                onChange={ ( val ) => updateTestimonio( index, 'nombre', val ) }
                            />
                            <TextControl
                                label="Cargo / Empresa"
                                value={ t.cargo }
                                onChange={ ( val ) => updateTestimonio( index, 'cargo', val ) }
                            />
                            <TextareaControl
                                label="Testimonio"
                                value={ t.testimonio }
                                onChange={ ( val ) => updateTestimonio( index, 'testimonio', val ) }
                                rows={ 3 }
                            />
                        </div>
                    ) ) }

                    <Button onClick={ addTestimonio } variant="secondary" style={ { width: '100%' } }>
                        + Agregar testimonio
                    </Button>
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                <div className="acemar-testimonios__editor-preview">
                    <div className="acemar-testimonios__editor-header">
                        <span className="acemar-testimonios__editor-titulo">{ titulo }</span>
                        <span className="acemar-testimonios__editor-info">{ testimonios.length } testimonios · { autoplay ? `Autoplay ${ autoplaySpeed }ms` : 'Sin autoplay' }</span>
                    </div>
                    <div className="acemar-testimonios__editor-grid">
                        { testimonios.slice( 0, 4 ).map( ( t, i ) => (
                            <div key={ i } className="acemar-testimonios__editor-card" style={ { background: cardBg } }>
                                { t.fotoUrl && (
                                    <img src={ t.fotoUrl } alt="" />
                                ) }
                                <div>
                                    <strong style={ { color: accentColor } }>{ t.nombre }</strong>
                                    <span>{ t.cargo }</span>
                                    <p>{ t.testimonio }</p>
                                </div>
                            </div>
                        ) ) }
                    </div>
                </div>
            </div>
        </>
    );
};

const Save = ( { attributes } ) => {
    const { titulo, testimonios, cardBg, accentColor, autoplay, autoplaySpeed } = attributes;

    const blockProps = useBlockProps.save( {
        className: 'acemar-testimonios alignfull',
        'data-autoplay': autoplay ? 'true' : 'false',
        'data-speed': autoplaySpeed,
        'data-accent': accentColor,
    } );

    return (
        <div { ...blockProps }>
            <div className="acemar-testimonios__header">
                <h2 className="acemar-testimonios__titulo" style={ { '--accent': accentColor } }>
                    { titulo }
                </h2>
                <div className="acemar-testimonios__arrows">
                    <button className="acemar-testimonios__arrow acemar-testimonios__arrow--prev" aria-label="Anterior">&#8249;</button>
                    <button className="acemar-testimonios__arrow acemar-testimonios__arrow--next" aria-label="Siguiente">&#8250;</button>
                </div>
            </div>

            <div className="acemar-testimonios__track-wrapper">
                <div className="acemar-testimonios__track">
                    { testimonios.map( ( t, index ) => (
                        <div
                            key={ index }
                            className="acemar-testimonios__card"
                            style={ { backgroundColor: cardBg } }
                        >
                            <div className="acemar-testimonios__card-header">
                                { t.fotoUrl && (
                                    <img
                                        src={ t.fotoUrl }
                                        alt={ t.nombre }
                                        className="acemar-testimonios__foto"
                                    />
                                ) }
                                <div className="acemar-testimonios__info">
                                    <span className="acemar-testimonios__nombre" style={ { color: accentColor } }>
                                        { t.nombre }
                                    </span>
                                    <span className="acemar-testimonios__cargo">{ t.cargo }</span>
                                </div>
                            </div>
                            <p className="acemar-testimonios__texto">{ t.testimonio }</p>
                        </div>
                    ) ) }
                </div>
            </div>
        </div>
    );
};

registerBlockType( metadata.name, {
    edit: Edit,
    save: Save,
} );