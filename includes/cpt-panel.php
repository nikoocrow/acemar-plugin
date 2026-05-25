<?php
/**
 * CPT: acemar_panel  –  Paneles Acústicos Domus
 *
 * Meta fields:
 *   _acemar_panel_hero_id          → ID imagen hero (banner superior)
 *   _acemar_panel_caracteristicas  → JSON array de strings
 *   _acemar_panel_galeria_titulo   → string
 *   _acemar_panel_galeria_texto    → string
 *   _acemar_panel_galeria_ids      → IDs separados por coma
 *
 * @package AcemarBlocks
 */

if ( ! defined( 'ABSPATH' ) ) exit;


// ============================================================
// CPT
// ============================================================
function acemar_register_cpt_panel() {
    register_post_type( 'acemar_panel', [
        'labels' => [
            'name'               => __( 'Paneles Domus',               'acemar-blocks' ),
            'singular_name'      => __( 'Panel Domus',                 'acemar-blocks' ),
            'add_new'            => __( 'Añadir panel',                'acemar-blocks' ),
            'add_new_item'       => __( 'Añadir nuevo panel',          'acemar-blocks' ),
            'edit_item'          => __( 'Editar panel',                'acemar-blocks' ),
            'new_item'           => __( 'Nuevo panel',                 'acemar-blocks' ),
            'view_item'          => __( 'Ver panel',                   'acemar-blocks' ),
            'search_items'       => __( 'Buscar paneles',              'acemar-blocks' ),
            'not_found'          => __( 'No se encontraron paneles',   'acemar-blocks' ),
            'not_found_in_trash' => __( 'No hay paneles en la papelera', 'acemar-blocks' ),
            'menu_name'          => __( 'Paneles Domus',               'acemar-blocks' ),
        ],
        'public'             => false,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'show_in_rest'       => true,
        'menu_icon'          => 'dashicons-grid-view',
        'menu_position'      => 27,
        'supports'           => [ 'title', 'thumbnail', 'editor' ],
        'has_archive'        => false,
        'rewrite'            => [ 'slug' => 'paneles-domus', 'with_front' => false ],
    ] );
}
add_action( 'init', 'acemar_register_cpt_panel' );


// ============================================================
// META FIELDS (REST)
// ============================================================
function acemar_register_meta_panel() {
    $type = 'acemar_panel';

    register_post_meta( $type, '_acemar_panel_hero_id', [
        'type' => 'integer', 'single' => true, 'default' => 0,
        'show_in_rest' => true, 'auth_callback' => '__return_true',
    ]);
    register_post_meta( $type, '_acemar_panel_caracteristicas', [
        'type' => 'string', 'single' => true, 'default' => '[]',
        'show_in_rest' => true, 'sanitize_callback' => 'wp_kses_post',
        'auth_callback' => '__return_true',
    ]);
    register_post_meta( $type, '_acemar_panel_galeria_titulo', [
        'type' => 'string', 'single' => true, 'default' => '',
        'show_in_rest' => true, 'sanitize_callback' => 'sanitize_text_field',
        'auth_callback' => '__return_true',
    ]);
    register_post_meta( $type, '_acemar_panel_galeria_texto', [
        'type' => 'string', 'single' => true, 'default' => '',
        'show_in_rest' => true, 'sanitize_callback' => 'sanitize_textarea_field',
        'auth_callback' => '__return_true',
    ]);
    register_post_meta( $type, '_acemar_panel_galeria_ids', [
        'type' => 'string', 'single' => true, 'default' => '',
        'show_in_rest' => true, 'sanitize_callback' => 'sanitize_text_field',
        'auth_callback' => '__return_true',
    ]);
}
add_action( 'init', 'acemar_register_meta_panel' );


// ============================================================
// META BOXES
// ============================================================
function acemar_add_metaboxes_panel() {
    // Hero — columna lateral
    add_meta_box(
        'acemar_panel_hero',
        __( 'Imagen Hero (banner superior)', 'acemar-blocks' ),
        'acemar_render_metabox_panel_hero',
        'acemar_panel', 'side', 'high'
    );
    // Características + Galería — columna principal
    add_meta_box(
        'acemar_panel_contenido',
        __( 'Características y Galería de Aplicaciones', 'acemar-blocks' ),
        'acemar_render_metabox_panel_contenido',
        'acemar_panel', 'normal', 'high'
    );
}
add_action( 'add_meta_boxes', 'acemar_add_metaboxes_panel' );


// ── Hero ──────────────────────────────────────────────────────
function acemar_render_metabox_panel_hero( WP_Post $post ) {
    wp_nonce_field( 'acemar_panel_save', 'acemar_panel_nonce' );
    $hero_id  = absint( get_post_meta( $post->ID, '_acemar_panel_hero_id', true ) );
    $hero_url = $hero_id ? wp_get_attachment_image_url( $hero_id, 'medium' ) : '';
    ?>
    <style>
        #acemar-hero-preview { width:100%; height:auto; border-radius:4px; display:block; margin-bottom:8px; <?php echo $hero_url ? '' : 'display:none;'; ?> }
        #acemar-hero-actions { display:flex; gap:8px; flex-wrap:wrap; }
    </style>

    <img id="acemar-hero-preview" src="<?php echo esc_url( $hero_url ); ?>" alt="">
    <input type="hidden" id="acemar_panel_hero_id" name="acemar_panel_hero_id" value="<?php echo esc_attr( $hero_id ); ?>">
    <div id="acemar-hero-actions">
        <button type="button" id="acemar-hero-select" class="button button-secondary">
            <?php echo $hero_id ? __( 'Cambiar hero', 'acemar-blocks' ) : __( 'Subir / seleccionar hero', 'acemar-blocks' ); ?>
        </button>
        <button type="button" id="acemar-hero-remove" class="button button-link-delete" <?php echo $hero_id ? '' : 'style="display:none"'; ?>>
            <?php _e( 'Quitar', 'acemar-blocks' ); ?>
        </button>
    </div>
    <p style="margin-top:8px;font-size:11px;color:#646970;font-style:italic;">
        <?php _e( 'Banner ancho que encabeza la página del panel. Recomendado: 1920 × 700 px mínimo.', 'acemar-blocks' ); ?>
    </p>

    <script>
    (function(){
        var frame;
        var inp     = document.getElementById('acemar_panel_hero_id');
        var preview = document.getElementById('acemar-hero-preview');
        var selBtn  = document.getElementById('acemar-hero-select');
        var remBtn  = document.getElementById('acemar-hero-remove');

        selBtn.addEventListener('click', function(){
            if (frame) { frame.open(); return; }
            frame = wp.media({ title:'<?php echo esc_js( __('Imagen Hero', 'acemar-blocks') ); ?>', button:{text:'<?php echo esc_js( __('Usar esta imagen', 'acemar-blocks') ); ?>'}, multiple:false, library:{type:'image'} });
            frame.on('select', function(){
                var att = frame.state().get('selection').first().toJSON();
                inp.value   = att.id;
                preview.src = att.sizes && att.sizes.medium ? att.sizes.medium.url : att.url;
                preview.style.display = 'block';
                selBtn.textContent = '<?php echo esc_js( __('Cambiar hero', 'acemar-blocks') ); ?>';
                remBtn.style.display = '';
            });
            frame.open();
        });

        remBtn.addEventListener('click', function(){
            inp.value = '';
            preview.src = '';
            preview.style.display = 'none';
            selBtn.textContent = '<?php echo esc_js( __('Subir / seleccionar hero', 'acemar-blocks') ); ?>';
            remBtn.style.display = 'none';
        });
    })();
    </script>
    <?php
}


// ── Características + Galería ─────────────────────────────────
function acemar_render_metabox_panel_contenido( WP_Post $post ) {
    $caract_raw = get_post_meta( $post->ID, '_acemar_panel_caracteristicas', true );
    $caract     = $caract_raw ? json_decode( $caract_raw, true ) : [];
    if ( ! is_array( $caract ) ) $caract = [];

    $gal_titulo = get_post_meta( $post->ID, '_acemar_panel_galeria_titulo', true );
    $gal_texto  = get_post_meta( $post->ID, '_acemar_panel_galeria_texto',  true );
    $gal_raw    = get_post_meta( $post->ID, '_acemar_panel_galeria_ids',    true );
    $gal_ids    = $gal_raw ? array_values( array_filter( array_map( 'absint', explode( ',', $gal_raw ) ) ) ) : [];
    ?>
    <style>
        .ap-section          { margin-bottom:28px; padding-bottom:24px; border-bottom:1px solid #e0e0e0; }
        .ap-section:last-child { border-bottom:none; margin-bottom:0; }
        .ap-section > h3     { margin:0 0 14px; font-size:13px; font-weight:600; color:#1d2327; display:flex; align-items:center; gap:6px; }
        .ap-field            { margin-bottom:12px; }
        .ap-field label      { display:block; font-weight:600; font-size:12px; color:#1d2327; margin-bottom:4px; }
        .ap-field input,
        .ap-field textarea   { width:100%; box-sizing:border-box; }
        /* Características */
        #ap-caract-list                  { list-style:none; margin:0 0 10px; padding:0; }
        .ap-caract-item                  { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
        .ap-caract-item input            { flex:1; }
        .ap-caract-item .ap-rm           { flex-shrink:0; background:none; border:1px solid #d63638; color:#d63638; border-radius:3px; padding:3px 9px; cursor:pointer; font-size:11px; line-height:1.5; }
        .ap-caract-item .ap-rm:hover     { background:#d63638; color:#fff; }
        /* Galería */
        #ap-gal-wrap                     { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:10px; }
        .ap-gal-thumb                    { position:relative; width:78px; height:78px; }
        .ap-gal-thumb img                { width:78px; height:78px; object-fit:cover; border-radius:4px; border:1px solid #ddd; display:block; }
        .ap-gal-thumb .ap-rm             { position:absolute; top:-7px; right:-7px; background:#d63638; color:#fff; border:none; border-radius:50%; width:19px; height:19px; cursor:pointer; font-size:12px; line-height:19px; text-align:center; padding:0; font-weight:700; }
        #ap-gal-add                      { cursor:pointer; background:#f0f0f1; border:2px dashed #8c8f94; border-radius:4px; width:78px; height:78px; display:flex; align-items:center; justify-content:center; font-size:26px; color:#8c8f94; user-select:none; }
        #ap-gal-add:hover                { border-color:#2271b1; color:#2271b1; }
    </style>

    <!-- ── Características ───────────────────────────────── -->
    <div class="ap-section">
        <h3>📋 Lista de Características</h3>
        <ul id="ap-caract-list">
            <?php foreach ( $caract as $texto ) : ?>
            <li class="ap-caract-item">
                <span style="color:#999;font-size:16px;flex-shrink:0">✓</span>
                <input type="text" name="acemar_panel_caracteristicas[]" value="<?php echo esc_attr( $texto ); ?>" placeholder="Ej: Absorción acústica óptima">
                <button type="button" class="ap-rm">✕ Quitar</button>
            </li>
            <?php endforeach; ?>
        </ul>
        <button type="button" id="ap-caract-add" class="button">+ Agregar característica</button>
        <p style="margin-top:8px;font-size:11px;color:#646970;font-style:italic;">
            <?php _e( 'Aparecen junto a la imagen destacada en la página del panel.', 'acemar-blocks' ); ?>
        </p>
    </div>

    <!-- ── Galería de Aplicaciones ───────────────────────── -->
    <div class="ap-section">
        <h3>🖼 Galería de Aplicaciones</h3>
        <div class="ap-field">
            <label><?php _e( 'Título de la sección', 'acemar-blocks' ); ?></label>
            <input type="text" name="acemar_panel_galeria_titulo" value="<?php echo esc_attr( $gal_titulo ); ?>" placeholder="Ej: Aplicaciones">
        </div>
        <div class="ap-field">
            <label><?php _e( 'Párrafo descriptivo', 'acemar-blocks' ); ?></label>
            <textarea name="acemar_panel_galeria_texto" rows="3" placeholder="Texto que aparece sobre la galería de imágenes..."><?php echo esc_textarea( $gal_texto ); ?></textarea>
        </div>
        <div class="ap-field">
            <label><?php _e( 'Imágenes de la galería', 'acemar-blocks' ); ?></label>
            <div id="ap-gal-wrap">
                <?php foreach ( $gal_ids as $id ) :
                    $url = wp_get_attachment_image_url( $id, 'thumbnail' );
                    if ( ! $url ) continue; ?>
                    <div class="ap-gal-thumb" data-id="<?php echo esc_attr( $id ); ?>">
                        <img src="<?php echo esc_url( $url ); ?>" alt="">
                        <button type="button" class="ap-rm">×</button>
                    </div>
                <?php endforeach; ?>
                <div id="ap-gal-add" title="Agregar imágenes">+</div>
            </div>
            <input type="hidden" id="ap_gal_ids" name="acemar_panel_galeria_ids" value="<?php echo esc_attr( implode( ',', $gal_ids ) ); ?>">
        </div>
    </div>

    <script>
    (function(){
        /* ── Características ── */
        var cList = document.getElementById('ap-caract-list');

        function rmHandler(btn){
            btn.addEventListener('click', function(){ btn.closest('li').remove(); });
        }
        cList.querySelectorAll('.ap-rm').forEach(rmHandler);

        document.getElementById('ap-caract-add').addEventListener('click', function(){
            var li = document.createElement('li');
            li.className = 'ap-caract-item';
            li.innerHTML = '<span style="color:#999;font-size:16px;flex-shrink:0">✓</span><input type="text" name="acemar_panel_caracteristicas[]" value="" placeholder="Ej: Característica del panel"><button type="button" class="ap-rm">✕ Quitar</button>';
            rmHandler(li.querySelector('.ap-rm'));
            cList.appendChild(li);
            li.querySelector('input').focus();
        });

        /* ── Galería ── */
        var galWrap = document.getElementById('ap-gal-wrap');
        var galInp  = document.getElementById('ap_gal_ids');
        var galAdd  = document.getElementById('ap-gal-add');
        var galFrame;

        function getIds(){
            return Array.from(galWrap.querySelectorAll('.ap-gal-thumb'))
                        .map(function(el){ return parseInt(el.dataset.id, 10); })
                        .filter(Boolean);
        }
        function syncIds(){ galInp.value = getIds().join(','); }

        function addThumb(id, url){
            var div = document.createElement('div');
            div.className = 'ap-gal-thumb';
            div.dataset.id = id;
            div.innerHTML = '<img src="' + url + '" alt=""><button type="button" class="ap-rm">×</button>';
            div.querySelector('.ap-rm').addEventListener('click', function(){ div.remove(); syncIds(); });
            galWrap.insertBefore(div, galAdd);
            syncIds();
        }

        galWrap.querySelectorAll('.ap-gal-thumb .ap-rm').forEach(function(btn){
            btn.addEventListener('click', function(){ btn.closest('.ap-gal-thumb').remove(); syncIds(); });
        });

        galAdd.addEventListener('click', function(){
            if (galFrame) { galFrame.open(); return; }
            galFrame = wp.media({ title:'<?php echo esc_js( __('Galería de Aplicaciones', 'acemar-blocks') ); ?>', button:{text:'<?php echo esc_js( __('Agregar imágenes', 'acemar-blocks') ); ?>'}, multiple:true, library:{type:'image'} });
            galFrame.on('select', function(){
                var cur = getIds();
                galFrame.state().get('selection').each(function(att){
                    if (cur.indexOf(att.id) !== -1) return;
                    var url = att.attributes.sizes && att.attributes.sizes.thumbnail
                        ? att.attributes.sizes.thumbnail.url
                        : att.attributes.url;
                    addThumb(att.id, url);
                    cur.push(att.id);
                });
            });
            galFrame.open();
        });
    })();
    </script>
    <?php
}


// ============================================================
// GUARDAR META
// ============================================================
function acemar_save_meta_panel( int $post_id ) {
    if ( ! isset( $_POST['acemar_panel_nonce'] ) ) return;
    if ( ! wp_verify_nonce( $_POST['acemar_panel_nonce'], 'acemar_panel_save' ) ) return;
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    // Hero
    update_post_meta( $post_id, '_acemar_panel_hero_id',
        absint( $_POST['acemar_panel_hero_id'] ?? 0 )
    );

    // Características → JSON
    $raw   = isset( $_POST['acemar_panel_caracteristicas'] ) ? (array) $_POST['acemar_panel_caracteristicas'] : [];
    $caract = array_values( array_filter( array_map( 'sanitize_text_field', $raw ) ) );
    update_post_meta( $post_id, '_acemar_panel_caracteristicas',
        wp_json_encode( $caract, JSON_UNESCAPED_UNICODE )
    );

    // Galería
    update_post_meta( $post_id, '_acemar_panel_galeria_titulo',
        sanitize_text_field( $_POST['acemar_panel_galeria_titulo'] ?? '' )
    );
    update_post_meta( $post_id, '_acemar_panel_galeria_texto',
        sanitize_textarea_field( $_POST['acemar_panel_galeria_texto'] ?? '' )
    );
    $gal_ids = array_values( array_filter(
        array_map( 'absint', explode( ',', $_POST['acemar_panel_galeria_ids'] ?? '' ) )
    ));
    update_post_meta( $post_id, '_acemar_panel_galeria_ids', implode( ',', $gal_ids ) );
}
add_action( 'save_post_acemar_panel', 'acemar_save_meta_panel' );


// ============================================================
// TEMPLATE ÚNICO
// ============================================================
function acemar_panel_template_include( $template ) {
    if ( ! is_singular( 'acemar_panel' ) ) return $template;

    $theme_tpl  = locate_template( 'single-acemar_panel.php' );
    if ( $theme_tpl ) return $theme_tpl;

    $plugin_tpl = ACEMAR_BLOCKS_PATH . 'templates/single-acemar_panel.php';
    if ( file_exists( $plugin_tpl ) ) return $plugin_tpl;

    return $template;
}
add_filter( 'template_include', 'acemar_panel_template_include' );


// ============================================================
// ASSETS EN SINGLE
// ============================================================
function acemar_panel_single_assets() {
    if ( ! is_singular( 'acemar_panel' ) ) return;

    wp_enqueue_style(
        'acemar-paneles-grid-style',
        ACEMAR_BLOCKS_URL . 'build/paneles-grid/style-index.css',
        [], ACEMAR_BLOCKS_VERSION
    );
    wp_enqueue_script(
        'acemar-paneles-grid-frontend',
        ACEMAR_BLOCKS_URL . 'build/paneles-grid/frontend.js',
        [], ACEMAR_BLOCKS_VERSION, true
    );
    wp_enqueue_style( 'wp-block-library' );

    if ( ! wp_style_is( 'acemar-google-fonts', 'enqueued' ) ) {
        wp_enqueue_style(
            'acemar-google-fonts',
            'https://fonts.googleapis.com/css2?family=Italiana&family=Tenor+Sans&display=swap',
            [], null
        );
    }
}
add_action( 'wp_enqueue_scripts', 'acemar_panel_single_assets' );


// ============================================================
// HINTS ADMIN
// ============================================================
function acemar_panel_admin_hints() {
    $screen = get_current_screen();
    if ( ! $screen || $screen->post_type !== 'acemar_panel' ) return;
    ?>
    <style>
        #postimagediv .inside::after {
            content: "★ Esta imagen aparece en el grid del sitio y en la sección de características del panel.";
            display:block; margin-top:8px; font-size:11px; color:#2271b1; font-style:italic;
        }
    </style>
    <?php
}
add_action( 'admin_head', 'acemar_panel_admin_hints' );
