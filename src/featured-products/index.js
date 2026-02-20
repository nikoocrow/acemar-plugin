/**
 * BLOQUE CONTENEDOR: Featured Products
 * Máximo 6 tarjetas
 */

import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

/**
 * EDIT: Lo que ve el usuario en el editor
 */
const Edit = ({ clientId }) => {
    const blockProps = useBlockProps({
        className: 'acemar-featured-products'
    });

    // Contar cuántas tarjetas hay
    const cardCount = useSelect((select) => {
        const { getBlocksByClientId } = select('core/block-editor');
        const innerBlocks = getBlocksByClientId(clientId)[0]?.innerBlocks || [];
        return innerBlocks.length;
    }, [clientId]);

    // TEMPLATE: 3 tarjetas iniciales
    const TEMPLATE = [
        ['acemar/product-card', {}],
        ['acemar/product-card', {}],
        ['acemar/product-card', {}]
    ];

    // Permitir agregar solo si hay menos de 6
    const canAddMore = cardCount < 6;

    return (
        <div {...blockProps}>
            <div className="acemar-featured-products__grid">
                <InnerBlocks
                    template={TEMPLATE}
                    allowedBlocks={['acemar/product-card']}
                    templateLock={false}
                    renderAppender={canAddMore ? () => <InnerBlocks.ButtonBlockAppender /> : false}
                />
            </div>
            {cardCount >= 6 && (
                <div style={{
                    textAlign: 'center',
                    padding: '15px',
                    background: '#fff3cd',
                    color: '#856404',
                    borderRadius: '6px',
                    marginTop: '15px',
                    fontWeight: '600'
                }}>
                    ⚠️ Máximo 6 tarjetas alcanzado
                </div>
            )}
        </div>
    );
};

/**
 * SAVE: Frontend
 */
const Save = () => {
    const blockProps = useBlockProps.save({
        className: 'acemar-featured-products'
    });

    return (
        <div {...blockProps}>
            <div className="acemar-featured-products__grid">
                <InnerBlocks.Content />
            </div>
        </div>
    );
};

registerBlockType(metadata.name, {
    edit: Edit,
    save: Save,
});