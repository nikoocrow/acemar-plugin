# Acemar Blocks Plugin

Plugin de bloques personalizados de Gutenberg para Acemar.

## Bloques incluidos

### 1. Solicitar Muestra (Samples CTA)

Bloque de Call to Action con imagen y contenido configurable.

**Características:**

- Imagen con fondo redondeado
- Contenido editable (título, texto, botón)
- Control de posición (imagen izquierda/derecha)
- Color de fondo personalizable
- Responsive design
- Botón con URL y target configurable

### 2. Featured Projects (Slider de Proyectos)

Slider de proyectos destacados con navegación.

### 3. Project Card (Tarjeta de Proyecto)

Tarjeta individual de proyecto con hover effects.

### 4. Hero Banner

Banner hero para páginas principales.

### 5. Productos Destacados

Grid de productos con efectos visuales.

## Instalación

1. Clonar el repositorio en `/wp-content/plugins/`
2. Instalar dependencias: `npm install`
3. Compilar bloques: `npm run build`
4. Activar el plugin en WordPress

## Desarrollo

```bash
# Instalar dependencias
npm install

# Compilar bloques (una vez)
npm run build

# Modo desarrollo (watch)
npm run start

# Compilar para producción
npm run build
```

## Requisitos

- WordPress 6.0+
- Node.js 14+
- PHP 7.4+

## Estructura

```
acemar-blocks-plugin/
├── src/                    # Archivos fuente
│   ├── samples-cta/       # Bloque Solicitar Muestra
│   ├── featured-projects/ # Slider de proyectos
│   ├── project-card/      # Tarjeta de proyecto
│   └── ...
├── build/                  # Archivos compilados
├── acemar-blocks.php      # Plugin principal
├── webpack.config.js      # Configuración Webpack
└── package.json           # Dependencias Node
```

## Autor

**Nicolas Castro** - GetReady

## Versión

1.0.3

## Licencia

Todos los derechos reservados - Acemar
