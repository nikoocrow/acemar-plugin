/**
 * BLOQUE: Hero Slider
 * Slider hero con Splide.js
 */

import { registerBlockType } from '@wordpress/blocks';
import { 
    InnerBlocks,
    InspectorControls,
    useBlockProps,
    useInnerBlocksProps
} from '@wordpress/block-editor';
import { 
    PanelBody,
    ToggleControl,
    RangeControl,
    Button
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

const ALLOWED_BLOCKS = ['acemar-blocks/hero-slide'];
const MAX_SLIDES = 7;

const TEMPLATE = [
    ['acemar-blocks/hero-slide', {}],
];

const Edit = ({ attributes, setAttributes, clientId }) => {
    const {
        autoplay,
        interval,
        height
    } = attributes;

    const [currentSlide, setCurrentSlide] = React.useState(0);

    const { innerBlocks } = useSelect(
        (select) => ({
            innerBlocks: select('core/block-editor').getBlocks(clientId),
        }),
        [clientId]
    );

    const { insertBlock, selectBlock } = useDispatch('core/block-editor');

    const blockProps = useBlockProps({
        className: 'acemar-hero-slider',
        style: { minHeight: `${height}vh` }
    });

    const innerBlocksProps = useInnerBlocksProps(
        { className: 'acemar-hero-slider__slides' },
        {
            allowedBlocks: ALLOWED_BLOCKS,
            template: TEMPLATE,
            renderAppender: false,
        }
    );

    const addSlide = () => {
        if (innerBlocks.length >= MAX_SLIDES) {
            alert(__(`Máximo ${MAX_SLIDES} slides permitidos`, 'acemar-blocks'));
            return;
        }

        const newBlock = wp.blocks.createBlock('acemar-blocks/hero-slide');
        insertBlock(newBlock, innerBlocks.length, clientId);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
        if (innerBlocks[index]) {
            selectBlock(innerBlocks[index].clientId);
        }
    };

    const nextSlide = () => {
        const next = (currentSlide + 1) % innerBlocks.length;
        goToSlide(next);
    };

    const prevSlide = () => {
        const prev = currentSlide === 0 ? innerBlocks.length - 1 : currentSlide - 1;
        goToSlide(prev);
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Configuración del Slider', 'acemar-blocks')} initialOpen={true}>
                    <RangeControl
                        label={__('Altura del Hero', 'acemar-blocks')}
                        value={height}
                        onChange={(value) => setAttributes({ height: value })}
                        min={50}
                        max={100}
                        step={5}
                        help={__(`Altura actual: ${height}vh`, 'acemar-blocks')}
                        marks={[
                            { value: 50, label: '50vh' },
                            { value: 70, label: '70vh' },
                            { value: 100, label: '100vh' }
                        ]}
                    />

                    <ToggleControl
                        label={__('Autoplay', 'acemar-blocks')}
                        checked={autoplay}
                        onChange={(value) => setAttributes({ autoplay: value })}
                    />

                    {autoplay && (
                        <RangeControl
                            label={__('Intervalo (ms)', 'acemar-blocks')}
                            value={interval}
                            onChange={(value) => setAttributes({ interval: value })}
                            min={2000}
                            max={10000}
                            step={500}
                            help={__('Tiempo entre slides', 'acemar-blocks')}
                        />
                    )}

                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
                        <p style={{ fontWeight: '600', marginBottom: '10px' }}>
                            {__('Slides:', 'acemar-blocks')} {innerBlocks.length}/{MAX_SLIDES}
                        </p>
                        <Button
                            variant="primary"
                            onClick={addSlide}
                            disabled={innerBlocks.length >= MAX_SLIDES}
                            style={{ width: '100%' }}
                        >
                            {__('+ Agregar Slide', 'acemar-blocks')}
                        </Button>
                    </div>
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="acemar-hero-slider__editor-header">
                    <div className="header-content">
                        <span className="header-title">
                            Hero Slider • {innerBlocks.length} {innerBlocks.length === 1 ? 'slide' : 'slides'}
                        </span>
                        
                        {innerBlocks.length > 1 && (
                            <div className="slide-navigation">
                                <button 
                                    className="nav-button prev"
                                    onClick={prevSlide}
                                    aria-label="Slide anterior"
                                >
                                    ‹
                                </button>
                                
                                <div className="slide-dots">
                                    {innerBlocks.map((block, index) => (
                                        <button
                                            key={block.clientId}
                                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                                            onClick={() => goToSlide(index)}
                                            aria-label={`Ir a slide ${index + 1}`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                                
                                <button 
                                    className="nav-button next"
                                    onClick={nextSlide}
                                    aria-label="Siguiente slide"
                                >
                                    ›
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="acemar-hero-slider__editor-slides">
                    <div {...innerBlocksProps} style={{ transform: `translateX(-${currentSlide * 100}%)` }} />
                </div>
            </div>
        </>
    );
};

const Save = ({ attributes }) => {
    const {
        autoplay,
        interval,
        height
    } = attributes;

    const blockProps = useBlockProps.save({
        className: 'acemar-hero-slider',
        style: { minHeight: `${height}vh` }
    });

    return (
        <div {...blockProps}>
            <div 
                className="splide acemar-hero-slider__splide"
                data-autoplay={autoplay}
                data-interval={interval}
            >
                <div className="splide__track">
                    <div className="splide__list">
                        <InnerBlocks.Content />
                    </div>
                </div>
            </div>
        </div>
    );
};

registerBlockType(metadata.name, {
    edit: Edit,
    save: Save,
});
