import { registerBlockType } from '@wordpress/blocks';
import {
    InnerBlocks,
    useBlockProps,
    RichText,
    InspectorControls,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import {
    PanelBody,
    TextControl,
    ToggleControl,
    __experimentalDivider as Divider,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

const Edit = ({ attributes, setAttributes, clientId }) => {
    const { titulo, descripcion, botonTexto, botonUrl, mostrarTexto } = attributes;

    const blockProps = useBlockProps({
        className: `acemar-recursos-tecnicos${ mostrarTexto ? '' : ' acemar-recursos-tecnicos--solo-cards' }`,
    });

    const cardCount = useSelect((select) => {
        const { getBlocksByClientId } = select('core/block-editor');
        const innerBlocks = getBlocksByClientId(clientId)[0]?.innerBlocks || [];
        return innerBlocks.length;
    }, [clientId]);

    const TEMPLATE = [
        ['acemar/recurso-card', {}],
        ['acemar/recurso-card', {}],
        ['acemar/recurso-card', {}],
    ];

    const canAddMore = cardCount < 6;

    return (
        <>
            <InspectorControls>
                <PanelBody title="Configuración del bloque" initialOpen={ true }>
                    <ToggleControl
                        label="Mostrar columna de texto"
                        checked={ mostrarTexto }
                        onChange={ (val) => setAttributes({ mostrarTexto: val }) }
                        help={ mostrarTexto ? 'Mostrando título, descripción y botón' : 'Solo se muestran las cards' }
                    />
                </PanelBody>

                { mostrarTexto && (
                    <PanelBody title="Texto y botón" initialOpen={ true }>
                        <TextControl
                            label="Título"
                            value={ titulo }
                            onChange={ (val) => setAttributes({ titulo: val }) }
                            placeholder="RECURSOS TÉCNICOS"
                        />
                        <TextControl
                            label="Descripción"
                            value={ descripcion }
                            onChange={ (val) => setAttributes({ descripcion: val }) }
                            placeholder="Descripción del bloque..."
                            help="Texto que aparece debajo del título"
                        />
                        <Divider />
                        <TextControl
                            label="Texto del botón"
                            value={ botonTexto }
                            onChange={ (val) => setAttributes({ botonTexto: val }) }
                            placeholder="RECURSOS TÉCNICOS"
                        />
                        <TextControl
                            label="URL del botón"
                            value={ botonUrl }
                            onChange={ (val) => setAttributes({ botonUrl: val }) }
                            placeholder="https://..."
                        />
                    </PanelBody>
                ) }
            </InspectorControls>

            <div { ...blockProps }>
                { mostrarTexto && (
                    <div className="acemar-recursos-tecnicos__left">
                        <p className="acemar-recursos-tecnicos__titulo">{ titulo }</p>
                        <p className="acemar-recursos-tecnicos__desc">{ descripcion }</p>
                        <a className="acemar-recursos-tecnicos__btn" href={ botonUrl }>
                            { botonTexto }
                        </a>
                    </div>
                ) }

                <div className="acemar-recursos-tecnicos__right">
                    <div className="acemar-recursos-tecnicos__grid">
                        <InnerBlocks
                            template={ TEMPLATE }
                            allowedBlocks={ ['acemar/recurso-card'] }
                            templateLock={ false }
                            renderAppender={ canAddMore ? () => <InnerBlocks.ButtonBlockAppender /> : false }
                        />
                    </div>
                    { cardCount >= 6 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '10px',
                            background: '#fff3cd',
                            color: '#856404',
                            borderRadius: '6px',
                            marginTop: '10px',
                            fontSize: '13px',
                        }}>
                            ⚠️ Máximo 6 cards alcanzado
                        </div>
                    ) }
                </div>
            </div>
        </>
    );
};

const Save = ({ attributes }) => {
    const { titulo, descripcion, botonTexto, botonUrl, mostrarTexto } = attributes;

    const blockProps = useBlockProps.save({
        className: `acemar-recursos-tecnicos${ mostrarTexto ? '' : ' acemar-recursos-tecnicos--solo-cards' }`,
    });

    return (
        <div { ...blockProps }>
            { mostrarTexto && (
                <div className="acemar-recursos-tecnicos__left">
                    <p className="acemar-recursos-tecnicos__titulo">{ titulo }</p>
                    <p className="acemar-recursos-tecnicos__desc">{ descripcion }</p>
                    <a className="acemar-recursos-tecnicos__btn" href={ botonUrl }>
                        { botonTexto }
                    </a>
                </div>
            ) }
            <div className="acemar-recursos-tecnicos__right">
                <div className="acemar-recursos-tecnicos__grid">
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