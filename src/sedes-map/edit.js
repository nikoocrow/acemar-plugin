import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
    TextControl,
    TextareaControl,
    RangeControl,
    Button,
    Flex,
    FlexBlock,
    FlexItem,
    Notice,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { v4 as uuidv4 } from 'uuid';

function generateId() {
    return 'sede-' + Math.random().toString(36).substr(2, 9);
}

export default function Edit( { attributes, setAttributes } ) {
   const { titulo, descripcion, googleMapsApiKey, mapZoom, sedes, markerSvgUrl, markerWidth, markerHeight } = attributes;
    const blockProps = useBlockProps( { className: 'acemar-sedes-map-editor' } );

    // --- Helpers para sedes ---
    const updateSede = ( index, field, value ) => {
        const updated = sedes.map( ( sede, i ) =>
            i === index ? { ...sede, [ field ]: value } : sede
        );
        setAttributes( { sedes: updated } );
    };

    const addSede = () => {
        setAttributes( {
            sedes: [
                ...sedes,
                {
                    id: generateId(),
                    nombre: '',
                    direccion: '',
                    telefono: '',
                    ciudad: '',
                    departamento: '',
                    lat: 4.570868,
                    lng: -74.297333,
                    urlDetalle: '',
                    urlContacto: '',
                },
            ],
        } );
    };

    const removeSede = ( index ) => {
        setAttributes( { sedes: sedes.filter( ( _, i ) => i !== index ) } );
    };

    return (
        <Fragment>
            {/* ── Panel lateral ── */}
            <InspectorControls>

                {/* Configuración general */}
                <PanelBody title="Configuración General" initialOpen={ true }>
                    <TextControl
                        label="Título de la sección"
                        value={ titulo }
                        onChange={ ( val ) => setAttributes( { titulo: val } ) }
                    />
                    <TextareaControl
                        label="Descripción"
                        value={ descripcion }
                        onChange={ ( val ) => setAttributes( { descripcion: val } ) }
                        rows={ 3 }
                    />
                </PanelBody>

                {/* Google Maps */}
                <PanelBody title="Google Maps" initialOpen={ true }>
                    { ! googleMapsApiKey && (
                        <Notice status="warning" isDismissible={ false }>
                            { __( 'Ingresa tu API Key de Google Maps para activar el mapa.' ) }
                        </Notice>
                    ) }
                    <TextControl
                        label="API Key de Google Maps"
                        value={ googleMapsApiKey }
                        onChange={ ( val ) => setAttributes( { googleMapsApiKey: val } ) }
                        placeholder="AIzaSy..."
                        help="Necesitas una API Key con Maps JavaScript API habilitada."
                    />
                    <RangeControl
                        label="Zoom inicial del mapa"
                        value={ mapZoom }
                        onChange={ ( val ) => setAttributes( { mapZoom: val } ) }
                        min={ 4 }
                        max={ 15 }
                    />

                    <TextControl
                        label="URL del Pin SVG (opcional)"
                        value={ markerSvgUrl }
                        onChange={ ( val ) => setAttributes( { markerSvgUrl: val } ) }
                        placeholder="https://... (vacío = pin default)"
                        help="Sube el SVG a la biblioteca de medios y pega la URL."
                    />
                    { markerSvgUrl && (
                        <Flex>
                            <FlexBlock>
                                <RangeControl
                                    label="Ancho del pin (px)"
                                    value={ markerWidth }
                                    onChange={ ( val ) => setAttributes( { markerWidth: val } ) }
                                    min={ 16 }
                                    max={ 80 }
                                />
                            </FlexBlock>
                            <FlexBlock>
                                <RangeControl
                                    label="Alto del pin (px)"
                                    value={ markerHeight }
                                    onChange={ ( val ) => setAttributes( { markerHeight: val } ) }
                                    min={ 16 }
                                    max={ 80 }
                                />
                            </FlexBlock>
                        </Flex>
                    ) }
                </PanelBody>

                {/* Sedes */}
                <PanelBody title={ `Sedes (${ sedes.length })` } initialOpen={ true }>
                    { sedes.map( ( sede, index ) => (
                        <div key={ sede.id } className="acemar-sede-item">
                            <Flex justify="space-between" align="center">
                                <FlexBlock>
                                    <strong>{ sede.nombre || `Sede ${ index + 1 }` }</strong>
                                </FlexBlock>
                                <FlexItem>
                                    <Button
                                        isDestructive
                                        variant="tertiary"
                                        size="small"
                                        onClick={ () => removeSede( index ) }
                                    >
                                        Eliminar
                                    </Button>
                                </FlexItem>
                            </Flex>

                            <TextControl
                                label="Nombre"
                                value={ sede.nombre }
                                onChange={ ( val ) => updateSede( index, 'nombre', val ) }
                                placeholder="Ej: Bogotá – Sede Centro"
                            />
                            <TextControl
                                label="Ciudad"
                                value={ sede.ciudad }
                                onChange={ ( val ) => updateSede( index, 'ciudad', val ) }
                            />
                            <TextControl
                                label="Departamento"
                                value={ sede.departamento }
                                onChange={ ( val ) => updateSede( index, 'departamento', val ) }
                            />
                            <TextareaControl
                                label="Dirección"
                                value={ sede.direccion }
                                onChange={ ( val ) => updateSede( index, 'direccion', val ) }
                                rows={ 2 }
                            />
                            <TextControl
                                label="Teléfono"
                                value={ sede.telefono }
                                onChange={ ( val ) => updateSede( index, 'telefono', val ) }
                                placeholder="(601) 234-5678"
                            />
                            <Flex>
                                <FlexBlock>
                                    <TextControl
                                        label="Latitud"
                                        type="number"
                                        value={ sede.lat }
                                        onChange={ ( val ) => updateSede( index, 'lat', parseFloat( val ) ) }
                                        step="0.0001"
                                    />
                                </FlexBlock>
                                <FlexBlock>
                                    <TextControl
                                        label="Longitud"
                                        type="number"
                                        value={ sede.lng }
                                        onChange={ ( val ) => updateSede( index, 'lng', parseFloat( val ) ) }
                                        step="0.0001"
                                    />
                                </FlexBlock>
                            </Flex>
                            <TextControl
                                label="URL Ver Detalle"
                                value={ sede.urlDetalle }
                                onChange={ ( val ) => updateSede( index, 'urlDetalle', val ) }
                                placeholder="https://..."
                            />
                            <TextControl
                                label="URL Agendar / Contacto"
                                value={ sede.urlContacto }
                                onChange={ ( val ) => updateSede( index, 'urlContacto', val ) }
                                placeholder="https://..."
                            />
                        <div style={ { margin: '12px 0', height: '1px', background: '#e0ddd6' } } />
                        </div>
                    ) ) }

                    <Button
                        variant="primary"
                        onClick={ addSede }
                        style={ { marginTop: '8px', width: '100%' } }
                    >
                        + Agregar Sede
                    </Button>
                </PanelBody>
            </InspectorControls>

            {/* ── Preview en el editor ── */}
            <div { ...blockProps }>
                <div className="acemar-sedes-editor-preview">
                    <div className="acemar-sedes-preview__left">
                        <p className="acemar-sedes-preview__tag">Todas las sedes</p>
                        <h2 className="acemar-sedes-preview__title">{ titulo }</h2>
                        <p className="acemar-sedes-preview__desc">{ descripcion }</p>

                        <div className="acemar-sedes-preview__search">
                            <input type="text" placeholder="Buscar por ciudad o departamento..." disabled />
                        </div>

                        <div className="acemar-sedes-preview__list">
                            { sedes.map( ( sede ) => (
                                <div key={ sede.id } className="acemar-sede-card">
                                    <div className="acemar-sede-card__header">
                                        <strong>{ sede.nombre || 'Nueva Sede' }</strong>
                                    </div>
                                    <div className="acemar-sede-card__body">
                                        <span>{ sede.direccion }</span>
                                        <span>{ sede.telefono }</span>
                                    </div>
                                    <div className="acemar-sede-card__actions">
                                        <button className="btn-outline">Agendar</button>
                                        <button className="btn-solid">Ver Detalle</button>
                                    </div>
                                </div>
                            ) ) }
                        </div>
                    </div>

                    <div className="acemar-sedes-preview__right">
                        { googleMapsApiKey ? (
                            <div className="acemar-sedes-preview__map-placeholder">
                                🗺️ Mapa activo — se renderiza en el frontend
                                <small>{ sedes.length } sede(s) configurada(s)</small>
                            </div>
                        ) : (
                            <div className="acemar-sedes-preview__map-placeholder acemar-sedes-preview__map-placeholder--warn">
                                ⚠️ Agrega tu API Key de Google Maps en el panel lateral
                            </div>
                        ) }
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
