import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    RichText,
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
    Button,
    ToggleControl,
    TextControl,
    SelectControl,
    RadioControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

const FONDO_OPTIONS = [
    { label: 'Blanco',           value: 'blanco' },
    { label: 'Gris claro',       value: 'gris' },
    { label: 'Dorado suave',     value: 'dorado' },
    { label: 'Negro',            value: 'negro' },
];

const POSICION_OPTIONS = [
    { label: 'Imagen a la derecha', value: 'derecha' },
    { label: 'Imagen a la izquierda', value: 'izquierda' },
];

const Edit = ({ attributes, setAttributes }) => {
    const {
        imagenPosicion, fondoColor,
        imagenUrl, imagenId, imagenAlt,
        botonActivo, botonTexto, botonUrl,
        contenido,
    } = attributes;

    const blockProps = useBlockProps({
        className: [
            'acemar-seccion-sostenibilidad',
            `acemar-seccion-sostenibilidad--fondo-${fondoColor}`,
            `acemar-seccion-sostenibilidad--imagen-${imagenPosicion}`,
        ].join(' '),
    });

    const isDark = fondoColor === 'negro';

    return (
        <>
            <InspectorControls>
                {/* ── Layout ── */}
                <PanelBody title="Layout" initialOpen={ true }>
                    <RadioControl
                        label="Posición de la imagen"
                        selected={ imagenPosicion }
                        options={ POSICION_OPTIONS }
                        onChange={ (val) => setAttributes({ imagenPosicion: val }) }
                    />
                    <SelectControl
                        label="Color de fondo"
                        value={ fondoColor }
                        options={ FONDO_OPTIONS }
                        onChange={ (val) => setAttributes({ fondoColor: val }) }
                    />
                </PanelBody>

                {/* ── Imagen ── */}
                <PanelBody title="Imagen" initialOpen={ true }>
                    { imagenUrl ? (
                        <>
                            <PanelRow>
                                <img
                                    src={ imagenUrl }
                                    alt={ imagenAlt }
                                    style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }}
                                />
                            </PanelRow>
                            <PanelRow>
                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={ (media) => setAttributes({
                                            imagenUrl: media.url,
                                            imagenId: media.id,
                                            imagenAlt: media.alt || '',
                                        }) }
                                        allowedTypes={ ['image'] }
                                        value={ imagenId }
                                        render={ ({ open }) => (
                                            <Button onClick={ open } variant="secondary" style={{ marginRight: '8px' }}>
                                                Cambiar
                                            </Button>
                                        ) }
                                    />
                                </MediaUploadCheck>
                                <Button
                                    onClick={ () => setAttributes({ imagenUrl: '', imagenId: 0, imagenAlt: '' }) }
                                    variant="tertiary"
                                    isDestructive
                                >
                                    Quitar
                                </Button>
                            </PanelRow>
                        </>
                    ) : (
                        <PanelRow>
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={ (media) => setAttributes({
                                        imagenUrl: media.url,
                                        imagenId: media.id,
                                        imagenAlt: media.alt || '',
                                    }) }
                                    allowedTypes={ ['image'] }
                                    value={ imagenId }
                                    render={ ({ open }) => (
                                        <Button onClick={ open } variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
                                            + Seleccionar imagen
                                        </Button>
                                    ) }
                                />
                            </MediaUploadCheck>
                        </PanelRow>
                    ) }
                </PanelBody>

                {/* ── Botón ── */}
                <PanelBody title="Botón sobre imagen" initialOpen={ false }>
                    <ToggleControl
                        label="Mostrar botón"
                        checked={ botonActivo }
                        onChange={ (val) => setAttributes({ botonActivo: val }) }
                        help={ botonActivo ? 'Visible en hover (desktop) y siempre en mobile' : 'Sin botón' }
                    />
                    { botonActivo && (
                        <>
                            <TextControl
                                label="Texto del botón"
                                value={ botonTexto }
                                onChange={ (val) => setAttributes({ botonTexto: val }) }
                                placeholder="Ver más"
                            />
                            <TextControl
                                label="URL del botón"
                                value={ botonUrl }
                                onChange={ (val) => setAttributes({ botonUrl: val }) }
                                placeholder="https://..."
                            />
                        </>
                    ) }
                </PanelBody>
            </InspectorControls>

            {/* ── Canvas ── */}
            <div { ...blockProps }>

                {/* Columna texto */}
                <div className="acemar-seccion-sostenibilidad__texto">
                    <RichText
                        tagName="div"
                        className="acemar-seccion-sostenibilidad__contenido"
                        multiline="p"
                        placeholder="Escribe el contenido aquí... Usa / para agregar un Heading opcional."
                        value={ contenido }
                        onChange={ (val) => setAttributes({ contenido: val }) }
                        allowedFormats={ ['core/bold', 'core/italic', 'core/link'] }
                        style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}
                    />
                </div>

                {/* Columna imagen */}
                <div className="acemar-seccion-sostenibilidad__imagen-wrap">
                    { imagenUrl ? (
                        <>
                            <img
                                src={ imagenUrl }
                                alt={ imagenAlt }
                                className="acemar-seccion-sostenibilidad__imagen"
                            />
                            { botonActivo && (
                                <div className="acemar-seccion-sostenibilidad__btn-wrap acemar-seccion-sostenibilidad__btn-wrap--preview">
                                    <a className="acemar-seccion-sostenibilidad__btn" href={ botonUrl }>
                                        { botonTexto }
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                            <polyline points="15 3 21 3 21 9"/>
                                            <line x1="10" y1="14" x2="21" y2="3"/>
                                        </svg>
                                    </a>
                                </div>
                            ) }
                        </>
                    ) : (
                        <div className="acemar-seccion-sostenibilidad__imagen-placeholder">
                            <span>Sin imagen — selecciona una en el panel</span>
                        </div>
                    ) }
                </div>

            </div>
        </>
    );
};

const Save = ({ attributes }) => {
    const {
        imagenPosicion, fondoColor,
        imagenUrl, imagenAlt,
        botonActivo, botonTexto, botonUrl,
        contenido,
    } = attributes;

    const blockProps = useBlockProps.save({
        className: [
            'acemar-seccion-sostenibilidad',
            `acemar-seccion-sostenibilidad--fondo-${fondoColor}`,
            `acemar-seccion-sostenibilidad--imagen-${imagenPosicion}`,
        ].join(' '),
    });

    return (
        <div { ...blockProps }>
            <div className="acemar-seccion-sostenibilidad__texto">
                <RichText.Content
                    tagName="div"
                    className="acemar-seccion-sostenibilidad__contenido"
                    value={ contenido }
                />
            </div>

            <div className="acemar-seccion-sostenibilidad__imagen-wrap">
                { imagenUrl && (
                    <img
                        src={ imagenUrl }
                        alt={ imagenAlt }
                        className="acemar-seccion-sostenibilidad__imagen"
                        loading="lazy"
                    />
                ) }
                { botonActivo && (
                    <div className="acemar-seccion-sostenibilidad__btn-wrap">
                        <a
                            className="acemar-seccion-sostenibilidad__btn"
                            href={ botonUrl }
                        >
                            { botonTexto }
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                        </a>
                    </div>
                ) }
            </div>
        </div>
    );
};

registerBlockType(metadata.name, {
    edit: Edit,
    save: Save,
});