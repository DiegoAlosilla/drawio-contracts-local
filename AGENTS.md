# Reglas del proyecto

Leer [ADR-001](ADR-001-extension-contratos-drawio.md) y `docs/progreso.md` antes de cambiar código. El ADR define alcance y aceptación; este archivo resume sus reglas, no las sustituye.

- Trabajar en la etapa más temprana pendiente. Entregar porciones ejecutables y registrar evidencias, limitaciones y siguiente paso. No declarar comprobado un mock o una prueba no ejecutada.
- Resolver decisiones rutinarias dentro del alcance. Consultar decisiones de producto o información imprescindible. Registrar cambios significativos de persistencia, versión OpenAPI, parches del editor, autenticación o almacenamiento en un ADR.
- No delegar a subagentes sin instrucción expresa del usuario.
- Mantener `contracts` y `model` independientes del DOM y Draw.io. Concentrar APIs del editor y transacciones en `drawio-adapter`. No inferir pertenencia por coordenadas, tags, nombres o colores.
- TypeScript modular; dependencias mantenidas con versiones exactas y lockfile. No improvisar parser YAML, mezclar OpenAPI 3.0/3.1 ni añadir frameworks innecesarios.
- Versiones autorizadas por el usuario: OpenAPI 3.1.x principal, OpenAPI 3.0.x y Swagger 2.0. Leer ADR-003; conservar semántica/dialecto original y diagnosticar capacidades no soportadas.
- Editor fijado por versión, commit y SHA-256; overlays reproducibles mínimos. No modificar su código base sin ADR específico.
- Preservar notas, geometría, conexiones y referencias; sin auto-layout implícito. Usar transacciones para deshacer/rehacer.
- Consulta principal en pestaña **Contratos** de la fila nativa Diagrama/Estilo o Estilo/Texto/Organizar (ADR-009). Conservar colores/clases nativos, buscador «Busca tu API» e importación visibles; elegir API muestra Swagger UI real 5.33.2 con todos sus endpoints y Agregar al lienzo por operación. Ajuste 1.11: seleccionar API en el lienzo abre su contrato completo; seleccionar endpoint abre el contrato completo y expande ese endpoint. Inspección aislada sigue como acción explícita. Aislar CSS/estado de Swagger; no incorporar otro editor. El núcleo conserva validación/interpretación y snapshots; Swagger recibe una copia validada. Repetir pruebas al cambiar versión/plugins internos.
- Ajustes 1.9–1.11: importar sin resumen modal; aviso breve en catálogo. Buscador sin label visible e Importar en una fila; sin contador de APIs. No reintroducir Clasificación de nuevas figuras en esta vista. Agregar/Arrastrar dentro de OperationSummary, junto a Copiar, sin activar el desplegado. Agregar todos crea un contenedor con una única fila de endpoints de izquierda a derecha, referencias propias por endpoint y una sola transacción. Ancho ajustable por borde izquierdo/teclado, sin guardar en el documento. Cerrar mediante × dentro del visor libera la vista, limpia el filtro y muestra todas las APIs; no elimina snapshots ni figuras.
- Registro versionado por documento, snapshot único por revisión y referencias por figura. Caché/localStorage nunca son la fuente de verdad. Versiones desconocidas no se reescriben silenciosamente. Vínculos rotos conservan figura y notas.
- Probar identidad, duplicación, páginas, guardado/reapertura en perfil limpio y editor sin extensión. Probar red y arranque sin conectividad externa después del bootstrap. Checks pertinentes, no tests que dupliquen implementación.
- Antes de cerrar importación: probar parámetros heredados/reemplazados, seguridad efectiva, referencias/ciclos y responses. Importación fallida debe ser atómica.
- Solo datos ficticios en ejemplos, fixtures y evidencias. Excluir runtime, temporales, cachés y datos privados de Git. No copiar `creditos.xml` ni referencias privadas.
- Contratos se procesan en navegador, sin subirlos al servidor. No ejecutar requests ni descargar referencias externas. Mostrar texto escapado; limitar tamaño y complejidad.
- No adelantar GitHub, animación, migración histórica, backend institucional, IA ni otra web. Preparar publicación no autoriza subir archivos, publicar o contactar terceros.
- Mantener atribuciones y avisos de dependencias. No presentarse como producto oficial de Draw.io. Licencia propia pendiente del responsable antes de publicar.
- Sincronizar README, compatibilidad, progreso y ADR con el comportamiento comprobado. Cada entrega explica cambio, criterio, prueba y pendientes.
