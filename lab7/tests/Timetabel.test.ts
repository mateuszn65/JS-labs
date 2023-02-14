import { Timetable } from '../Timetable'
import {move} from '../move'
import {Action} from '../Action'
import {Meeting} from '../Meeting'
import {describe, it, expect, beforeEach} from 'vitest'

describe('canBeTransferredTo(date: Date) : boolean', () => {
    let timetable: Timetable
    beforeEach(() => {
        timetable = new Timetable()
    });
    it('returns true', () => {
        let meeting:Meeting = {
            title: "Meeting title",
            date: new Date("09-01-2022 12:30"),
            duration: 5
        }
        let date = new Date("09-02-2022 13:30")
        expect(timetable.canBeTransferredTo(date)).toBeTruthy()
        timetable.put(meeting)
        expect(timetable.canBeTransferredTo(date)).toBeTruthy()
    });
    
    it('returns false when busy', () => {
        let meeting:Meeting = {
            title: "Meeting title",
            date: new Date("09-01-2022 12:30"),
            duration: 5
        }
        
        timetable.put(meeting)
        let date = new Date("09-01-2022 12:29")
        expect(timetable.canBeTransferredTo(date)).toBeTruthy()
        date = new Date("09-01-2022 12:30")
        expect(timetable.canBeTransferredTo(date)).toBeFalsy()
        date = new Date("09-01-2022 14:30")
        expect(timetable.canBeTransferredTo(date)).toBeFalsy()
        date = new Date("09-01-2022 17:30")
        expect(timetable.canBeTransferredTo(date)).toBeFalsy()
        date = new Date("09-01-2022 17:31")
        expect(timetable.canBeTransferredTo(date)).toBeTruthy()
    });
    it('returns false when before 8', () => {
        let date = new Date("09-02-2022 7:30")
        expect(timetable.canBeTransferredTo(date)).toBeFalsy()
    });
    it('returns false when after 20', () => {
        let date = new Date("09-02-2022 20:30")
        expect(timetable.canBeTransferredTo(date)).toBeFalsy()
    });
    
});


describe('busy(date: Date): boolean', () => {
    let timetable: Timetable
    beforeEach(() => {
        timetable = new Timetable()
    });
    it('returns false when no other meetings', () => {
        let date = new Date("09-02-2022 12:30")
        expect(timetable.busy(date)).toBeFalsy()
    });

    it('returns false when no collisions', () => {
        let meeting1:Meeting = {
            title: "Meeting title",
            date: new Date("09-01-2022 12:30"),
            duration: 5
        }
        let meeting2:Meeting = {
            title: "Meeting title",
            date: new Date("09-02-2022 12:30"),
            duration: 5
        }
        timetable.put(meeting1)
        let date = new Date("09-02-2022 8:30")
        expect(timetable.busy(date)).toBeFalsy()
        timetable.put(meeting2)
        expect(timetable.busy(date)).toBeFalsy()
    });
    
    it('returns true when collisions', () => {
        let meeting1:Meeting = {
            title: "Meeting title",
            date: new Date("09-01-2022 12:30"),
            duration: 5
        }
        let meeting2:Meeting = {
            title: "Meeting title",
            date: new Date("09-02-2022 12:30"),
            duration: 5
        }
        timetable.put(meeting1)
        timetable.put(meeting2)
        let date = new Date("09-01-2022 15:30")
        expect(timetable.busy(date)).toBeTruthy()
        date = new Date("09-02-2022 12:30")
        expect(timetable.busy(date)).toBeTruthy()
    });
    
});

describe('put(meeting: Meeting): boolean', () => {
    let timetable: Timetable
    beforeEach(() => {
        timetable = new Timetable()
    });
    it('returns true when added a new meeting', () => {
        let meeting1:Meeting = {
            title: "Meeting title",
            date: new Date("09-01-2022 12:30"),
            duration: 5
        }
        let meeting2:Meeting = {
            title: "Meeting title",
            date: new Date("09-02-2022 12:30"),
            duration: 5
        }
        
        expect(timetable.put(meeting1)).toBeTruthy()
        expect(timetable.put(meeting2)).toBeTruthy()

    });

    it('returns false when couldnt add a new meeting', () => {
        let meeting1:Meeting = {
            title: "Meeting title",
            date: new Date("09-01-2022 12:30"),
            duration: 5
        }
        let meeting2:Meeting = {
            title: "Meeting title",
            date: new Date("09-01-2022 13:30"),
            duration: 5
        }

        expect(timetable.put(meeting1)).toBeTruthy()
        expect(timetable.put(meeting2)).toBeFalsy()
    });
    
});

describe('get(date: Date): Meeting', () => {
    let timetable: Timetable
    beforeEach(() => {
        timetable = new Timetable()
    });
    it('returns meeting at given date', () => {
        let meeting1:Meeting = {
            title: "Meeting title",
            date: new Date("09-01-2022 12:30"),
            duration: 5
        }
        let meeting2:Meeting = {
            title: "Meeting title",
            date: new Date("09-02-2022 12:30"),
            duration: 5
        }
        timetable.put(meeting1)
        timetable.put(meeting2)
        expect(timetable.get(meeting1.date)).toStrictEqual(meeting1)
        expect(timetable.get(meeting2.date)).toStrictEqual(meeting2)
    });

    it('returns no such meeting with duration -1', () => {
        let duration = -1
        let title = "No such meeting"
        let date: Date = new Date("09-01-2022 13:30")
        expect(timetable.get(date).title).toStrictEqual(title)
        expect(timetable.get(date).duration).toStrictEqual(duration)
    });
    
});

describe('perform(actions: Array<Action>): void', () => {
    let timetable: Timetable
    let meeting1: Meeting,meeting2: Meeting, meeting3: Meeting
    beforeEach(() => {
        timetable = new Timetable()
        meeting1 = {
            title: "Meeting 1 title",
            date: new Date("09-01-2022 12:30"),
            duration: 5
        }
        meeting2 = {
            title: "Meeting 2 title",
            date: new Date("09-02-2022 12:30"),
            duration: 2
        }
        meeting3 = {
            title: "Meeting 3 title",
            date: new Date("09-02-2022 16:30"),
            duration: 3
        }
        timetable.put(meeting1)
        timetable.put(meeting2)
        timetable.put(meeting3)
    });
    it('performs actions on all meetings', () => {
        let actions: Action[] = [Action.DAY_EARLIER, Action.HOUR_LATER, Action.DAY_LATER]
        timetable.perform(actions)

        let expectedDate1 = new Date("08-31-2022 12:30")
        let expectedDate2 = new Date("09-02-2022 13:30")
        let expectedDate3 = new Date("09-03-2022 16:30")
        expect(timetable.get(expectedDate1).title).toStrictEqual(meeting1.title)
        expect(timetable.get(expectedDate2).title).toStrictEqual(meeting2.title)
        expect(timetable.get(expectedDate3).title).toStrictEqual(meeting3.title)
    });

    it('dont perform actions when its not possible', () => {
        let actions: Action[] = [Action.DAY_LATER, Action.DAY_EARLIER, Action.DAY_LATER]
        timetable.perform(actions)

        let expectedDate3 = new Date("09-03-2022 16:30")
        expect(timetable.get(meeting1.date)).toStrictEqual(meeting1)
        expect(timetable.get(meeting2.date)).toStrictEqual(meeting2)
        expect(timetable.get(expectedDate3).title).toStrictEqual(meeting3.title)
    });
    it('dont perform actions when wrong number of actions', () => {
        let actions: Action[] = [Action.DAY_EARLIER, Action.HOUR_LATER, Action.DAY_LATER, Action.HOUR_LATER]
        timetable.perform(actions)

        expect(timetable.get(meeting1.date)).toStrictEqual(meeting1)
        expect(timetable.get(meeting2.date)).toStrictEqual(meeting2)
        expect(timetable.get(meeting3.date)).toStrictEqual(meeting3)
    });

    
});
