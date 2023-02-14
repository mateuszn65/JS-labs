import { Action } from "./Action";
export default function parse(arr){
    return arr.map(value=>{
        switch (value) {
            case "d-":
                return Action.DAY_EARLIER
            case "d+":
                return Action.DAY_LATER
            case "h-":
                return Action.HOUR_EARIELR
            case "h+":
                return Action.HOUR_LATER
            default:
                return ;
        }
    })
}