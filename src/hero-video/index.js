import { registerBlockType } from '@wordpress/blocks';
import {
    InnerBlocks,
    InspectorControls,
    useBlockProps
} from '@wordpress/block-editor';
import {
    Button,
    PanelBody,
    RangeControl,
    TextControl
} from '@wordpress/components';
import metadata from './block.json';
import './editor.scss';
import './style.scss';

const ALLOWED_BLOCKS = ['core/heading', 'core/paragraph', 'core/buttons'];
const TEMPLATE = [
    ['core/heading', { level: 2, placeholder: 'Título del banner...', textAlign: 'center' }],
    ['core/paragraph', { placeholder: 'Descripción del banner...', align: 'center' }],
    ['core/buttons', { layout: { type: 'flex', justifyContent: 'center' } }, [
        ['core/button', { text: 'Más información' }]
    ]]
];

const getVideoEmbed = ( url ) => {
    if ( ! url ) return null;

    const youtubeMatch = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if ( youtubeMatch ) {
        return {
            type: 'iframe',
            src: `https://www.youtube.com/embed/${ youtubeMatch[1] }?autoplay=1&mute=1&loop=1&playlist=${ youtubeMatch[1] }&controls=0&showinfo=0&rel=0`,
            label: 'YouTube',
        };
    }

    const vimeoMatch = url.match( /vimeo\.com\/(\d+)/ );
    if ( vimeoMatch ) {
        return {
            type: 'iframe',
            src: `https://player.vimeo.com/video/${ vimeoMatch[1] }?autoplay=1&muted=1&loop=1&background=1`,
            label: 'Vimeo',
        };
    }

    return { type: 'video', src: url, label: 'Video' };
};

const Edit = ( { attributes, setAttributes } ) => {
    const {
        backgroundVideoUrl,
        overlayOpacity,
        minHeight,
    } = attributes;

    const embed = getVideoEmbed( backgroundVideoUrl );

    const blockProps = useBlockProps( {
        className: 'acemar-hero-video alignfull',
        style: { minHeight: `${ minHeight }px`, position: 'relative' },
    } );

    return (
        <>
            <InspectorControls>
                <PanelBody title="Video de fondo" initialOpen={ true }>
                    <TextControl
                        label="URL del video"
                        value={ backgroundVideoUrl }
                        onChange={ ( value ) => setAttributes( { backgroundVideoUrl: value } ) }
                        placeholder="YouTube, Vimeo o URL directa .mp4"
                        help="Soporta YouTube, Vimeo y URLs directas de video"
                    />
                    { backgroundVideoUrl && (
                        <Button
                            onClick={ () => setAttributes( { backgroundVideoUrl: '' } ) }
                            isDestructive
                            variant="link"
                        >
                            Limpiar URL
                        </Button>
                    ) }
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
                        min={ 300 }
                        max={ 1000 }
                        step={ 10 }
                    />
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                <div className={ `acemar-hero-video__editor-bg${ embed ? ' has-video' : '' }` }>
                    { embed ? (
                        <div className="acemar-hero-video__editor-tag">
                            <span className="acemar-hero-video__editor-icon">▶</span>
                            <span className="acemar-hero-video__editor-label">{ embed.label } cargado</span>
                            <span className="acemar-hero-video__editor-url">{ backgroundVideoUrl }</span>
                        </div>
                    ) : (
                        <div className="acemar-hero-video__editor-tag is-empty">
                            <span className="acemar-hero-video__editor-icon">🎬</span>
                            <span className="acemar-hero-video__editor-label">
                                Sin video — pega una URL en el panel lateral
                            </span>
                        </div>
                    ) }
                </div>

                <div
                    className="acemar-hero-video__overlay"
                    style={ { backgroundColor: `rgba(0,0,0,${ overlayOpacity })` } }
                />

                <div className="acemar-hero-video__content">
                    <InnerBlocks
                        allowedBlocks={ ALLOWED_BLOCKS }
                        template={ TEMPLATE }
                        templateLock={ false }
                    />
                </div>
            </div>
        </>
    );
};

const Save = ( { attributes } ) => {
    const {
        backgroundVideoUrl,
        overlayOpacity,
        minHeight,
    } = attributes;

    const embed = getVideoEmbed( backgroundVideoUrl );

    const blockProps = useBlockProps.save( {
        className: 'acemar-hero-video alignfull',
        style: { minHeight: `${ minHeight }px`, position: 'relative' },
    } );

    return (
        <div { ...blockProps }>
            { embed && embed.type === 'iframe' && (
                <iframe
                    className="acemar-hero-video__video"
                    src={ embed.src }
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                />
            ) }
            { embed && embed.type === 'video' && (
                <video
                    className="acemar-hero-video__video"
                    src={ embed.src }
                    autoPlay
                    muted
                    loop
                    playsInline
                />
            ) }
            <div
                className="acemar-hero-video__overlay"
                style={ { backgroundColor: `rgba(0,0,0,${ overlayOpacity })` } }
            />
            <div className="acemar-hero-video__content">
                <InnerBlocks.Content />
            </div>
        </div>
    );
};

registerBlockType( metadata.name, {
    edit: Edit,
    save: Save,
} );