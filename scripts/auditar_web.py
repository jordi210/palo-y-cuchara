#!/usr/bin/env python3
"""Auditoría automatizada de Palo y Cuchara: navegación, páginas, recursos y dominio."""
import os, sys, json, re, time, subprocess, socket, urllib.parse, collections
from pathlib import Path
import requests
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
PAGES=["index.html","orden-merito.html","calendario.html","resultados.html","resultados-noviembre-2026.html","galeria.html","torneo-noviembre-2026.html","campeones.html","curiosidades.html","normas.html","patrocinadores.html","editar.html"]
URL="http://127.0.0.1:8765/"
report={"pages":{},"all_internal_links":[],"external_links":[],"dns":{},"issues":[],"warnings":[],"mobile":{},"functional":{}}
try:
 for host in ["paloycuchara.es","www.paloycuchara.es","jordi210.github.io"]:
  try: report["dns"][host]={"ips":sorted(set(t[4][0] for t in socket.getaddrinfo(host,443,type=socket.SOCK_STREAM)))}
  except Exception as e: report["dns"][host]={"error":str(e)}
 for u in ["https://paloycuchara.es/","https://www.paloycuchara.es/","https://jordi210.github.io/palo-y-cuchara/"]:
  try:
   r=requests.get(u,timeout=12,allow_redirects=True)
   report["dns"][u]={"status":r.status_code,"final_url":r.url,"length":len(r.content)}
  except Exception as e: report["dns"][u]={"error":str(e)}
 excepts=0
 server=subprocess.Popen([sys.executable,"-m","http.server","8765","--bind","127.0.0.1","--directory",str(ROOT)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 time.sleep(1.5)
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(headless=True,args=["--no-sandbox"])
   pc=browser.new_context(viewport={"width":1440,"height":900},locale="es-ES")
   all_links=set()
   for page_path in PAGES:
    p=pc.new_page()
    console=[]; page_errors=[]; missing=[]
    p.on("console",lambda m:console.append(m.text) if m.type=="error" else None)
    p.on("pageerror",lambda e:page_errors.append(str(e)))
    p.on("response",lambda r:missing.append({"url":r.url,"status":r.status}) if r.status>=400 and r.url.startswith(URL) else None)
    response=p.goto(URL+page_path,wait_until="domcontentloaded",timeout=20000)
    p.locator("img[loading='lazy']").evaluate_all("(els)=>els.forEach(e=>e.loading='eager')")
    p.wait_for_timeout(850)
    links=p.locator("a[href]").evaluate_all("(els)=>els.map(a=>({text:a.innerText.trim().slice(0,110),href:a.getAttribute('href'),target:a.target}))")
    images=p.locator("img[src]").evaluate_all("(els)=>els.map(e=>({src:e.getAttribute('src'),alt:e.alt,loaded:e.complete&&e.naturalWidth>0,naturalWidth:e.naturalWidth}))")
    videos=p.locator("video").evaluate_all("(els)=>els.map(e=>({src:e.querySelector('source')?.getAttribute('src')||e.getAttribute('src'),poster:e.getAttribute('poster'),error:e.error?.message||null}))")
    for l in links:
     if l["href"]:all_links.add((l["href"],page_path))
    report["pages"][page_path]={"status":response.status,"title":p.title(),"heading":p.locator("h1").all_inner_texts(),"links":len(links),"links_preview":links[:20],"images":len(images),"broken_images":[i for i in images if not i["loaded"]],"videos":videos,"console_errors":console,"page_errors":page_errors,"failed_requests":missing}
    if p.locator("h1").count()==0:report["issues"].append(f"{page_path}: sin título principal h1")
    if response.status!=200:report["issues"].append(f"{page_path}: estado HTTP {response.status}")
    if page_errors:report["issues"].append(f"{page_path}: errores de JavaScript: {page_errors}")
    if missing:report["issues"].append(f"{page_path}: recursos internos fallidos: {missing}")
    if any(i.get("loaded")==False for i in images):report["issues"].append(f"{page_path}: imágenes que no se cargan: {[x.get('src') for x in images if not x['loaded']]}")
    if page_path=="resultados.html":
     report["functional"]["resultados_index"]={"noviembre_link":p.locator("a[href='resultados-noviembre-2026.html']").count(),"meses":p.locator(".resultados-mes-card").count()}
    if page_path=="resultados-noviembre-2026.html":
     before=p.locator("#mensual-ranking").inner_text()
     p.locator("#mes-scratch").click();after=p.locator("#mensual-ranking").inner_text()
     report["functional"]["resultados_tabs"]={"changed":before!=after,"handicap":p.locator("#mes-handicap").get_attribute("aria-selected"),"scratch":p.locator("#mes-scratch").get_attribute("aria-selected")}
    if page_path=="orden-merito.html":
     before=p.locator("#ranking").inner_text();p.locator("#tab-scratch").click();after=p.locator("#ranking").inner_text()
     report["functional"]["orden_tabs"]={"changed":before!=after,"rows":p.locator("#ranking tbody tr").count(),"hcap":p.locator("#tab-handicap").get_attribute("aria-selected"),"scratch":p.locator("#tab-scratch").get_attribute("aria-selected")}
    if page_path=="patrocinadores.html":
     img=p.locator("img.idp-official-logo")
     report["functional"]["idp_logo"]={"src":img.get_attribute("src"),"loaded":img.evaluate("(e)=>e.complete&&e.naturalWidth>0")}
    if page_path=="editar.html":
     labels={}
     for key in ["albumesMensuales","resultadosMensuales"]:
      btn=p.locator(f"[data-section='{key}']")
      labels[key]=btn.count()
      if btn.count():
       btn.click()
       labels[key+"_title"]=p.locator("#editorContent h2").first.inner_text()
     report["functional"]["editor_monthly"]=labels
    if page_path=="galeria.html": report["functional"]["galeria_album_link"]=p.locator("a[href='torneo-noviembre-2026.html']").count()
    if page_path=="torneo-noviembre-2026.html":
     report["functional"]["november_gallery"]={"cards":p.locator(".photo-card").count(),"missing":p.locator(".missing-photo").count()}
    if page_path=="curiosidades.html":
     report["functional"]["curiosidades"]={"images":p.locator(".curiosidad-canva-item img").count(),"videos":p.locator(".curiosidad-canva-item video").count()}
    p.close()
   for href,source in sorted(all_links):
    if href.startswith(("#","mailto:","tel:","javascript:")): continue
    parsed=urllib.parse.urlparse(href)
    if parsed.scheme in ("https","http"):
     report["external_links"].append({"src":source,"href":href})
     continue
    target=urllib.parse.urljoin(URL+source,href)
    parsed2=urllib.parse.urlparse(target)
    if parsed2.netloc!="127.0.0.1:8765":
     report["external_links"].append({"src":source,"href":href});continue
    path=urllib.parse.unquote(parsed2.path).lstrip("/")
    if ".." in Path(path).parts:report["issues"].append(f"{source}: ruta sospechosa {href}")
    if path and not (ROOT/path).is_file() and not (ROOT/path).is_dir():
     report["issues"].append(f"Enlace roto en {source}: {href}")
    elif parsed2.fragment and path.endswith(".html"):
     pass
    report["all_internal_links"].append({"source":source,"href":href})
   pm=browser.new_context(viewport={"width":390,"height":844},is_mobile=True,has_touch=True,device_scale_factor=1,locale="es-ES")
   mp=pm.new_page();mp.goto(URL+"index.html",wait_until="domcontentloaded")
   mp.wait_for_timeout(450)
   before=mp.locator("#mainMenu").evaluate("(e)=>({display:getComputedStyle(e).display,open:e.classList.contains('open')})")
   mp.locator("#menuToggle").click()
   after=mp.locator("#mainMenu").evaluate("(e)=>({display:getComputedStyle(e).display,open:e.classList.contains('open')})")
   report["mobile"]={"menu_before":before,"menu_after":after,"toggle_aria":mp.locator("#menuToggle").get_attribute("aria-expanded"),"scroll_w":mp.evaluate("document.documentElement.scrollWidth"),"viewport_w":mp.evaluate("window.innerWidth"),"results_link_visible":mp.locator("a[href='resultados.html']").count()}
   mp.screenshot(path="/tmp/palo_mobile_home.png")
   try:
    mp.locator("#mainMenu a[href='galeria.html']").first.click(timeout=4000)
    report["mobile"]["navigate_after_menu"]=mp.url
   except Exception as e:report["mobile"]["nav_error"]=str(e)[:250]
   report["responsive"]={}
   for width in [390,768,1024,1120,1366]:
    vp=browser.new_context(viewport={"width":width,"height":850},locale="es-ES")
    q=vp.new_page()
    q.goto(URL+"index.html",wait_until="domcontentloaded")
    q.wait_for_timeout(200)
    v=q.evaluate("""() => ({
       viewport:innerWidth,docWidth:document.documentElement.scrollWidth,
       menuButton:getComputedStyle(document.querySelector('.mobile-menu')).display,
       menu:getComputedStyle(document.querySelector('#mainMenu')).display,
       headerHeight:Math.round(document.querySelector('.header').getBoundingClientRect().height)
    })""")
    report["responsive"][str(width)]=v
    if v["docWidth"]>v["viewport"]+3:report["issues"].append(f"Desbordamiento horizontal en {width}px: {v['docWidth']}px")
    if width<=1120 and v["menuButton"]=="none":report["issues"].append(f"Falta menú móvil a {width}px")
    q.close();vp.close()
   pc.close();pm.close();browser.close()
 finally: server.terminate();server.wait(timeout=5)
except Exception as e:
 report["issues"].append("Error de auditoría: "+repr(e))
open(ROOT/"AUDITORIA_WEB.json","w",encoding="utf8").write(json.dumps(report,indent=2,ensure_ascii=False))
print("===== AUDITORIA RESUMEN =====")
print(json.dumps({k:report[k] for k in ["dns","issues","warnings","mobile","functional"]},ensure_ascii=False,indent=2))
print("===== RESPONSIVE =====",json.dumps(report.get('responsive',{}),ensure_ascii=False))
print("===== PÁGINAS =====")
for p,v in report["pages"].items():print(p, "HTTP",v["status"],"title",v["title"],"h1",v["heading"],"links",v["links"],"images",v["images"],"broken",len(v["broken_images"]),"scripts",v["page_errors"],"console",v["console_errors"])
print("===== ENLACES EXTERNOS =====")
for x in report["external_links"]:print(x["src"],x["href"])
