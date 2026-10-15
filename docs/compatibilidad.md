# Compatibilidad comprobada

Actualizado el **14 de octubre de 2026**, America/Lima. Se conservan las entregas anteriores como registro histórico; el último apartado describe la interfaz actual. Piloto con personas aún pendiente.

## Versiones y entorno

| Elemento | Valor probado |
|---|---|
| Editor | Draw.io **32.4.1**, WAR oficial, tag `v32.4.1` |
| Commit | `9034053fba80a435e27d68d374bc564b83917ae9` |
| SHA-256 del WAR | `b83663313ccdecef6581476a7eaa96750bccf1bfdc3768981eb5d95e94be7820` |
| Runtime | Node.js **24.18.0**, npm **11.16.0** |
| Sistema | Windows 11 Pro Insider Preview 10.0.26300, x64; PowerShell |
| Equipo | AMD Ryzen 5 5500, 15.9 GiB RAM |
| Navegador automatizado | Chromium / Chrome for Testing **156.0.8078.4**, Playwright **1.64.0** |
| UI | Tema clásico `kennedy`, español, viewport 1440 × 1000; además arranque por `/` sin parámetros |
| Comprobación manual | Navegador integrado de Codex: insertar y abrir inspector visibles |
| Fixture | JSON OpenAPI **3.0.4**, API de clientes ficticios, 1 operación GET; no representa contratos reales |
| Herramientas | TypeScript 7.0.2, esbuild 0.28.2, fflate 0.8.3; versiones exactas y lockfile |
| Documentación actual | Swagger UI / swagger-ui-dist **5.33.2**, bundle/CSS locales; [ADR-008](adr/ADR-008-swagger-ui-real.md) sustituye el renderer anterior |

La selección del editor/runtime se mantiene. Desde la instrucción del usuario, **OpenAPI 3.1.x es principal** y se admiten **3.0.x/Swagger 2.0**, JSON/YAML, con límites de ADR-003. No se anuncia soporte para sistemas/navegadores/editor/temas no probados. Dependencias nuevas exactas en package-lock y fuentes/huellas del schema 3.1 en config.

## Pruebas y resultados

`npm test`: comprobación TypeScript y **3 pruebas de integración aprobadas**, 14.5 s en la ejecución registrada. Son escenarios con el editor real, no dobles del modelo. `npm run test:startup`: **5 comprobaciones de arranque aprobadas** en Windows.

| Criterio | Resultado / evidencia |
|---|---|
| Carga automática | PostConfig → Draw.loadPlugin; acciones en barra y Extras, sin configuración de plugins por perfil |
| Inserción/selección/consulta | Figura UserObject y diálogo de documentación real; [inspector](evidence/etapa-0-inspector.png) |
| Identidad | Referencia explícita API/revisión/método/path, `operationId` auxiliar; duplicar asigna otro id mxCell manteniendo la referencia |
| Snapshot | Los bytes de la fixture y su SHA-256 coinciden tras serializar; registro único en mxfile |
| Transacciones | Un undo quita figura y registro inicial; redo restituye ambos |
| Figuras/páginas | Duplicación de figura, movimiento de copia, duplicación/cambio/creación de páginas; 3 páginas, 5 instancias, 1 snapshot |
| Archivo físico / perfil limpio | Descarga .drawio a disco, cierre del contexto autor, otro contexto sin storage previo; solo se selecciona el .drawio, no el contrato; geometría, notas y referencias iguales; [captura](evidence/etapa-0-perfil-limpio.png) |
| Editor sin extensión | `contracts=0`: figuras básicas visibles; apertura, cambio de etiqueta y **Archivo → Guardar como → Descargar → OK**; archivo físico [sin extensión](../examples/diagrams/etapa-0-sin-extension.drawio); otra sesión con plugin vuelve a mostrar docs y conserva registro/notas/geometría |
| Metadatos desconocidos | Versión 99 se informa y bloquea la nueva inserción; se preserva el atributo original |
| Vínculo perdido | Inspector informa «Contrato no disponible»; no elimina figura ni notas |
| Descripciones como datos | HTML ficticio se muestra literalmente; no crea img ni ejecuta el handler |
| Recursos/red | En 4 contextos: **59 GET locales**, 59 respuestas exitosas, 0 externas, 0 errores/CSP en el contexto autor; [registro](evidence/network-etapa-0.json) |
| Escrituras al servidor | POST rechazado con 405; el contrato se lee en el navegador |
| Clon limpio | Git clone desde repositorio temporal ficticio local, sin node_modules ni .runtime; `npm start` instala, descarga, verifica, extrae y muestra plugin; 50.292 s incluyendo consulta con navegador |
| Segundo arranque | Reutiliza editor y dependencias; 2.583 s incluyendo navegador e inspector; sin acceso externo; [resultados](evidence/startup-results.json) |
| Fallos de runtime | Puerto ocupado/puerto inválido y SHA incorrecto: código de salida 1, mensaje concreto, sin servidor aparentemente listo |

El archivo de demostración [etapa-0-ficticia.drawio](../examples/diagrams/etapa-0-ficticia.drawio) pesa **7161 bytes** en la ejecución registrada; incluye 3 páginas y el snapshot. El archivo después de guardar sin extensión pesa 7112 bytes. Son mediciones de estas fixtures, no un presupuesto de rendimiento del MVP.

## Qué significa «sin red» en estas pruebas

Se bloquean las conexiones externas con rutas del navegador; loopback permanece disponible para el editor. El segundo `npm start` se ejecuta con preload de prueba que rechaza fetch externo, resolución DNS externa y conexiones TCP externas en Node. El editor carga e inserta/consulta correctamente desde un perfil nuevo. No se modifica la configuración de red del equipo ni se apaga el adaptador físico. Es una prueba de aislamiento del proceso y de ausencia de dependencia externa para el recorrido ensayado, no una auditoría de todas las funciones de Draw.io.

La CSP del servidor impide destinos externos. PreConfig desactiva integraciones remotas, exportación remota, logs e IA; PostConfig desactiva búsquedas remotas de iconos. Recursos como stencils, formas y extensiones se sirven desde el WAR verificado. La preparación inicial sí requiere Internet; los enlaces externos solo corresponden a acciones explícitas y la CSP puede impedir algunas funciones ajenas a esta prueba.

## Cierre técnico de etapas 2–5 (registro anterior)

13 tests de núcleo y 8 escenarios de navegador aprobados, más comprobación de arranque desde clon limpio y reutilización aislada. La interfaz usa el mismo Draw.io; no se generó otra web. [ADR-003](adr/ADR-003-openapi-versiones.md) explica el formato 2 y la adaptación controlada del schema oficial 3.1 para Ajv.

| Capacidad | Evidencia actual |
|---|---|
| Tres líneas, JSON/YAML | Cada línea se prueba en ambos formatos; las versiones se detectan antes de normalizar; boolean/null/siblings 3.1, nullable/allOf 3.0 y body/formData/consumes/produces 2.0 conservan su semántica |
| Parámetros/seguridad | Herencia y reemplazo por nombre+ubicación; ausencia distinta de seguridad vacía, headers/cookie, definición global y sobrescritura por operación |
| Referencias | JSON Pointer URI/escapes, ciclos conservados, objetivos inexistentes y externos rechazados; objetos referenciados validados en su sitio de uso; Schema Objects sin expansión/flattening global |
| Importación atómica | Rechazos conservan registro/lienzo; mismo archivo se deduplica; API id independiente de título/ruta/operationId; importación aceptada es undoable |
| Catálogo/figuras | Buscar 3 APIs con rutas iguales, botón y arrastre reales; crear/mover/redimensionar/conectar pendiente, revisar diferencias y vincular sin perder id, notas, propósito, estilo, geometría o conexión |
| Inspector | Request, parámetros efectivos, responses/headers/ejemplos/seguridad y procedencia; propiedades/referencias/composiciones en detalles desplazables; ciclo detenido y texto HTML seguro |
| Registro portable | Formato 1 JSON legible, formato 2 JSON/YAML actual; snapshot único por revisión y vínculos por figura; unsupported se informa sin reescritura |
| Flujo completo | [mvp-ficticio.drawio](../examples/diagrams/mvp-ficticio.drawio): 3 snapshots, 2 páginas, 7 figuras y 3 conexiones por página; copia con id nuevo y referencia compartida, caché/validación libres; contexto limpio conserva todos los datos |
| Sin extensión | Archivo formato 2 con las tres versiones: abrir, cambiar etiqueta y descargar por menú nativo; otro contexto con plugin recupera contrato/notas/geometría/conexiones; [archivo](../examples/diagrams/mvp-sin-extension-ficticio.drawio) |
| Entre documentos | `mxClipboard.copy/paste`: faltan revisiones → bloqueado **antes** de importar células, sin inserción parcial; figuras libres permitidas; [ADR-004](adr/ADR-004-copia-entre-documentos.md) |
| Red/localidad | Recorrido completo/importación con destinos externos bloqueados; todas las solicitudes observadas GET loopback. Contratos no se envían al servidor; POST rechazado. Aislamiento Node/navegador después del bootstrap |

### Presupuesto medido

La fixture de presupuesto genera **3 contratos × 100 operaciones**, uno por versión, con 20 propiedades por response. Ejecución de navegador registrada en [budget-results.json](evidence/budget-results.json). Los archivos tienen **173596–176866 bytes (170–173 KiB)**. Último registro: 200/158/173 ms de importación y 2,2 ms de búsqueda; importaciones <3 s y búsqueda <300 ms comprobadas sobre ese conjunto. No equivale a ensayar archivos de 5 MiB ni todos los contratos complejos.

Límites implementados y pruebas de rechazo: 5 MiB por archivo, 15 MiB por snapshots/documento y por datos/referencias expandidos, 64 niveles, 200000 nodos, alias YAML 50, cadenas de referencias 64. Navegación del inspector hasta 6 niveles. El diagrama MVP ronda **22 KiB**; el tamaño exacto de cada ejecución se obtiene del archivo, no se promete rendimiento general ni aceptación institucional.

## Límites actuales

- Copia/pegado entre documentos no transporta snapshots: se bloquea explícitamente si falta una revisión. Compartir/reabrir el archivo completo sí es portable. Un transporte futuro requiere ampliar integración y pruebas.
- El registry usa APIs observadas en esta versión (`fileNode`, serializador y cambios del modelo). Cada actualización del editor requiere repetir las pruebas. El callback de plugin es el punto de entrada soportado, los demás mecanismos están encapsulados en el adaptador.
- El guardado sin plugin está comprobado para este XML, una edición de etiqueta y estas páginas. Exportar a SVG/PNG, copiar páginas entre archivos o utilizar otras herramientas no fue verificado.
- Anchors, bases `$id`, `$dynamicRef` y dialectos personalizados se rechazan; callbacks/webhooks se conservan sin enumerarlos. Referencias externas no se descargan. MIME se presenta literalmente; no es un validador completo de contrato ni de payloads.
- Los umbrales de importación/búsqueda se verificaron con la fixture de 300 operaciones; apertura de un documento de 15 MiB, muchos esquemas complejos y todas las funciones del editor no están verificados.
- Licencia propia, nombre/responsable de publicación y **piloto de utilidad con 3–5 personas** siguen pendientes. Sin publicaciones ni remotos externos.

## Repetir la comprobación

1. `npm start` y abrir la URL indicada; insertar, consultar y guardar desde Extras.
2. Abrir el archivo desde otro perfil privado/limpio con extensión, sin seleccionar ningún contrato. Consultar la figura.
3. Repetir con `contracts=0`, editar etiqueta y guardar; volver con plugin.
4. `npm run test:browser-install; npm test; npm run test:startup` para los escenarios automatizados. Este último realiza descarga inicial nueva para su clon temporal.

## Figura de componente — 14 de octubre de 2026

Ampliación visual descrita en [ADR-005](adr/ADR-005-figura-componente.md), sin nueva versión de Draw.io ni de registro. 13 tests de núcleo y 9 escenarios de navegador aprobados (44,9 s). Los componentes son figuras nativas: editables, guardables y visibles sin extensión. Selección interna resuelve la referencia del padre; copiar el hijo por clipboard incluye el contenedor y mantiene el bloqueo entre documentos sin revisión. Conversión individual deshacible; nunca automática al abrir. Diagramas anteriores conservan su aspecto hasta elegir Extras → Usar figura de componente. El nuevo mínimo 360×170 puede requerir ajustar manualmente el espacio al convertir. Títulos/rutas extensos pueden necesitar redimensionado del autor. El color amarillo se adapta al modo oscuro del editor. [Ejemplo](../examples/diagrams/figura-componente-ficticia.drawio), [captura](evidence/figura-componente.png). Las pruebas de arranque anteriores siguen siendo históricas y no se repitieron para este cambio visual.

## Diagnósticos YAML acotados — 14 de octubre de 2026 (sustituido por ADR-006)

Raíz no mapeada: INVALID_FILE con línea/columna e indicación de claves con dos puntos. Fallos del parser: hasta tres códigos de error/advertencia con ubicación y contador del resto; no se incrusta el contrato en el aviso. Se mantiene rechazo estricto/atómico y se utiliza la AST/LineCounter de YAML 2.9.1. No se reconstruyen signos, rutas ni referencias de archivos dañados. Verificados 14 tests de núcleo y el escenario de importación de navegador con entrada dañada ficticia y tres versiones válidas; anteriores verificaciones de figuras/arranque no se repitieron. [Evidencia ficticia](evidence/error-yaml-ficticio.png).

El reportador de errores utiliza un diálogo del editor con texto escapado y área desplazable para evitar el recorte del aviso nativo. El mensaje completo sigue accesible por teclado/desplazamiento.

## Consulta visual y corpus público fijado — registro anterior, 14 de octubre de 2026

[ADR-006](adr/ADR-006-consulta-y-diagnosticos.md) detalla el inspector por pestañas y tablas, ejemplos/códigos/MIME seleccionables, fuente original y catálogo renovado. Sin cambios de registro/editor/versiones. Expansión visual hasta 6 niveles y presupuesto de 300 nodos por esquema; las definiciones completas permanecen en Fuente. Ejemplos que son cadenas siguen siendo cadenas, los ejemplos externos no se descargan y no se inventa schema desde ejemplos. Estilos claros/oscuros y ventana 640×720 ensayados.

Ajv genera todos los fallos estructurales; el informe filtra ramas alternativas que no corresponden al objeto y muestra hasta 50 problemas con punteros. El resultado de aceptación no se relaja. Referencias, parser/límites y normalización siguen siendo etapas sucesivas: pueden aparecer problemas posteriores tras corregir los anteriores. YAML muestra la primera incidencia para evitar cascadas y distingue HTML frente a contenido Raw. Importación rechazada conserva registro/lienzo.

Corpus de examples de postmanlabs/openapi-to-postman, commit 6367b778d19bab24b2718b522539299504269f4c: **7 de 9 originales aceptados, 2 rechazados correctamente**. Se excluyen dos JSON de opciones, no se auditó toda la suite del repositorio. Huellas en config/public-examples.json; fuentes en work ignorado. api-with-examples.yaml requiere corregir indentación del cierre en línea 43, tras lo cual se verifican 2 operaciones y su ejemplo 300. La prueba de desarrollo descarga archivos públicos explícitamente; el producto sigue sin integración GitHub ni descargas de referencias. [Resultados](evidence/public-examples-results.json), [navegador](evidence/public-examples-browser-results.json).

Cierre: 15 tests de núcleo y 10 escenarios de navegador aprobados (51,5 s), incluida regresión completa de portabilidad, informe agrupado/atomicidad y consulta visual. [Resultados](evidence/redesign-integration-results.json). Presupuesto actualizado: 228/177/191 ms por importación de 100 operaciones (3.1/3.0/2.0) y 2,1 ms de búsqueda, [fixture de medidas](evidence/redesign-budget-results.json). No prueba rendimiento con todos los contratos ni utilidad con personas. Las verificaciones de arranque anteriores siguen como evidencia histórica; no se repitieron en este ajuste sin cambios de bootstrap/dependencias.

## Consulta automática lateral — ADR-007, registro anterior del 14 de octubre de 2026

La ubicación modal de ADR-006 se sustituye por un lateral derecho fijo, inspirado en Swagger UI y renderizado por código propio. Seleccionar padre/hijo de una instancia actualiza la documentación sin acción adicional; dos instancias distintas muestran selección múltiple. Catálogo acoplado con preview sin inserción y controles nativos accesibles en Formato. Sin selección/figura libre/pendiente/vínculo perdido se retira documentación anterior. El conmutador nativo de formato y ocultar/recuperar lateral están probados. En ventanas <900 px se superpone de forma cerrable.

Adaptador verificado contra columna 4/fila 3 de la cuadrícula de Draw.io 32.4.1, tema local habitual. No modificar editor base ni geometrías para acomodar el panel. Otros layouts/temas no certificados. No hay dependencia nueva de Swagger ni otro parser/resolvedor; reglas/versiones/snapshots iguales. [ADR-007](adr/ADR-007-panel-endpoint.md), [captura](evidence/lateral-endpoint.png).

15 tests del núcleo + 11 escenarios de navegador aprobados (52,7 s); comprobación adicional del lateral con conmutador/búsqueda aprobada (5,0 s). [Resultados generales](evidence/dock-integration-results.json), [lateral](evidence/dock-focused-results.json), [corpus público en panel nuevo](evidence/dock-public-examples-results.json). Se mantienen guardado/páginas/perfiles/editor sin plugin, edición/clipboard/undo, inspector seguro y diagnóstico atómico. Arranque previo sigue histórico y no se repitió. No implica disponibilidad de un piloto humano ni compatibilidad con todas las funciones o versiones de Draw.io.

## Swagger UI real — registro de entrega 1.7, ADR-008

Se sustituye el renderer propio de ADR-006/007 por **Swagger UI 5.33.2**, sin cambiar Draw.io, núcleo de contratos o registro. JavaScript/CSS incluidos en contracts.js, sin CDN; plugin resultante **3 425 593 bytes** (desarrollo, sin gzip, con el núcleo y CSS incluidos). Esta cifra no es el peso exclusivo de Swagger ni una promesa de carga para producción.

- OpenAPI 3.1: refs de parámetros heredados resueltos, override de query requerido, cookie/header, requestBody, nullable nativo, restricciones junto a $ref, modelo recursivo, responses/headers y ejemplos declarados. Ref entre rutas y operación con varios tags: una sola operación visible, documento completo para resolver referencias.
- OpenAPI 3.0: schema nullable/allOf conservado, ejemplos sin schema con selector nativo. Swagger 2.0: body/formData, consumes/produces y respuestas. Cambio entre versiones/archivos y selección rápida no muestran respuestas antiguas en los escenarios probados.
- Swagger controla modelos/Example Value/Schema; expansión inicial a un nivel. El límite visual propio anterior de seis niveles/300 nodos queda retirado. Permanecen los límites del núcleo; no se certifica toda expansión manual, cada keyword JSON Schema ni rendimiento máximo de modelos grandes.
- Consulta conserva snapshot byte por byte y XML del diagrama. Example Value generado no se persiste como ejemplo declarado. Seguridad efectiva y fuente original desplegables; autorización/OIDC y Try it out desactivados. HTML e imágenes Markdown del contrato aparecen como texto, sin img/handlers ni solicitudes externas, incluido externalValue.
- Shadow DOM aísla CSS; tema claro y etiquetas originales de Swagger dentro del editor claro/oscuro. Escritorio 1440×1000 y estrecho 640×720 probados; se conservan pestaña Endpoint y controles nativos al ajustar ancho. Formato explícito/conmutador, catálogo y selección mantienen sus pruebas. Otros temas/layouts no certificados.

Resultados ejecutados: **TypeScript + 15 pruebas de núcleo + 13 escenarios de navegador**, todos aprobados, navegador **74,4 s**. [Suite](evidence/swagger-integration-results.json). Incluye las regresiones anteriores de guardado físico/perfil limpio, editor sin plugin, geometría/notas/conexiones/clipboard/páginas/undo y errores atómicos. [Captura de endpoint](evidence/swagger-ui-endpoint.png), [ejemplos](evidence/swagger-ui-respuestas.png), [ventana estrecha](evidence/swagger-ui-estrecho.png).

Arranque repetido por cambio de dependencias: **6 comprobaciones aprobadas**, clon limpio 55,719 s y reutilización con Node/navegador sin conexiones externas 3,276 s. El probe espera una respuesta real dentro de Swagger UI; no solo el encabezado del adaptador. [Resultados](evidence/swagger-startup-results.json). Npm no ejecutó los scripts pendientes de esbuild/Scarf en la versión probada; se conserva el opt-out explícito de Scarf en package.json para instalaciones que sí los permitan.

Corpus público fijado repetido en núcleo/editor: 7 aceptados/2 rechazados sin modificar registro; ejemplo 300 de la copia corregida visible en el renderer real; **0 solicitudes externas del navegador**. [Resultados](evidence/swagger-public-examples-results.json). Descarga inicial de fixtures públicas solo en runner de desarrollo, nunca en producto. Presupuesto ficticio: importaciones de 100 operaciones 208/158/152 ms (3.1/3.0/2.0), búsqueda 2,3 ms; [medidas](evidence/swagger-budget-results.json). No mide el tiempo de toda renderización ni prueba tamaños máximos.

Pendientes: piloto humano de etapa 6, localización de Swagger, decisión de tema oscuro del renderer y medidas con esquemas mayores. No se ejecutaron APIs ni se subieron/publicaron archivos.

## Contratos en pestañas nativas — registro de entrega 1.8

[ADR-009](adr/ADR-009-tab-contratos-nativo.md) reemplaza la fila propia Endpoint/Catálogo/Formato y la selección automática. **Contratos** aparece dentro de geFormatTitleContainer, junto a Diagrama/Estilo o Estilo/Texto/Organizar. Utiliza geFormatTitle/geActiveFormatTitle y los colores nativos; no se modifica el WAR. El ancho adicional solo se aplica mientras Contratos está activo; se restaura el ancho nativo al salir. Vista normal, 1440×1000 y 640×720 probadas; la cuadrícula original reserva espacio al panel, sin overlay propio.

Importar contrato y Busca tu API permanecen arriba. Buscar filtra títulos/versiones de APIs; elegir una muestra el documento completo en Swagger UI, con endpoints inicialmente plegados y **Agregar al lienzo** por operación. Se conserva la elección y búsqueda al insertar, seleccionar/editar figuras y alternar pestañas. El botón de cada operación usa identidad del núcleo; no infiere propietario por texto/color. La acción explícita Panel de endpoint conserva consulta individual, siempre con la barra de APIs encima. Clasificación manual y vinculación de pendientes se mantienen.

Verificación final: **TypeScript + 15 tests de núcleo + 13 escenarios de navegador aprobados (68,7 s)**. [Resultado](evidence/native-tabs-integration-results.json). Nueva prueba sobre pestañas reales, comparación de colores del header, API completa/acciones, persistencia de búsqueda, cambio de API, no coincidencias, selección vacía, controles de Estilo recuperados, ancho acotado, inserción/undo/redo y conservación de registro/referencia/geometría. Regresión de 3.1/3.0/2.0, texto seguro/red bloqueada, drag/pendientes, identidad/conexiones/notas/páginas/clipboard, guardado físico/perfiles limpios/editor sin extensión. La comparación de XML excluye únicamente dx/dy del viewport de mxGraphModel; no excluye geometrías ni snapshots. [Captura](evidence/contratos-tab-nativo.png).

Corpus fijado repetido con los nuevos controles: 7 originales aceptados, 2 rechazados sin cambiar registro y ejemplo 300 de copia corregida visible; 0 solicitudes externas del navegador. [Resultados](evidence/native-tabs-public-examples-results.json). Presupuesto ficticio: importaciones de 100 operaciones 247/225/241 ms (3.1/3.0/2.0); filtrado de **tres APIs** 0,2 ms, no comparable con el anterior filtrado de cientos de operaciones. [Medidas](evidence/native-tabs-budget-results.json). No mide render completo ni prueba el máximo de tamaños. Bundle de desarrollo conjunto: 3 429 118 bytes sin gzip.

Comprobación manual en el navegador integrado: Contratos → Importar contrato → cerrar resumen → buscar «clientes» → elegir API → ver tres endpoints plegados → agregar GET. El buscador conserva «clientes» y el contrato completo; aparecen Estilo/Texto/Organizar/Contratos con los colores nativos oscuros de esa sesión. Demo independiente delivery=1.8. No se reabrieron ni modificaron las pestañas con trabajo previo del usuario.

Arranque desde clon no se repitió: no cambian dependencias, bootstrap, servidor ni versión del editor; sus seis comprobaciones previas se mantienen como históricas. Piloto humano y soporte de otros layouts/versiones siguen pendientes. Sin ejecución de APIs, subidas o publicación.

## Refinamiento del catálogo — estado actual, entrega 1.9

Ajuste solicitado sobre la pestaña nativa existente; se conservan colores y controles. Importar vuelve directamente al catálogo con un estado breve (API/versión/operaciones o archivo ya importado), sin el resumen modal eliminado. Rechazos conservan diagnóstico y atomicidad. El input con placeholder/nombre accesible Busca tu API y el botón Importar contrato comparten fila; no hay label visible ni Clasificación de nuevas figuras. Las nuevas inserciones del catálogo no asignan clasificación; no se reescriben metadatos de figuras existentes.

Agregar al lienzo y Arrastrar se insertan dentro de **OperationSummary**, junto al control Copiar original, conservando sus handlers y el desplegado de Swagger. No se anidan botones en el botón de expansión. Pulsar Agregar no abre/cierra el endpoint; drag sigue pasando por el adaptador existente. En contenedores estrechos, método/ruta pueden ocupar una fila y las acciones otra, siempre dentro del mismo borde.

**Cerrar contrato** retira la documentación, limpia la búsqueda y devuelve todas las APIs al área de contenido con desplazamiento, sin el límite de altura usado mientras el contrato está abierto. No elimina snapshots, figuras, notas o conexiones ni crea una entrada de undo. Se puede elegir otra API o volver a abrir la anterior.

Pruebas: TypeScript, **15 pruebas de núcleo y 13 escenarios de navegador aprobados (71,4 s)**; [regresión](evidence/catalog-refinements-integration-results.json). Tras el ajuste final del estado accesible y distribución estrecha, se repiten los **5 escenarios de catálogo/inspector (22,8 s), todos aprobados**; [resultado](evidence/catalog-refinements-focused-results.json). Incluye fila alineada, ausencia de label/clasificación/resumen, acciones dentro de opblock-summary/opblock, clic sin desplegar, drag, cierre/filtro/lista completa y preservación del registro; se conservan validación de tres versiones, ciclos/seguridad/texto seguro, clipboard, guardado y perfiles limpios/editor sin plugin. [Contrato abierto](evidence/contratos-tab-nativo.png), [lista tras cerrar](evidence/contratos-lista-completa.png).

Corpus fijado repetido con importación sin modal: 7 originales aceptados/2 rechazados atómicamente, ejemplo 300 corregido visible y cero solicitudes externas del navegador; [resultado](evidence/catalog-refinements-public-examples-results.json). Presupuesto ficticio: 292/327/303 ms para importar 100 operaciones por línea, filtrado de tres APIs 0,2 ms; [medidas](evidence/catalog-refinements-budget-results.json). No representa el tiempo de render completo ni un catálogo grande. No se repite bootstrap: dependencias/editor/servidor no cambian. Piloto humano pendiente; sin publicación, subidas o llamadas a APIs.
## Entrega 1.10 — controles y agregado de API completa

14 de octubre de 2026 (America/Lima). Sobre Draw.io 32.4.1/kennedy y Swagger UI 5.33.2 fijados: Importar abre el selector local, sin contador de APIs; la × accesible como Cerrar contrato aparece dentro de la barra del visor. Se conserva el aviso breve de importación y los estados vacíos. Agregar al lienzo tiene contraste/foco/hover y símbolo de suma. Se retiran los botones de prueba del lateral izquierdo; permanecen las acciones de Extras. **Agregar todos** crea un contenedor de API y un hijo vinculado por operación del núcleo, en una única transacción, sin duplicar snapshots ni cambiar figuras previas. API/revisión/método/path y parent explícitos; etiquetas y coordenadas no definen identidad.

Separador izquierdo por puntero y teclado: flechas ±20 px, Inicio/Fin; ancho de 300–1000 px acotado al viewport menos 40 px. Preferencia de sesión solo en memoria; al reducir viewport se acota sin perderla y al cambiar de pestaña se recupera el CSS nativo. Ventana estrecha 640×720 ensayada. La cabecera se ajusta al gutter nativo para evitar desbordamiento; no se modifica el editor base.

`npm test`: TypeScript + **15 pruebas de núcleo + 14 escenarios de navegador aprobados (~1,4 min)**; [resumen de salida](evidence/panel-controls-integration-results.json). Después del acabado final se ejecutan check/build y **2 escenarios (19,0 s)**, [reporte original](evidence/panel-controls-focused-results.json). Incluye arrastre real/teclado del separador, ancho entre pestañas/clamp estrecho, cierre interno, inserción por operación y de API completa, undo/redo único, conservación de figuras/notas/conexiones, copia individual y conjunta, duplicación/cambio de página, guardado físico y perfil limpio sin contratos originales; apertura sin extensión y reserialización tras editar sin ella; consulta de referencias recuperadas y cero solicitudes externas/errores de página en ese recorrido. La regresión general conserva interpretación de las tres versiones, seguridad/ref/ciclos, rechazos atómicos y clipboard incompleto bloqueado. [Captura](evidence/controles-contratos-1.10.png).

No se repiten bootstrap desde clon ni corpus público al no cambiar dependencias/parser/runtime/editor; resultados previos históricos. Sus selectores se adaptan a los controles nuevos. No se extrapola a contratos de tamaño máximo, todos los layouts ni utilidad humana. Piloto de etapa 6 pendiente. Sin ejecución de APIs, subidas o publicación.
## Entrega 1.11 — fila horizontal y selección automática

14 de octubre de 2026 (America/Lima). Agregar todos genera una sola fila horizontal de izquierda a derecha; el ancho del nuevo contenedor crece con el número de operaciones. Los contenedores existentes conservan geometría. Seleccionar o pulsar una API abre su contrato completo en Contratos; un endpoint abre el mismo contrato completo con la operación seleccionada expandida y visible en el scroll. Funciona desde una pestaña nativa y al volver a pulsar una figura ya seleccionada después de cerrar. Se conserva la inspección aislada mediante Extras → Panel de endpoint. Selecciones vacías/libres/múltiples no sustituyen la consulta.

Padres de API resueltos por referencias propias o de hijos explícitos que deben coincidir en API/revisión. Sin atributo nuevo, migración de datos, cambio de registro/snapshot, inferencia por etiquetas o nuevas entradas de undo al consultar. La inserción conserva la documentación y expansión previas; la selección real posterior navega. El plugin de Swagger distingue vista completa con expansión dirigida de la vista individual explícita. Conserva scrollTop al regenerar las pestañas nativas y espera el commit de Swagger antes de desplazar al endpoint.

**Ejecutado:** `npm test`: TypeScript, **15 pruebas de núcleo y 15 escenarios de navegador aprobados (1,7 min)**; [reporte original completo](evidence/canvas-selection-integration-results.json). El escenario nuevo comprueba seis endpoints en una fila, referencias y geometrías, clics SVG reales de API y endpoints, documento completo y expansión única, scroll a la sexta operación, cierre/reapertura, retorno al padre, no modificación del XML salvo viewport y perfil nuevo sin contratos originales. Regresión completa mantiene OpenAPI 3.1/3.0/Swagger 2.0, herencia/reemplazo, seguridad, refs/ciclos/responses, atomicidad, texto seguro/red, clipboard, páginas, undo/redo y guardado físico/edición sin extensión. [API/fila](evidence/seleccion-api-fila-1.11.png), [endpoint](evidence/seleccion-endpoint-1.11.png).

Comprobación manual adicional en navegador integrado con seis operaciones GET/POST/DELETE/GET/PUT/DELETE de inventario ficticio: selección de PUT /articulos/{id} expande esa operación y muestra parámetro heredado/respuesta correctos; selección del padre recupera la API. Sin conexiones externas observadas en el nuevo escenario automatizado. No se repiten bootstrap ni corpus público; sin cambios de runtime, parser, dependencias o versión fijada. No certifica todas las extensiones internas de Swagger ni rendimiento máximo de una fila muy larga. Piloto humano pendiente; sin publicaciones, subidas ni ejecución de APIs.
