/**
 * BLOQUE: Hero Banner
 * Banner con imagen de fondo, contenido centrado y link en botón
 */

import { registerBlockType } from '@wordpress/blocks';
import { 
    InnerBlocks,
    MediaUpload,
    MediaUploadCheck,
    InspectorControls,
    useBlockProps 
} from '@wordpress/block-editor';
import { 
    Button,
    PanelBody,
    RangeControl,
    TextControl,
    ToggleControl
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

/**
 * EDIT: Editor
 */
const Edit = ({ attributes, setAttributes }) => {
    const { 
        backgroundImageUrl, 
        backgroundImageId, 
        overlayOpacity, 
        minHeight,
        buttonLink,
        buttonTarget
    } = attributes;
    
    const blockProps = useBlockProps({
        className: 'acemar-hero-banner',
        style: {
            backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
            minHeight: `${minHeight}px`
        }
    });

    const onSelectImage = (media) => {
        setAttributes({
            backgroundImageUrl: media.url,
            backgroundImageId: media.id
        });
    };

    const onRemoveImage = () => {
        setAttributes({
            backgroundImageUrl: '',
            backgroundImageId: 0
        });
    };

    // Template: Heading + Paragraph + Button
    const TEMPLATE = [
        ['core/heading', {
            level: 2,
            placeholder: __('Título del banner...', 'acemar-blocks'),
            textAlign: 'center',
            style: {
                color: { text: '#ffffff' },
                typography: { fontSize: '48px' }
            }
        }],
        ['core/paragraph', {
            placeholder: __('Descripción...', 'acemar-blocks'),
            align: 'center',
            style: {
                color: { text: '#ffffff' }
            }
        }],
        ['core/buttons', {
            layout: { type: 'flex', justifyContent: 'center' }
        }, [
            ['core/button', {
                text: __('LEER ARTÍCULO', 'acemar-blocks'),
                style: {
                    color: { background: 'transparent', text: '#ffffff' },
                    border: { color: '#D4AF37', width: '2px' }
                }
            }]
        ]]
    ];

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Configuración de imagen', 'acemar-blocks')} initialOpen={true}>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectImage}
                            allowedTypes={['image']}
                            value={backgroundImageId}
                            render={({ open }) => (
                                <div style={{ marginBottom: '15px' }}>
                                    {backgroundImageUrl ? (
                                        <>
                                            <img 
                                                src={backgroundImageUrl}
                                                alt="Preview"
                                                style={{ 
                                                    width: '100%', 
                                                    height: 'auto',
                                                    borderRadius: '4px',
                                                    marginBottom: '10px'
                                                }}
                                            />
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Button onClick={open} variant="secondary">
                                                    {__('Cambiar imagen', 'acemar-blocks')}
                                                </Button>
                                                <Button onClick={onRemoveImage} variant="secondary" isDestructive>
                                                    {__('Remover', 'acemar-blocks')}
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <Button onClick={open} variant="primary">
                                            {__('Seleccionar imagen de fondo', 'acemar-blocks')}
                                        </Button>
                                    )}
                                </div>
                            )}
                        />
                    </MediaUploadCheck>

                    <RangeControl
                        label={__('Opacidad del overlay', 'acemar-blocks')}
                        value={overlayOpacity}
                        onChange={(value) => setAttributes({ overlayOpacity: value })}
                        min={0}
                        max={1}
                        step={0.1}
                    />

                    <RangeControl
                        label={__('Altura mínima (px)', 'acemar-blocks')}
                        value={minHeight}
                        onChange={(value) => setAttributes({ minHeight: value })}
                        min={300}
                        max={800}
                        step={50}
                    />
                </PanelBody>

                <PanelBody title={__('Configuración del botón', 'acemar-blocks')} initialOpen={true}>
                    <TextControl
                        label={__('URL del enlace', 'acemar-blocks')}
                        value={buttonLink}
                        onChange={(value) => setAttributes({ buttonLink: value })}
                        placeholder="https://ejemplo.com"
                        help={__('URL a la que llevará el botón al hacer clic', 'acemar-blocks')}
                    />
                    
                    <ToggleControl
                        label={__('Abrir en nueva pestaña', 'acemar-blocks')}
                        checked={buttonTarget === '_blank'}
                        onChange={(value) => 
                            setAttributes({ buttonTarget: value ? '_blank' : '_self' })
                        }
                    />

                    {buttonLink && (
                        <div style={{
                            marginTop: '10px',
                            padding: '10px',
                            background: '#f0f0f0',
                            borderRadius: '4px',
                            fontSize: '12px'
                        }}>
                            <strong>✓ Link activo:</strong><br />
                            <span style={{ wordBreak: 'break-all' }}>{buttonLink}</span>
                        </div>
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div 
                    className="acemar-hero-banner__overlay"
                    style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
                />
                <div className="acemar-hero-banner__content">
                    <InnerBlocks
                        template={TEMPLATE}
                        templateLock={false}
                    />
                    
                    {buttonLink && (
                        <div style={{
                            position: 'absolute',
                            bottom: '10px',
                            left: '10px',
                            background: '#D4AF37',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            zIndex: 10
                        }}>
                            🔗 Botón con link activo
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

/**
 * SAVE: Frontend - con link funcional en el botón
 */
const Save = ({ attributes }) => {
    const { 
        backgroundImageUrl, 
        overlayOpacity, 
        minHeight,
        buttonLink,
        buttonTarget
    } = attributes;
    
    const blockProps = useBlockProps.save({
        className: 'acemar-hero-banner',
        style: {
            backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
            minHeight: `${minHeight}px`
        }
    });

    return (
        <div {...blockProps}>
            <div 
                className="acemar-hero-banner__overlay"
                style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
            />
            <div 
                className="acemar-hero-banner__content"
                data-button-link={buttonLink}
                data-button-target={buttonTarget}
            >
                <InnerBlocks.Content />
            </div>
        </div>
    );
};

registerBlockType(metadata.name, {
    edit: Edit,
    save: Save,
});