#!/usr/bin/env node
/**
 * Actualiza el contenido HTML visible por buscadores sin ejecutar JavaScript.
 * Uso:
 *   node scripts/actualizar-seo.mjs          # regenerar páginas y sitemap
 *   node scripts/actualizar-seo.mjs --check  # verificar si están actualizados
 *
 * Las 11 páginas públicas contienen dos comentarios SEO que delimitan
 * su fotografía del contenido. JavaScript sigue mostrando la versión
 * interactiva cuando el usuario visita la web.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const checked=process.argv.includes('--check');
const config=JSON.parse(fs.readFileSync(path.join(root,'docs/seo-paginas.json'),'utf8'));
const rawData=fs.readFileSync(path.join(root,'contenido.js'),'utf8');
const siteJS=fs.readFileSync(path.join(root,'assets/web.js'),'utf8');
const start='<!-- SEO prerender start -->';
const end='<!-- SEO prerender end -->';

function render(page,month){
 const app={innerHTML:''};
 const cls={add(){},remove(){},toggle(){}};
 const doc={
   body:{dataset:{page,...(month?{month}:{})},appendChild(){}},
   head:{appendChild(){}},
   documentElement:{style:{setProperty(){}},classList:cls},
   createElement(){return {textContent:'',innerHTML:'',classList:cls,addEventListener(){}}},
   getElementById(id){return id==='app'?app:null},
   querySelectorAll(){return []},
   addEventListener(){}
 };
 const win={location:{protocol:'https:',hostname:'paloycuchara.es'}};
 vm.runInNewContext(rawData,{window:win},{filename:'contenido.js',timeout:10000});
 vm.runInNewContext(siteJS,{window:win,document:doc,localStorage:{getItem(){return null;}},console},{filename:'assets/web.js',timeout:10000});
 if(!app.innerHTML.includes('<h1'))throw new Error('No se generó el H1 para '+page);
 return app.innerHTML;
}
let changed=0;
for(const p of config.paginas){
 const file=path.join(root,p.path);
 let s=fs.readFileSync(file,'utf8');
 const body=render(p.page,p.month);
 const a=s.indexOf(start),b=s.indexOf(end);
 if(a===-1||b===-1||b<a)throw new Error(p.path+' no tiene comentarios de prerenderización');
 const next=s.slice(0,a+start.length)+body+s.slice(b);
 if(s!==next){
   changed++;
   if(!checked)fs.writeFileSync(file,next);
   console.log((checked?'DESACTUALIZADO ':'ACTUALIZADO ')+p.path);
 }else console.log('OK '+p.path);
}
const domain=config.dominio.endsWith('/')?config.dominio:config.dominio+'/';
const sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
 config.paginas.map(p=>'  <url><loc>'+domain+(p.path==='index.html'?'':p.path)+'</loc></url>').join('\n')+
 '\n</urlset>\n';
const mapPath=path.join(root,'sitemap.xml');
if(fs.readFileSync(mapPath,'utf8')!==sitemap){
 changed++;
 if(!checked)fs.writeFileSync(mapPath,sitemap);
 console.log((checked?'DESACTUALIZADO ':'ACTUALIZADO ')+'sitemap.xml');
}else console.log('OK sitemap.xml');
console.log(checked?(changed?'CAMBIOS PENDIENTES: '+changed:'Todas las instantáneas están al día'):'Archivos regenerados: '+changed);
if(checked&&changed)process.exitCode=1;
