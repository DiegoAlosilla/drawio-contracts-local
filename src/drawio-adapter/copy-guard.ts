import {readRegistry,findRevision,REGISTRY_ATTRIBUTE,REF_ATTRIBUTE} from '../persistence/registry';
import {contractCell} from './component-figure';
export function installCopyGuard(ui:any,report:(error:unknown)=>void){
  const graph=ui.editor.graph;
  const exportable=graph.getExportableCells;
  graph.getExportableCells=function(cells:any[]){
    // A selected inner endpoint travels with its owning container and reference.
    return exportable.call(this,[...new Set(cells.map(cell=>contractCell(graph,cell)))]);
  };
  const previous=graph.importCells;
  graph.importCells=function(cells:any[],...args:any[]){
    try{
      const pending=[...cells];
      while(pending.length){
        const cell=pending.pop();if(!cell)continue;
        if(cell.children)pending.push(...cell.children);
        const raw=cell.value?.getAttribute?.(REF_ATTRIBUTE);
        if(raw){
          try{findRevision(readRegistry(ui.fileNode?.getAttribute(REGISTRY_ATTRIBUTE)),JSON.parse(raw));}
          catch{throw new Error('Copia bloqueada: el documento destino no contiene el contrato vinculado. Comparta el archivo .drawio completo o añada la operación desde el catálogo del destino.');}
        }
      }
      return previous.apply(graph,[cells,...args]);
    }catch(error){report(error);return [];}
  };
}
