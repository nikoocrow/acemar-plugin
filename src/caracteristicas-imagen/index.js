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
    SelectControl,
    RadioControl,
    TextControl,
    TextareaControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

const FONDO_OPTIONS = [
    { label: 'Blanco',       value: 'blanco' },
    { label: 'Gris claro',   value: 'gris' },
    { label: 'Negro',        value: 'negro' },
];

const POSICION_OPTIONS = [
    { label: 'Imagen a la derecha',   value: 'derecha' },
    { label: 'Imagen a la izquierda', value: 'izquierda' },
];

const MAX_ITEMS = 10;

/* ── Componente de un ítem ── */
const ItemRow = ({ item, index, onChange, onRemove }) => {
    return (
        <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '12px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                {/* Miniatura del ícono */}
                { item.iconoUrl ? (
                    <img src={ item.iconoUrl } alt="" style={{ width: 36, height: 36, objectFit: 'contain', background: '#f5f5f5', borderRadius: 4 }} />
                ) : (
                    <div style={{ width: 36, height: 36, background: '#eee', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#999' }}>
                        ícono
                    </div>
                )}
                <span style={{ fontWeight: 600, fontSize: 12 }}>Ítem { index + 1 }</span>
                <Button
                    onClick={ onRemove }
                    variant="tertiary"
                    isDestructive
                    style={{ marginLeft: 'auto', padding: '2px 6px', fontSize: 11 }}
                >
                    ✕
                </Button>
            </div>

            {/* Botón de ícono */}
            <MediaUploadCheck>
                <MediaUpload
                    onSelect={ (media) => onChange({ ...item, iconoUrl: media.url, iconoId: media.id }) }
                    allowedTypes={ ['image'] }
                    value={ item.iconoId }
                    render={ ({ open }) => (
                        <Button onClick={ open } variant="secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: 6 }}>
                            { item.iconoUrl ? 'Cambiar ícono' : '+ Seleccionar ícono' }
                        </Button>
                    ) }
                />
            </MediaUploadCheck>

            {/* Texto */}
            <TextareaControl
                label="Texto"
                value={ item.texto }
                onChange={ (val) => onChange({ ...item, texto: val }) }
                rows={ 2 }
                style={{ marginBottom: 0 }}
            />
        </div>
    );
};

/* ── Edit ── */
const Edit = ({ attributes, setAttributes }) => {
    const {
        imagenPosicion, fondoColor,
        imagenUrl, imagenId, imagenAlt,
        titulo, items,
    } = attributes;

    const blockProps = useBlockProps({
        className: [
            'acemar-caracteristicas-imagen',
            `acemar-ci--fondo-${fondoColor}`,
            `acemar-ci--imagen-${imagenPosicion}`,
        ].join(' '),
    });

    const isDark = fondoColor === 'negro';
    const textColor = isDark ? '#fff' : '#1a1a1a';

    const updateItem = (index, newItem) => {
        const newItems = items.map((it, i) => i === index ? newItem : it);
        setAttributes({ items: newItems });
    };

    const removeItem = (index) => {
        setAttributes({ items: items.filter((_, i) => i !== index) });
    };

    const addItem = () => {
        if (items.length >= MAX_ITEMS) return;
        const newId = Date.now();
        setAttributes({
            items: [...items, { id: newId, iconoUrl: '', iconoId: 0, texto: 'Nueva característica' }]
        });
    };

    /* Columna de íconos */
    const colIconos = (
        <div className="acemar-ci__col-iconos">
            { titulo && (
                <div className="acemar-ci__titulo-editor" style={{ color: textColor, marginBottom: 24, fontSize: 22, fontFamily: 'Cormorant Garamond, serif' }}>
                    { titulo }
                </div>
            )}
            <div className="acemar-ci__grid">
                { items.map((item) => (
                    <div key={ item.id } className="acemar-ci__item">
                        { item.iconoUrl ? (
                            <img src={ item.iconoUrl } alt="" className="acemar-ci__icono" />
                        ) : (
                            <div className="acemar-ci__icono-placeholder">?</div>
                        )}
                        <span className="acemar-ci__texto" style={{ color: textColor }}>
                            { item.texto }
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    /* Columna imagen */
    const colImagen = (
        <div className="acemar-ci__col-imagen">
            { imagenUrl ? (
                <img src={ imagenUrl } alt={ imagenAlt } className="acemar-ci__imagen" />
            ) : (
                <div className="acemar-ci__imagen-placeholder">
                    <span>Sin imagen — selecciona en el panel</span>
                </div>
            )}
        </div>
    );

    return (
        <>
            <InspectorControls>
                {/* Layout */}
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

                {/* Título opcional */}
                <PanelBody title="Título (opcional)" initialOpen={ false }>
                    <TextControl
                        label="Título sobre los ítems"
                        value={ titulo }
                        onChange={ (val) => setAttributes({ titulo: val }) }
                        placeholder="Ej: Características del producto"
                    />
                </PanelBody>

                {/* Imagen */}
                <PanelBody title="Imagen" initialOpen={ true }>
                    { imagenUrl ? (
                        <>
                            <PanelRow>
                                <img src={ imagenUrl } alt={ imagenAlt } style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
                            </PanelRow>
                            <PanelRow>
                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={ (media) => setAttributes({ imagenUrl: media.url, imagenId: media.id, imagenAlt: media.alt || '' }) }
                                        allowedTypes={ ['image'] }
                                        value={ imagenId }
                                        render={ ({ open }) => (
                                            <Button onClick={ open } variant="secondary" style={{ marginRight: 8 }}>Cambiar</Button>
                                        ) }
                                    />
                                </MediaUploadCheck>
                                <Button onClick={ () => setAttributes({ imagenUrl: '', imagenId: 0, imagenAlt: '' }) } variant="tertiary" isDestructive>
                                    Quitar
                                </Button>
                            </PanelRow>
                        </>
                    ) : (
                        <PanelRow>
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={ (media) => setAttributes({ imagenUrl: media.url, imagenId: media.id, imagenAlt: media.alt || '' }) }
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
                    )}
                </PanelBody>

                {/* Ítems */}
                <PanelBody title={ `Ítems (${items.length}/${MAX_ITEMS})` } initialOpen={ true }>
                    { items.map((item, i) => (
                        <ItemRow
                            key={ item.id }
                            item={ item }
                            index={ i }
                            onChange={ (newItem) => updateItem(i, newItem) }
                            onRemove={ () => removeItem(i) }
                        />
                    ))}
                    { items.length < MAX_ITEMS && (
                        <Button onClick={ addItem } variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
                            + Agregar ítem
                        </Button>
                    )}
                </PanelBody>
            </InspectorControls>

            {/* Canvas */}
            <div { ...blockProps }>
                { imagenPosicion === 'izquierda' ? (
                    <>{ colImagen }{ colIconos }</>
                ) : (
                    <>{ colIconos }{ colImagen }</>
                )}
            </div>
        </>
    );
};

/* ── Save ── */
const Save = ({ attributes }) => {
    const { imagenPosicion, fondoColor, imagenUrl, imagenAlt, titulo, items } = attributes;

    const blockProps = useBlockProps.save({
        className: [
            'acemar-caracteristicas-imagen',
            `acemar-ci--fondo-${fondoColor}`,
            `acemar-ci--imagen-${imagenPosicion}`,
        ].join(' '),
    });

    const colIconos = (
        <div className="acemar-ci__col-iconos">
            { titulo && <h2 className="acemar-ci__titulo">{ titulo }</h2> }
            <div className="acemar-ci__grid">
                { items.map((item) => (
                    <div key={ item.id } className="acemar-ci__item">
                        { item.iconoUrl && (
                            <img src={ item.iconoUrl } alt="" className="acemar-ci__icono" loading="lazy" />
                        )}
                        <span className="acemar-ci__texto">{ item.texto }</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const colImagen = (
        <div className="acemar-ci__col-imagen">
            { imagenUrl && (
                <img src={ imagenUrl } alt={ imagenAlt } className="acemar-ci__imagen" loading="lazy" />
            )}
        </div>
    );

    return (
        <div { ...blockProps }>
            { imagenPosicion === 'izquierda' ? (
                <>{ colImagen }{ colIconos }</>
            ) : (
                <>{ colIconos }{ colImagen }</>
            )}
        </div>
    );
};

registerBlockType(metadata.name, { edit: Edit, save: Save });