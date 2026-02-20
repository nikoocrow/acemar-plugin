/**
 * BLOQUE HIJO: Product Card
 * Con campo de link en el panel lateral
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
    TextControl,
    ToggleControl 
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

/**
 * EDIT: Editor del bloque de tarjeta
 */
const Edit = ({ attributes, setAttributes }) => {
    const { imageUrl, imageId, imageAlt, linkUrl, linkTarget } = attributes;
    const blockProps = useBlockProps({
        className: 'acemar-product-card'
    });

    const onSelectImage = (media) => {
        setAttributes({
            imageUrl: media.url,
            imageId: media.id,
            imageAlt: media.alt || ''
        });
    };

    const onRemoveImage = () => {
        setAttributes({
            imageUrl: '',
            imageId: 0,
            imageAlt: ''
        });
    };

    const TEMPLATE = [
        ['core/heading', { 
            level: 3, 
            placeholder: __('Título del producto (máx. 40 caracteres)', 'acemar-blocks'),
            className: 'acemar-product-card__heading'
        }],
        ['core/paragraph', { 
            placeholder: __('Descripción breve (máx. 80 caracteres)', 'acemar-blocks'),
            className: 'acemar-product-card__description'
        }]
    ];

    return (
        <>
            {/* Panel de configuración en la barra lateral */}
            <InspectorControls>
                <PanelBody title={__('Configuración del enlace', 'acemar-blocks')} initialOpen={true}>
                    <TextControl
                        label={__('URL del enlace', 'acemar-blocks')}
                        value={linkUrl}
                        onChange={(value) => setAttributes({ linkUrl: value })}
                        placeholder="https://ejemplo.com"
                        help={__('URL a la que llevará la tarjeta al hacer clic', 'acemar-blocks')}
                    />
                    <ToggleControl
                        label={__('Abrir en nueva pestaña', 'acemar-blocks')}
                        checked={linkTarget === '_blank'}
                        onChange={(value) => 
                            setAttributes({ linkTarget: value ? '_blank' : '_self' })
                        }
                    />
                    {linkUrl && (
                        <div style={{
                            marginTop: '10px',
                            padding: '10px',
                            background: '#f0f0f0',
                            borderRadius: '4px',
                            fontSize: '12px'
                        }}>
                            <strong>✓ Link activo:</strong><br />
                            <span style={{ wordBreak: 'break-all' }}>{linkUrl}</span>
                        </div>
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="acemar-product-card__image-wrapper">
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectImage}
                            allowedTypes={['image']}
                            value={imageId}
                            render={({ open }) => (
                                <>
                                    {imageUrl ? (
                                        <div className="acemar-product-card__image-container">
                                            <img 
                                                src={imageUrl} 
                                                alt={imageAlt}
                                                className="acemar-product-card__image"
                                            />
                                            <div className="acemar-product-card__image-actions">
                                                <Button 
                                                    onClick={open}
                                                    variant="secondary"
                                                    isSmall
                                                >
                                                    {__('Cambiar', 'acemar-blocks')}
                                                </Button>
                                                <Button 
                                                    onClick={onRemoveImage}
                                                    variant="secondary"
                                                    isDestructive
                                                    isSmall
                                                >
                                                    {__('Remover', 'acemar-blocks')}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button 
                                            onClick={open}
                                            variant="secondary"
                                            className="acemar-product-card__upload-button"
                                        >
                                            {__('Seleccionar imagen', 'acemar-blocks')}
                                        </Button>
                                    )}
                                </>
                            )}
                        />
                    </MediaUploadCheck>
                </div>

                <div className="acemar-product-card__content">
                    <InnerBlocks
                        template={TEMPLATE}
                        templateLock="all"
                    />
                </div>

                {linkUrl && (
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
                        🔗 Link activo
                    </div>
                )}
            </div>
        </>
    );
};

/**
 * SAVE: HTML del frontend con link
 */
const Save = ({ attributes }) => {
    const { imageUrl, imageAlt, linkUrl, linkTarget } = attributes;
    const blockProps = useBlockProps.save({
        className: 'acemar-product-card'
    });

    const content = (
        <>
            {imageUrl && (
                <div className="acemar-product-card__image-wrapper">
                    <img 
                        src={imageUrl} 
                        alt={imageAlt}
                        className="acemar-product-card__image"
                    />
                </div>
            )}
            
            <div className="acemar-product-card__content">
                <InnerBlocks.Content />
            </div>
        </>
    );

    // Si hay link, envolver en <a>, si no, solo el <div>
    if (linkUrl) {
        return (
            <a 
                {...blockProps}
                href={linkUrl}
                target={linkTarget}
                rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
                {content}
            </a>
        );
    }

    return <div {...blockProps}>{content}</div>;
};

registerBlockType(metadata.name, {
    edit: Edit,
    save: Save,
});