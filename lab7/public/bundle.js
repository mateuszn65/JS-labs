'use strict';

var Action = /* @__PURE__ */ ((Action2) => {
  Action2["DAY_EARLIER"] = "Dzie\u0144 wcze\u015Bniej";
  Action2["DAY_LATER"] = "Dzie\u0144 p\xF3\u017Aniej";
  Action2["HOUR_EARIELR"] = "Godzien\u0119 wcze\u015Bniej";
  Action2["HOUR_LATER"] = "Godzien\u0119 p\xF3\u017Aniej";
  return Action2;
})(Action || {});

function parse(arr) {
  return arr.map((value) => {
    switch (value) {
      case "d-":
        return Action.DAY_EARLIER;
      case "d+":
        return Action.DAY_LATER;
      case "h-":
        return Action.HOUR_EARIELR;
      case "h+":
        return Action.HOUR_LATER;
      default:
        return;
    }
  });
}

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
const move = (meeting, action) => {
  let result = __spreadValues({}, meeting);
  result.date = new Date(meeting.date);
  switch (action) {
    case Action.DAY_EARLIER:
      result.date.setDate(result.date.getDate() - 1);
      break;
    case Action.DAY_LATER:
      result.date.setDate(result.date.getDate() + 1);
      break;
    case Action.HOUR_EARIELR:
      if (result.date.getHours() - 1 >= 8)
        result.date.setHours(result.date.getHours() - 1);
      break;
    case Action.HOUR_LATER:
      if (result.date.getHours() + 1 + result.duration < 20)
        result.date.setHours(result.date.getHours() + 1);
      break;
  }
  return result;
};

class Timetable {
  constructor() {
    this.meetings = [];
  }
  numberOfMeetings() {
    return this.meetings.length;
  }
  canBeTransferredTo(date) {
    return !this.busy(date) && date.getHours() >= 8 && date.getHours() < 20;
  }
  busy(date) {
    for (let meeting of this.meetings) {
      if (meeting.date <= date && date.getTime() <= meeting.date.getTime() + meeting.duration * 60 * 60 * 1e3)
        return true;
    }
    return false;
  }
  put(meeting) {
    if (this.busy(meeting.date))
      return false;
    this.meetings.push(meeting);
    return true;
  }
  get(date) {
    for (let meeting2 of this.meetings) {
      if (meeting2.date.getTime() == date.getTime())
        return meeting2;
    }
    let meeting = {
      title: "No such meeting",
      date: new Date(),
      duration: -1
    };
    return meeting;
  }
  perform(actions) {
    if (actions.length != this.meetings.length)
      return;
    for (let i = 0; i < this.meetings.length; i++) {
      let meeting = this.meetings.splice(i, 1)[0];
      let newMeeting = move(meeting, actions[i]);
      if (this.canBeTransferredTo(newMeeting.date)) {
        this.meetings.splice(i, 0, newMeeting);
      } else {
        this.meetings.splice(i, 0, meeting);
      }
    }
  }
  toString() {
    let result = "\n";
    for (let meeting of this.meetings) {
      result += " \n";
      result += "  title: " + meeting.title + ",\n";
      result += "  start date: " + meeting.date.toLocaleString() + ",\n";
      result += "  end date: " + new Date(meeting.date.getTime() + meeting.duration * 60 * 60 * 1e3).toLocaleString() + ",\n";
      result += " \n";
    }
    result += "\n";
    return result;
  }
}

const template = document.createElement("template");
template.innerHTML = `
    <style>
      blockquote{
        white-space: pre-line;
      }
    </style>

    <label id="msg" for="action">Choose</label><br><br>
    <input type="text" id="action" name="action">
    <input id="btn" type="button" value="Submit">
    <div>Actions: [ "d+", "d-", "h+", "h-" ]</div>
    <blockquote id="timetable">
    </blockquote>
`;
class TimeTable extends HTMLElement {
  constructor() {
    var _a;
    super();
    this.msgElement = null;
    this.timetableElement = null;
    this.attachShadow({ mode: "open" });
    if (this.shadowRoot) {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.msgElement = this.shadowRoot.querySelector("#msg");
      this.timetableElement = this.shadowRoot.querySelector("#timetable");
      (_a = this.shadowRoot.querySelector("#btn")) == null ? void 0 : _a.addEventListener("click", this.handleInput.bind(this));
    }
    this.i = 0;
    this.allowedInput = ["d+", "d-", "h+", "h-"];
    this.strActions = ["", "", ""];
    this.timetable = new Timetable();
    this.init();
    if (this.msgElement) {
      this.msgElement.textContent = "Please Choose an option for " + this.timetable.meetings[this.i % this.timetable.numberOfMeetings()].title;
    }
    this.display();
  }
  init() {
    let meeting1, meeting2, meeting3;
    meeting1 = {
      title: "Meeting 1 title",
      date: new Date("09-01-2022 12:30"),
      duration: 5
    };
    meeting2 = {
      title: "Meeting 2 title",
      date: new Date("09-02-2022 12:30"),
      duration: 2
    };
    meeting3 = {
      title: "Meeting 3 title",
      date: new Date("09-02-2022 16:30"),
      duration: 3
    };
    this.timetable.put(meeting1);
    this.timetable.put(meeting2);
    this.timetable.put(meeting3);
  }
  handleInput() {
    var _a;
    let line = ((_a = this.shadowRoot) == null ? void 0 : _a.querySelector("#action")).value;
    console.log(line);
    if (this.allowedInput.includes(line)) {
      this.strActions[this.i % this.timetable.numberOfMeetings()] = line;
      this.i++;
      console.log(this.i % this.timetable.numberOfMeetings());
      if (this.msgElement) {
        this.msgElement.textContent = "Please Choose an option for " + this.timetable.meetings[this.i % this.timetable.numberOfMeetings()].title;
      }
    } else if (this.msgElement) {
      this.msgElement.textContent = "No such option!\nPlease Choose another option for " + this.timetable.meetings[this.i % this.timetable.numberOfMeetings()].title;
    }
    if (this.i % this.timetable.numberOfMeetings() == 0) {
      if (this.i != 0)
        this.timetable.perform(parse(this.strActions));
      this.display();
    }
  }
  display() {
    if (this.timetableElement)
      this.timetableElement.textContent = this.timetable.toString();
  }
}
customElements.define("time-table", TimeTable);
