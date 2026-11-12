(function(){
'use strict';
// Seguridad adicional: si se entra por HTTP al dominio oficial, llevar al visitante a HTTPS.
// La imposición a nivel de servidor debe activarse también en GitHub Pages.
if(window.location?.protocol==='http:' && /^(www\.)?paloycuchara\.es$/i.test(window.location.hostname)){
  window.location.replace('https://'+window.location.host+window.location.pathname+window.location.search+window.location.hash);
  return;
}
const original=window.PYC_CONTENT||{};
let c;
try{const local=localStorage.getItem('pyc_web_v2');c=local?JSON.parse(local):original;}catch(_){c=original;}
// Garantizar que la clasificación publicada sea visible aunque el navegador conserve una edición local antigua.
if(original.resultadosNoviembre&&!c.resultadosNoviembre)c.resultadosNoviembre=original.resultadosNoviembre;
if(original.resultadosMensuales?.length)c.resultadosMensuales=original.resultadosMensuales;
if(original.galeriaNoviembre2026?.length)c.galeriaNoviembre2026=original.galeriaNoviembre2026;
// Las Curiosidades publicadas desde Canva prevalecen sobre borradores antiguos sin imágenes.
if(original.curiosidades?.length)c.curiosidades=original.curiosidades;
if((!Array.isArray(c.participantes)||!c.participantes.length)&&original.participantes?.length)c.participantes=original.participantes;
if((!Array.isArray(c.puntuaciones)||!c.puntuaciones.length)&&original.puntuaciones?.length)c.puntuaciones=original.puntuaciones;
window.PYC=c;
// Migrar la paleta original del sitio a los azules y al naranja elegidos por la organización.
if((c.sitio?.colorPrincipal||'').toLowerCase()==='#193d2a')c.sitio.colorPrincipal='#496b9c';
if((c.sitio?.colorDorado||'').toLowerCase()==='#d5b16a')c.sitio.colorDorado='#f26c2d';
if(c.sitio?.portadaImagen==='imagenes/cabecera-torneo.jpg')c.sitio.portadaImagen='imagenes/final-golf-palo-cuchara.webp';
if(/^#[0-9a-f]{6}$/i.test(c.sitio?.colorPrincipal||''))document.documentElement.style.setProperty('--green',c.sitio.colorPrincipal);
if(/^#[0-9a-f]{6}$/i.test(c.sitio?.colorDorado||''))document.documentElement.style.setProperty('--gold',c.sitio.colorDorado);
const page=document.body.dataset.page||'inicio';
const h=(s)=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const url=s=>{s=String(s||'');return /^(https?:\/\/|imagenes\/|data:image\/(?:png|jpeg|webp|gif);base64,)/i.test(s)?h(s):'#';};
const links=[['inicio','Inicio','index.html'],['orden','Orden de mérito','orden-merito.html'],['calendario','📅 Calendario','calendario.html'],['resultados','Resultados','resultados.html'],['galeria','Galería','galeria.html'],['campeones','Campeones 25-26','campeones.html'],['normas','Normas','normas.html'],['patrocinadores','Patrocinadores','patrocinadores.html']];
// Menú tipo acordeón para móviles y tabletas. En escritorio se conserva la navegación horizontal.
const accLink=(href,label,current)=>`<a href="${href}" class="accordion-link${current?' active':''}" ${current?'aria-current="page"':''}>${label}</a>`;
const accClub=['campeones','normas','curiosidades'].includes(page);
const accTorneos=['orden','calendario','resultados','resultados-mes','galeria','torneo-noviembre'].includes(page);
const mobileAccordion=`<nav class="pyc-accordion" id="mobileAccordion" aria-label="Menú desplegable">
<a href="index.html" class="accordion-home${page==='inicio'?' active':''}" ${page==='inicio'?'aria-current="page"':''}>INICIO</a>
<details class="accordion-group" ${accClub?'open':''}>
<summary>PALO Y CUCHARA<span class="accordion-arrow" aria-hidden="true"></span></summary>
<div class="accordion-panel">
${accLink('campeones.html','Campeones 25–26',page==='campeones')}
${accLink('curiosidades.html','Curiosidades',page==='curiosidades')}
${accLink('normas.html','Normas y reglamento',page==='normas')}
</div></details>
<details class="accordion-group" ${accTorneos?'open':''}>
<summary>TORNEOS<span class="accordion-arrow" aria-hidden="true"></span></summary>
<div class="accordion-panel">
${accLink('calendario.html','Calendario',page==='calendario')}
${accLink('orden-merito.html','Orden de mérito',page==='orden')}
${accLink('resultados.html','Resultados por meses',page==='resultados'||page==='resultados-mes')}
${accLink('galeria.html','Galería de imágenes mensual',page==='galeria'||page==='torneo-noviembre')}
</div></details>
<a href="patrocinadores.html" class="accordion-home${page==='patrocinadores'?' active':''}" ${page==='patrocinadores'?'aria-current="page"':''}>PATROCINADORES</a>
</nav>`;
const header=`<header class="header"><div class="container nav-wrap"><a class="brand" href="index.html" aria-label="Palo y Cuchara, inicio"><span class="brand-emblem" role="img" aria-label="Logotipo oficial de Palo y Cuchara"></span><span class="brand-copy"><strong>Palo y Cuchara</strong><small>Golf entre amigos</small></span></a><button id="menuToggle" class="mobile-menu" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobileAccordion">☰</button><nav id="mainMenu" class="menu" aria-label="Navegación principal">${links.map(([id,txt,href])=>id==='galeria'?`<div class="nav-dropdown"><a class="${page==='galeria'||page==='torneo-noviembre'||page==='curiosidades'?'active':''}" href="galeria.html">Galería <span aria-hidden="true">▾</span></a><div class="nav-submenu"><a href="galeria.html" ${page==='galeria'?'aria-current="page"':''}>Galería de fotos</a><a href="curiosidades.html" ${page==='curiosidades'?'aria-current="page"':''}>Curiosidades</a></div></div>`:`<a class="${(page===id||(page==='resultados-mes'&&id==='resultados'))?'active':''}${id==='calendario'?' calendar-tab':''}${id==='patrocinadores'?' sponsors-tab':''}" href="${href}" ${(page===id||(page==='resultados-mes'&&id==='resultados'))?'aria-current="page"':''}>${txt}</a>`).join('')}</nav>${mobileAccordion}</div></header>`;
const dropdownCSS=document.createElement('style');dropdownCSS.textContent=`.nav-dropdown{position:relative;display:flex;align-items:center}.nav-submenu{display:none;position:absolute;top:100%;left:0;min-width:175px;background:#fff;border:1px solid #dce4ef;border-radius:9px;box-shadow:0 12px 28px #1c355033;padding:7px;z-index:80}.nav-dropdown:hover .nav-submenu,.nav-dropdown:focus-within .nav-submenu{display:grid}.menu .nav-submenu a{display:block;padding:10px 12px;white-space:nowrap}.nav-dropdown>a{white-space:nowrap}@media(max-width:800px){.nav-dropdown{display:block;width:100%}.nav-dropdown>a{display:block}.nav-submenu{display:grid;position:static;box-shadow:none;border:0;border-left:2px solid #f26c2d;border-radius:0;margin:0 0 4px 15px;padding:0 0 0 8px;background:transparent}.menu .nav-submenu a{padding:9px 12px}}`;document.head.appendChild(dropdownCSS);
const footer=`<footer class="footer"><div class="container"><div class="footer-top"><div><strong>Palo y Cuchara</strong><p>${h(c.sitio?.lema||'Golf y amistad')}</p><p>Campo de Golf · Base Aérea de Zaragoza</p></div><div class="footer-links"><a href="index.html">Inicio</a><a href="orden-merito.html">Orden de mérito</a><a href="resultados.html">Resultados mensuales</a><a href="calendario.html">Calendario</a><a href="galeria.html">Galería</a><a href="curiosidades.html">Curiosidades</a><a href="normas.html">Normas</a><a href="patrocinadores.html">Patrocinadores</a></div></div><div class="footer-bottom"><span>© Palo y Cuchara · Temporada ${h(c.sitio?.temporada)}</span><span>Golf, competición y amistad · Zaragoza</span></div></div></footer>`;
function title(t,desc){return `<div class="page-head"><div class="container"><span class="eyebrow">Palo y Cuchara · ${h(c.sitio?.temporada)}</span><h1>${h(t)}</h1><p>${h(desc)}</p></div></div>`}
function shortDate(s){if(!s)return 'Fecha pendiente';const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'})}
function dayBox(s){if(!s)return ['—','POR CONFIRMAR'];const [y,m,d]=s.split('-').map(Number);return [d,new Date(y,m-1,d).toLocaleDateString('es-ES',{month:'short'}).replace('.','').toUpperCase()]}
function eventCard(e){const [d,m]=dayBox(e.fecha);return `<article class="event-card"><div class="event-date"><strong>${h(d)}</strong><span>${h(m)}</span></div><div class="event-body"><span class="pill ${/cerrada/i.test(e.estado)?'neutral':'gold'}">${h(e.estado||'Por confirmar')}</span><h3>${h(e.titulo)}</h3><div class="event-meta"><span>📅 ${h(shortDate(e.fecha))}</span>${e.hora?`<span>🕘 ${h(e.hora)} h</span>`:''}<span>📍 ${h(e.lugar||'Campo por confirmar')}</span></div><p>${h(e.descripcion||'')}</p>${e.enlace?`<a class="text-link" target="_blank" rel="noopener" href="${url(e.enlace)}">Ver convocatoria</a>`:''}</div></article>`}
function pageInicio(){return `<section class="hero"><div class="hero-inner"><span class="eyebrow">Temporada ${h(c.sitio.temporada)} · Zaragoza</span><h1>Palo y<br>Cuchara</h1><p>${h(c.sitio.lema)}</p><div class="hero-actions"><a class="btn gold" href="orden-merito.html">Ver orden de mérito ↗</a><a class="btn outline" href="calendario.html">📅 Calendario de torneos</a></div></div></section><section class="section"><div class="container"><div class="section-head"><div><span class="kicker">Lo que nos une</span><h2>Golf, amigos y muchas historias</h2><p>${h(c.sitio.anuncio)}</p></div></div><div class="grid home-links"><a href="orden-merito.html" class="card"><div class="body"><span class="kicker">Temporada actual</span><h3>Orden de mérito</h3><p>Scratch y Hándicap, clasificaciones independientes y actualizables.</p><p style="margin-top:19px" class="text-link">Ver clasificaciones</p></div></a><a href="resultados.html" class="card"><div class="body"><span class="kicker">Cada jornada</span><h3>Resultados</h3><p>Consulta las clasificaciones Scratch y Hándicap de cada torneo, ordenadas por meses.</p><p style="margin-top:19px" class="text-link">Ver resultados</p></div></a><a href="galeria.html" class="card"><div class="body"><span class="kicker">Fotografías por meses</span><h3>Galería mensual</h3><p>Revive cada jornada con las fotos de los torneos, los premiados y el hoyo 19.</p><p style="margin-top:19px" class="text-link">Ver álbumes</p></div></a><a href="campeones.html" class="card"><div class="body"><span class="kicker">Mención especial</span><h3>Los campeones</h3><p>Un homenaje a quienes brillaron en la temporada anterior.</p><p style="margin-top:19px" class="text-link">Conocer ganadores</p></div></a></div></div></section><section class="section"><div class="container"><div class="featured"><img src="${url(c.sitio.portadaImagen)}" alt="Escena de golf al sol: bolsa, palos, bola, green y avión sobrevolando el campo"><div class="copy"><span class="kicker">Golpeamos con estilo</span><h2>El espíritu del Palo y Cuchara</h2><p>Competimos, compartimos mesa y coleccionamos recuerdos. Este espacio reúne todo lo importante de nuestra temporada, sin perder las historias que nos hacen únicos.</p><a class="btn green" style="align-self:start;margin-top:10px" href="galeria.html">Entrar en la galería</a></div></div></div></section><section class="band"><div class="container"><div><strong>¿Preparado para la próxima jornada?</strong><p>Consulta las fechas, las novedades y toda la información del torneo.</p></div><a class="btn gold" href="calendario.html">Ver calendario ↗</a></div></section>`}
// Temporada de noviembre a junio: todos los meses se muestran desde el inicio.
function mesesOrdenMerito(){
 const temporada=String(c.sitio?.temporada||'');
 const anio=Number((temporada.match(/20\d{2}/)||[])[0])||2026;
 return [
  ['Noviembre',11,anio],['Diciembre',12,anio],
  ['Enero',1,anio+1],['Febrero',2,anio+1],
  ['Marzo',3,anio+1],['Abril',4,anio+1],
  ['Mayo',5,anio+1],['Junio',6,anio+1]
 ].map(([nombre,mes,year])=>({nombre,clave:year+'-'+String(mes).padStart(2,'0')}));
}
function playersFor(kind){
 const meses=mesesOrdenMerito();
 const claves=new Set(meses.map(m=>m.clave));
 const mesPorJornada=new Map((c.jornadas||[]).map(j=>[
   String(j.id),
   String(j.fecha||j.id).slice(0,7)
 ]));
 const puntuaciones=(c.puntuaciones||[]).filter(x=>x.jugador&&x.jornada).map(x=>({
   nombre:String(x.jugador).trim(),
   mes:mesPorJornada.get(String(x.jornada))||String(x.jornada).slice(0,7),
   puntos:Number(x[kind])||0
 })).filter(x=>claves.has(x.mes));
 const mesesPublicados=new Set(puntuaciones.map(x=>x.mes));
 const porJugador=new Map();
 for(const p of puntuaciones){
   if(!porJugador.has(p.nombre))porJugador.set(p.nombre,new Map());
   const porMes=porJugador.get(p.nombre);
   porMes.set(p.mes,(porMes.get(p.mes)||0)+p.puntos);
 }
 const jugadores=[...new Set([
   ...(c.participantes||[]),
   ...puntuaciones.map(p=>p.nombre)
 ].map(x=>String(x||'').trim()).filter(Boolean))];
 const rows=jugadores.map(name=>{
   const porMes=porJugador.get(name)||new Map();
   // null significa que la jornada todavía no tiene resultados publicados.
   // 0 significa que el mes ya tiene resultados, pero el jugador no puntuó.
   const puntosMes=meses.map(m=>mesesPublicados.has(m.clave)?(porMes.get(m.clave)||0):null);
   const puntuados=puntosMes.filter(v=>v!==null);
   const totalBruto=puntuados.reduce((a,b)=>a+b,0);
   const descartes=c.sitio.cierreTemporada&&puntuados.length>=3
      ?puntuados.slice().sort((a,b)=>a-b).slice(0,2).reduce((a,b)=>a+b,0):0;
   return {name,puntosMes,total:totalBruto-descartes,raw:totalBruto,turns:puntuados.length};
 });
 return rows.sort((a,b)=>b.total-a.total||a.name.localeCompare(b.name,'es'));
}
function renderTable(kind){
 const rows=playersFor(kind);
 const meses=mesesOrdenMerito();
 if(!rows.length)return `<div class="empty"><div class="symbol">⛳</div><strong>Clasificación por estrenar</strong><p>Las posiciones aparecerán cuando se publiquen los puntos de las jornadas de la temporada ${h(c.sitio.temporada)}.</p></div>`;
 const fmt=n=>Number(n).toLocaleString('es-ES',{maximumFractionDigits:2});
 return `<div class="table-wrap merito-scroll" role="region" tabindex="0" aria-label="Orden de mérito ${h(kind)}: desplaza la tabla horizontalmente para consultar todos los meses">
 <table class="merito-table">
 <caption class="visually-hidden">Orden de mérito ${h(kind)}, de noviembre a junio, con puntos mensuales y acumulado.</caption>
 <thead><tr><th class="merito-pos" scope="col">Posición</th><th class="merito-nombre" scope="col">Jugador/a</th>
 ${meses.map(m=>`<th class="num merito-mes" scope="col">${h(m.nombre)}</th>`).join('')}
 <th class="num merito-total" scope="col">Puntos</th></tr></thead>
 <tbody>${rows.map((p,i)=>`<tr><td class="merito-pos"><b>${i+1}º</b></td>
 <th class="merito-nombre" scope="row">${h(p.name)}</th>
 ${p.puntosMes.map((puntos,j)=>`<td class="num merito-mes ${puntos===null?'merito-pendiente':''}" title="${h(meses[j].nombre)}: ${puntos===null?'Pendiente de publicar':fmt(puntos)+' puntos'}">${puntos===null?'—':fmt(puntos)}</td>`).join('')}
 <td class="num merito-total"><strong>${fmt(p.total)}</strong></td></tr>`).join('')}</tbody></table></div>
 <p class="hint merito-help">Desliza la tabla hacia los lados para ver todos los meses y el total. <strong>—</strong> = resultados todavía no publicados; <strong>0</strong> = sin puntos en una jornada ya publicada.</p>`;
}
function pageOrden(){return `${title('Orden de mérito','Temporada actual. Dos categorías independientes: Scratch y Hándicap.')}<section class="section"><div class="container"><div class="section-head"><div><span class="kicker">Clasificaciones oficiales</span><h2>Temporada ${h(c.sitio.temporada)}</h2><p>Selecciona una categoría para consultar los puntos de los participantes.</p></div></div><div class="tabs" role="tablist" aria-label="Categorías"><button id="tab-handicap" class="active" role="tab" aria-selected="true">Hándicap</button><button id="tab-scratch" role="tab" aria-selected="false">Scratch</button></div><div id="ranking">${renderTable('handicap')}</div><div class="notice" style="margin-top:23px"><strong>Cómo funciona la clasificación:</strong> Las ausencias cuentan como cero puntos. Al terminar la temporada, se descartan los dos peores resultados de cada jugador, incluidas posibles ausencias. ${c.sitio.cierreTemporada?'Los descartes finales ya están aplicados.':'Durante la temporada se muestran los puntos acumulados sin aplicar todavía los descartes finales.'}</div><p class="hint" style="margin-top:16px">Los puntos introducidos son los oficiales facilitados por la organización; la web no inventa ni calcula puntuaciones de juego.</p><p style="margin-top:19px"><a class="btn green" href="resultados.html">Ver los resultados de cada mes ↗</a></p></div></section>`}
function renderMensual(kind, datos){
 const lista=(datos||{})[kind]||[];
 if(!lista.length)return '<div class="empty">Todavía no hay resultados publicados.</div>';
 return `<div class="table-wrap"><table class="resultados-table"><thead><tr><th>Posición</th><th>Jugador/a</th><th class="num">Puntos</th></tr></thead><tbody>${lista.map(([pos,nombre,puntos])=>`<tr><td><b>${h(pos==='NP'||pos==='NE'?pos:pos+'º')}</b></td><td>${h(nombre)}</td><td class="num"><strong>${h(puntos==null?'—':puntos)}</strong></td></tr>`).join('')}</tbody></table></div>`;
}
function pageResultados(){
  const meses=(c.resultadosMensuales||[]).slice().sort((a,b)=>String(b.fecha||'').localeCompare(String(a.fecha||'')));
  const tarjetas=meses.map(m=>{
    const datos=c[m.clave]||{};
    const participantes=Math.max((datos.scratch||[]).length,(datos.handicap||[]).length);
    const cover=m.portada||(m.id==='2026-11'?c.galeriaNoviembre2026?.[0]?.imagen:'imagenes/campo-panoramico.jpg')||'imagenes/portada-golf.jpg';
    const destino=/^resultados-[a-z0-9-]+\.html$/i.test(String(m.pagina||''))?m.pagina:'resultados.html';
    return `<a class='album-tile resultados-mes-card' href='${h(destino)}' aria-label='Abrir ${h(m.titulo)}'>
      <img src='${url(cover)}' alt='Fotografía del torneo correspondiente a ${h(m.titulo)}' loading='lazy'>
      <div class='album-tile-info'><span class='kicker'>${h(shortDate(m.fecha))}</span><h2>${h(m.titulo)}</h2>
      <p>${h(m.descripcion||'Clasificaciones oficiales de la jornada.')}</p>
      <span class='resultados-mes-meta'>⛳ Scratch y Hándicap${participantes?' · '+participantes+' jugadores':''}</span>
      <strong>Consultar clasificaciones ↗</strong></div></a>`;
  }).join('');
  return `${title('Resultados por meses','Consulta las clasificaciones oficiales de cada torneo de Palo y Cuchara.')}
    <section class='section'><div class='container'><div class='section-head'><div><span class='kicker'>Temporada ${h(c.sitio.temporada)}</span><h2>Resultados de cada jornada</h2><p>Selecciona el mes para ver por separado las clasificaciones Scratch y Hándicap.</p></div></div>
    <div class='albums-grid'>${tarjetas||'<div class="empty">Todavía no hay resultados publicados.</div>'}</div>
    <p class='hint' style='margin-top:26px'>Añadiremos los resultados de cada torneo cuando dispongamos de las clasificaciones oficiales.</p>
    <p style='margin-top:22px'><a class='text-link' href='orden-merito.html'>Ver también el Orden de mérito acumulada ↗</a></p>
    </div></section>`;
}
function pageResultadosMes(){
  const mes=(c.resultadosMensuales||[]).find(m=>m.id===document.body.dataset.month);
  if(!mes)return `${title('Resultados no disponibles','Todavía no se han publicado las clasificaciones de este torneo.')}<section class='section'><div class='container'><a class='btn green' href='resultados.html'>Volver a resultados por meses</a></div></section>`;
  const datos=c[mes.clave]||{};
  return `${title(mes.titulo,'Clasificaciones oficiales Scratch y Hándicap del torneo celebrado el '+shortDate(mes.fecha)+'.')}
    <section class='section monthly-results'><div class='container'>
    <p class='album-back'><a class='text-link' href='resultados.html'>← Volver a los resultados por meses</a></p>
    <div class='section-head'><div><span class='kicker'>${h(shortDate(mes.fecha))} · Base Aérea de Zaragoza</span><h2>Clasificaciones del torneo</h2>
    <p>Consulta las posiciones y puntuaciones tal como figuran en los resultados oficiales facilitados por la organización.</p></div></div>
    <div class='tabs' role='tablist' aria-label='Categorías de la jornada'><button id='mes-handicap' class='active' role='tab' aria-selected='true'>Hándicap · ${(datos.handicap||[]).length} jugadores</button>
    <button id='mes-scratch' role='tab' aria-selected='false'>Scratch · ${(datos.scratch||[]).length} jugadores</button></div>
    <div id='mensual-ranking'>${renderMensual('handicap',datos)}</div>
    <p class='hint' style='margin-top:20px'>Se respetan las posiciones y los indicadores NP y NE originales. Esta es la clasificación de la jornada, no el acumulado de la temporada.</p>
    <p style='margin-top:24px'><a class='btn green' href='orden-merito.html'>Ver Orden de mérito de la temporada ↗</a></p>
    </div></section>`;
}
function pageCalendario(){const ev=(c.jornadas||[]).slice().sort((a,b)=>a.fecha.localeCompare(b.fecha));return `${title('Calendario','Fechas de la temporada 2026–2027 y detalles de los próximos encuentros.') }<section class="section"><div class="container"><div class="section-head"><div><span class="kicker">Próximas citas</span><h2>Una jornada, muchas historias</h2></div></div>${ev.map(eventCard).join('')||'<div class="empty">Calendario pendiente de publicación.</div>'}<div class="notice" style="margin-top:22px">Los horarios y detalles pueden actualizarse. Consulta siempre la convocatoria publicada por la organización.</div></div></section>`}
function pageCampeones(){const w=c.campeonesAnteriores||{};return `${title('Nuestros campeones','Un recuerdo especial a los jugadores destacados de la temporada anterior.') }<section class="section"><div class="container"><div class="section-head"><div><span class="kicker">Temporada ${h(w.temporada)}</span><h2>Honor a nuestros ganadores</h2><p>Conservamos la memoria de los campeones, sin trasladar el histórico de torneos mensuales.</p></div></div><div class="grid"><div class="medal"><span class="icon">🏆</span><small>Campeón Scratch</small><strong>${h(w.scratch||'Por completar')}</strong></div><div class="medal"><span class="icon">🏅</span><small>Campeón Hándicap</small><strong>${h(w.handicap||'Por completar')}</strong></div><div class="medal"><span class="icon">🥈</span><small>Subcampeón</small><strong>${h(w.subcampeon||'Por completar')}</strong></div></div><div class="featured" style="margin-top:30px"><img src="imagenes/campeones-25-26.webp" alt="Tres trofeos de los campeones 2025–2026: Dan Moyer, campeón Scratch; Paco Valencia, campeón Hándicap; Miguel Ángel Ballestín, subcampeón" style="height:auto;min-height:0;object-fit:contain;align-self:center"><div class="copy"><span class="kicker">Un recuerdo para siempre</span><h2>El mejor premio es seguir juntos</h2><p>${h(w.nota||'Una mención especial a nuestros campeones.')}</p><a class="btn green" style="align-self:start" href="orden-merito.html">Ver temporada actual</a></div></div></div></section>`}
function imageCard(i,curiosity=false){const photo=i.imagen?`<img loading="lazy" src="${url(i.imagen)}" alt="${h(i.titulo)}">`:`<div class="missing-photo"><span>Ver fotografía en la web de Canva ↗</span></div>`;const tag=i.imagen?'article':'a';const attr=i.imagen?`data-photo="${url(i.imagen)}"`:`href="${url(c.sitio.origenCanva)}" target="_blank" rel="noopener"`;return `<${tag} class="photo-card" ${attr} aria-label="${h(i.titulo)}">${photo}<div class="photo-info"><small class="kicker">${h(i.categoria||(curiosity?'Curiosidad':'Fotografía'))}</small><h3>${h(i.titulo)}</h3>${i.descripcion?`<p>${h(i.descripcion)}</p>`:''}</div></${tag}>`}
function pageGaleria(){
const album=(c.galeriaNoviembre2026||[]);
const cover=album.find(p=>p.imagen)?.imagen||'imagenes/portada-golf.jpg';
return `${title('Galería de torneos','Un álbum para cada jornada de la temporada. Elige el mes para ver todas sus fotografías.')}
<section class="section"><div class="container">
<div class="section-head"><div><span class="kicker">Nuestros recuerdos · Temporada 2026–2027</span><h2>Álbumes por mes</h2><p>Las fotografías de cada torneo están reunidas en su propio álbum. Pulsa sobre el mes que quieras recordar.</p></div></div>
<div class="albums-grid">
<a class="album-tile" href="torneo-noviembre-2026.html" aria-label="Abrir todas las fotos del torneo de noviembre de 2026">
<img src="${url(cover)}" alt="Entrega de premios del torneo de noviembre de 2026" loading="eager">
<div class="album-tile-info"><span class="kicker">10 de noviembre de 2026</span><h2>Torneo de noviembre</h2><p>Premiados, entrega de trofeos y el hoyo 19 · ${album.length} fotografías</p><strong>Ver todas las fotos ↗</strong></div>
</a>
</div>
<p class="hint" style="margin-top:25px">Aquí iremos incorporando los álbumes de los próximos torneos, uno por cada mes.</p>
</div></section>`;
}
function pageTorneoNoviembre(){
const photos=c.galeriaNoviembre2026||[];
const winners=photos.filter(x=>x.destacado);
const rest=photos.filter(x=>!x.destacado);
return `${title('Torneo de noviembre','10 de noviembre de 2026 · Entrega de premios, amigos y una gran jornada en La Bolera.')}
<section class="section"><div class="container">
<p class="album-back"><a class="text-link" href="galeria.html">← Volver a los álbumes por mes</a></p>
<div class="section-head"><div><span class="kicker">Mención especial</span><h2>Los premiados del torneo</h2><p>Enhorabuena a quienes destacaron en las clasificaciones de la jornada.</p></div></div>
<div class="grid destacados-grid">${winners.map(photo=>imageCard(photo)).join('')}</div>
<div class="section-head album-subhead"><div><span class="kicker">Galería · noviembre 2026</span><h2>Entrega de premios y el hoyo 19</h2><p>Los mejores recuerdos del torneo y de nuestra comida entre amigos.</p></div></div>
<div class="grid recuerdos-grid">${rest.map(photo=>imageCard(photo)).join('')}</div>
<p class="album-back" style="margin-top:40px"><a class="btn green" href="galeria.html">← Todos los álbumes</a></p>
</div></section>`;
}
function curiosityCanvaCard(item){
 const titulo=h(item.titulo),alt='Curiosidad original: '+titulo;
 if(item.video){
  return `<article class="curiosidad-canva-item curiosidad-canva-video"><video controls playsinline preload="metadata" poster="${url(item.imagen)}" aria-label="Vídeo: ${alt}"><source src="${url(item.video)}" type="video/mp4">Tu navegador no admite este vídeo.</video><h3>${titulo}</h3></article>`;
 }
 return `<button type="button" class="curiosidad-canva-item" data-photo="${url(item.imagen)}" aria-label="Ampliar ${alt}"><img loading="lazy" src="${url(item.imagen)}" alt="${alt}"><h3>${titulo}</h3></button>`;
}
function pageCuriosidades(){
 const curiosidades=c.curiosidades||[];
 const originales=[33,34].map((num,i)=>({num,fotos:curiosidades.filter(x=>x.paginaCanva===num),pagina:i+1}));
 return `${title('Curiosidades','Las fotografías, los vídeos y los recuerdos originales de Palo y Cuchara, recuperados de nuestra web de Canva.')}
<section class="section"><div class="container">
<div class="section-head"><div><span class="kicker">Del archivo original de Palo y Cuchara</span><h2>Pequeñas grandes historias</h2><p>Las mismas curiosidades que aparecían en Canva, en su orden original y con sus títulos. Pulsa una fotografía para ampliarla o reproduce los vídeos.</p></div></div>
${originales.map(g=>`<section class="curiosidades-canva-page" aria-label="Curiosidades originales de Canva, página ${g.pagina}">
  <div class="curiosidades-canva-heading"><span>Curiosidades</span><small>${g.pagina} / 2</small></div>
  <div class="curiosidades-canva-grid">${g.fotos.map(curiosityCanvaCard).join('')}</div>
</section>`).join('')}
<p class="hint" style="margin-top:18px">Imágenes y vídeos originales del archivo de Palo y Cuchara, conservados sin sustituirlos por imágenes ajenas.</p>
</div></section>`;
}
function pagePatrocinadores(){return `${title('Nuestros patrocinadores','Gracias a quienes hacen posible que Palo y Cuchara siga creciendo como punto de encuentro deportivo y social.') }<section class="section sponsors-section"><div class="container"><div class="section-head"><div><span class="kicker">Palo y Cuchara 2026–2027</span><h2>Un equipo dentro y fuera del campo</h2><p>El golf se disfruta todavía más cuando va acompañado de amistad y buenos momentos.</p></div></div><div class="sponsors-grid">
<a class="sponsor-card sponsor-care" href="https://bodegascare.com/" target="_blank" rel="noopener" aria-label="Visitar la web oficial de Bodegas CARE"><div class="sponsor-graphic sponsor-official-graphic"><img class="sponsor-official-logo care-official-logo" src="https://static.wixstatic.com/media/9b3898_b56a218bcc684d018ad9ffe3dbd80bf7~mv2.png" alt="Logotipo oficial completo de Bodegas CARE, texto e ilustración del rostro" loading="lazy" onerror="if(!this.dataset.alt){this.dataset.alt='1';this.src='https://www.vinoaragones.com/wp-content/uploads/2020/03/logo-care-grande-1-300x139.png'}else{this.hidden=true;this.nextElementSibling.hidden=false}"><div class="logo-fallback" hidden><span class="sponsor-overline">BODEGAS</span><strong class="care-mark">CARE</strong><span class="sponsor-submark">D.O. CARIÑENA · ARAGÓN</span></div></div><div class="sponsor-info"><h3>Bodegas CARE</h3><p>Una bodega de Cariñena que une tradición e innovación. Gracias por formar parte de Palo y Cuchara.</p><span class="text-link">Visitar su web ↗</span></div></a>
<a class="sponsor-card sponsor-idp" href="https://www.aragongolf.com/clubs/idp-golf-base-aerea/" target="_blank" rel="noopener" aria-label="Información del I.D.P. Golf Base Aérea en la Federación Aragonesa de Golf"><div class="sponsor-graphic sponsor-official-graphic"><img class="sponsor-official-logo idp-official-logo" src="imagenes/logo-idp-golf-oficial.png" alt="Escudo oficial I.D.P. Golf Base Aérea Zaragoza, león dorado y aviones sobre fondo rojo y azul" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="logo-fallback" hidden><div class="idp-emblem" aria-hidden="true">⛳</div><strong class="idp-mark">I.D.P. GOLF</strong><span class="sponsor-submark">BASE AÉREA DE ZARAGOZA</span></div></div><div class="sponsor-info"><h3>I.D.P. Golf Base Aérea</h3><p>El campo y punto de encuentro en el que compartimos nuestras jornadas de competición.</p><span class="text-link">Información del campo ↗</span></div></a>
<article class="sponsor-card sponsor-bolera"><div class="sponsor-graphic bolera-graphic"><img src="imagenes/bolera-logo-mostado-final.svg?v=bolera-definitivo" alt="La Bolera: logotipo elegido, tres bolos blancos y bola azul, letras blancas sobre fondo azul oscuro" loading="lazy"></div><div class="sponsor-info"><h3>La Bolera</h3><p>El lugar de nuestros encuentros y celebraciones después del golf. Gracias por acompañar el torneo.</p></div></article>
</div><p class="sponsor-footer">A todos nuestros patrocinadores, gracias por su apoyo y por compartir el espíritu de Palo y Cuchara.</p></div></section>`}
function pageNormas(){const n=c.normas||{};const list=x=>'<ul>'+(x||[]).map(t=>'<li>'+h(t)+'</li>').join('')+'</ul>';return `${title('Normas del campo','Convivencia, seguridad y cuidado del campo de golf de la Base Aérea de Zaragoza.') }<section class="section"><div class="container"><div class="rules-grid"><div class="card"><h2>⛳ Uso y cuidado</h2>${list(n.uso)}</div><div class="card"><h2>🤝 Cortesía y ritmo</h2>${list(n.cortesia)}</div><div class="card"><h2>🌿 Etiqueta y seguridad</h2>${list(n.etiqueta)}</div></div><div class="section-head" style="margin-top:70px"><div><span class="kicker">Convenios de la Base</span><h2>Correspondencias</h2><p>Campos mencionados en la página original. Consulta con la Base las condiciones de uso y vigencia de cada acuerdo.</p></div></div><div class="grid">${(c.correspondencias||[]).map(t=>`<div class="card pad"><span class="kicker">Correspondencia</span><h3>${h(t)}</h3></div>`).join('')}</div></div></section>`}
const root=document.getElementById('app');
if(root){const views={inicio:pageInicio,orden:pageOrden,calendario:pageCalendario,resultados:pageResultados,'resultados-mes':pageResultadosMes,campeones:pageCampeones,galeria:pageGaleria,'torneo-noviembre':pageTorneoNoviembre,curiosidades:pageCuriosidades,normas:pageNormas,patrocinadores:pagePatrocinadores,editar:()=>title('Editor local de la web','Prepara y exporta cambios sin publicarlos; la web pública se actualiza después desde GitHub.')+'<section class="section"><div class="container"><div id="editorApp"></div></div></section>'};root.innerHTML=header+(views[page]?views[page]():'')+footer;}
const toggle=document.getElementById('menuToggle'),mobileMenu=document.getElementById('mobileAccordion');
if(toggle&&mobileMenu){
 const closeMobileMenu=()=>{mobileMenu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menú');toggle.textContent='☰';};
 toggle.addEventListener('click',()=>{const isOpen=mobileMenu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(isOpen));toggle.setAttribute('aria-label',isOpen?'Cerrar menú':'Abrir menú');toggle.textContent=isOpen?'×':'☰';});
 mobileMenu.querySelectorAll('details.accordion-group').forEach(group=>group.addEventListener('toggle',()=>{
   if(group.open)mobileMenu.querySelectorAll('details.accordion-group').forEach(other=>{if(other!==group)other.open=false;});
 }));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&mobileMenu.classList.contains('open')){closeMobileMenu();toggle.focus();}});
 document.addEventListener('click',event=>{if(mobileMenu.classList.contains('open')&&!event.target.closest('#mobileAccordion')&&!event.target.closest('#menuToggle'))closeMobileMenu();});
}
const tabH=document.getElementById('tab-handicap'),tabS=document.getElementById('tab-scratch');if(tabH&&tabS){[tabH,tabS].forEach((b,i)=>b.addEventListener('click',()=>{let kind=i===0?'handicap':'scratch';tabH.classList.toggle('active',i===0);tabS.classList.toggle('active',i===1);tabH.setAttribute('aria-selected',String(i===0));tabS.setAttribute('aria-selected',String(i===1));document.getElementById('ranking').innerHTML=renderTable(kind);}));}
const mesH=document.getElementById('mes-handicap'),mesS=document.getElementById('mes-scratch');
if(mesH&&mesS){[mesH,mesS].forEach((b,i)=>b.addEventListener('click',()=>{const k=i===0?'handicap':'scratch';mesH.classList.toggle('active',i===0);mesS.classList.toggle('active',i===1);mesH.setAttribute('aria-selected',String(i===0));mesS.setAttribute('aria-selected',String(i===1));const mes=(c.resultadosMensuales||[]).find(m=>m.id===document.body.dataset.month);document.getElementById('mensual-ranking').innerHTML=renderMensual(k,mes?c[mes.clave]:null);}));}
if(page==='galeria'||page==='torneo-noviembre'||page==='curiosidades'){const pop=document.createElement('div');pop.className='lightbox';pop.innerHTML='<button aria-label="Cerrar imagen">×</button><img alt="Fotografía ampliada">';document.body.appendChild(pop);document.querySelectorAll('[data-photo]').forEach(el=>el.addEventListener('click',()=>{const src=el.getAttribute('data-photo');pop.querySelector('img').src=src;pop.classList.add('open')}));pop.addEventListener('click',(e)=>{if(e.target===pop||e.target.tagName==='BUTTON')pop.classList.remove('open')});document.addEventListener('keydown',e=>{if(e.key==='Escape')pop.classList.remove('open')});}
})();
