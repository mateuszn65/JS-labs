import {move} from '../move'
import {Action} from '../Action'
import {Meeting} from '../Meeting'
import {describe, it, expect} from 'vitest'

describe('Move', () => {
    let meeting:Meeting = {
        title: "Meeting title",
        date: new Date("09-01-2022 12:30"),
        duration: 5
    };
    it('Day earlier', () => {
        let expectedDate = new Date(meeting.date)
        expectedDate.setDate(expectedDate.getDate() - 1)
        expect(move(meeting, Action.DAY_EARLIER).date.getTime()).toBe(expectedDate.getTime())
    });
    it('Day later', () => {
        let expectedDate = new Date(meeting.date)
        expectedDate.setDate(expectedDate.getDate() + 1)
        expect(move(meeting, Action.DAY_LATER).date.getTime()).toBe(expectedDate.getTime())
    });
    it('Hour earlier', () => {
        let expectedDate = new Date(meeting.date)
        expectedDate.setHours(expectedDate.getHours() - 1)
        expect(move(meeting, Action.HOUR_EARIELR).date.getTime()).toBe(expectedDate.getTime())
    });
    it('Hour later', () => {
        let expectedDate = new Date(meeting.date)
        expectedDate.setHours(expectedDate.getHours() + 1)
        expect(move(meeting, Action.HOUR_LATER).date.getTime()).toBe(expectedDate.getTime())
    });
    it('Hour earlier meeting cant start before 8', () => {
        meeting.date = new Date("09-01-2022 8:30")
        let expectedDate = new Date(meeting.date)
        expect(move(meeting, Action.HOUR_EARIELR).date.getTime()).toBe(expectedDate.getTime())
    });
    it('Hour later meeting cant end after 20', () => {
        meeting.date = new Date("09-01-2022 15:10")
        let expectedDate = new Date(meeting.date)
        expect(move(meeting, Action.HOUR_LATER).date.getTime()).toBe(expectedDate.getTime())
    });
    
});
