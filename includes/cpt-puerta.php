<?php
/**
 * CPT: acemar_puerta
 * Campos: galería (hasta 5 imgs), ranuras, acabado_foto, interior, accesorios_incluidos
 *
 * @package AcemarBlocks
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ============================================================
// CPT: acemar_puerta
// ============================================================
function acemar_register_cpt_puerta() {
    register_post_type( 'acemar_puerta', [
        'labels' => [
            'name'               => __( 'Puertas',              'acemar-blocks' ),
            'singular_name'      => __( 'Puerta',               'acemar-blocks' ),
            'add_new'            => __( 'Añadir puerta',         'acemar-blocks' ),
            'add_new_item'       => __( 'Añadir nueva puerta',   'acemar-blocks' ),
            'edit_item'          => __( 'Editar puerta',         'acemar-blocks' ),
            'new_item'           => __( 'Nueva puerta',          'acemar-blocks' ),
            'view_item'          => __( 'Ver puerta',            'acemar-blocks' ),
            'search_items'       => __( 'Buscar puertas',        'acemar-blocks' ),
            'not_found'          => __( 'No se encontraron puertas', 'acemar-blocks' ),
            'menu_name'          => __( 'Puertas',               'acemar-blocks' ),
        ],
        'public'          => false,
        'show_ui'         => true,
        'show_in_menu'    => true,
        'show_in_rest'    => true,
        'menu_icon'       => 'dashicons-image-filter',
        'menu_position'   => 26,
        'supports'        => [ 'title' ],
        'has_archive'     => false,
        'rewrite'         => false,
    ] );
}
add_action( 'init', 'acemar_register_cpt_puerta' );


// ============================================================
// REGISTRO DE META FIELDS (REST API + bloque Gutenberg)
// ============================================================
function acemar_register_meta_puerta() {
    $post_type = 'acemar_puerta';

    register_post_meta( $post_type, '_acemar_puerta_imagenes', [
        'type'              => 'string',
        'single'            => true,
        'default'           => '',
        'show_in_rest'      => true,
        'sanitize_callback' => 'sanitize_text_field',
        'auth_callback'     => '__return_true',
    ] );

    $campos_texto = [
        '_acemar_puerta_ranuras'             => 'Ranuras',
        '_acemar_puerta_acabado_foto'        => 'Acabado de la foto',
        '_acemar_puerta_interior'            => 'Interior',
        '_acemar_puerta_accesorios'          => 'Accesorios incluidos',
    ];

    foreach ( $campos_texto as $key => $label ) {
        register_post_meta( $post_type, $key, [
            'type'              => 'string',
            'single'            => true,
            'default'           => '',
            'show_in_rest'      => true,
            'sanitize_callback' => 'sanitize_text_field',
            'auth_callback'     => '__return_true',
        ] );
    }
}
add_action( 'init', 'acemar_register_meta_puerta' );


// ============================================================
// META BOX ADMIN
// ============================================================
function acemar_add_metabox_puerta() {
    add_meta_box(
        'acemar_puerta_datos',
        __( 'Datos de la puerta', 'acemar-blocks' ),
        'acemar_render_metabox_puerta',
        'acemar_puerta',
        'normal',
        'high'
    );
}
add_action( 'add_meta_boxes', 'acemar_add_metabox_puerta' );


function acemar_render_metabox_puerta( WP_Post $post ) {
    wp_nonce_field( 'acemar_puerta_save', 'acemar_puerta_nonce' );

    $imagenes_raw = get_post_meta( $post->ID, '_acemar_puerta_imagenes', true );
    $ids          = $imagenes_raw ? array_filter( array_map( 'absint', explode( ',', $imagenes_raw ) ) ) : [];

    $ranuras    = get_post_meta( $post->ID, '_acemar_puerta_ranuras',      true );
    $acabado    = get_post_meta( $post->ID, '_acemar_puerta_acabado_foto', true );
    $interior   = get_post_meta( $post->ID, '_acemar_puerta_interior',     true );
    $accesorios = get_post_meta( $post->ID, '_acemar_puerta_accesorios',   true );
    ?>
    <style>
        #acemar-puerta-galeria        { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:12px; }
        .acemar-puerta-thumb          { position:relative; width:100px; height:100px; }
        .acemar-puerta-thumb img      { width:100px; height:100px; object-fit:cover; border:1px solid #ddd; border-radius:4px; }
        .acemar-puerta-thumb .remove  { position:absolute; top:-6px; right:-6px; background:#c00; color:#fff;
                                        border:none; border-radius:50%; width:20px; height:20px; cursor:pointer;
                                        font-size:12px; line-height:20px; text-align:center; padding:0; }
        #acemar-puerta-add            { cursor:pointer; background:#f0f0f1; border:2px dashed #8c8f94;
                                        border-radius:4px; width:100px; height:100px; display:flex;
                                        align-items:center; justify-content:center; font-size:28px; color:#8c8f94; }
        #acemar-puerta-add.hidden     { display:none; }
        .acemar-puerta-field          { margin-bottom:14px; }
        .acemar-puerta-field label    { display:block; font-weight:600; margin-bottom:4px; }
        .acemar-puerta-field input    { width:100%; }
    </style>

    <p><strong><?php _e( 'Galería de imágenes (máx. 5)', 'acemar-blocks' ); ?></strong></p>
    <div id="acemar-puerta-galeria">
        <?php foreach ( $ids as $id ) :
            $url = wp_get_attachment_image_url( $id, 'thumbnail' );
            if ( ! $url ) continue; ?>
            <div class="acemar-puerta-thumb" data-id="<?php echo esc_attr( $id ); ?>">
                <img src="<?php echo esc_url( $url ); ?>" alt="">
                <button type="button" class="remove" title="Quitar">×</button>
            </div>
        <?php endforeach; ?>
        <div id="acemar-puerta-add" <?php echo count( $ids ) >= 5 ? 'class="hidden"' : ''; ?>>+</div>
    </div>
    <input type="hidden" id="acemar_puerta_imagenes" name="acemar_puerta_imagenes"
           value="<?php echo esc_attr( implode( ',', $ids ) ); ?>">

    <div class="acemar-puerta-field">
        <label for="acemar_puerta_ranuras"><?php _e( 'Ranuras', 'acemar-blocks' ); ?></label>
        <input type="text" id="acemar_puerta_ranuras" name="acemar_puerta_ranuras"
               value="<?php echo esc_attr( $ranuras ); ?>">
    </div>

    <div class="acemar-puerta-field">
        <label for="acemar_puerta_acabado_foto"><?php _e( 'Acabado de la foto', 'acemar-blocks' ); ?></label>
        <input type="text" id="acemar_puerta_acabado_foto" name="acemar_puerta_acabado_foto"
               value="<?php echo esc_attr( $acabado ); ?>">
    </div>

    <div class="acemar-puerta-field">
        <label for="acemar_puerta_interior"><?php _e( 'Interior', 'acemar-blocks' ); ?></label>
        <input type="text" id="acemar_puerta_interior" name="acemar_puerta_interior"
               value="<?php echo esc_attr( $interior ); ?>">
    </div>

    <div class="acemar-puerta-field">
        <label for="acemar_puerta_accesorios"><?php _e( 'Accesorios incluidos', 'acemar-blocks' ); ?></label>
        <input type="text" id="acemar_puerta_accesorios" name="acemar_puerta_accesorios"
               value="<?php echo esc_attr( $accesorios ); ?>">
    </div>

    <script>
    (function(){
        var MAX = 5;
        var frame;

        function getIds() {
            return document.getElementById('acemar_puerta_imagenes').value
                .split(',').map(Number).filter(Boolean);
        }

        function setIds(ids) {
            document.getElementById('acemar_puerta_imagenes').value = ids.join(',');
        }

        function addThumb(id, url) {
            var wrap = document.getElementById('acemar-puerta-galeria');
            var addBtn = document.getElementById('acemar-puerta-add');

            var div = document.createElement('div');
            div.className = 'acemar-puerta-thumb';
            div.dataset.id = id;
            div.innerHTML = '<img src="' + url + '" alt=""><button type="button" class="remove" title="Quitar">×</button>';
            div.querySelector('.remove').addEventListener('click', removeThumb);
            wrap.insertBefore(div, addBtn);

            if (getIds().length >= MAX) addBtn.classList.add('hidden');
        }

        function removeThumb() {
            var div = this.closest('.acemar-puerta-thumb');
            var id  = parseInt(div.dataset.id, 10);
            div.remove();
            var ids = getIds().filter(function(i){ return i !== id; });
            setIds(ids);
            if (ids.length < MAX) document.getElementById('acemar-puerta-add').classList.remove('hidden');
        }

        document.querySelectorAll('.acemar-puerta-thumb .remove').forEach(function(btn){
            btn.addEventListener('click', removeThumb);
        });

        document.getElementById('acemar-puerta-add').addEventListener('click', function(){
            if (getIds().length >= MAX) return;

            if (frame) { frame.open(); return; }

            frame = wp.media({
                title: 'Seleccionar imágenes de la puerta',
                button: { text: 'Usar estas imágenes' },
                multiple: true,
                library: { type: 'image' }
            });

            frame.on('select', function(){
                var selection = frame.state().get('selection');
                selection.each(function(attachment){
                    var ids = getIds();
                    if (ids.length >= MAX || ids.indexOf(attachment.id) !== -1) return;
                    ids.push(attachment.id);
                    setIds(ids);
                    var url = attachment.attributes.sizes && attachment.attributes.sizes.thumbnail
                        ? attachment.attributes.sizes.thumbnail.url
                        : attachment.attributes.url;
                    addThumb(attachment.id, url);
                });
            });

            frame.open();
        });
    })();
    </script>
    <?php
}


// ============================================================
// GUARDAR META
// ============================================================
function acemar_save_meta_puerta( int $post_id ) {
    if ( ! isset( $_POST['acemar_puerta_nonce'] ) ) return;
    if ( ! wp_verify_nonce( $_POST['acemar_puerta_nonce'], 'acemar_puerta_save' ) ) return;
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    // Galería: lista de IDs separados por coma
    $raw_ids = isset( $_POST['acemar_puerta_imagenes'] ) ? $_POST['acemar_puerta_imagenes'] : '';
    $ids     = array_slice(
        array_filter( array_map( 'absint', explode( ',', $raw_ids ) ) ),
        0,
        5
    );
    update_post_meta( $post_id, '_acemar_puerta_imagenes', implode( ',', $ids ) );

    $campos = [
        'acemar_puerta_ranuras'      => '_acemar_puerta_ranuras',
        'acemar_puerta_acabado_foto' => '_acemar_puerta_acabado_foto',
        'acemar_puerta_interior'     => '_acemar_puerta_interior',
        'acemar_puerta_accesorios'   => '_acemar_puerta_accesorios',
    ];

    foreach ( $campos as $post_key => $meta_key ) {
        $value = isset( $_POST[ $post_key ] ) ? sanitize_text_field( $_POST[ $post_key ] ) : '';
        update_post_meta( $post_id, $meta_key, $value );
    }
}
add_action( 'save_post_acemar_puerta', 'acemar_save_meta_puerta' );
