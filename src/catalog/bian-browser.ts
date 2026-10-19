import catalogData from '../../data/bian/catalog.json';
import manifest from '../../data/bian/manifest.json';
import support from '../../data/bian/es-support.json';
import {createBianSearch,QUERY_LIMIT,SEARCH_HELP_VERSION} from '../bian/search';
import {actionHelp,guideSteps,loanChoices,SUPPORT_VERSION} from '../bian/guidance';
import {makeBianReference,readBianReference} from '../bian/reference';
import type {BianReference} from '../bian/reference';
import type {BianCatalog,BianDomain} from '../bian/types';
import {el} from '../ui/styles';

export function bianBrowser(close:()=>void,insert?:(reference:BianReference)=>void){
  const catalog:BianCatalog=catalogData,engine=createBianSearch(catalog),spanish:Record<string,string[]>=support.domains;
  const element=el('section','','ct-bian');element.setAttribute('aria-label','Consulta BIAN');
  const head=el('div','','ct-bian-head'),heading=el('h2','Consulta BIAN'),guideButton=button('Guía BIAN',()=>showGuide(false)),back=button('×',close);back.setAttribute('aria-label','Cerrar consulta BIAN');head.append(heading,guideButton,back);
  const meta=el('p',`BIAN ${catalog.landscape} · artefactos ${catalog.release} · ${catalog.variant}`,'ct-bian-meta');
  const intro=el('p','Busca una responsabilidad de negocio. El orden orienta; la elección requiere revisar la definición.','ct-bian-hint');
  const label=el('label','¿Qué hará tu endpoint?'),purpose=el('textarea');purpose.rows=2;purpose.maxLength=QUERY_LIMIT;purpose.placeholder='Ej.: iniciar préstamo personal';purpose.setAttribute('aria-label','Propósito del endpoint');label.append(purpose);
  const filters=el('div','','ct-bian-filters'),actionLabel=el('label','Acción · filtro manual'),action=el('select');action.setAttribute('aria-label','Acción BIAN');action.append(new Option('Todas las acciones',''));
  for(const name of engine.actions)action.append(new Option(`${name} — ${actionHelp[name]?.es??name}`,name));actionLabel.append(action);
  const actionButton=button('?',()=>showGuide(true));actionButton.setAttribute('aria-label','Ayuda de acciones BIAN');actionButton.title='Qué significa cada acción y cuándo usarla';
  actionButton.classList.add('ct-bian-help-trigger');
  const clear=button('Limpiar',()=>{purpose.value='';action.value='';update();purpose.focus();});filters.append(actionLabel,actionButton,clear);
  const options=el('label','','ct-bian-language'),translate=el('input');translate.type='checkbox';translate.checked=true;translate.setAttribute('aria-label','Mostrar apoyo en español');options.append(translate,el('span','Español de apoyo · no oficial'));
  const help=el('details','','ct-bian-provenance');help.append(el('summary','Fuente, alcance y ayuda de búsqueda'));
  help.append(el('p',`${catalog.domains.length} dominios y ${manifest.counts.operations} operaciones BOM OAS publicadas. No incluye todo el Landscape, ISO20022/DDD ni AsyncAPI. Fuente: BIAN y contribuidores · Apache-2.0 · commit ${catalog.commit}.`));
  help.append(el('p',`Verificado el 18/10/2026. Extracción local modificada: sin payloads. ${SUPPORT_VERSION}: nombres traducidos y resúmenes españoles propios; el original inglés se conserva. ${SEARCH_HELP_VERSION}: equivalencias locales para búsqueda. No son traducciones oficiales, reglas de tu organización ni certificación. Sin IA ni envío del propósito.`));
  help.append(sourceLink('README.md','Repositorio oficial (enlace externo)'),el('br'),sourceLink('LICENSE','Licencia de la fuente (enlace externo)'));
  const expansion=el('p','','ct-bian-hint'),status=el('p','','ct-bian-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const scroll=el('div','','ct-bian-scroll'),results=el('div','','ct-bian-results');results.setAttribute('aria-label','Dominios BIAN');
  const detail=el('article','','ct-bian-detail'),guide=el('article','','ct-bian-guide');detail.hidden=true;guide.hidden=true;
  scroll.append(results,detail,guide);element.append(head,meta,intro,label,filters,options,help,expansion,status,scroll);
  let response=engine.search(''),limit=30,timer:ReturnType<typeof setTimeout>|undefined,selected:BianDomain|undefined,saved:BianReference|undefined,guideFocus:HTMLElement|undefined;
  function button(text:string,click:()=>void){const b=el('button',text,'geBtn');b.type='button';b.onclick=click;return b;}
  function sourceLink(path:string,text:string,commit=catalog.commit){const a=el('a',text);a.href=`https://github.com/bian-official/public/blob/${commit}/${path.split('/').map(encodeURIComponent).join('/')}`;a.target='_blank';a.rel='noopener noreferrer';return a;}
  function referenceMatches(ref:BianReference){const d=catalog.domains.find(d=>d.id===ref.domain.id),source=manifest.sources.find(s=>s.path===ref.source);return ref.commit===catalog.commit&&ref.release===catalog.release&&ref.variant===catalog.variant&&source?.sha256===ref.sourceSha256&&d?.title===ref.domain.title&&d?.description===ref.domain.description&&d.operations.some(o=>JSON.stringify(o)===JSON.stringify(ref.operation));}
  function translated(domain:BianDomain,reference?:BianReference){return translate.checked&&(!reference||referenceMatches(reference))?spanish[domain.id]:undefined;}
  function showGuide(actionsOnly:boolean){
    clearTimeout(timer);guideFocus=document.activeElement instanceof HTMLElement?document.activeElement:undefined;results.hidden=true;detail.hidden=true;guide.hidden=false;guide.replaceChildren();
    const title=el('h3',actionsOnly?'¿Qué acción elijo?':'Guía de uso de BIAN');title.tabIndex=-1;
    guide.append(button('← Volver a la consulta',()=>{guide.hidden=true;if(selected)detail.hidden=false;else results.hidden=false;guideFocus?.focus();}),title);
    guide.append(el('p','La acción NO se selecciona automáticamente. El filtro muestra solo operaciones que ya tienen esa acción en la fuente. Si no sabes cuál usar, empieza con Todas las acciones.'));
    if(!actionsOnly){
      for(const [name,text] of guideSteps)guide.append(el('h4',name),el('p',text));
      guide.append(el('h4','Ejemplo: ¿préstamo personal u oferta?'));
      for(const [name,text] of loanChoices)guide.append(el('h4',name),el('p',text));
      guide.append(el('p','Estas diferencias son orientación propia basada en las definiciones. «Oferta» no siempre significa préstamo formalizado. Revisa también el proceso, cliente y producto reales.'));
      guide.append(el('h4','Cómo se ordenan los resultados'),el('p','Se comparan palabras y algunas equivalencias españolas con nombres y descripciones. El nombre del dominio pesa más que una mención incidental. A igualdad de coincidencias se priorizan rutas más generales. Se muestran términos cubiertos y faltantes; no hay comprensión semántica ni una elección ideal garantizada.'));
    }
    guide.append(el('h4','Acciones: orientación en español'),el('p','Los nombres ingleses proceden del catálogo. Estas explicaciones y ejemplos son ayuda propia; confirma el significado en la descripción de cada operación. Create e Initiate, Capture y Register, o Execute y Request no son intercambiables por traducirse de forma parecida.'));
    for(const name of engine.actions){const entry=actionHelp[name];const section=el('section','','ct-bian-action-help');section.dataset.action=name;section.append(el('h4',`${name} — ${entry.es}`),el('p',entry.meaning),el('p',entry.example,'ct-bian-hint'),button(`Filtrar por ${name}`,()=>{action.value=name;update();action.focus();}));guide.append(section);}
    guide.append(el('h4','Método HTTP y nivel CR/BQ'),el('p','El término BIAN no sustituye al método HTTP. CR identifica el registro de control principal; BQ señala una parte de su comportamiento. Revisa la etiqueta original y la descripción de la operación antes de elegir.'));
    guide.append(el('h4','Fuente conceptual y límites'),el('p',`Guía propia ${SUPPORT_VERSION}. Consulta local sin IA ni llamadas a las APIs. Una referencia en el dibujo no declara implementación o conformidad. Las traducciones son resúmenes de apoyo; el inglés sigue disponible.`));
    const source=el('a','Semantic API Practitioner Guide V8.1 · §3.2.5 (enlace externo)');source.href='https://bian.org/wp-content/uploads/2024/12/BIAN-Semantic-API-Pactitioner-Guide-V8.1-FINAL.pdf';source.target='_blank';source.rel='noopener noreferrer';guide.append(source);
    scroll.scrollTop=0;title.focus({preventScroll:true});
  }
  function showDetail(domain:BianDomain,reference?:BianReference){
    selected=domain;saved=reference;results.hidden=true;detail.hidden=false;guide.hidden=true;detail.replaceChildren();
    const backToList=button('← Dominios',()=>{selected=undefined;saved=undefined;detail.hidden=true;results.hidden=false;Array.from(results.querySelectorAll<HTMLButtonElement>('[data-domain-id]')).find(b=>b.dataset.domainId===domain.id)?.focus();});
    const title=el('h3',domain.title);title.tabIndex=-1;detail.append(backToList,title);
    const es=translated(domain,reference);
    if(es){detail.append(el('p',es[0],'ct-bian-label'),el('p','Traducción resumida de apoyo · propia, no oficial','ct-bian-hint'));if(es[1])detail.append(el('p',es[1]));}
    const original=el('details','','ct-bian-original');original.open=!es;original.append(el('summary','Dominio · definición oficial en inglés'),el('p',domain.description||'La fuente no incluye una definición de este dominio.'));detail.append(original);
    if(!domain.description)detail.append(el('p','La fuente no incluye una definición de este dominio.','ct-bian-hint'));
    detail.append(el('p',`Artefacto ${domain.version} · ${domain.id}.yaml${reference?' · referencia guardada en esta figura':''}`,'ct-bian-meta'),sourceLink(domain.source,'Fuente oficial del dominio (enlace externo)',reference?.commit));
    if(reference){detail.append(el('p',`Referencia de diseño, sin contrato importado. ${referenceMatches(reference)?'Coincide con el catálogo local fijado.':'La referencia guardada difiere del catálogo local; se muestra sin sustituirla.'}`,'ct-bian-hint'));const revision=el('details','','ct-bian-original');revision.append(el('summary','Revisión de la referencia guardada'),el('p',`BIAN y contribuidores · ${reference.license} · extracto de referencia. Commit ${reference.commit} · SHA-256 de la fuente ${reference.sourceSha256}.`));detail.append(revision);}
    const operations=reference?[{operation:reference.operation,matchedTerms:[] as string[]}]:response.matches.find(m=>m.domain.id===domain.id)?.operations??[];
    detail.append(el('h4',`${operations.length} operaciones${!reference&&action.value?' · '+action.value:''}`),el('p','Nombres y rutas literales. La acción es el segmento final de la ruta. Revisa la descripción y el nivel CR/BQ.','ct-bian-hint'));
    if(!domain.operations.length)detail.append(el('p','Este artefacto oficial no publica operaciones en paths. No se han inventado endpoints.','ct-bian-empty'));
    for(const {operation,matchedTerms} of operations){
      const row=el('section','','ct-bian-operation');row.append(el('h4',operation.operationId),el('p',`Acción: ${operation.action}${translate.checked&&actionHelp[operation.action]?' — '+actionHelp[operation.action].es:''}`,'ct-bian-label'),el('code',`${operation.method} ${operation.path}`),el('p',operation.summary));
      if(operation.description!==operation.summary)row.append(el('p',operation.description));
      if(operation.tags.length)row.append(el('p',operation.tags.join(' · '),'ct-bian-meta'));
      if(!reference&&response.terms.length)row.append(el('p',matchedTerms.length?`Coincide con: ${matchedTerms.join(', ')}`:'Sin coincidencia directa; incluida para explorar el dominio.','ct-bian-hint'));
      if(insert&&(!reference||referenceMatches(reference))){const add=button('Agregar endpoint al lienzo',()=>{try{const ref=reference??makeBianReference(catalog,domain,operation,manifest.sources.find(s=>s.path===domain.source)!.sha256);insert(ref);status.textContent=`Referencia BIAN agregada: ${domain.title} · ${operation.operationId}. No se ha generado un contrato.`;}catch(error){status.textContent=error instanceof Error?error.message:String(error);}});add.classList.add('ct-bian-add');add.setAttribute('aria-label',`Agregar endpoint BIAN ${domain.id} ${operation.operationId}`);row.append(add);}
      detail.append(row);
    }
    scroll.scrollTop=0;title.focus({preventScroll:true});
  }
  function render(){
    response=engine.search(purpose.value,action.value);selected=undefined;saved=undefined;detail.hidden=true;guide.hidden=true;detail.replaceChildren();results.hidden=false;results.replaceChildren();
    expansion.textContent=response.expansions.length?`Ayuda local: ${response.expansions.map(e=>`${e.term} → ${e.alternatives.join(' / ')}`).join(' · ')}`:'';expansion.hidden=!expansion.textContent;
    status.textContent=`${response.matches.length} dominios${response.terms.length?' con coincidencias':' disponibles'}${response.truncated?' · Se usan los primeros 32 términos.':''}.`;
    if(!response.matches.length)results.append(el('p','Sin coincidencias. Prueba otro término, un nombre en inglés o cambia la acción. La búsqueda es léxica y su vocabulario español es limitado.','ct-bian-empty'));
    appendResults(0);scroll.scrollTop=0;
  }
  function appendResults(start:number){
    results.querySelector('.ct-bian-more')?.remove();
    for(const match of response.matches.slice(start,limit)){
      const domain=match.domain,row=el('div','','ct-bian-result'),b=button(domain.title,()=>showDetail(domain));b.className='ct-bian-domain';b.dataset.domainId=domain.id;row.append(b);
      const es=translated(domain);if(es)row.append(el('p',es[0],'ct-bian-label'));
      row.append(el('p',es?.[1]||domain.description||'Definición ausente en la fuente.'));
      if(es)row.append(el('p','Traducción resumida de apoyo · no oficial','ct-bian-hint'));
      if(response.terms.length){const missing=response.terms.filter(t=>!match.matchedTerms.includes(t));row.append(el('p',`Coincide con: ${match.matchedTerms.join(', ')} · ${match.matchedTerms.length}/${response.terms.length} términos${missing.length?' · Sin cubrir: '+missing.join(', '):''}`,'ct-bian-hint'));}
      if(!domain.operations.length)row.append(el('p','Sin operaciones publicadas en paths.','ct-bian-hint'));results.append(row);
    }
    if(response.matches.length>limit){const more=button('Mostrar más dominios',()=>{const start=limit;limit+=30;appendResults(start);results.querySelectorAll<HTMLButtonElement>('.ct-bian-domain')[start]?.focus();});more.classList.add('ct-bian-more');results.append(more);}
  }
  function update(){clearTimeout(timer);limit=30;render();}
  purpose.oninput=()=>{clearTimeout(timer);timer=setTimeout(update,120);};action.onchange=update;
  translate.onchange=()=>{clearTimeout(timer);if(selected)showDetail(selected,saved);else render();};
  render();
  return {element,focus(){purpose.focus();},showReference(raw:string){clearTimeout(timer);try{const ref=readBianReference(raw);status.textContent='Referencia BIAN guardada · consulta de una operación.';showDetail({...ref.domain,version:ref.release,source:ref.source,operations:[ref.operation]},ref);}catch(error){selected=undefined;saved=undefined;results.hidden=true;detail.hidden=false;guide.hidden=true;detail.replaceChildren();const alert=el('p',error instanceof Error?error.message:String(error));alert.setAttribute('role','alert');detail.append(alert);}},reset(){clearTimeout(timer);purpose.value='';action.value='';limit=30;help.open=false;render();}};
}
