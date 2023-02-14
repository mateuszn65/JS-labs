import { Action } from "./Action";
import { ITimetable } from "./ITimetable";
import { Meeting } from "./Meeting";
import {move} from "./move"


export class Timetable implements ITimetable{
    meetings: Meeting[] = []
    
    numberOfMeetings() : number {
        return this.meetings.length
    }
    
    canBeTransferredTo(date: Date): boolean {
        return !this.busy(date) &&
            date.getHours() >= 8 &&
            date.getHours() < 20
    }
    busy(date: Date): boolean {
        for (let meeting of this.meetings){
            if (meeting.date <= date && date.getTime() <= meeting.date.getTime() + meeting.duration * 60 * 60 * 1000)
                return true
        }
        return false
    }
    put(meeting: Meeting): boolean {
        if(this.busy(meeting.date))
            return false
        
        this.meetings.push(meeting)
        return true
    }
    get(date: Date): Meeting {
        for (let meeting of this.meetings){
            if (meeting.date.getTime() == date.getTime())
                return meeting
        }
        let meeting: Meeting = {
            title: "No such meeting",
            date: new Date(),
            duration: -1
        }
        return meeting
    }
    perform(actions: Action[]): void {
        if (actions.length != this.meetings.length)
            return

        for (let i = 0; i < this.meetings.length; i++){
            let meeting: Meeting = this.meetings.splice(i, 1)[0]
            let newMeeting: Meeting = move(meeting, actions[i])
            if (this.canBeTransferredTo(newMeeting.date)){
                this.meetings.splice(i, 0, newMeeting)
            }else{
                this.meetings.splice(i, 0, meeting)
            }

        }
    }
    
    toString():string{
        let result:string = "\n"
        for (let meeting of this.meetings){
            result += " \n"
            result += "  title: " + meeting.title + ",\n"
            result += "  start date: " + meeting.date.toLocaleString() + ",\n"
            result += "  end date: " + new Date(meeting.date.getTime() + meeting.duration * 60 * 60 * 1000).toLocaleString() + ",\n"
            result += " \n"
        }
        result += "\n"
        return result
    }
    
}
