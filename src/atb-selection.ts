import type {Command} from './types';
export interface CommandSelection {command:Command;targetId:string}
/** Transient UI selection only. Availability and valid targets come from the existing engine. */
export function commandSelection(previous:Readonly<CommandSelection>|undefined,available:readonly Command[],targets:(command:Command)=>readonly {id:string}[],fallbackTarget=''):CommandSelection {
 const command=previous&&available.includes(previous.command)?previous.command:available.find(c=>c!=='attack')??'defend';
 const choices=targets(command),targetId=choices.find(t=>t.id===previous?.targetId)?.id??choices.find(t=>t.id===fallbackTarget)?.id??choices[0]?.id??'';
 return {command,targetId};
}
