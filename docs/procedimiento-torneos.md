# Procedimiento permanente · Torneos de Palo y Cuchara

**Aplicar en cada torneo mensual a partir de noviembre de 2026.**

## Objetivo
Mantener la web con una **Galería que sea exclusivamente un índice de álbumes por meses**. Cada torneo tiene una página propia con sus fotografías, premiados destacados al comienzo y el resto de imágenes después. Se siguen conservando los álbumes anteriores.

## Material que debe facilitar la organización
- Fotografías originales del torneo, en una o varias tandas; no es necesario enviarlas juntas.
- Clasificaciones oficiales **Scratch** y **Hándicap**, preferiblemente en Excel, para identificar los premiados sin adivinar.
- Si no está claro qué persona o qué foto corresponde a cada premiado, **pedir confirmación** antes de poner nombres o premios incorrectos.
- Fecha y nombre del torneo. Si hay imágenes adicionales, incorporarlas al mismo álbum sin borrar las anteriores.

## Orden y presentación de cada álbum mensual
1. Abrir con el título **«Torneo de [mes]»**, fecha y una descripción breve.
2. Apartado **«Los premiados del torneo»**: las fotos correspondientes a:
   - **1.º clasificado Scratch**, con su mención breve.
   - **1.º clasificado Hándicap**, con su mención breve.
   - **2.º clasificado Hándicap**, con su mención breve.
3. Debajo, apartado **«Entrega de premios y el hoyo 19»** con las demás fotografías, imágenes de grupo y comida.
4. Debajo de cada foto de premiado, una felicitación corta y elegante. Si el nombre está confirmado en resultados y en la foto, puede incluirse.
5. Al pulsar una fotografía, debe abrirse ampliada; incluir enlace **«Volver a los álbumes»**.

## Calidad y respeto al original
- **Usar siempre las imágenes originales de mayor resolución**, nunca miniaturas de Canva ni versiones comprimidas de 200 × 150 píxeles.
- Preparar copias **WebP** para la web, con ancho aproximado de **1.400–1.800 px** (sin ampliar artificialmente por encima de la resolución original), calidad de compresión alta, orientación correcta y proporciones originales; comprobar que sean nítidas al ampliarse.
- **No modificar caras, expresiones, personas ni contenido de las fotos**, ni añadir o quitar personas.
- Conservar la fuente original; las copias optimizadas se guardan dentro del repositorio y se referencian desde la página.
- Evitar enlaces temporales o firmados de herramientas de terceros para la web pública.

## Estructura de archivos (ejemplo diciembre de 2026)
- Fotos: `imagenes/torneo-diciembre-2026/foto-01.webp`, `foto-02.webp`, etc.
- Datos: añadir en `contenido.js` un álbum separado, por ejemplo `galeriaDiciembre2026`, con `titulo`, `descripcion`, `categoria`, `imagen` y `destacado` para las tres menciones especiales.
- Página mensual: `torneo-diciembre-2026.html`, que carga `contenido.js` y `assets/web.js`, con el identificador de página adecuado.
- Lógica: ampliar `assets/web.js` para renderizar el nuevo álbum y su enlace desde `pageGaleria()`; no sustituir el de noviembre. Mantener las funciones de ampliación (lightbox).
- Diseño: aprovechar las clases de `assets/estilos.css` para fichas del mes, premiados y resto de fotografías.

**Referencia ya publicada:** `galeria.html` (índice de meses) y `torneo-noviembre-2026.html` (álbum de noviembre, 14 fotos WebP).

## Publicación y comprobación
1. Incorporar los nuevos archivos de fotografía **de verdad** al repositorio `jordi210/palo-y-cuchara`; verificar que existen y que no son miniaturas.
2. Actualizar `contenido.js`, la página mensual, `assets/web.js` y cualquier estilo necesario.
3. Añadir **una sola tarjeta por torneo** a `galeria.html` mediante la función de renderizado, enlazada a la página propia del mes.
4. Actualizar la versión de caché de CSS/JS/datos en las páginas afectadas, para evitar que un navegador muestre la galería antigua.
5. Comprobar que cada imagen referenciada existe, que el álbum contiene **todas** las fotos, que la mención de premiados está en primer lugar y que las imágenes se pueden ampliar.
6. Verificar que la publicación de **GitHub Pages** termina con éxito.
7. Facilitar los dos enlaces: **`https://paloycuchara.es/galeria.html`** y el enlace al álbum del mes; si el dominio personalizado falla por DNS, diferenciar el problema DNS del estado de publicación en GitHub.
8. Confirmar lo realmente publicado y señalar cualquier parte pendiente. **No decir «publicado» antes de verificarlo.**

## Resultados oficiales organizados por meses (norma permanente)

**La pestaña «Resultados» funciona como un índice de torneos por meses, igual que la Galería.** No se colocan en ella todas las clasificaciones juntas.

### Publicación de cada torneo
1. Recibir las hojas **oficiales Scratch y Hándicap** de la jornada (preferentemente Excel) y validar nombres, puntuaciones, puestos, NP y NE. No inventar resultados.
2. Guardar ambas clasificaciones en `contenido.js` dentro de una **clave propia para ese mes** (por ejemplo, `resultadosDiciembre`), sin sustituir `resultadosNoviembre` ni los meses anteriores.
3. Añadir una entrada a la colección `resultadosMensuales` de `contenido.js` con:
   - `id`: por ejemplo, `2026-12`.
   - `fecha`: fecha real del torneo, formato `YYYY-MM-DD`.
   - `temporada`: por ejemplo `2026–2027`.
   - `titulo`: **«Resultados de diciembre»**.
   - `descripcion`: breve texto de la jornada.
   - `pagina`: **`resultados-diciembre-2026.html`**.
   - `clave`: **`resultadosDiciembre`** (la misma clave del paso 2).
   - `portada` (opcional): fotografía del mes en `imagenes/...`.
4. Crear la página mensual `resultados-diciembre-2026.html`, copiando la plantilla de `resultados-noviembre-2026.html` y cambiando los atributos del `body` a `data-page="resultados-mes" data-month="2026-12"`. Actualizar los metadatos (título, descripción) y la versión de caché de CSS/JS.
5. El índice `resultados.html` lista automáticamente `resultadosMensuales` **por fecha, del más reciente al más antiguo**, con una tarjeta por torneo. Al pulsar se abre la página de ese mes.
6. La página de cada mes muestra las pestañas **Hándicap** y **Scratch**, con todas las posiciones y puntos originales, y el enlace de vuelta a **Resultados por meses**.
7. Actualizar por separado el **Orden de mérito** acumulado de la temporada conforme a las normas (incluyendo jornadas sin participación, puntuaciones cero y descartes cuando corresponda). **No confundir** resultados del torneo con acumulado de temporada.
8. Confirmar que el índice, los enlaces del mes y ambas pestañas funcionan, que los recuentos coinciden con los archivos oficiales y que **GitHub Pages** ha publicado correctamente. No borrar meses anteriores.

### Ejemplo ya publicado
- Índice: `resultados.html` → **Resultados de noviembre**.
- Página del torneo: `resultados-noviembre-2026.html`, con los 37 registros Scratch y los 37 registros Hándicap facilitados por la organización.
- Este sistema se utiliza también para diciembre y todos los torneos futuros.

## Si también se reciben clasificaciones
Actualizar las secciones de **Resultados** y **Orden de mérito** desde los archivos oficiales, respetando Scratch, Hándicap, NP/NE y las normas de cálculo de la temporada. Esto no modifica por sí solo el orden de fotografías: el álbum mantiene siempre su propio apartado de premiados.

## Regla de continuidad
Cada nuevo mes **se añade** al índice general y crea su propio álbum, sin borrar fotos, resultados ni páginas de meses anteriores. Se aplica este procedimiento de forma recurrente siempre que el organizador envíe las imágenes del siguiente torneo.

## Orden de mérito: detalle de los ocho meses

La tabla de **Orden de mérito** contiene exactamente estas columnas, tanto para Scratch como para Hándicap:

**Posición · Jugador/a · Noviembre · Diciembre · Enero · Febrero · Marzo · Abril · Mayo · Junio · Puntos**.

- Cada columna mensual muestra los puntos oficiales de esa jornada. Si hay más de una jornada en un mes, se suman las puntuaciones de ese jugador.
- Cuando **todavía no se han publicado resultados del mes**, mostrar **—** (no inventar ceros).
- Cuando ya hay resultados del mes, pero un jugador **no puntuó o no participó**, mostrar **0**.
- La columna final **Puntos** mantiene la clasificación acumulada de la temporada; al cerrar la temporada aplica los dos descartes previstos.
- Las ocho columnas están visibles desde noviembre, aunque no se hayan celebrado los meses futuros. En dispositivos pequeños la tabla se desplaza horizontalmente, manteniendo la posición y el nombre del jugador a la vista.
- Los encabezados y las puntuaciones se generan con `mesesOrdenMerito()`, `playersFor()` y `renderTable()` en `assets/web.js`. Para próximas temporadas se utilizan automáticamente los años de `sitio.temporada` del archivo `contenido.js`.

## Mantener el posicionamiento de Google al publicar un torneo

Cuando se publique el siguiente torneo (fotos o resultados), además de actualizar las páginas y los datos:

1. Añadir las **nuevas páginas mensuales** (galería y resultados) al inventario `docs/seo-paginas.json`, con un título y una descripción propios, su `data-page`, y en resultados el `data-month`.
2. Actualizar en el HTML de cada página nueva su `<title>`, `meta description`, `canonical`, metadatos para redes sociales y JSON-LD siguiendo los ejemplos de noviembre.
3. Regenerar las versiones HTML estáticas con `node scripts/actualizar-seo.mjs`. Este paso es **obligatorio** después de cambiar `contenido.js` o `assets/web.js`: evita que Google vea información antigua mientras espera a ejecutar JavaScript.
4. Incluir en el mismo commit las instantáneas HTML generadas y el `sitemap.xml` actualizado.
5. Verificar `node scripts/actualizar-seo.mjs --check` y la tarea de GitHub Actions **«Comprobar SEO y páginas indexables»**; después comprobar la publicación de GitHub Pages.
6. Revisar en Google Search Console la indexación de `https://paloycuchara.es/` y enviar `https://paloycuchara.es/sitemap.xml` una vez verificada la propiedad del dominio.

No publicar meses ficticios ni alterar la clasificación oficial solo para mejorar el posicionamiento. El SEO debe describir fielmente el contenido.
