/**
 * BLOQUE: Proyectos – Archivo
 * Grid masonry con filtros por Segmento, Uso y Tipo de Madera
 */

import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

const Edit = ({ attributes, setAttributes }) => {
    const { titulo, subtitulo } = attributes;

    const blockProps = useBlockProps({
        className: 'acemar-proyectos-archive-editor',
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Opciones del bloque', 'acemar-blocks')} initialOpen={true}>
                    <TextControl
                        label={__('Título (opcional)', 'acemar-blocks')}
                        value={titulo}
                        onChange={(val) => setAttributes({ titulo: val })}
                        placeholder="Nuestros Proyectos"
                    />
                    <TextControl
                        label={__('Subtítulo (opcional)', 'acemar-blocks')}
                        value={subtitulo}
                        onChange={(val) => setAttributes({ subtitulo: val })}
                        placeholder="Descripción breve..."
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="acemar-proyectos-archive-editor__preview">
                    <span className="acemar-proyectos-archive-editor__icon">🏗️</span>
                    <strong>Acemar – Proyectos</strong>
                    <p>Grid masonry con filtros de Segmento, Uso y Tipo de Madera.</p>
                    <p>El contenido se renderiza en el frontend.</p>
                    {titulo && (
                        <p className="acemar-proyectos-archive-editor__meta">
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
    save: () => null, // Server-side render via render.php
});
