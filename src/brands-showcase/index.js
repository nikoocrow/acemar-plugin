/**
 * BLOQUE: Brands Showcase
 * Muestra logos de marcas con efecto marquee
 */

import { registerBlockType } from '@wordpress/blocks';
import { 
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    RichText,
    useBlockProps
} from '@wordpress/block-editor';
import { 
    PanelBody,
    Button,
    ToggleControl,
    RangeControl,
    ColorPicker
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

const Edit = ({ attributes, setAttributes }) => {
    const {
        title,
        logos,
        enableMarquee,
        direction,
        speed,
        backgroundColor
    } = attributes;

    const blockProps = useBlockProps({
        className: 'acemar-brands-showcase',
        style: { backgroundColor }
    });

    const onSelectLogos = (media) => {
        // Limitar a 15 logos
        const newLogos = media.slice(0, 15).map(item => ({
            id: item.id,
            url: item.url,
            alt: item.alt || ''
        }));
        setAttributes({ logos: newLogos });
    };

    const removeLogo = (index) => {
        const newLogos = [...logos];
        newLogos.splice(index, 1);
        setAttributes({ logos: newLogos });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Configuración de logos', 'acemar-blocks')} initialOpen={true}>
                    <p style={{ marginBottom: '12px', fontWeight: '600' }}>
                        {__('Logos cargados:', 'acemar-blocks')} {logos.length}/15
                    </p>
                    
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectLogos}
                            allowedTypes={['image']}
                            multiple={true}
                            gallery={true}
                            value={logos.map(logo => logo.id)}
                            render={({ open }) => (
                                <Button 
                                    onClick={open}
                                    variant="secondary"
                                    style={{ marginBottom: '15px', width: '100%' }}
                                >
                                    {logos.length > 0 
                                        ? __('Cambiar logos', 'acemar-blocks')
                                        : __('Seleccionar logos', 'acemar-blocks')
                                    }
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>

                    {logos.length > 0 && (
                        <Button 
                            onClick={() => setAttributes({ logos: [] })}
                            variant="secondary"
                            isDestructive
                            style={{ width: '100%' }}
                        >
                            {__('Remover todos', 'acemar-blocks')}
                        </Button>
                    )}
                </PanelBody>

                <PanelBody title={__('Animación', 'acemar-blocks')} initialOpen={true}>
                    <ToggleControl
                        label={__('Activar marquee', 'acemar-blocks')}
                        checked={enableMarquee}
                        onChange={(value) => setAttributes({ enableMarquee: value })}
                        help={enableMarquee 
                            ? __('Los logos se moverán automáticamente', 'acemar-blocks')
                            : __('Los logos estarán estáticos', 'acemar-blocks')
                        }
                    />

                    {enableMarquee && (
                        <>
                            <div style={{ marginTop: '20px' }}>
                                <p style={{ marginBottom: '12px', fontWeight: '600' }}>
                                    {__('Dirección', 'acemar-blocks')}
                                </p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Button
                                        variant={direction === 'left' ? 'primary' : 'secondary'}
                                        onClick={() => setAttributes({ direction: 'left' })}
                                    >
                                        ← {__('Izquierda', 'acemar-blocks')}
                                    </Button>
                                    <Button
                                        variant={direction === 'right' ? 'primary' : 'secondary'}
                                        onClick={() => setAttributes({ direction: 'right' })}
                                    >
                                        {__('Derecha', 'acemar-blocks')} →
                                    </Button>
                                </div>
                            </div>

                            <RangeControl
                                label={__('Velocidad', 'acemar-blocks')}
                                value={speed}
                                onChange={(value) => setAttributes({ speed: value })}
                                min={10}
                                max={60}
                                help={__('Segundos para completar un ciclo', 'acemar-blocks')}
                            />
                        </>
                    )}
                </PanelBody>

                <PanelBody title={__('Apariencia', 'acemar-blocks')} initialOpen={false}>
                    <p style={{ marginBottom: '8px', fontWeight: '600' }}>
                        {__('Color de fondo', 'acemar-blocks')}
                    </p>
                    <ColorPicker
                        color={backgroundColor}
                        onChangeComplete={(color) => setAttributes({ backgroundColor: color.hex })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {/* Título */}
                <div className="acemar-brands-showcase__header">
                    <RichText
                        tagName="h2"
                        value={title}
                        onChange={(value) => setAttributes({ title: value })}
                        placeholder={__('Nuestras marcas', 'acemar-blocks')}
                        className="acemar-brands-showcase__title"
                    />
                </div>

                {/* Logos */}
                {logos.length > 0 ? (
                    <div className="acemar-brands-showcase__container">
                        <div className={`acemar-brands-showcase__track ${enableMarquee ? 'is-animated' : ''}`}>
                            {logos.map((logo, index) => (
                                <div key={logo.id} className="acemar-brands-showcase__logo">
                                    <img src={logo.url} alt={logo.alt} />
                                    <Button
                                        onClick={() => removeLogo(index)}
                                        className="acemar-brands-showcase__remove"
                                        isSmall
                                        isDestructive
                                    >
                                        ×
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="acemar-brands-showcase__placeholder">
                        <p>{__('Selecciona logos desde el panel lateral →', 'acemar-blocks')}</p>
                    </div>
                )}

                {/* Info de estado */}
                {logos.length > 0 && (
                    <div style={{
                        marginTop: '15px',
                        padding: '10px',
                        background: '#f0f0f0',
                        borderRadius: '4px',
                        fontSize: '12px',
                        textAlign: 'center'
                    }}>
                        <strong>{logos.length} logos</strong> • 
                        {enableMarquee 
                            ? ` Animado ${direction === 'left' ? '←' : '→'} • ${speed}s`
                            : ' Estático'
                        }
                    </div>
                )}
            </div>
        </>
    );
};


const Save = ({ attributes }) => {
    const {
        title,
        logos,
        enableMarquee,
        direction,
        speed,
        backgroundColor
    } = attributes;

    const blockProps = useBlockProps.save({
        className: 'acemar-brands-showcase',
        style: { backgroundColor }
    });

    
// Duplicar logos múltiples veces para efecto infinito suave
// Si hay pocos logos, duplicarlos más veces
const duplications = logos.length < 5 ? 4 : 2;
const displayLogos = enableMarquee 
    ? Array(duplications).fill(logos).flat() 
    : logos;

    return (
        <div {...blockProps}>
            {/* Título */}
            {title && (
                <div className="acemar-brands-showcase__header">
                    <RichText.Content
                        tagName="h2"
                        value={title}
                        className="acemar-brands-showcase__title"
                    />
                </div>
            )}

            {/* Logos */}
            {logos.length > 0 && (
                <div className="acemar-brands-showcase__container">
                    <div 
                        className={`acemar-brands-showcase__track ${enableMarquee ? 'is-animated' : ''}`}
                        data-direction={direction}
                        data-speed={speed}
                        style={enableMarquee ? {
                            animationDuration: `${speed}s`,
                            animationDirection: direction === 'right' ? 'reverse' : 'normal'
                        } : {}}
                    >
                        {displayLogos.map((logo, index) => (
                            <div key={`${logo.id}-${index}`} className="acemar-brands-showcase__logo">
                                <img src={logo.url} alt={logo.alt} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

registerBlockType(metadata.name, {
    edit: Edit,
    save: Save,
});