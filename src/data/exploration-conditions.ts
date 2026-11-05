export const landmarks=[{id:'c5-temple-windmark',chapterId:'chapter-05',locationId:'c5-compass',requiresEvent:'c5-gardion',name:'神殿の風読み印'}] as const;
export const sandstorms=[
 {id:'dunes-storm',chapterId:'chapter-05',locationId:'c5-dunes',appearsAfter:'c5-palace-judgment',clearedByEvent:'c5-dunes-sign',clearedByLandmark:'',restrictedActions:['c5-dunes-fight','nadia-lost-sign'],reason:'砂嵐で街道と倒れた道標を調べられません。',release:'「風除けの道標」の会話で流れを読み、風を逃がしてください。'},
 {id:'temple-storm',chapterId:'chapter-05',locationId:'c5-compass',appearsAfter:'c5-gardion',clearedByEvent:'',clearedByLandmark:'c5-temple-windmark',restrictedActions:['c5-compass-puzzle','fragment-temple'],reason:'砂が方位環と資料を覆っています。',release:'この地点の「道標を確かめる」で神殿の風読み印を読んでください。'},
] as const;
