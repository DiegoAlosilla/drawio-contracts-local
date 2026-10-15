import {build} from 'esbuild';
await build({entryPoints:['src/contracts/index.ts'],outfile:'dist/contracts-core.mjs',bundle:true,platform:'node',format:'esm',target:'node24',packages:'external'});
await build({entryPoints:['src/persistence/registry.ts'],outfile:'dist/registry-core.mjs',bundle:true,platform:'node',format:'esm',target:'node24',packages:'external'});
