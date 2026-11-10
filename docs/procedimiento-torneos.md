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

## Si también se reciben clasificaciones
Actualizar las secciones de **Resultados** y **Orden de mérito** desde los archivos oficiales, respetando Scratch, Hándicap, NP/NE y las normas de cálculo de la temporada. Esto no modifica por sí solo el orden de fotografías: el álbum mantiene siempre su propio apartado de premiados.

## Regla de continuidad
Cada nuevo mes **se añade** al índice general y crea su propio álbum, sin borrar fotos, resultados ni páginas de meses anteriores. Se aplica este procedimiento de forma recurrente siempre que el organizador envíe las imágenes del siguiente torneo.
