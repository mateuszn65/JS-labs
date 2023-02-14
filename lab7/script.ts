import {Action} from './Action'
import {Meeting} from './Meeting'
import {move} from './move'

let meeting: Meeting
meeting = {
    title: "Meeting 1",
    date: new Date("06-30-2022 16:00"),
    duration: 4
}
console.log(meeting)

meeting = {
    title: "Meeting 2",
    date: new Date("02-15-2012 12:30"),
    duration: 2,
    participants: ["jan@kowalski.com"]
}
console.log(meeting)

meeting = {
    title: "Meeting 3",
    date: new Date("09-01-2022 12:30"),
    duration: 5,
    participants: ["adam@example.com", "marek@gmail.com"]
}
console.log(meeting)


let actions: Action[] = [Action.DAY_EARLIER, Action.HOUR_LATER, Action.HOUR_LATER]
console.log(actions)



for (let action of actions){
    meeting = move(meeting, action)
}
console.log(meeting)