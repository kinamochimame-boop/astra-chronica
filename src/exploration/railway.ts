import type {Progress} from '../save';
import {railNetwork,transitRestored,transitDestinations,transitReason,beginTransit,completeTransit,transitGuidance,type TransitTicket} from './transit';
/** v2.1 API remains available; railway and ark share a single transition engine. */
export const railStationIds=railNetwork.mapIds;
export type RailTicket=TransitTicket;
export const railwayRestored=(p:Progress)=>transitRestored(p,railNetwork);
export const railStations=(p:Progress)=>transitDestinations(p,railNetwork);
export const railReason=(p:Progress,to:string)=>transitReason(p,to,railNetwork);
export const beginRailTrip=(p:Progress,to:string)=>beginTransit(p,to,railNetwork);
export const completeRailTrip=(p:Progress,t:RailTicket)=>completeTransit(p,t,railNetwork);
export const railGuidance=(p:Progress)=>transitGuidance(p,railNetwork);
