import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

const Edit = ({ attributes, setAttributes }) => {
    const { titulo } = attributes;

    const blockProps = useBlockProps({
        className: 'acemar-puertas-grid-editor',
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Opciones del bloque', 'acemar-blocks')} initialOpen={true}>
                    <TextControl
                        label={__('Título (opcional)', 'acemar-blocks')}
                        value={titulo}
                        onChange={(val) => setAttributes({ titulo: val })}
                        placeholder="Nuestras Puertas"
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="acemar-puertas-grid-editor__preview">
                    <span className="acemar-puertas-grid-editor__icon">🚪</span>
                    <strong>Acemar – Puertas</strong>
                    <p>Grid de 3 columnas con slider de imágenes y lightbox.</p>
                    <p>El contenido se renderiza en el frontend.</p>
                    {titulo && (
                        <p className="acemar-puertas-grid-editor__meta">
                            Título: <em>{titulo}</em>
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

registerBlockType(metadata.name, {
    edit: Edit,
    save: () => null,
});
