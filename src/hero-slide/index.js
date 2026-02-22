import { registerBlockType } from '@wordpress/blocks';
import { 
    InnerBlocks,
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    BlockControls,
    AlignmentToolbar,
    useBlockProps
} from '@wordpress/block-editor';
import { 
    PanelBody,
    Button
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

// Template sugerido pero NO bloqueado
const TEMPLATE = [
    ['core/heading', { 
        level: 1, 
        placeholder: __('Título del slide', 'acemar-blocks'),
        className: 'hero-slide__title'
    }],
    ['core/paragraph', { 
        placeholder: __('Descripción del slide...', 'acemar-blocks'),
        className: 'hero-slide__description'
    }],
    ['core/buttons', {}, [
        ['core/button', { 
            text: __('Más información', 'acemar-blocks'),
            className: 'hero-slide__button'
        }]
    ]]
];

const Edit = ({ attributes, setAttributes }) => {
    const {
        imageUrl,
        imageId,
        imageAlt,
        contentAlignment
    } = attributes;

    const blockProps = useBlockProps({
        className: `acemar-hero-slide align-${contentAlignment}`,
        style: imageUrl ? {
            backgroundImage: `url(${imageUrl})`
        } : {}
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
            <BlockControls>
                <AlignmentToolbar
                    value={contentAlignment}
                    onChange={(value) => setAttributes({ contentAlignment: value || 'center' })}
                />
            </BlockControls>

            <InspectorControls>
                <PanelBody title={__('Imagen de fondo', 'acemar-blocks')} initialOpen={true}>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectImage}
                            allowedTypes={['image']}
                            value={imageId}
                            render={({ open }) => (
                                <>
                                    {imageUrl ? (
                                        <div style={{ marginBottom: '15px' }}>
                                            <img 
                                                src={imageUrl} 
                                                alt={imageAlt}
                                                style={{ 
                                                    width: '100%', 
                                                    height: 'auto',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                            <div style={{ 
                                                display: 'flex', 
                                                gap: '10px', 
                                                marginTop: '10px' 
                                            }}>
                                                <Button 
                                                    onClick={open}
                                                    variant="secondary"
                                                    style={{ flex: 1 }}
                                                >
                                                    {__('Cambiar', 'acemar-blocks')}
                                                </Button>
                                                <Button 
                                                    onClick={onRemoveImage}
                                                    variant="secondary"
                                                    isDestructive
                                                    style={{ flex: 1 }}
                                                >
                                                    {__('Remover', 'acemar-blocks')}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button 
                                            onClick={open}
                                            variant="secondary"
                                            style={{ width: '100%' }}
                                        >
                                            {__('Seleccionar imagen', 'acemar-blocks')}
                                        </Button>
                                    )}
                                </>
                            )}
                        />
                    </MediaUploadCheck>
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
    <div className="acemar-hero-slide__overlay"></div>
    <div className="acemar-hero-slide__content">
        <InnerBlocks 
            template={TEMPLATE}
            templateLock={false}
        />
    </div>
</div>
        </>
    );
};

const Save = ({ attributes }) => {
    const {
        imageUrl,
        imageAlt,
        contentAlignment
    } = attributes;

    const blockProps = useBlockProps.save({
        className: `acemar-hero-slide splide__slide align-${contentAlignment}`,
        style: imageUrl ? {
            backgroundImage: `url(${imageUrl})`
        } : {}
    });

    return (
        <div {...blockProps}>
            <div className="acemar-hero-slide__overlay"></div>
            <div className="acemar-hero-slide__content">
                <InnerBlocks.Content />
            </div>
        </div>
    );
};

registerBlockType(metadata.name, {
    edit: Edit,
    save: Save,
});