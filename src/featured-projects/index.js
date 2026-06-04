/**
 * BLOQUE CONTENEDOR: Featured Projects
 * Slider de proyectos - Máximo 6
 */

import { registerBlockType } from '@wordpress/blocks';
import {
    InnerBlocks,
    InspectorControls,
    RichText,
    useBlockProps
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

const ALIGN_OPTIONS = [
    { label: 'Izquierda',  value: 'left'    },
    { label: 'Centro',     value: 'center'  },
    { label: 'Derecha',    value: 'right'   },
    { label: 'Justificado', value: 'justify' },
];

const Edit = ({ clientId, attributes, setAttributes }) => {
    const { titleText, titleAlign, descriptionText, descriptionAlign } = attributes;

    const blockProps = useBlockProps({
        className: 'acemar-featured-projects'
    });

    const projectCount = useSelect((select) => {
        const { getBlocksByClientId } = select('core/block-editor');
        const innerBlocks = getBlocksByClientId(clientId)[0]?.innerBlocks || [];
        return innerBlocks.length;
    }, [clientId]);

    const TEMPLATE = [
        ['acemar/project-card', {}],
        ['acemar/project-card', {}],
        ['acemar/project-card', {}]
    ];

    const canAddMore = projectCount < 6;

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Encabezado de sección', 'acemar-blocks')} initialOpen={true}>
                    <SelectControl
                        label={__('Alineación del título', 'acemar-blocks')}
                        value={titleAlign}
                        options={ALIGN_OPTIONS}
                        onChange={(v) => setAttributes({ titleAlign: v })}
                    />
                    <SelectControl
                        label={__('Alineación del párrafo', 'acemar-blocks')}
                        value={descriptionAlign}
                        options={ALIGN_OPTIONS}
                        onChange={(v) => setAttributes({ descriptionAlign: v })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <RichText
                    tagName="h2"
                    value={titleText}
                    onChange={(value) => setAttributes({ titleText: value })}
                    placeholder={__('Título de la sección (opcional)', 'acemar-blocks')}
                    style={{ textAlign: titleAlign }}
                    className="acemar-featured-projects__title"
                    allowedFormats={['core/bold', 'core/italic']}
                />
                <RichText
                    tagName="p"
                    value={descriptionText}
                    onChange={(value) => setAttributes({ descriptionText: value })}
                    placeholder={__('Descripción de la sección (opcional)', 'acemar-blocks')}
                    style={{ textAlign: descriptionAlign }}
                    className="acemar-featured-projects__description"
                    allowedFormats={['core/bold', 'core/italic']}
                />

                <div className="acemar-featured-projects__slider">
                    <div className="acemar-featured-projects__track">
                        <InnerBlocks
                            template={TEMPLATE}
                            allowedBlocks={['acemar/project-card']}
                            templateLock={false}
                            renderAppender={canAddMore ? () => <InnerBlocks.ButtonBlockAppender /> : false}
                        />
                    </div>
                </div>

                {projectCount >= 6 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '15px',
                        background: '#fff3cd',
                        color: '#856404',
                        borderRadius: '6px',
                        marginTop: '15px',
                        fontWeight: '600'
                    }}>
                        ⚠️ Máximo 6 proyectos alcanzado
                    </div>
                )}
            </div>
        </>
    );
};

const Save = ({ attributes }) => {
    const { titleText, titleAlign, descriptionText, descriptionAlign } = attributes;
    const blockProps = useBlockProps.save({
        className: 'acemar-featured-projects'
    });

    return (
        <div {...blockProps}>
            {titleText && (
                <RichText.Content
                    tagName="h2"
                    value={titleText}
                    style={{ textAlign: titleAlign }}
                    className="acemar-featured-projects__title"
                />
            )}
            {descriptionText && (
                <RichText.Content
                    tagName="p"
                    value={descriptionText}
                    style={{ textAlign: descriptionAlign }}
                    className="acemar-featured-projects__description"
                />
            )}

            <button className="acemar-featured-projects__nav acemar-featured-projects__nav--prev acemar-featured-projects__nav--left" aria-label="Anterior">
                ‹
            </button>
            <button className="acemar-featured-projects__nav acemar-featured-projects__nav--next acemar-featured-projects__nav--right" aria-label="Siguiente">
                ›
            </button>

            <div className="acemar-featured-projects__slider">
                <div className="acemar-featured-projects__track">
                    <InnerBlocks.Content />
                </div>
            </div>
        </div>
    );
};

registerBlockType(metadata.name, {
    edit: Edit,
    save: Save,
});
