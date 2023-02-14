import { Action } from "./Action";
import { Meeting } from "./Meeting";

export interface ITimetable{
    canBeTransferredTo(date: Date): boolean,
    busy(date: Date): boolean,
    put(meeting: Meeting): boolean,
    get(date: Date): Meeting,
    perform(actions: Array<Action>): void
}