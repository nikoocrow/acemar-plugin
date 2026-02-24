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
    TextControl,
    TextareaControl,
    ColorIndicator
} from '@wordpress/components';
import metadata from './block.json';
import './editor.scss';
import './style.scss';

const Edit = ( { attributes, setAttributes } ) => {
    const { hitos, accentColor, panelBg } = attributes;

    const blockProps = useBlockProps( {
        className: 'acemar-timeline alignfull',
    } );

    const updateHito = ( index, field, value ) => {
        const updated = hitos.map( ( h, i ) =>
            i === index ? { ...h, [ field ]: value } : h
        );
        setAttributes( { hitos: updated } );
    };

    const addHito = () => {
        setAttributes( {
            hitos: [
                ...hitos,
                { year: '2000', title: 'Nuevo hito', description: 'Descripción del hito.', imageUrl: '', imageId: 0 }
            ]
        } );
    };

    const removeHito = ( index ) => {
        setAttributes( { hitos: hitos.filter( ( _, i ) => i !== index ) } );
    };

    const moveHito = ( index, direction ) => {
        const updated = [ ...hitos ];
        const target = index + direction;
        if ( target < 0 || target >= updated.length ) return;
        [ updated[ index ], updated[ target ] ] = [ updated[ target ], updated[ index ] ];
        setAttributes( { hitos: updated } );
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title="Colores" initialOpen={ false }>
                    <p style={ { fontSize: '12px', marginBottom: '4px' } }>
                        Color acento <ColorIndicator colorValue={ accentColor } />
                    </p>
                    <ColorPalette
                        colors={ [
                            { name: 'Dorado Acemar', color: '#C9A84C' },
                            { name: 'Blanco', color: '#ffffff' },
                            { name: 'Naranja', color: '#e8732a' },
                        ] }
                        value={ accentColor }
                        onChange={ ( val ) => setAttributes( { accentColor: val } ) }
                    />
                    <p style={ { fontSize: '12px', marginBottom: '4px', marginTop: '12px' } }>
                        Fondo panel <ColorIndicator colorValue={ panelBg } />
                    </p>
                    <ColorPalette
                        colors={ [
                            { name: 'Negro', color: '#1a1a1a' },
                            { name: 'Gris oscuro', color: '#2d2d2d' },
                            { name: 'Gris', color: '#444444' },
                        ] }
                        value={ panelBg }
                        onChange={ ( val ) => setAttributes( { panelBg: val } ) }
                    />
                </PanelBody>

                <PanelBody title={ `Hitos (${ hitos.length })` } initialOpen={ true }>
                    { hitos.map( ( hito, index ) => (
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
                                <strong style={ { fontSize: '12px' } }>Hito { index + 1 }</strong>
                                <div style={ { display: 'flex', gap: '4px' } }>
                                    <Button
                                        onClick={ () => moveHito( index, -1 ) }
                                        variant="tertiary"
                                        style={ { minWidth: 'unset', padding: '0 6px' } }
                                    >↑</Button>
                                    <Button
                                        onClick={ () => moveHito( index, 1 ) }
                                        variant="tertiary"
                                        style={ { minWidth: 'unset', padding: '0 6px' } }
                                    >↓</Button>
                                    <Button
                                        onClick={ () => removeHito( index ) }
                                        isDestructive
                                        variant="link"
                                        style={ { fontSize: '11px' } }
                                    >Eliminar</Button>
                                </div>
                            </div>

                            <MediaUploadCheck>
                                <MediaUpload
                                  onSelect={ ( media ) => {
                                            const updated = hitos.map( ( h, i ) =>
                                                i === index ? { ...h, imageUrl: media.url, imageId: media.id } : h
                                            );
                                            setAttributes( { hitos: updated } );
                                        } }
                                    allowedTypes={ [ 'image' ] }
                                    value={ hito.imageId }
                                    render={ ( { open } ) => (
                                        <div style={ { marginBottom: '8px' } }>
                                            { hito.imageUrl && (
                                                <img
                                                    src={ hito.imageUrl }
                                                    style={ { width: '100%', height: '60px', objectFit: 'cover', borderRadius: '2px', marginBottom: '4px' } }
                                                    alt=""
                                                />
                                            ) }
                                            <Button onClick={ open } variant="secondary" style={ { width: '100%', fontSize: '11px' } }>
                                                { hito.imageUrl ? 'Cambiar imagen' : 'Subir imagen' }
                                            </Button>
                                        </div>
                                    ) }
                                />
                            </MediaUploadCheck>

                            <TextControl
                                label="Año"
                                value={ hito.year }
                                onChange={ ( val ) => updateHito( index, 'year', val ) }
                                placeholder="1962"
                            />
                            <TextControl
                                label="Título"
                                value={ hito.title }
                                onChange={ ( val ) => updateHito( index, 'title', val ) }
                                placeholder="Nace un sueño"
                            />
                            <TextareaControl
                                label="Descripción"
                                value={ hito.description }
                                onChange={ ( val ) => updateHito( index, 'description', val ) }
                                placeholder="Descripción del hito..."
                                rows={ 3 }
                            />
                        </div>
                    ) ) }

                    <Button onClick={ addHito } variant="secondary" style={ { width: '100%' } }>
                        + Agregar hito
                    </Button>
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                <div className="acemar-timeline__editor-preview">
                    <span>🕐 Timeline — { hitos.length } hitos configurados</span>
                    <div className="acemar-timeline__editor-list">
                        { hitos.map( ( hito, i ) => (
                            <div key={ i } className="acemar-timeline__editor-item">
                                { hito.imageUrl && (
                                    <img src={ hito.imageUrl } alt="" />
                                ) }
                                <div>
                                    <strong>{ hito.year }</strong>
                                    <span>{ hito.title }</span>
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
    const { hitos, accentColor, panelBg } = attributes;

    const blockProps = useBlockProps.save( {
        className: 'acemar-timeline alignfull',
        style: { '--accent': accentColor },
    } );

    return (
        <div { ...blockProps }>
            <div className="acemar-timeline__slides">
                { hitos.map( ( hito, index ) => (
                    <div
                        key={ index }
                        className={ `acemar-timeline__slide${ index === 0 ? ' is-active' : '' }` }
                        data-index={ index }
                    >
                        <div className="acemar-timeline__image">
                            { hito.imageUrl
                                ? <img src={ hito.imageUrl } alt={ hito.title } />
                                : <div className="acemar-timeline__image-placeholder" />
                            }
                        </div>

                        <div
                            className="acemar-timeline__panel"
                            style={ { backgroundColor: panelBg } }
                        >
                            <div className="acemar-timeline__panel-inner">
                                <span
                                    className="acemar-timeline__year"
                                    style={ { color: accentColor } }
                                >
                                    { hito.year }
                                </span>
                                <h3 className="acemar-timeline__title">{ hito.title }</h3>
                                <p className="acemar-timeline__description">{ hito.description }</p>
                            </div>
                        </div>
                    </div>
                ) ) }
            </div>

            <button className="acemar-timeline__arrow acemar-timeline__arrow--prev" aria-label="Anterior">&#8249;</button>
            <button className="acemar-timeline__arrow acemar-timeline__arrow--next" aria-label="Siguiente">&#8250;</button>

            <div className="acemar-timeline__nav">
                <div className="acemar-timeline__nav-track">
                    <div className="acemar-timeline__nav-line"></div>
                    { hitos.map( ( hito, index ) => (
                        <button
                            key={ index }
                            className={ `acemar-timeline__nav-item${ index === 0 ? ' is-active' : '' }` }
                            data-index={ index }
                        >
                            <span className="acemar-timeline__nav-dot"></span>
                            <span className="acemar-timeline__nav-year">{ hito.year }</span>
                        </button>
                    ) ) }
                </div>
                <button className="acemar-timeline__nav-arrow acemar-timeline__nav-arrow--prev" aria-label="Anterior">&#8249;</button>
                <button className="acemar-timeline__nav-arrow acemar-timeline__nav-arrow--next" aria-label="Siguiente">&#8250;</button>
            </div>
        </div>
    );
};

registerBlockType( metadata.name, {
    edit: Edit,
    save: Save,
} );