# Progreso

Fecha de inicio: 13 de octubre de 2026 (America/Lima).

## Entrega 0 — Comprobada

Estado inicial: solo ADR-001. Windows/PowerShell; Node 24.18.0, npm 11.16.0, Git 2.47.0. Selección fijada: Draw.io v32.4.1, commit `9034053fba80a435e27d68d374bc564b83917ae9` y SHA-256 en `config/drawio-version.json`.

- Plugin propio carga automáticamente en el editor real sin parche del código base. Inserta UserObject ficticio y consulta texto de operación en diálogo del editor.
- Registro JSON de formato 1 en mxfile, snapshot original único y vínculos por instancia. Interpretación de fixture aislada del adaptador. No es un parser general de OpenAPI.
- Inserción y registro participan en una transacción reversible. Se aprobaron selección, undo/redo, duplicación/movimiento, duplicación/cambio de páginas y registro común a 3 páginas.
- Se descargó un .drawio a disco, cerró el contexto autor y reabrió en perfil limpio sin archivo de contrato ni caché autor. Vínculos, notas, geometría y documentación se conservaron.
- Editor sin extensión: abre figuras y conserva metadatos tras cambiar una etiqueta y descargar desde Archivo → Guardar como. Reapertura del archivo físico con plugin recupera consulta. Límites explícitos en compatibilidad.
- Snapshot y huella comprobados contra bytes de fixture. HTML mostrado como texto, metadatos desconocidos no reescritos y vínculo perdido diagnosticado conservando figura.
- Aislamiento externo en Node/navegador después de preparar instalación. En la integración: 59 solicitudes GET locales, 59 respuestas exitosas, ninguna externa. No se cambió la red del equipo.

Evidencias: [compatibilidad](compatibilidad.md), [ADR-002](adr/ADR-002-registro-etapa-0.md), [diagrama ficticio](../examples/diagrams/etapa-0-ficticia.drawio), [perfil limpio](evidence/etapa-0-perfil-limpio.png), [red](evidence/network-etapa-0.json).

`npm test`: TypeScript y 3 escenarios aprobados, 14.5 s. Fallos encontrados y corregidos: selección vacía al instalar el plugin; apertura con descriptor de archivo incorrecto (se usa ahora LocalFile nativo). Se corrigieron también un locator ambiguo, el cambio de etiqueta Guardar → OK al elegir Descargar y un escape de ruta Windows del preload de prueba; no se contabilizaron como criterios aprobados hasta ejecutar de nuevo. La API ficticia usa identidad explícita estable, separada de la huella de revisión.

OpenAPI de esta prueba: provisional **3.0.4** ficticio. La versión real sigue sin información del usuario. Esta limitación se documenta según el criterio de etapa 0 y la decisión queda pendiente antes de desarrollar etapa 2.

## Entrega 1 — Comprobada

Estructura modular única, AGENTS.md coherente con ADR-001, README, lockfile, versiones exactas, overlays y bootstrap idempotente. Licencias/avisos de dependencias conservados; licencia propia pendiente antes de publicar. Repositorio Git local inicializado, sin commits del proyecto ni publicación. Los commits de fixture se crean solo en el repositorio temporal de pruebas.

`npm run test:startup`: clone Git de una fixture local sin node_modules/runtime; `npm start` prepara y abre plugin (50.292 s en esta ejecución, incluye navegador/consulta). Segundo arranque reutiliza recursos sin acceso externo (2.583 s, también incluye navegador). Puerto ocupado, puerto inválido y huella incorrecta se rechazan con salida 1. **5 comprobaciones aprobadas**. [Resultados](evidence/startup-results.json).

Windows es el único sistema probado; soporte multiplataforma no anunciado. El comando de arranque no exige Docker, Python ni permisos de administrador. Chromium solo se instala para las pruebas automatizadas.

## Entrega 2 — Comprobada

El usuario confirmó 3.1.x principal y pidió versiones anteriores: 3.0.x y Swagger 2.0. ADR-001 1.2 y ADR-003 recogen la ampliación. Implementados parser YAML/JSON con límites, detección de versión, validación estructural por dialecto, modelo de consulta, JSON Pointer interno, ciclos/diagnósticos, API/revisión explícitas y preparación pura de importaciones deduplicadas.

Importar contrato desde Draw.io procesa archivo en navegador y muestra resumen/lista de operaciones. Un fallo no altera registro ni figuras; una importación aceptada es deshacible. Snapshot original único en registro 2 con compatibilidad de lectura de registro 1. No se usan títulos/tags/archivo para inferir identidad o propietario.

`npm test`: TypeScript, **11 tests de núcleo y 4 escenarios de integración aprobados** (19.9 s navegador en la ejecución de cierre). 3 contratos/7 operaciones ficticios, rutas/operationId iguales entre APIs distintas, JSON/YAML, snapshot/huella/BOM, nullable/boolean/siblings/composiciones, seguridad global/vacía y bodies/formData. Perfil nuevo reabre los 3 snapshots sin originales; reimportación deduplica. Tráfico del recorrido solo GET local; ninguna solicitud externa. Diagrama: [etapa 2](../examples/diagrams/etapa-2-contratos-ficticios.drawio).

Límites: webhooks/callbacks conservados, no enumerados; anchors/$id/$dynamicRef y dialectos personalizados se rechazan explícitamente; no es validador completo de payloads. La adaptación del schema 3.1 confiable para Ajv y su huella están registradas en ADR-003/config. El adaptador del editor solo maneja selección de archivo y transacción, sin reglas OpenAPI.

## Entrega 3 — Comprobada

Catálogo flotante del editor, búsqueda por API/método/ruta/resumen/descripción, clasificación manual, botón y arrastre reales al lienzo. Se insertan referencias explícitas sin reimportar snapshots. Operación pendiente con método/ruta/propósito previstos; selección y vinculación explícita muestran diferencias. Conserva id visual, notas, texto del autor, estilo, geometría y conexiones en una transacción reversible.

El escenario de etapa 3 abre snapshots de etapa 2, busca rutas iguales en tres APIs, inserta dos operaciones por botón y otra por arrastre, crea/mueve/redimensiona/conecta una pendiente y la vincula. Comprueba los datos y undo/redo. [Diagrama](../examples/diagrams/etapa-3-flujo-ficticio.drawio). No se infiere componente propietario ni capa a partir de contrato/posición/color.

## Entrega 4 — Comprobada

Inspector agrupado por parámetros efectivos/ubicación/requerimiento, request, tipos de contenido, responses explícitas/default/rangos, headers, ejemplos y seguridad con procedencia. Referencias de esquema y propiedades/composiciones se consultan como tales sin aplanar; expansión limitada a 6 niveles y detección de recursión. Texto seguro y desplazamiento/teclado del diálogo.

La operación PATCH ficticia combina parámetros heredados, request con referencia/siblings 3.1, varias respuestas, headers/ejemplos y seguridad vacía. El escenario del inspector abre una referencia de request y demuestra la detención de ciclo. Los 6 escenarios de navegador pasan (27.2 s); se conserva la prueba de descripciones como HTML literal. Se reforzó validación de objetos referenciados en su sitio de uso y límites de expansión; el núcleo tiene 12 tests aprobados.

## Entrega 5 — Comprobada

Fecha de cierre: **14 de octubre de 2026 (America/Lima)**. Flujo completo guardado en [mvp-ficticio.drawio](../examples/diagrams/mvp-ficticio.drawio): tres revisiones de distintas versiones, 2 páginas, copia con nuevo id visual/ref compartida, figuras de caché/validación y conexiones manuales. Se cierra el autor y se reabre en contexto nuevo sin contratos originales; compara registro, ids, etiquetas, estilos, notas, geometría y terminales de conectores. Una edición/descarga nativa sin plugin del formato 2 también conserva todo al volver con plugin.

ADR-004 opta por bloqueo explícito y atómico de clipboard si destino carece de revisión; copia dentro del documento y copia libre normales verificadas. No se inventan vínculos ni se anuncia transporte entre documentos.

**13 tests de núcleo + 8 escenarios de navegador aprobados** (37.4 s navegador en la ejecución final). Incluye las tres versiones en ambos formatos, hash del schema oficial, límites, atomicidad, seguridad, referencias/composiciones, búsqueda/arrastre/vinculación, guardado/perfiles/editor sin plugin y tráfico. Presupuesto ficticio de 3×100 operaciones (20 propiedades por response, archivos 170–173 KiB) satisface los objetivos provisionales <3 s importación y <300 ms búsqueda; valores en evidencia. No equivale a medir los máximos 5/15 MiB ni a demostrar utilidad humana.

Arranque limpio se repite con dependencias nuevas: **6 comprobaciones aprobadas**, incluido núcleo de tres versiones en el clon con conexiones externas bloqueadas y huella del schema oficial intacta. Primer arranque/consulta 50.212 s, segundo 2.338 s en el registro final; las descargas iniciales siguen requiriendo Internet. Windows/editor fijado son la compatibilidad probada. [Compatibilidad](compatibilidad.md) recoge procedimientos, evidencia y límites.

La revisión visual detectó controles cortados en ventanas estrechas: se movieron a un bloque nativo de la barra lateral, con reconstrucción al refrescar idioma. La inserción por botón usa el punto libre de Draw.io y no mueve figuras existentes. El ejemplo se ordenó con posiciones explícitas del autor de la demo; no hay auto-layout sobre diagramas del usuario. Se repitieron integración y arranque después del ajuste.

## Etapa actual — 6 preparada, pendiente de personas

[Protocolo de piloto](piloto.md) preparado: 3–5 participantes, tarea común, orden A/B alternado, tiempos/exactitud/ayuda/fricciones, guardado y voluntad de reutilización. Se preguntó por disponibilidad; no se contactó a nadie y no hay resultados humanos. No marcar piloto aprobado ni convertir benchmark automatizado en ahorro de tiempo de personas.

Las etapas 7–12 no se iniciaron. Tampoco GitHub, animación, migración histórica, otra web o backend; no se publicaron archivos. Licencia propia/nombre/responsable de publicación pendientes.

Pendientes posteriores: copia entre documentos, límites de contratos grandes, importación/búsqueda/pendientes, inspector completo, licencias de publicación y piloto con participantes. No se asume el éxito del piloto desde esta demostración.

## Ajuste solicitado — Figura de componente comprobada

14 de octubre de 2026 (America/Lima). Se sustituye la caja simple de las nuevas inserciones por un contenedor amarillo con título de API, icono de componente y operación interna con método/ruta. Ambas figuras se editan con Draw.io; el tema oscuro adapta colores. APIUX/APIBS proceden exclusivamente de clasificación manual. El inspector funciona seleccionando padre o hijo. La copia del hijo transporta el contenedor para conservar su referencia.

**Extras → Usar figura de componente** permite convertir una caja anterior seleccionada: conserva identidad, referencia, notas y conexiones; guarda la etiqueta original, conserva posición y amplía tamaño mínimo. No transforma diagramas al abrirlos. No cambia parser, snapshots ni formato de registro. [ADR-005](adr/ADR-005-figura-componente.md).

Verificación ejecutada: TypeScript, **13 tests de núcleo y 9 escenarios de navegador aprobados (44,9 s)**. Nuevo escenario: edición y movimiento, conexión al hijo, copia desde hijo, conversión individual, undo/redo y guardado físico/reapertura en perfil limpio con identidad/notas/etiqueta/terminal conservados. Se mantienen pruebas de páginas y recorrido sin plugin. `npm test` compila ahora el plugin antes del navegador, incluso al reutilizar servidor. Arranque no se repitió: no hay cambios de bootstrap/dependencias/editor fijado. [Ejemplo](../examples/diagrams/figura-componente-ficticia.drawio), [captura](evidence/figura-componente.png). Etapa 6 continúa pendiente de participantes.

## Corrección de diagnóstico YAML — 14 de octubre de 2026

Se investigó localmente un archivo proporcionado por el usuario, fuera del repositorio. La entrada había perdido separadores YAML y signos de rutas/referencias; no se copió ni modificó y no se intentó reconstruir endpoints por conjetura. El rechazo por sintaxis es correcto; soporte OpenAPI 3.1 no es la causa. Recuperar el archivo desde su origen sigue pendiente de disponibilidad del usuario.

Se mejoró el error del parser: raíz no mapeada señala línea/columna y ejemplo de cabecera; errores de sintaxis muestran hasta tres códigos con ubicación y un contador adicional, sin volcar fragmentos del documento. YAML 1.2 sigue interpretado por la dependencia fijada, sin parser casero ni reparación silenciosa. No cambia formato de registro/editor/interpretación de contratos válidos. README y compatibilidad actualizados.

Verificación: TypeScript y **14 tests de núcleo** aprobados, incluida regresión ficticia de sintaxis dañada, ubicación, mensaje acotado sin contenido y atomicidad del registro. Escenario de importación real de navegador aprobado: las tres versiones válidas, rechazo externo/versión/YAML dañado, deduplicación, undo/redo y perfil nuevo. Captura/fixture solo ficticias: [diagnóstico](evidence/error-yaml-ficticio.png), [fixture](../tests/fixtures/missing-yaml-separators.yaml). No se repitieron todos los escenarios visuales ni arranque para este ajuste de diagnóstico. El archivo real se comprobó de nuevo solo con el núcleo local y recibe INVALID_FILE en línea 1, columna 1. No hubo subida de archivos ni acceso a servidores del contrato. Piloto humano permanece pendiente.

La revisión visual detectó que el aviso nativo recortaba incluso el diagnóstico breve. Los errores de la extensión se muestran ahora en un diálogo del editor con texto seleccionable y desplazamiento, sin interpretar HTML; se comprueba que la cabecera de ejemplo completa queda en el aviso. Se repiten también los escenarios de viabilidad por el cambio del reportador compartido.

Cierre de verificación del reportador: **4 escenarios de navegador aprobados (25,0 s)** — importación y tres regresiones de viabilidad, incluyendo errores/HTML seguro, portabilidad/perfiles y metadatos desconocidos. 14 tests de núcleo aprobados y TypeScript sin errores. [Resultados](evidence/yaml-diagnostic-results.json).

## Diagnóstico y copia corregida de entrada — 14 de octubre de 2026

Se revisó otro archivo del usuario fuera del repositorio. YAML válido/OpenAPI 3.0.0 con cinco grupos de errores de entrada: propiedad de estilo mal escrita, parámetro query sin schema (tipo ya indicado en un comentario), Schema Object ubicado en components.parameters, definición HTTP Basic sin scheme/con propiedad name no admitida y parámetro path omitido en PUT. Se preparó una copia corregida junto al original en Downloads, sin sobrescribirlo. Restaurar limit como integer/int32 utiliza el comentario original; scheme basic interpreta el nombre/descripción explícitos del ejemplo. No se cambiaron rutas ni versión OpenAPI. No se relajó el validador ni se modificó código de producto.

Prueba local sobre la copia: núcleo acepta 6 operaciones; navegador real importa un único snapshot con SHA coincidente, muestra las seis entradas del catálogo, inserta PUT y abre inspector multipart/form-data; descarga .drawio y lo reabre en perfil limpio sin contrato original, recuperando inspector. Cero solicitudes externas en el recorrido. Scripts, diagrama y captura de esa entrada permanecen en work/ ignorado; contenido original/copia quedan fuera del repositorio. Solo se conserva [resultado sin contenido del contrato](evidence/input-repair-results.json). No se ejecutaron endpoints ni se subieron datos. No se repitió la suite general porque el producto no cambió. Piloto humano sigue pendiente.

Reglas contrastadas con la [especificación oficial OpenAPI 3.0.4](https://spec.openapis.org/oas/v3.0.4.html#parameter-object) (compatible con la línea 3.0 de la entrada): Schema/Parameter Object, parámetros de ruta y Security Scheme HTTP.

## Consulta visual y compatibilidad con ejemplos públicos — 14 de octubre de 2026

Solicitud del usuario: importaciones con errores sucesivos e inspector difícil de comprender. [ADR-006](adr/ADR-006-consulta-y-diagnosticos.md) documenta el ajuste. Catálogo agrupado por API, búsqueda con contador y acceso desde resumen. Inspector con tablas de parámetros/campos, pestañas Entrada/Respuestas/Seguridad/Fuente, respuestas por código/MIME, ejemplos seleccionables y JSON original secundario. Navegación de referencias/composiciones acotada, sin aplanar ni deducir schema desde ejemplos. Teclado, pantalla estrecha y modo oscuro probados.

Validación estructural mantiene aceptación estricta y muestra hasta 50 problemas independientes con campo/mensaje en español. No garantiza agotar todos los errores: referencias/límites/normalización son etapas sucesivas. YAML indica primera incidencia y HTML de una página se distingue de Raw YAML/JSON. Sin reparación silenciosa ni cambios de snapshot/formato/editor/dependencias.

Corpus externo fijado en config/public-examples.json: 9 contratos de examples (2 JSON de opciones excluidos). 7 originales aceptados, 2 rechazados correctamente. api-with-examples.yaml tiene llave de cierre mal indentada en línea 43; corrección local explícita permite 2 operaciones. petstore-expanded.yaml tiene defectos de parámetros/esquema/seguridad ya documentados. No se confunde esta matriz con toda la suite del proyecto externo. Descargas originales/copias/capturas externas solo en work ignorado o Downloads; evidencias de regresión del repositorio solo con datos ficticios.

Pruebas reproducibles: npm run test:corpus y, con editor iniciado, npm run test:corpus:browser. Núcleo y navegador coinciden; rechazos mantienen registro; respuesta 300 de la copia corregida conserva ejemplo literal. Cero solicitudes externas del navegador (la obtención inicial de fixtures públicas ocurre explícitamente en el runner Node). Resultados: [núcleo](evidence/public-examples-results.json), [editor](evidence/public-examples-browser-results.json). No se ejecutaron endpoints ni se subieron archivos. Arranque previo no se repitió para este cambio; piloto de etapa 6 continúa pendiente.

Cierre del ajuste: **TypeScript + 15 tests de núcleo + 10 escenarios de navegador aprobados (51,5 s)**. Incluye informe de varios errores y rechazo atómico, catálogo/arrastre/vinculación, inspector/tablas/ejemplos/teclado/recursión, ventana estrecha/modo oscuro, copia/páginas y guardado/perfil limpio/editor sin plugin. [Resultado completo](evidence/redesign-integration-results.json). Presupuesto ficticio repetido por cambios de validación/UI: importaciones 228/177/191 ms para 100 operaciones por versión y búsqueda 2,1 ms; [medidas](evidence/redesign-budget-results.json). No extrapolar estos datos al máximo de tamaño ni al piloto humano. La demo renovada se dejó en una pestaña independiente del editor.

## Panel fijo por selección — 14 de octubre de 2026

Solicitud del usuario: presentación similar a Swagger y documentación fija al seleccionar un endpoint. [ADR-007](adr/ADR-007-panel-endpoint.md) adopta el patrón visual de Swagger UI con renderer propio, sin incorporar librerías Swagger ni otro editor. El inspector deja de ser modal y aparece automáticamente al seleccionar el contenedor o la operación interna. «Ver contrato» pasa a llamarse «Panel de endpoint», solo necesario para recuperar el lateral oculto.

Panel derecho con Endpoint/Catálogo/Formato. Catálogo acoplado, método/ruta diferenciados, preview Consultar sin insertar ni alterar registro y búsqueda preservada al alternar. Formato mantiene controles nativos. Selección vacía/libre/pendiente/múltiple o vínculo roto presenta un estado propio, evitando documentación obsoleta. Clic sobre la figura ya seleccionada recupera su vista tras consultar el catálogo. Se interpreta selección padre/hijo de la misma instancia como una sola operación, incluso después de undo/redo. No cambia interpretación del contrato ni formato de snapshot.

Integración en cuadrícula del editor fijado, sin modificar su distribución; escritorio reserva espacio, ventana estrecha usa lateral superpuesto cerrable. Se conserva geometría/identidad/referencias/notas; no hay auto-layout. Cache de consulta invalidada por registro/archivo, nunca fuente de verdad. [Demo ficticia](../examples/diagrams/seleccion-lateral-ficticia.drawio), [captura](evidence/lateral-endpoint.png).

Verificación: **TypeScript, 15 tests de núcleo y 11 escenarios de navegador aprobados (52,7 s)**. [Suite completa](evidence/dock-integration-results.json). Después se comprueba de nuevo el lateral con conmutador nativo y conservación de búsqueda: 1 escenario aprobado (5,0 s), [resultado](evidence/dock-focused-results.json). El clic de selección es real sobre SVG; no requiere pulsar inspector. Se repite el corpus público en el nuevo panel: 7 originales aceptados, 2 rechazados sin alterar registro, ejemplo 300 de copia corregida visible, cero solicitudes externas del navegador. [Resultado](evidence/dock-public-examples-results.json).

Presupuesto ficticio durante regresión: 227/190/150 ms para 100 operaciones por versión y búsqueda 2,1 ms; [medidas](evidence/dock-budget-results.json). No se repitió arranque desde clon, pues bootstrap/editor/dependencias no cambiaron; se actualizó su selector de nombre para futuras ejecuciones. No se publicaron/subieron archivos ni se ejecutaron APIs. Etapa 6 sigue pendiente de participantes.

## Swagger UI real en el lateral — entrega 1.7

14 de octubre de 2026 (America/Lima). El usuario pide reutilizar la librería de Swagger, dentro del panel de formato. [ADR-008](adr/ADR-008-swagger-ui-real.md) reemplaza la decisión previa de renderer propio. **Swagger UI 5.33.2** exacto, JavaScript/CSS locales; renderer anterior retirado. No se incorpora el editor de definiciones Swagger Editor ni otra web.

Parameters, Request body, Responses, MIME, ejemplos y Example Value/Schema son componentes de la librería. Selección de una figura los muestra automáticamente en Endpoint; Catálogo mantiene acciones de lienzo y Consultar usa el mismo renderer; Formato conserva controles nativos. Ajuste responsive no roba la pestaña. Una sola raíz de Swagger reutilizada y CSS en Shadow DOM. Núcleo propio independiente: valida/interpreta primero; Swagger recibe una copia completa, con filtro visual por operación, sin recortar paths ni convertir versiones. Resolución explícita de Path Item corrige parámetros heredados referenciados. No cambia registro/snapshot/figuras/undo.

Fuente original y seguridad efectiva desplegables. No se ejecutan requests, autorización ni descubrimiento OIDC; validador externo y configuración por query desactivados. HTML/Markdown con imágenes de la entrada se muestra como texto. Los ejemplos sintetizados por Swagger son ayudas visuales, no se guardan como declaraciones del contrato. Tema claro y términos originales de Swagger conservados. Dependencia Scarf de instalación desactivada explícitamente; avisos/licencias incorporados.

**Verificación completada:** TypeScript, 15 tests de núcleo y **13 escenarios de navegador aprobados (74,4 s)**. [Suite](evidence/swagger-integration-results.json). Ref heredado/cross-path, tags múltiples, herencia/override, 3.1 nullable/siblings/ciclo, 3.0 y 2.0 body/formData, MIME, selectores, archivo/selección rápida, ausencia de ejecución y red, identidad/notas/geometría/conexiones/páginas/copia/undo y guardado físico/perfiles limpios/editor sin extensión. [Endpoint](evidence/swagger-ui-endpoint.png), [respuestas](evidence/swagger-ui-respuestas.png), [pantalla estrecha](evidence/swagger-ui-estrecho.png).

**Arranque:** 6 comprobaciones aprobadas, clon limpio 55,719 s y reutilización aislada 3,276 s, probe sobre respuesta real de Swagger. [Evidencia](evidence/swagger-startup-results.json). **Corpus público:** 7 originales aceptados, 2 rechazados atómicamente, copia corregida con ejemplo 300 visible; cero solicitudes externas del navegador. [Evidencia](evidence/swagger-public-examples-results.json). Presupuesto ficticio: 208/158/152 ms para 100 operaciones por versión y búsqueda 2,3 ms; [medidas](evidence/swagger-budget-results.json). Bundle conjunto de desarrollo 3 425 593 bytes sin gzip; no extrapolar a modelos grandes ni medir render completo con el tiempo de importación.

Demo abierta en pestaña independiente `delivery=1.7`, comprobada visualmente en navegador integrado con [cuentas ficticias 3.1](../examples/contracts/cuentas-3.1-ficticias.yaml). El piloto de etapa 6 sigue pendiente de participantes; traducción/tema propio/presupuestos mayores quedan documentados. No se publicaron ni subieron archivos ni se ejecutaron endpoints.

## Pestaña nativa Contratos y API completa — entrega 1.8

14 de octubre de 2026 (America/Lima). El usuario precisa la experiencia: una pestaña junto a Diagrama/Estilo, importación y buscador permanentes arriba, selección de API con todo el Swagger debajo y Agregar al lienzo en cada endpoint, conservando colores. [ADR-009](adr/ADR-009-tab-contratos-nativo.md) sustituye la cabecera propia y el cambio automático por selección de entregas anteriores.

**Contratos** utiliza la fila/clases originales de Format y conserva Diagrama/Estilo o Estilo/Texto/Organizar. Vista persistente reinsertada tras la regeneración nativa, sin editar la distribución. Buscador Busca tu API y botón Importar contrato fuera del scroll de Swagger. API elegida muestra todos sus endpoints inicialmente plegados, con botón Agregar al lienzo y drag; búsqueda/elección sobreviven a inserción y cambio de pestaña. Seleccionar una figura no reemplaza la API. La acción explícita Panel de endpoint conserva consulta individual, con la barra de APIs encima. Formato nativo se recupera al pulsar sus tabs, incluso si ya estaba seleccionado internamente. Pestañas ocultas no se duplican. Ancho adicional acotado solo durante Contratos; sin auto-layout ni cambios de geometría.

Núcleo, versiones de OpenAPI, dependencias y registro permanecen iguales. Swagger recibe copia validada del documento completo, conserva referencias y agrega acciones con identidad del núcleo. No se cambia snapshot ni se guardan ejemplos generados. Fuente/seguridad, clasificación manual y vinculación de pendientes siguen disponibles; no hay llamadas, autorizaciones, publicación o subida de contratos.

**Verificación completada:** TypeScript, **15 tests de núcleo y 13 escenarios de navegador aprobados (68,7 s)**. [Suite](evidence/native-tabs-integration-results.json). Incluye prueba nueva del flujo solicitado, colores/clases, API completa, buscador persistente, importación accesible, varias APIs, no coincidencias, estrecho, selección/controles nativos, inserción/undo/redo y ausencia de red; además, las regresiones de interpretación/seguridad, drag/pendientes y guardado físico/perfil limpio/editor sin plugin. El viewport puede modificar dx/dy del XML nativo; geometrías y snapshots se comparan sin excluirlos. [Captura](evidence/contratos-tab-nativo.png).

Corpus público repetido con nuevos controles: 7 aceptados/2 rechazos atómicos, ejemplo 300 de copia corregida visible, 0 solicitudes externas del navegador. [Resultado](evidence/native-tabs-public-examples-results.json). Presupuesto ficticio: 247/225/241 ms para importar 100 operaciones de cada línea, búsqueda entre tres APIs 0,2 ms; [medidas](evidence/native-tabs-budget-results.json). No extrapolar a un catálogo grande ni al tiempo de render completo. No se repite bootstrap porque dependencias/editor/servidor no cambian; arranque de entrega 1.7 sigue histórico.

Demo `delivery=1.8` comprobada manualmente en navegador integrado: importar desde Contratos, buscar clientes, elegir API completa de tres operaciones y agregar GET conservando búsqueda y pestaña. Se deja en una pestaña independiente con datos ficticios. AGENTS/README/compatibilidad/ADR actualizados. Etapa 6 continúa pendiente de personas; etapas excluidas no iniciadas. Sin publicación ni subidas.

## Refinamiento pedido sobre Contratos — entrega 1.9

14 de octubre de 2026 (America/Lima). Se aplican los cinco ajustes solicitados: resumen modal de importación eliminado; Importar contrato junto al input sin label visible; Clasificación de nuevas figuras retirada; Agregar/Arrastrar dentro de la cabecera de cada endpoint, junto a Copiar; y Cerrar contrato para retirar Swagger y devolver la lista completa al espacio de contenido. El cierre limpia el filtro, sin borrar datos. Se actualiza [ADR-009](adr/ADR-009-tab-contratos-nativo.md), sin otra dependencia, editor, formato o versión OpenAPI.

La importación aceptada deja un estado breve en la pestaña; duplicados se informan sin reinsertar snapshots. Errores mantienen su diálogo y rechazo atómico. OperationSummary conserva el render y los controles de Swagger 5.33.2; las acciones son hermanos del control Copiar, dentro del borde, sin botón anidado ni expansión por clic en Agregar. Para ancho reducido se distribuyen en dos filas internas. Se conserva drag nativo del adaptador. Nuevas figuras de catálogo sin clasificación; metadatos ya existentes permanecen.

Verificación: TypeScript + **15 tests de núcleo y 13 escenarios de navegador aprobados (71,4 s)**, [suite](evidence/catalog-refinements-integration-results.json). Después del ajuste final de estado accesible y distribución estrecha se repiten **5 escenarios (22,8 s)**, [resultado](evidence/catalog-refinements-focused-results.json). Pruebas de importación sin modal/duplicados/rechazos, fila alineada y sin label/clasificación, acciones dentro del endpoint, clic sin desplegar, drag, cerrar con filtro y volver a tres APIs sin cambiar registro, undo/redo, esquema/respuesta/seguridad, texto seguro/red, páginas/clipboard y guardado físico/perfiles limpios/editor sin plugin. [Vista abierta](evidence/contratos-tab-nativo.png), [lista completa al cerrar](evidence/contratos-lista-completa.png).

Corpus público repetido: 7 originales aceptados, 2 rechazos atómicos, ejemplo 300 de copia corregida visible, 0 solicitudes externas del navegador. [Evidencia](evidence/catalog-refinements-public-examples-results.json). Presupuesto ficticio: importación 292/327/303 ms por 100 operaciones de cada línea y filtrado de tres APIs 0,2 ms; [medidas](evidence/catalog-refinements-budget-results.json). No extrapolar a catálogos grandes/render completo. Arranque de clon no repetido al no cambiar dependencias, editor ni servidor.

Demo independiente delivery=1.9: importar dos APIs ficticias sin resumen, buscar clientes, elegir la API completa, insertar GET sin abrir el endpoint y cerrar mostrando ambas APIs con filtro vacío; figura conservada. No se tocaron pestañas previas del usuario. Piloto de etapa 6 continúa pendiente de personas. No se ejecutaron APIs ni se subieron/publicaron archivos.
## Ajustes de controles y API completa — entrega 1.10

14 de octubre de 2026 (America/Lima). Ocho comentarios visuales atendidos: **Importar** como texto corto; contador de APIs retirado; cierre **×** integrado en la barra del propio visor, junto al aviso de Swagger; botón **Agregar al lienzo** con suma, contraste y estados; accesos de prueba retirados de la biblioteca izquierda; **Agregar todos** por API; y ancho ajustable por borde izquierdo/teclado. Cerrar sigue limpiando filtro y mostrando APIs sin borrar datos. Acciones explícitas de inspección y prueba continúan en Extras.

Inserción conjunta con un contenedor amarillo, hasta tres columnas de operaciones y filas adicionales. Cada hijo conserva su referencia propia y padre explícito; usa las operaciones únicas del núcleo, sin inferir identidad por tags. Preparación de referencias antes de escribir y una única transacción para undo/redo. Se conservan notas, geometría y conectores anteriores; no se reorganiza el lienzo. Registro/snapshot/versiones/dependencias y editor fijado permanecen iguales. [ADR-009](adr/ADR-009-tab-contratos-nativo.md) y [ADR-005](adr/ADR-005-figura-componente.md) actualizados.

Ancho inicial habitual, ajustable entre 300–1000 px y acotado al viewport menos 40 px. Tirador con puntero, flechas de 20 px e Inicio/Fin. Preferencia solo en memoria; no modifica el archivo ni la preferencia nativa. Cambio de pestañas restaura ancho original de Draw.io. Se corrigió el ancho de la cabecera respecto al gutter nativo para evitar desbordamiento en ventana estrecha. Sin parche de la distribución del editor.

**Verificación ejecutada:** `npm test`: TypeScript, **15 pruebas de núcleo y 14 escenarios de navegador aprobados (~1,4 min)**. [Resumen de salida observada](evidence/panel-controls-integration-results.json). Tras el indicador visual/title final del tirador y reforzar páginas/edición sin extensión: check/build y **2 escenarios aprobados (19,0 s)**, [reporte original](evidence/panel-controls-focused-results.json). Prueba nueva: drag real del separador, teclado/límites, recuperación del ancho entre pestañas y clamp a 640×720, cierre interno sin contador, inserción individual y conjunta sin desplegar, undo/redo único, notas/geometría/conexión anteriores, copia individual/grupo, duplicación/cambio de página, archivo físico/reapertura limpia, editor sin plugin y reserialización tras editar sin extensión; referencias y registro intactos, cero solicitudes externas/errores de página en el recorrido nuevo. [Captura ficticia](evidence/controles-contratos-1.10.png).

Demo independiente `delivery=1.10` comprobada en navegador integrado mediante importación local ficticia y Agregar todos. Se conserva la pestaña anterior con trabajo del usuario. Bootstrap y corpus público no se repiten para este ajuste sin cambios de runtime/parser/dependencias; evidencias anteriores históricas. Los runners se adaptan a Importar y Extras, retirados los accesos de la izquierda. No se certifican tamaños máximos ni otros layouts. Piloto humano de etapa 6 sigue pendiente; siguiente paso: participantes y revisión de utilidad. Sin ejecución de APIs, publicación o subidas.
## Fila única y consulta desde figuras — entrega 1.11

14 de octubre de 2026 (America/Lima). Por indicación del usuario, Agregar todos coloca todos los endpoints en **una sola fila de izquierda a derecha**, sin salto tras el tercero. Seleccionar/pulsar la API muestra el contrato completo; seleccionar/pulsar un endpoint muestra ese contrato completo con el endpoint expandido y desplazado a la vista. Reabre Contratos desde Estilo y recupera el visor al volver a pulsar una figura ya seleccionada después de cerrar. Selección vacía/libre/múltiple conserva la consulta. Extras → Panel de endpoint mantiene su inspección aislada explícita.

La API de un padre existente se resuelve desde sus referencias explícitas y coherentes de hijos (o la propia en figuras individuales), sin inferir por texto/posición/color. No se reescribe el archivo al consultar ni se redistribuyen contenedores existentes. Las nuevas filas siguen usando el registro y snapshot anteriores, una transacción y operaciones únicas del núcleo. Inserción por botón/drag conserva su consulta sin alterar el desplegado. Correcciones detectadas por la prueba: conservar scrollTop al regenerar Format y usar la figura del evento CLICK cuando Draw.io asciende la selección del grupo. [ADR-009](adr/ADR-009-tab-contratos-nativo.md), ADR-005, README y AGENTS sincronizados.

**Ejecutado:** `npm test`: TypeScript, **15 pruebas de núcleo y 15 escenarios de navegador aprobados (1,7 min)**; [reporte original](evidence/canvas-selection-integration-results.json). Prueba nueva con seis operaciones: y idéntica/x creciente/sin solapamiento; clics SVG reales de API y endpoints; seis operaciones visibles y solo la elegida expandida; desplazamiento a la sexta; cerrar/reabrir por clic; cambio entre endpoints; XML sin cambios salvo viewport; reapertura limpia con referencias y snapshot iguales. [Fila/API](evidence/seleccion-api-fila-1.11.png), [endpoint expandido](evidence/seleccion-endpoint-1.11.png). Regresión mantiene versiones, herencia/seguridad/responses/ciclos, rechazo atómico, copia, páginas, undo/redo, guardado físico y edición sin extensión.

Demo independiente `delivery=1.11` verificada en navegador integrado con [inventario ficticio de seis operaciones](../examples/contracts/inventario-6-ficticio.json): fila única, selección de PUT /articulos/{id} con parámetro heredado/respuesta correctos, retorno a API completa y selección de PUT otra vez. Las pestañas anteriores se conservan. Sin nuevas dependencias, versión de OpenAPI, formato de registro, almacenamiento o parche del editor. Bootstrap y corpus público no se repiten; sus pruebas anteriores son históricas. No se midió el máximo de operaciones en una fila muy ancha. Piloto humano de etapa 6 continúa pendiente; siguiente paso: participantes. No se ejecutaron APIs ni se subieron/publicaron archivos.
## Versión 1.0.0 — respaldo remoto autorizado

15 de octubre de 2026 (America/Lima). El responsable solicita subir código y toda la documentación y designar esta entrega como versión 1. Se crea el repositorio **privado** [DiegoAlosilla/drawio-contracts-local](https://github.com/DiegoAlosilla/drawio-contracts-local), conservando pendiente la elección de licencia para distribución pública. Esta autorización reemplaza la limitación anterior de no subir archivos para este respaldo; no añade integración GitHub al producto ni autoriza despliegue de la aplicación.

`package.json` y lockfile se fijan en **1.0.0**, sin cambios de dependencias. Se incorporan CHANGELOG, notas de versión y un índice de toda la documentación; las iteraciones 1.7–1.11 se mantienen como historial de interfaz. La primera etiqueta es `v1.0.0`. Se incluyen fuentes, configuración, tests, ejemplos ficticios, ADR, evidencias y avisos de terceros. Se excluyen .runtime, node_modules, dist, work, test-results, cachés y archivos de entorno. No se copian referencias privadas.

Checks ejecutados tras cambiar la versión: TypeScript, **15 tests del núcleo aprobados** y compilación del plugin. La regresión funcional de navegador de la entrega 1.11 (15 escenarios, 99,98 s) se conserva con su reporte original; no se repite por el cambio de metadatos/documentación. Revisión local de archivos versionables, enlaces de la documentación propia y firmas comunes de credenciales sin hallazgos; no es una auditoría exhaustiva. El README de licencia de Draw.io se preserva literal y su referencia LICENSE está disponible como licenses/drawio-Apache-2.0.txt.

Notas y límites: [v1.0.0](releases/v1.0.0.md). Piloto con personas, licencia pública y validaciones de tamaños máximos siguen pendientes. La versión 1 no convierte esos pendientes en criterios comprobados.
