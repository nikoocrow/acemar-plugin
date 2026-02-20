# ⚡ Mejores Prácticas y Errores Comunes

## ✅ Mejores Prácticas

### 1. **Nombrado Consistente**
```javascript
// ✅ BIEN: Prefijo consistente
'acemar/featured-products'
'acemar/product-card'
'acemar-featured-products' (clase CSS)

// ❌ MAL: Inconsistente
'acemar/featuredProducts'
'acemar-ProductCard'
'.featured_products'
```

### 2. **Estructura de Archivos**
```
✅ BIEN:
src/
  mi-bloque/
    block.json
    index.js
    editor.scss
    style.scss

❌ MAL:
src/
  MiBloque.js
  estilos-mi-bloque.css
  config.json
```

### 3. **useBlockProps SIEMPRE**
```javascript
// ✅ BIEN: useBlockProps en Edit y Save
const Edit = () => {
    const blockProps = useBlockProps();
    return <div {...blockProps}>Contenido</div>;
};

const Save = () => {
    const blockProps = useBlockProps.save();
    return <div {...blockProps}>Contenido</div>;
};

// ❌ MAL: Sin useBlockProps
const Edit = () => {
    return <div className="mi-bloque">Contenido</div>;
};
```

### 4. **Attributes Type Safety**
```json
// ✅ BIEN: Tipos definidos con defaults
{
  "attributes": {
    "title": {
      "type": "string",
      "default": ""
    },
    "count": {
      "type": "number",
      "default": 0
    }
  }
}

// ❌ MAL: Sin defaults
{
  "attributes": {
    "title": {
      "type": "string"
    }
  }
}
```

### 5. **Internacionalización (i18n)**
```javascript
// ✅ BIEN: Textos traducibles
import { __ } from '@wordpress/i18n';

<Button>
    {__('Seleccionar imagen', 'acemar-blocks')}
</Button>

// ❌ MAL: Textos hardcodeados
<Button>Seleccionar imagen</Button>
```

### 6. **InnerBlocks Template Lock**
```javascript
// ✅ BIEN: Especifica comportamiento
<InnerBlocks
    template={TEMPLATE}
    templateLock="all"  // o false, o 'insert'
/>

// ❌ MAL: Sin especificar
<InnerBlocks template={TEMPLATE} />
```

## ❌ Errores Comunes

### 1. **Editar Archivos en build/**
```bash
❌ MAL: Editar build/featured-products/index.js
✅ BIEN: Editar src/featured-products/index.js
        Luego ejecutar: npm run build
```

### 2. **Olvidar Compilar**
```bash
# Editaste el código pero no se reflejan los cambios?
# Probablemente olvidaste compilar:

npm run build
# O mejor, usar modo desarrollo:
npm run start  # Recompila automáticamente
```

### 3. **Diferencia Edit vs Save**
```javascript
// ❌ ERROR COMÚN: Código diferente en Edit y Save
const Edit = () => {
    return (
        <div className="mi-clase-editor">
            <h2>Título en editor</h2>
        </div>
    );
};

const Save = () => {
    return (
        <div className="otra-clase">
            <h3>Título en frontend</h3>
        </div>
    );
};
// Resultado: "Block validation error" o contenido roto
```

```javascript
// ✅ BIEN: Estructura consistente
const Edit = ({ attributes }) => {
    const blockProps = useBlockProps({ className: 'mi-bloque' });
    return (
        <div {...blockProps}>
            <h2>{attributes.title}</h2>
        </div>
    );
};

const Save = ({ attributes }) => {
    const blockProps = useBlockProps.save({ className: 'mi-bloque' });
    return (
        <div {...blockProps}>
            <h2>{attributes.title}</h2>
        </div>
    );
};
```

### 4. **No usar ...blockProps**
```javascript
// ❌ MAL:
const blockProps = useBlockProps();
return <div className="mi-clase">Contenido</div>;

// ✅ BIEN:
const blockProps = useBlockProps({ className: 'mi-clase-adicional' });
return <div {...blockProps}>Contenido</div>;
// WordPress agrega sus clases + tus clases
```

### 5. **Template vs AllowedBlocks**
```javascript
// ❌ MAL: Template con bloques no permitidos
<InnerBlocks
    template={[
        ['core/heading'],
        ['core/paragraph']
    ]}
    allowedBlocks={['core/heading']}  // Paragraph no permitido!
/>

// ✅ BIEN: Coherencia
<InnerBlocks
    template={[
        ['core/heading'],
        ['core/paragraph']
    ]}
    allowedBlocks={['core/heading', 'core/paragraph']}
/>
```

### 6. **Mutar Attributes Directamente**
```javascript
// ❌ MAL: Mutar directamente
const Edit = ({ attributes }) => {
    attributes.title = "Nuevo título";  // NO HACER ESTO
};

// ✅ BIEN: Usar setAttributes
const Edit = ({ attributes, setAttributes }) => {
    setAttributes({ title: "Nuevo título" });
};
```

### 7. **Imports Incorrectos**
```javascript
// ❌ MAL: Importar desde paquetes incorrectos
import { Button } from 'react';

// ✅ BIEN: Usar paquetes de WordPress
import { Button } from '@wordpress/components';
import { InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
```

### 8. **CSS Selector Demasiado Específicos**
```scss
// ❌ MAL: Difícil de mantener y sobrescribir
.wp-block-acemar-featured-products .acemar-featured-products__grid .wp-block-acemar-product-card .acemar-product-card__content h3 {
    font-size: 20px;
}

// ✅ BIEN: Específico pero razonable
.acemar-product-card__heading {
    font-size: 20px;
}
```

### 9. **No Limpiar Eventos/Timers**
```javascript
// ❌ MAL: Memory leak
const Edit = () => {
    setInterval(() => {
        console.log('tick');
    }, 1000);
    
    return <div>Contenido</div>;
};

// ✅ BIEN: Limpiar en cleanup
const Edit = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            console.log('tick');
        }, 1000);
        
        return () => clearInterval(interval);
    }, []);
    
    return <div>Contenido</div>;
};
```

### 10. **Demasiados Re-renders**
```javascript
// ❌ MAL: Se crea nueva función en cada render
const Edit = ({ setAttributes }) => {
    return (
        <Button onClick={() => setAttributes({ clicked: true })}>
            Click
        </Button>
    );
};

// ✅ BIEN: useCallback para funciones
const Edit = ({ setAttributes }) => {
    const handleClick = useCallback(() => {
        setAttributes({ clicked: true });
    }, [setAttributes]);
    
    return <Button onClick={handleClick}>Click</Button>;
};
```

## 🔍 Debugging Tips

### 1. **Console.log en el Editor**
```javascript
const Edit = ({ attributes }) => {
    console.log('Attributes:', attributes);  // Se ve en la consola del navegador
    
    return <div>Contenido</div>;
};
```

### 2. **React DevTools**
- Instala React Developer Tools en Chrome
- Inspecciona componentes en tiempo real
- Ve props y state

### 3. **WordPress Debug**
```php
// En wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('SCRIPT_DEBUG', true);
```

### 4. **Verificar Compilación**
```bash
# Verifica que los archivos se generaron
ls -la build/featured-products/

# Debería mostrar:
# block.json
# index.js
# index.css (editor)
# style-index.css (frontend)
```

### 5. **Inspeccionar Block Validation**
```javascript
// En la consola del navegador cuando hay errores
wp.data.select('core/block-editor').getBlocks()
```

## 📦 Performance Tips

### 1. **Lazy Load Images**
```javascript
// ✅ BIEN para el frontend
<img 
    src={imageUrl} 
    alt={imageAlt}
    loading="lazy"
/>
```

### 2. **Optimizar CSS**
```scss
// ❌ MAL: Demasiados selectores anidados
.block {
    .container {
        .row {
            .col {
                .item {
                    // Demasiado anidado (especificidad alta)
                }
            }
        }
    }
}

// ✅ BIEN: Máximo 3 niveles
.block__item {
    // Flat y eficiente
}
```

### 3. **Evitar Inline Styles en Save**
```javascript
// ❌ MAL: Estilos inline
const Save = () => {
    return <div style={{ color: 'red' }}>Contenido</div>;
};

// ✅ BIEN: Usar clases CSS
const Save = () => {
    return <div className="mi-bloque--rojo">Contenido</div>;
};
```

## 🎯 Checklist Pre-Deploy

- [ ] Ejecutar `npm run build` (no `npm run start`)
- [ ] Probar en Chrome, Firefox, Safari
- [ ] Probar en móvil real (no solo DevTools)
- [ ] Verificar que los estilos se aplican
- [ ] No hay errores en consola
- [ ] Funciona con tema del sitio
- [ ] Accesibilidad (contraste, alt text)
- [ ] Performance (Lighthouse score)
- [ ] Compatible con Gutenberg actual
