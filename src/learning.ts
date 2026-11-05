import {skills} from './data/combat';
import type {Command,Unit} from './types';
/** Additive story unlocks can be supplied later without changing level saves or role restrictions. */
export function isSkillLearned(unit:Unit,command:Command,storyUnlocks:readonly Command[]=[]):boolean {
 return unit.level>=(skills[command].unlockLevel??1)||storyUnlocks.includes(command);
}
export type SkillAccess=(unit:Unit,command:Command)=>boolean;
