import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, BlockControls, AlignmentControl } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

const ALIGN_LABELS = { left: 'Izquierda', center: 'Centro', right: 'Derecha' };

const Edit = ({ attributes, setAttributes }) => {
    const { titulo, alineacion } = attributes;

    const blockProps = useBlockProps({
        className: `acemar-puertas-grid-editor is-align-${alineacion}`,
    });

    return (
        <>
            <BlockControls group="block">
                <AlignmentControl
                    value={alineacion}
                    onChange={(val) => setAttributes({ alineacion: val || 'left' })}
                    alignmentControls={[
                        { icon: 'editor-alignleft',   title: __('Izquierda', 'acemar-blocks'), align: 'left'   },
                        { icon: 'editor-aligncenter', title: __('Centro',    'acemar-blocks'), align: 'center' },
                        { icon: 'editor-alignright',  title: __('Derecha',   'acemar-blocks'), align: 'right'  },
                    ]}
                />
            </BlockControls>

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
                            Título: <em>{titulo}</em> &nbsp;·&nbsp; Alineación: <em>{ALIGN_LABELS[alineacion]}</em>
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
