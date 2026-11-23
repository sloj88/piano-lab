import { validateCurriculum } from '../js/content-validator.js';
import { musicLibrary } from '../js/music-library.js';
import { reinforcementCatalog } from '../js/reinforcements.js';
import { assetCatalog, sessionCatalog } from '../js/session-catalog.js';

const result = validateCurriculum({ sessions: sessionCatalog, reinforcements: reinforcementCatalog, music: musicLibrary, assets: assetCatalog });
for (const warning of result.warnings) console.warn(`warning [${warning.category}/${warning.code}] ${warning.path}: ${warning.message}`);
if (!result.valid) {
  for (const error of result.errors) console.error(`error [${error.category}/${error.code}] ${error.path}: ${error.message}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${sessionCatalog.length} session(s), ${Object.keys(musicLibrary).length} music example(s), and ${Object.keys(reinforcementCatalog).length} reinforcement card(s).`);
}
