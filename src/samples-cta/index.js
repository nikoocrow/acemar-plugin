/**
 * BLOQUE: Samples CTA
 * Call to Action para solicitar muestras
 */

import { registerBlockType } from '@wordpress/blocks';
import { 
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    RichText,
    useBlockProps,
    URLInput
} from '@wordpress/block-editor';
import { 
    PanelBody,
    Button,
    TextControl,
    ToggleControl,
    ColorPicker
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

const Edit = ({ attributes, setAttributes }) => {
    const {
        imageUrl,
        imageId,
        imageAlt,
        title,
        content,
        buttonText,
        buttonUrl,
        buttonTarget,
        backgroundColor,
        imagePosition
    } = attributes;

const blockProps = useBlockProps({
    className: `acemar-samples-cta ${imagePosition === 'right' ? 'acemar-samples-cta--reverse' : ''}`,
    style: { backgroundColor }
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

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Configuración del Botón', 'acemar-blocks')} initialOpen={true}>
                    <TextControl
                        label={__('Texto del botón', 'acemar-blocks')}
                        value={buttonText}
                        onChange={(value) => setAttributes({ buttonText: value })}
                        help={__('Texto que aparecerá en el botón', 'acemar-blocks')}
                    />
                    
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                            {__('URL del botón', 'acemar-blocks')}
                        </label>
                        <URLInput
                            value={buttonUrl}
                            onChange={(value) => setAttributes({ buttonUrl: value })}
                            placeholder="https://ejemplo.com o /pagina"
                        />
                    </div>
                    
                    <ToggleControl
                        label={__('Abrir en nueva pestaña', 'acemar-blocks')}
                        checked={buttonTarget === '_blank'}
                        onChange={(value) => 
                            setAttributes({ buttonTarget: value ? '_blank' : '_self' })
                        }
                    />
                </PanelBody>

              <PanelBody title={__('Apariencia', 'acemar-blocks')} initialOpen={false}>
    <p style={{ marginBottom: '8px', fontWeight: '600' }}>
        {__('Color de fondo', 'acemar-blocks')}
    </p>
    <ColorPicker
        color={backgroundColor}
        onChangeComplete={(color) => setAttributes({ backgroundColor: color.hex })}
    />
    
    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
        <p style={{ marginBottom: '12px', fontWeight: '600' }}>
            {__('Posición de la imagen', 'acemar-blocks')}
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
            <Button
                variant={imagePosition === 'left' ? 'primary' : 'secondary'}
                onClick={() => setAttributes({ imagePosition: 'left' })}
            >
                {__('Izquierda', 'acemar-blocks')}
            </Button>
            <Button
                variant={imagePosition === 'right' ? 'primary' : 'secondary'}
                onClick={() => setAttributes({ imagePosition: 'right' })}
            >
                {__('Derecha', 'acemar-blocks')}
            </Button>
        </div>
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#757575' }}>
            {imagePosition === 'left' 
                ? __('Imagen a la izquierda, contenido a la derecha', 'acemar-blocks')
                : __('Contenido a la izquierda, imagen a la derecha', 'acemar-blocks')
            }
        </p>
    </div>
</PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="acemar-samples-cta__container">
                    {/* Imagen */}
                    <div className="acemar-samples-cta__image">
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={onSelectImage}
                                allowedTypes={['image']}
                                value={imageId}
                                render={({ open }) => (
                                    <>
                                        {imageUrl ? (
                                            <div className="acemar-samples-cta__image-wrapper">
                                                <img 
                                                    src={imageUrl} 
                                                    alt={imageAlt}
                                                />
                                                <div className="acemar-samples-cta__image-actions">
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
                                                className="acemar-samples-cta__upload-button"
                                            >
                                                {__('+ Seleccionar imagen', 'acemar-blocks')}
                                            </Button>
                                        )}
                                    </>
                                )}
                            />
                        </MediaUploadCheck>
                    </div>

                    {/* Contenido */}
                    <div className="acemar-samples-cta__content">
                    <RichText
                            tagName="h4"
                            value={title}
                            onChange={(value) => setAttributes({ title: value })}
                            placeholder={__('SOLICITAR MUESTRA', 'acemar-blocks')}
                            className="acemar-samples-cta__title"
                        />

                        <RichText
                            tagName="div"
                            multiline="p"
                            value={content}
                            onChange={(value) => setAttributes({ content: value })}
                            placeholder={__('Escriba aquí el contenido...', 'acemar-blocks')}
                            className="acemar-samples-cta__text"
                        />

                        <div className="acemar-samples-cta__button-wrapper">
                            <span className="acemar-samples-cta__button">
                                {buttonText || 'SOLICITE SU MUESTRA'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
const Save = ({ attributes }) => {
    const {
        imageUrl,
        imageAlt,
        title,
        content,
        buttonText,
        buttonUrl,
        buttonTarget,
        backgroundColor,
        imagePosition
    } = attributes;

    const blockProps = useBlockProps.save({
        className: `acemar-samples-cta ${imagePosition === 'right' ? 'acemar-samples-cta--reverse' : ''}`,
        style: { backgroundColor }
    });
    return (
        <div {...blockProps}>
            <div className="acemar-samples-cta__container">
                {/* Imagen */}
                {imageUrl && (
                    <div className="acemar-samples-cta__image">
                        <div className="acemar-samples-cta__image-wrapper">
                            <img src={imageUrl} alt={imageAlt} />
                        </div>
                    </div>
                )}

                {/* Contenido */}
                <div className="acemar-samples-cta__content">
                 {title && (
                        <RichText.Content
                            tagName="h4"
                            value={title}
                            className="acemar-samples-cta__title"
                        />
                    )}

                    {content && (
                        <RichText.Content
                            tagName="div"
                            value={content}
                            className="acemar-samples-cta__text"
                        />
                    )}

                    {buttonUrl && (
                        <div className="acemar-samples-cta__button-wrapper">
                            <a 
                                href={buttonUrl}
                                className="acemar-samples-cta__button"
                                target={buttonTarget}
                                rel={buttonTarget === '_blank' ? 'noopener noreferrer' : undefined}
                            >
                                {buttonText || 'SOLICITE SU MUESTRA'}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

registerBlockType(metadata.name, {
    edit: Edit,
    save: Save,
});