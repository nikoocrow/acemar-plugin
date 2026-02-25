window.acemarInitMaps = function () {
    const blockIds = window.acemarSedesMapConfig || [];

    blockIds.forEach( ( blockId ) => {
        const section = document.getElementById( blockId );
        if ( ! section ) return;
        initSedesMap( section, blockId );
    } );
};

function initSedesMap( section, blockId ) {
    const apiKey       = section.dataset.mapApiKey;
    const zoom         = parseInt( section.dataset.mapZoom ) || 6;
    const centerLat    = parseFloat( section.dataset.mapCenterLat ) || 4.570868;
    const centerLng    = parseFloat( section.dataset.mapCenterLng ) || -74.297333;
    const sedes        = JSON.parse( section.dataset.sedes || '[]' );
    const markerSvgUrl = section.dataset.markerSvg || '';
    const markerWidth  = parseInt( section.dataset.markerWidth ) || 40;
    const markerHeight = parseInt( section.dataset.markerHeight ) || 40;

    const mapEl    = document.getElementById( `${ blockId }-map` );
    const listEl   = document.getElementById( `${ blockId }-list` );
    const searchEl = document.getElementById( `${ blockId }-search` );

    if ( ! mapEl ) return;

    const map = new google.maps.Map( mapEl, {
        center: { lat: centerLat, lng: centerLng },
        zoom,
        styles: acemarMapStyles(),
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
    } );

    const markers     = {};
    const infoWindows = {};

    sedes.forEach( ( sede ) => {
        if ( ! sede.lat || ! sede.lng ) return;

        const icon = markerSvgUrl ? {
            url        : markerSvgUrl,
            scaledSize : new google.maps.Size( markerWidth, markerHeight ),
            anchor     : new google.maps.Point( markerWidth / 2, markerHeight ),
        } : {
            path         : google.maps.SymbolPath.CIRCLE,
            scale        : 10,
            fillColor    : '#b5955a',
            fillOpacity  : 1,
            strokeColor  : '#ffffff',
            strokeWeight : 2,
        };

        const marker = new google.maps.Marker( {
            position : { lat: sede.lat, lng: sede.lng },
            map,
            title    : sede.nombre,
            icon,
        } );

        const infoContent = `
            <div class="acemar-infowindow">
                <strong>${ sede.nombre }</strong>
                <p>${ sede.direccion }</p>
                <p>${ sede.telefono }</p>
                ${ sede.urlDetalle ? `<a href="${ sede.urlDetalle }" target="_blank">Ver sede →</a>` : '' }
            </div>
        `;

        const infoWindow = new google.maps.InfoWindow( { content: infoContent } );

        marker.addListener( 'click', () => {
            Object.values( infoWindows ).forEach( iw => iw.close() );
            infoWindow.open( map, marker );
            map.panTo( marker.getPosition() );
            highlightCard( listEl, sede.id );
        } );

        markers[ sede.id ]     = marker;
        infoWindows[ sede.id ] = infoWindow;
    } );

    if ( listEl ) {
        listEl.addEventListener( 'click', ( e ) => {
            const card = e.target.closest( '.acemar-sede-card' );
            if ( ! card ) return;

            const sedeId = card.dataset.sedeId;
            const lat    = parseFloat( card.dataset.lat );
            const lng    = parseFloat( card.dataset.lng );

            if ( lat && lng ) {
                map.panTo( { lat, lng } );
                map.setZoom( 13 );
                Object.values( infoWindows ).forEach( iw => iw.close() );
                if ( infoWindows[ sedeId ] ) {
                    infoWindows[ sedeId ].open( map, markers[ sedeId ] );
                }
                highlightCard( listEl, sedeId );
            }
        } );
    }

    if ( searchEl ) {
        searchEl.addEventListener( 'input', () => {
            const query = searchEl.value.toLowerCase().trim();
            const cards = listEl.querySelectorAll( '.acemar-sede-card' );

            cards.forEach( ( card ) => {
                const texto  = card.dataset.ciudad || '';
                const nombre = card.querySelector( '.acemar-sede-card__name' )?.textContent.toLowerCase() || '';
                const visible = ! query || texto.includes( query ) || nombre.includes( query );
                card.style.display = visible ? '' : 'none';
            } );
        } );
    }
}

function highlightCard( listEl, sedeId ) {
    if ( ! listEl ) return;
    listEl.querySelectorAll( '.acemar-sede-card' ).forEach( ( c ) => {
        c.classList.toggle( 'is-active', c.dataset.sedeId === sedeId );
    } );
    const activeCard = listEl.querySelector( `.acemar-sede-card[data-sede-id="${ sedeId }"]` );
    if ( activeCard ) {
        activeCard.scrollIntoView( { behavior: 'smooth', block: 'nearest' } );
    }
}

function acemarMapStyles() {
    return [
        { featureType: 'all', elementType: 'labels.text.fill', stylers: [ { color: '#4a4a4a' } ] },
        { featureType: 'water', elementType: 'geometry', stylers: [ { color: '#c9e8f5' } ] },
        { featureType: 'landscape', elementType: 'geometry', stylers: [ { color: '#f5f5f0' } ] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [ { color: '#ffffff' }, { weight: 1.5 } ] },
        { featureType: 'road.arterial', elementType: 'geometry', stylers: [ { color: '#ffffff' } ] },
        { featureType: 'road.local', elementType: 'geometry', stylers: [ { color: '#ffffff' } ] },
        { featureType: 'poi', elementType: 'geometry', stylers: [ { color: '#e8ede5' } ] },
        { featureType: 'transit', stylers: [ { visibility: 'off' } ] },
        { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [ { color: '#c0c0b8' }, { weight: 1 } ] },
    ];
}