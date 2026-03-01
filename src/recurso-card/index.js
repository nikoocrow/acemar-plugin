import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    MediaUpload,
    MediaUploadCheck,
    InspectorControls,
} from '@wordpress/block-editor';
import { Button, TextControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

const Edit = ({ attributes, setAttributes }) => {
    const {
        titulo,
        imagenUrl,
        imagenId,
        imagenAlt,
        urlDescarga,
        urlPagina,
        textoDescarga,
        textoPagina,
    } = attributes;

    const blockProps = useBlockProps({ className: 'acemar-recurso-card' });

    return (
        <>
            <InspectorControls>
                <PanelBody title="Configuración de la card" initialOpen={ true }>
                    <TextControl
                        label="Título"
                        value={ titulo }
                        onChange={ (val) => setAttributes({ titulo: val }) }
                        placeholder="Ej: Brochure Fachadas"
                    />
                    <TextControl
                        label="Texto botón descarga"
                        value={ textoDescarga }
                        onChange={ (val) => setAttributes({ textoDescarga: val }) }
                        placeholder="Descargar"
                    />
                    <TextControl
                        label="URL de descarga (PDF)"
                        value={ urlDescarga }
                        onChange={ (val) => setAttributes({ urlDescarga: val }) }
                        placeholder="https://..."
                    />
                    <TextControl
                        label="Texto botón página"
                        value={ textoPagina }
                        onChange={ (val) => setAttributes({ textoPagina: val }) }
                        placeholder="Ver más"
                    />
                    <TextControl
                        label="URL página interna"
                        value={ urlPagina }
                        onChange={ (val) => setAttributes({ urlPagina: val }) }
                        placeholder="https://..."
                    />
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                <div className="acemar-recurso-card__image-wrap">
                    { imagenUrl ? (
                        <>
                            <img
                                src={ imagenUrl }
                                alt={ imagenAlt }
                                className="acemar-recurso-card__img"
                            />
                            <div className="acemar-recurso-card__overlay">
                                <span className="acemar-recurso-card__titulo-overlay">{ titulo }</span>
                            </div>
                            <div className="acemar-recurso-card__editor-actions">
                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={ (media) => setAttributes({
                                            imagenUrl: media.url,
                                            imagenId: media.id,
                                            imagenAlt: media.alt || titulo,
                                        }) }
                                        allowedTypes={ ['image'] }
                                        value={ imagenId }
                                        render={ ({ open }) => (
                                            <Button onClick={ open } variant="secondary" size="small">
                                                Cambiar
                                            </Button>
                                        ) }
                                    />
                                </MediaUploadCheck>
                                <Button
                                    onClick={ () => setAttributes({ imagenUrl: '', imagenId: 0 }) }
                                    variant="tertiary"
                                    isDestructive
                                    size="small"
                                >
                                    Quitar
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="acemar-recurso-card__placeholder">
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={ (media) => setAttributes({
                                        imagenUrl: media.url,
                                        imagenId: media.id,
                                        imagenAlt: media.alt || titulo,
                                    }) }
                                    allowedTypes={ ['image'] }
                                    value={ imagenId }
                                    render={ ({ open }) => (
                                        <Button onClick={ open } variant="primary">
                                            + Seleccionar imagen
                                        </Button>
                                    ) }
                                />
                            </MediaUploadCheck>
                        </div>
                    ) }
                </div>
                <p className="acemar-recurso-card__titulo-below">{ titulo || 'Nombre del Recurso' }</p>
            </div>
        </>
    );
};

const Save = ({ attributes }) => {
    const { titulo, imagenUrl, imagenAlt, urlDescarga, urlPagina, textoDescarga, textoPagina } = attributes;

    const blockProps = useBlockProps.save({ className: 'acemar-recurso-card' });

    return (
        <div { ...blockProps }>
            <div className="acemar-recurso-card__image-wrap">
                { imagenUrl && (
                    <img
                        src={ imagenUrl }
                        alt={ imagenAlt }
                        className="acemar-recurso-card__img"
                        loading="lazy"
                    />
                ) }
                <div className="acemar-recurso-card__overlay">
                    <span className="acemar-recurso-card__titulo-overlay">{ titulo }</span>
                    <div className="acemar-recurso-card__hover-btns">
                        { urlDescarga && (
                            <a
                                href={ urlDescarga }
                                className="acemar-recurso-card__btn acemar-recurso-card__btn--download"
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="7 10 12 15 17 10"/>
                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                                { textoDescarga }
                            </a>
                        ) }
                        { urlPagina && (
                            <a
                                href={ urlPagina }
                                className="acemar-recurso-card__btn acemar-recurso-card__btn--page"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                    <polyline points="15 3 21 3 21 9"/>
                                    <line x1="10" y1="14" x2="21" y2="3"/>
                                </svg>
                                { textoPagina }
                            </a>
                        ) }
                    </div>
                </div>
            </div>
            <p className="acemar-recurso-card__titulo-below">{ titulo }</p>
        </div>
    );
};

registerBlockType(metadata.name, {
    edit: Edit,
    save: Save,
});