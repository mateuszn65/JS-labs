import {Meeting} from './Meeting'
import parse from './parse'
import { Timetable } from './Timetable'
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'node:process';


const rl = readline.createInterface({ input, output });
let allowedInput: string[] = ["d+", "d-", "h+", "h-"]
let timetable: Timetable
let strActions: string[] = ["", "", ""]

function init():Timetable{
    let meeting1: Meeting,meeting2: Meeting, meeting3: Meeting

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
    return timetable
}

function recursiveAsyncReadLine(i:number) {
    if(i % timetable.numberOfMeetings() == 0){
        if(i != 0)
            timetable.perform(parse(strActions))
        console.log(timetable.toString())
    }

    rl.question("Please Choose an option for "
        + timetable.meetings[i%timetable.numberOfMeetings()].title + "\n"
        + "Action) \"d+\", \"d-\", \"h+\", \"h-\" \n"
        + "Exit) q\n"
        , function (line) {
        if(allowedInput.includes(line)){
            strActions[i%timetable.numberOfMeetings()] = line
            i++
        }else if (line == "q"){
            return rl.close();
        }else{
            console.log("No such option. Please enter another: ")
        }
        
        recursiveAsyncReadLine(i)
    });

};
init()
recursiveAsyncReadLine(0)


