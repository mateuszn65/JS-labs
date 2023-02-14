const template = document.createElement('template')
template.innerHTML = `
    <style>
        table{
            margin: 1em;
            border-spacing: 0;
            border-collapse: collapse;
        }
        td{
            font-size: 1em;
            padding: 0.7em;
            border: 0.01em solid black;
            text-align: center;
        }
    </style>

    <table>
        <tr>
            <td>Score</td> <td>Time</td>
        </tr>
        <tr>
            <td id="score">0</td> <td id="timer">3min</td>
        </tr>
    </table>
`

class ScoreTable extends HTMLElement{
    constructor(){
        super()
        this.attachShadow({mode: "open"})
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.scoreElement = this.shadowRoot.querySelector('#score')
        this.timerElement = this.shadowRoot.querySelector('#timer')
        this._score = 0
        this.faze = 1
    }
    get score(){
        return this._score
    }
    set score(score){
        this._score = score
        this.scoreElement.textContent = this._score 
    }
    startTimer(){
        this.timeStart = new Date().getTime()
        window.requestAnimationFrame(this.timer.bind(this))
    }
    timer(){
        const timeNow = new Date().getTime()
        const timeLeft = 180000 - (timeNow - this.timeStart)
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeLeft % (1000 * 60)) / (1000))
        if (this.faze == 1 && timeLeft <= 120000){
            this.faze = 2
            this.dispatchEvent(new CustomEvent('faze2',{
                bubbles: true,
                composed: true
            }))
        }
        if (this.faze == 2 && timeLeft <= 60000){
            this.faze = 3
            this.dispatchEvent(new CustomEvent('faze3',{
                bubbles: true,
                composed: true
            }))
        }
        if (minutes > 0)
            this.timerElement.textContent = minutes + 'min ' + seconds + 's'
        else if (seconds >= 0)
            this.timerElement.textContent = seconds + 's'
        else{
            this.faze = 1
            this.dispatchEvent(new CustomEvent('endGame',{
                bubbles: true,
                composed: true
            }))
            return
        }

            
        window.requestAnimationFrame(this.timer.bind(this))

    }
}
customElements.define('score-table', ScoreTable)