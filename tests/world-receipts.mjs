/** Project only the four known new receipts out of legacy assertions; never hide unknown IDs. */
export const newChapterOneReceiptIds=new Set(['c1-first-battle-symbol','c1-fork-battle-symbol','c1-guardian-symbol','c1-chest-object']);
export function legacyWorldIds(ids){return ids.filter(id=>!newChapterOneReceiptIds.has(id))}
