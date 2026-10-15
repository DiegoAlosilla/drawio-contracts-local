import {createSwaggerInspector} from '../inspector/swagger';
import type {ContractModel,OperationView} from '../contracts/types';
import type {CatalogHandlers} from './view';
import {el} from '../ui/styles';

export function apiBrowser(handlers:CatalogHandlers,importContract:()=>void){
  const element=el('section','','ct-api-browser');element.setAttribute('aria-label','Contratos de API');
  const tools=el('div','','ct-api-tools'),importButton=el('button','Importar','geBtn');importButton.onclick=importContract;
  const toolbar=el('div','','ct-api-toolbar'),search=el('input');search.type='search';search.placeholder='Busca tu API';search.setAttribute('aria-label','Busca tu API');toolbar.append(search,importButton);
  const choices=el('div','','ct-api-choices');choices.setAttribute('role','list');choices.setAttribute('aria-label','APIs importadas');
  const status=el('p');status.setAttribute('role','status');status.hidden=true;
  tools.append(toolbar,choices,status);
  const body=el('div','','ct-api-document');element.append(tools,body);
  const inspector=createSwaggerInspector({insert:operation=>handlers.insert(operation,''),bindDrag:(node,operation)=>handlers.bindDrag(node,operation,()=> ''),close:()=>close(),insertAll:contract=>handlers.insertAll?.(contract)});
  let contracts:ContractModel[]=[],selected:ContractModel|undefined;
  const key=(contract:ContractModel)=>`${contract.revision.apiId}:${contract.revision.revisionId}`;
  function renderChoices(){
    const query=search.value.trim().toLocaleLowerCase();choices.replaceChildren();
    const matches=contracts.filter(contract=>`${contract.title} ${contract.declaredVersion} ${contract.sourceVersion}`.toLocaleLowerCase().includes(query));
    for(const contract of matches){const row=el('div');row.setAttribute('role','listitem');const button=el('button',`${contract.title} · ${contract.declaredVersion}`,'ct-api-choice');
      button.type='button';button.setAttribute('aria-label',`Seleccionar API ${contract.title} · ${contract.revision.apiId.slice(0,8)}`);button.setAttribute('aria-pressed',String(Boolean(selected&&key(selected)===key(contract))));
      button.title=`${contract.title} · API ${contract.declaredVersion} · ${contract.sourceVersion} · ${contract.revision.apiId}`;
      button.onclick=()=>select(contract);row.append(button);choices.append(row);}
    status.textContent=contracts.length?(matches.length?'':'Sin coincidencias'):'Importa un contrato para empezar.';status.hidden=!status.textContent;
  }
  function listView(){element.dataset.view='list';tools.replaceChildren(toolbar,status);body.replaceChildren(choices);}
  function close(){selected=undefined;search.value='';listView();renderChoices();search.focus();}
  function select(contract:ContractModel,operation?:OperationView,wholeContract=false){selected=contract;element.dataset.view='contract';tools.replaceChildren(toolbar,choices,status);body.replaceChildren(inspector.show(contract,operation,false,wholeContract));renderChoices();}
  search.oninput=renderChoices;
  listView();
  return {element,select,imported(contract:ContractModel,duplicate:boolean){close();status.hidden=false;status.textContent=`${contract.title} · ${contract.line==='2.0'?'Swagger':'OpenAPI'} ${contract.sourceVersion} · ${contract.operations.length} operaciones${duplicate?' · archivo ya importado':' · contrato importado'}`;},setContracts(next:ContractModel[]){
    const previous=selected;contracts=next;selected=previous?next.find(contract=>key(contract)===key(previous)):undefined;
    if(!selected)listView();
    else if(selected!==previous)select(selected);
    renderChoices();
  }};
}
