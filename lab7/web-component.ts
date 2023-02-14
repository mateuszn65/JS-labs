import parse from './parse';
import { Meeting } from "./Meeting";
import { Timetable } from "./Timetable";

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
  i: number;
  timetable: Timetable;
  msgElement: HTMLElement | null = null;
  timetableElement: HTMLElement | null = null;
  allowedInput: string[];
  strActions: string[];
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    if (this.shadowRoot) {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.msgElement = this.shadowRoot.querySelector("#msg");
      this.timetableElement = this.shadowRoot.querySelector("#timetable");
      this.shadowRoot
        .querySelector("#btn")
        ?.addEventListener("click", this.handleInput.bind(this));
    }

    this.i = 0;
    this.allowedInput = ["d+", "d-", "h+", "h-"];
    this.strActions = ["", "", ""];
    this.timetable = new Timetable();
    this.init();
    if (this.msgElement) {
      this.msgElement.textContent =
        "Please Choose an option for " +
        this.timetable.meetings[this.i % this.timetable.numberOfMeetings()].title
    }

    this.display();
  }

  init(): void {
    let meeting1: Meeting, meeting2: Meeting, meeting3: Meeting;
    meeting1 = {
      title: "Meeting 1 title",
      date: new Date("09-01-2022 12:30"),
      duration: 5,
    };
    meeting2 = {
      title: "Meeting 2 title",
      date: new Date("09-02-2022 12:30"),
      duration: 2,
    };
    meeting3 = {
      title: "Meeting 3 title",
      date: new Date("09-02-2022 16:30"),
      duration: 3,
    };
    this.timetable.put(meeting1);
    this.timetable.put(meeting2);
    this.timetable.put(meeting3);
  }

  handleInput(): void {
    let line: string = (
      this.shadowRoot?.querySelector("#action") as HTMLInputElement
    ).value;
    console.log(line)
    if (this.allowedInput.includes(line)) {
      this.strActions[this.i % this.timetable.numberOfMeetings()] = line;
      this.i++;
      console.log(this.i % this.timetable.numberOfMeetings())
      if (this.msgElement) {
        this.msgElement.textContent =
          "Please Choose an option for " +
          this.timetable.meetings[this.i % this.timetable.numberOfMeetings()].title
      }
    } else if (this.msgElement) {
      this.msgElement.textContent =
        "No such option!\nPlease Choose another option for " +
        this.timetable.meetings[this.i % this.timetable.numberOfMeetings()].title
    }
    if (this.i % this.timetable.numberOfMeetings() == 0) {
      if (this.i != 0) this.timetable.perform(parse(this.strActions));
      this.display();
    }
  }

  display(): void {
    if (this.timetableElement)
      this.timetableElement.textContent = this.timetable.toString();
  }
}

customElements.define("time-table", TimeTable);
