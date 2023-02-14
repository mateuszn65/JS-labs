import {Action} from './Action'
import {Meeting} from './Meeting'


export const move: (meeting: Meeting, action: Action) => Meeting = (meeting, action) =>{
    let result: Meeting = {...meeting}
    result.date = new Date(meeting.date)

    switch (action) {
        case Action.DAY_EARLIER:
            result.date.setDate(result.date.getDate() - 1)
            break;
        case Action.DAY_LATER:
            result.date.setDate(result.date.getDate() + 1)
            break;
        case Action.HOUR_EARIELR:
            if (result.date.getHours() - 1 >= 8)
                result.date.setHours(result.date.getHours() - 1)
            break;
        case Action.HOUR_LATER:
            if (result.date.getHours() + 1 + result.duration < 20)
                result.date.setHours(result.date.getHours() + 1)
            break;
    
        default:
            break;
    }

    return result
}