/**
 * BLOQUE CONTENEDOR: Featured Projects
 * Slider de proyectos - Máximo 6
 */

import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

const Edit = ({ clientId }) => {
    const blockProps = useBlockProps({
        className: 'acemar-featured-projects'
    });

    // Contar proyectos
    const projectCount = useSelect((select) => {
        const { getBlocksByClientId } = select('core/block-editor');
        const innerBlocks = getBlocksByClientId(clientId)[0]?.innerBlocks || [];
        return innerBlocks.length;
    }, [clientId]);

    // Template: 3 proyectos iniciales
    const TEMPLATE = [
        ['acemar/project-card', {}],
        ['acemar/project-card', {}],
        ['acemar/project-card', {}]
    ];

    const canAddMore = projectCount < 6;

    return (
        <div {...blockProps}>
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
    );
};

const Save = () => {
    const blockProps = useBlockProps.save({
        className: 'acemar-featured-projects'
    });

    return (
        <div {...blockProps}>
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