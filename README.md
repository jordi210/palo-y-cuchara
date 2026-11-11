# Palo y Cuchara · Web multipágina

Temporada 2026–2027: Inicio, Orden de mérito Scratch/Hándicap, Calendario, homenaje a campeones anteriores, Galería, Curiosidades y Normas.

## Cómo actualizar

El editor local está en [`editar.html`](editar.html), **fuera del menú público**. No es un área protegida con contraseña: el sitio funciona en GitHub Pages, que sirve las páginas estáticas públicamente. «Guardar» solo conserva los cambios en el navegador; «Descargar contenido.js» permite exportarlos, pero no publica nada por sí mismo. Para publicar, actualiza ese archivo en GitHub. El editor muestra los álbumes y los resultados por meses, y permite editar sus títulos y descripciones; para crear un mes nuevo también hay que añadir los archivos HTML y fotos al repositorio.

La sección **Curiosidades** ya está recuperada del Canva original: 26 fotografías y 4 vídeos, con los títulos y el orden de las páginas 33 y 34. Los 30 recursos se guardan dentro de `imagenes/curiosidades/` y se muestran en `curiosidades.html` (no depende de enlaces temporales). La correspondencia original de Canva se documenta en `docs/curiosidades-canva-assets.json`; el importador reutilizable está en `scripts/importar_curiosidades_canva.py`.

## Procedimiento para los torneos mensuales

La publicación de nuevas fotografías se hace siguiendo el [procedimiento permanente de torneos](docs/procedimiento-torneos.md): una tarjeta por mes en la Galería, álbum propio, tres premiados destacados primero, fotos originales en WebP de alta calidad y verificación de GitHub Pages. Este es el procedimiento de referencia para los próximos torneos.

## Resultados mensuales

La pestaña [Resultados](resultados.html) es un índice de clasificaciones organizadas por meses. Cada torneo tiene su propia página con Scratch y Hándicap; por ejemplo, [Resultados de noviembre de 2026](resultados-noviembre-2026.html). Los nuevos meses se añadirán siguiendo el [procedimiento permanente](docs/procedimiento-torneos.md), sin sobrescribir los anteriores. El Orden de mérito es una clasificación acumulada distinta.

## Revisión de enlaces y seguridad · 11 de noviembre de 2026

- Logo oficial de I.D.P. Golf guardado como `imagenes/logo-idp-golf-oficial.png`; se sirve desde el propio repositorio para evitar enlaces externos rotos.
- Retirado el enlace al antiguo Canva y el editor del menú/pie públicos. Las páginas del editor y la guía llevan `noindex` (eso no equivale a autenticación).
- Navegación compacta en dispositivos hasta 1120 px; botón de menú accesible en móvil.
- Se actualizan los enlaces canónicos de las páginas a `https://paloycuchara.es/` y se fuerza el salto a HTTPS en el navegador si un visitante llega por HTTP.
- **Pendiente de configuración de administrador:** en GitHub → Settings → Pages, activar **Enforce HTTPS** para redirigir de HTTP a HTTPS a nivel de servidor. El certificado de GitHub Pages ya está aprobado, pero la opción no puede activarse con los permisos actuales del conector.
- La batería automática de pruebas se ejecuta con `scripts/auditar_web.py` y puede lanzarse desde GitHub Actions → «Auditoría navegación y recursos de la web».

## Posicionamiento en Google (SEO)

- `robots.txt` permite el rastreo y señala el mapa `sitemap.xml`; este último incluye las 11 páginas públicas y omite el editor.
- Cada página tiene título, descripción, URL canónica, etiquetas sociales (Open Graph/Twitter), datos estructurados y contenido HTML visible sin JavaScript.
- La lista de páginas que deben aparecer en Google se mantiene en `docs/seo-paginas.json`.
- **Al publicar cualquier cambio de datos**: ejecutar `node scripts/actualizar-seo.mjs`, incluir los archivos HTML y el sitemap que cambien, y comprobar `node scripts/actualizar-seo.mjs --check`.
- GitHub Actions → **Comprobar SEO y páginas indexables** valida que las 11 páginas, el sitemap y los metadatos están actualizados.
- **Google Search Console:** la propiedad del dominio `paloycuchara.es` debe ser verificada por un propietario con acceso a su cuenta de Google; después se envía `https://paloycuchara.es/sitemap.xml`. Subir el mapa a GitHub **no lo envía automáticamente** a Search Console.
- La indexación y las posiciones dependen de Google. No hay garantías de aparecer entre los primeros resultados.
