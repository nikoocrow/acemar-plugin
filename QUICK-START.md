# 🚀 Guía Rápida - Acemar Blocks

## Comandos Esenciales

```bash
# Instalar dependencias (primera vez)
npm install

# Desarrollo (auto-recompila al guardar)
npm run start

# Compilar para producción
npm run build

# Formatear código
npm run format

# Linter de JavaScript
npm run lint:js
```

## 📂 ¿Dónde Edito Qué?

### Para cambiar FUNCIONALIDAD:
📝 `src/[bloque]/index.js`

### Para cambiar ESTILOS DEL EDITOR:
🎨 `src/[bloque]/editor.scss`

### Para cambiar ESTILOS DEL FRONTEND:
🎨 `src/[bloque]/style.scss`

### Para cambiar CONFIGURACIÓN del bloque:
⚙️ `src/[bloque]/block.json`

## 🧩 Anatomía de un Bloque

```javascript
// index.js
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const Edit = ({ attributes, setAttributes }) => {
    // Lo que ves en el EDITOR
    return <div>Editor view</div>;
};

const Save = ({ attributes }) => {
    // Lo que se GUARDA y muestra en el frontend
    return <div>Frontend view</div>;
};

registerBlockType('acemar/mi-bloque', {
    edit: Edit,
    save: Save,
});
```

## 🔑 Conceptos Clave en 30 Segundos

### InnerBlocks
Permite bloques dentro de bloques (como las tarjetas dentro del contenedor)

```javascript
<InnerBlocks
    template={[[bloque], [bloque]]}  // Bloques iniciales
    allowedBlocks={['acemar/card']}  // Solo estos bloques
    templateLock="all"               // No agregar/eliminar
/>
```

### Attributes
Los datos que guarda el bloque

```json
{
  "attributes": {
    "title": {
      "type": "string",
      "default": "Hola"
    }
  }
}
```

### useBlockProps
Hook necesario para que WordPress identifique el bloque

```javascript
const blockProps = useBlockProps({
    className: 'mi-clase-custom'
});

return <div {...blockProps}>Contenido</div>;
```

## 🎯 Flujo de Trabajo Típico

1. **Editas** código en `src/`
2. **Compilas** con `npm run build` o `npm run start`
3. **Refrescas** el editor de WordPress (Ctrl+R)
4. **Pruebas** tu bloque
5. **Repites**

## 🐛 Problemas Comunes

### "El bloque no aparece"
```bash
# Limpia y recompila
rm -rf build/
npm run build
```

### "Los estilos no se aplican"
- Limpia caché del navegador (Ctrl+Shift+R)
- Verifica que `build/` tenga los archivos CSS

### "Error de compilación"
- Lee el error en la terminal
- Generalmente es un error de sintaxis JSX o SCSS

## 📚 Recursos Útiles

- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [InnerBlocks Reference](https://developer.wordpress.org/block-editor/reference-guides/components/inner-blocks/)
- [@wordpress/scripts docs](https://developer.wordpress.org/block-editor/packages/packages-scripts/)

## 💡 Tips

- **Siempre usa `npm run start` en desarrollo** - recompila automáticamente
- **No edites archivos en `build/`** - se sobreescriben al compilar
- **Usa `console.log()` en el código** - aparece en la consola del navegador
- **Los estilos del editor NO afectan el frontend** - son separados por diseño
