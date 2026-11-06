export const landmarks=[{id:'c5-temple-windmark',chapterId:'chapter-05',locationId:'c5-compass',requiresEvent:'c5-gardion',name:'神殿の風読み印'}] as const;
export const sandstorms=[
 {id:'dunes-storm',chapterId:'chapter-05',locationId:'c5-dunes',appearsAfter:'c5-palace-judgment',clearedByEvent:'c5-dunes-sign',clearedByLandmark:'',restrictedActions:['c5-dunes-fight','nadia-lost-sign'],reason:'砂嵐で街道と倒れた道標を調べられません。',release:'「風除けの道標」の会話で流れを読み、風を逃がしてください。'},
 {id:'temple-storm',chapterId:'chapter-05',locationId:'c5-compass',appearsAfter:'c5-gardion',clearedByEvent:'',clearedByLandmark:'c5-temple-windmark',restrictedActions:['c5-compass-puzzle','fragment-temple'],reason:'砂が方位環と資料を覆っています。',release:'この地点の「道標を確かめる」で神殿の風読み印を読んでください。'},
] as const;
export const timeDevices=[
 {id:'c6-canal-clock',chapterId:'chapter-06',locationId:'c6-canal',requiresEvent:'c6-orphen',settledByEvent:'c6-canal-tune',name:'運河の時流装置'},
 {id:'c6-corridor-clock',chapterId:'chapter-06',locationId:'c6-corridor',requiresEvent:'c6-shield-gift',settledByEvent:'c6-clock-puzzle',name:'回廊の時流装置'},
] as const;
export type TimeMode='stopped'|'flowing';
export interface ExplorationRule {id:string;kind:'sandstorm'|'time';chapterId:string;locationId:string;appearsAfter:string;clearedByEvent?:string;clearedByLandmark?:string;timeDevice?:string;restrictedActions:readonly string[];reason:string;release:string}
export const explorationRules:readonly ExplorationRule[]=[
 ...sandstorms.map(rule=>({...rule,kind:'sandstorm' as const})),
 {id:'canal-time',kind:'time',chapterId:'chapter-06',locationId:'c6-canal',appearsAfter:'c6-orphen',timeDevice:'c6-canal-clock',restrictedActions:['c6-canal-tune','c6-canal-fight','orphen-spring'],reason:'時間は静止中です。戻り続ける水で調査できません。',release:'この地点の時流装置を「進行」に切り替えてください。'},
 {id:'corridor-time',kind:'time',chapterId:'chapter-06',locationId:'c6-corridor',appearsAfter:'c6-shield-gift',timeDevice:'c6-corridor-clock',restrictedActions:['c6-clock-puzzle','eil-message'],reason:'時間は静止中です。時刻盤と伝言の文字が戻り続けています。',release:'この地点の時流装置を「進行」に切り替えてください。'},
];
