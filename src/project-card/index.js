/**
 * BLOQUE: Project Card
 * Tarjeta de proyecto con botón configurable
 * Descripción en el panel lateral
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
    TextareaControl,
    ToggleControl 
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

const Edit = ({ attributes, setAttributes }) => {
    const { imageUrl, imageId, imageAlt, projectLink, projectTarget, buttonText, projectDescription } = attributes;
    const blockProps = useBlockProps({
        className: 'acemar-project-card'
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

    // Template: SOLO HEADING (sin párrafo)
    const TEMPLATE = [
        ['core/heading', { 
            level: 4, 
            placeholder: __('Nombre del proyecto', 'acemar-blocks'),
            className: 'acemar-project-card__heading'
        }]
    ];

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Configuración del proyecto', 'acemar-blocks')} initialOpen={true}>
                    <TextareaControl
                        label={__('Descripción del proyecto', 'acemar-blocks')}
                        value={projectDescription}
                        onChange={(value) => setAttributes({ projectDescription: value })}
                        placeholder="Descripción breve del proyecto..."
                        help={__('Esta descripción aparecerá en hover sobre la imagen (desktop)', 'acemar-blocks')}
                        rows={4}
                    />
                    
                    <TextControl
                        label={__('Texto del botón', 'acemar-blocks')}
                        value={buttonText}
                        onChange={(value) => setAttributes({ buttonText: value })}
                        placeholder="VER PROYECTO"
                        help={__('Texto que aparecerá en el botón', 'acemar-blocks')}
                    />
                    
                    <TextControl
                        label={__('URL del proyecto', 'acemar-blocks')}
                        value={projectLink}
                        onChange={(value) => setAttributes({ projectLink: value })}
                        placeholder="https://ejemplo.com/proyecto o /mi-pagina"
                        help={__('URL externa (https://) o interna (/pagina)', 'acemar-blocks')}
                    />
                    
                    <ToggleControl
                        label={__('Abrir en nueva pestaña', 'acemar-blocks')}
                        checked={projectTarget === '_blank'}
                        onChange={(value) => 
                            setAttributes({ projectTarget: value ? '_blank' : '_self' })
                        }
                        help={__('Recomendado para links externos', 'acemar-blocks')}
                    />
                    
                    {projectLink && (
                        <div style={{
                            marginTop: '15px',
                            padding: '12px',
                            background: '#f0f0f0',
                            borderRadius: '4px',
                            fontSize: '12px',
                            borderLeft: '3px solid #D4AF37'
                        }}>
                            <strong>✓ Configuración activa:</strong>
                            <div style={{ marginTop: '8px' }}>
                                <strong>Botón:</strong> {buttonText || 'VER PROYECTO'}
                            </div>
                            <div style={{ marginTop: '4px' }}>
                                <strong>Link:</strong> <span style={{ wordBreak: 'break-all' }}>{projectLink}</span>
                            </div>
                            <div style={{ marginTop: '4px' }}>
                                <strong>Abre en:</strong> {projectTarget === '_blank' ? 'Nueva pestaña' : 'Misma pestaña'}
                            </div>
                        </div>
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="acemar-project-card__image-wrapper">
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectImage}
                            allowedTypes={['image']}
                            value={imageId}
                            render={({ open }) => (
                                <>
                                    {imageUrl ? (
                                        <div className="acemar-project-card__image-container">
                                            <img 
                                                src={imageUrl} 
                                                alt={imageAlt}
                                                className="acemar-project-card__image"
                                            />
                                            <div className="acemar-project-card__image-actions">
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
                                            
                                            {/* Descripción VISIBLE en el editor (desde el atributo) */}
                                            {projectDescription && (
                                                <div className="acemar-project-card__description-preview">
                                                    {projectDescription}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Button 
                                            onClick={open}
                                            variant="secondary"
                                            className="acemar-project-card__upload-button"
                                        >
                                            {__('Seleccionar imagen', 'acemar-blocks')}
                                        </Button>
                                    )}
                                </>
                            )}
                        />
                    </MediaUploadCheck>
                    
                    {/* Botón */}
                    <div className="acemar-project-card__button-wrapper">
                        <span className="acemar-project-card__button">
                            {buttonText || 'VER PROYECTO'}
                        </span>
                    </div>
                </div>

                <div className="acemar-project-card__content">
                    <InnerBlocks
                        template={TEMPLATE}
                        templateLock="all"
                    />
                </div>

                {projectLink && (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: '#D4AF37',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        zIndex: 10
                    }}>
                        🔗 Link activo
                    </div>
                )}
            </div>
        </>
    );
};

const Save = ({ attributes }) => {
    const { imageUrl, imageAlt, projectLink, projectTarget, buttonText, projectDescription } = attributes;
    const blockProps = useBlockProps.save({
        className: 'acemar-project-card'
    });

    const content = (
        <>
            {imageUrl && (
                <div className="acemar-project-card__image-wrapper">
                    <img 
                        src={imageUrl} 
                        alt={imageAlt}
                        className="acemar-project-card__image"
                    />
                    
                    {/* Descripción en el frontend */}
                    {projectDescription && (
                        <div className="acemar-project-card__description">
                            {projectDescription}
                        </div>
                    )}
                    
                    {/* Botón */}
                    <div className="acemar-project-card__button-wrapper">
                        <span className="acemar-project-card__button">
                            {buttonText || 'VER PROYECTO'}
                        </span>
                    </div>
                </div>
            )}
            
            <div className="acemar-project-card__content">
                <InnerBlocks.Content />
            </div>
        </>
    );

    // Si hay link, envolver en <a>
    if (projectLink) {
        return (
            <a 
                {...blockProps}
                href={projectLink}
                target={projectTarget}
                rel={projectTarget === '_blank' ? 'noopener noreferrer' : undefined}
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