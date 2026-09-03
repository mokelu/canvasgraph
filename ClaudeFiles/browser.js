// Pure web / browser-only entry.
//
// Uses unstorage's OFFICIAL IndexedDB driver instead of a hand-rolled OPFS
// driver. Two reasons:
//   1. It's already correct and tested — no async-iterator bugs to chase.
//   2. A plugin list is small, structured data — exactly the shape
//      IndexedDB (a database) is for, not raw file storage.
//
// If Fairy later needs to store actual FILES in the browser (e.g. a
// downloaded plugin's assets), that's a separate, additive concern —
// mount an OPFS driver at a different key prefix then. Don't reach for it
// before you need it.
//
// Requires: npm i unstorage idb-keyval

import { createStorage } from 'unstorage';
import indexedDbDriver from 'unstorage/drivers/indexeddb';

export const storage = createStorage({
  driver: indexedDbDriver({ base: 'fairy' }),
});
