const hsTemplate = document.createElement('template')
hsTemplate.innerHTML = `
    <style>
        table{
            margin: 1em;
            border-spacing: 0;
            border-collapse: collapse;
        }
        td{
            font-size: 1em;
            padding: 0.4em;
            border: 0.01em solid black;
            text-align: center;
        }
    </style>
    <table>
        <tr>
            <td></td><td>Name</td> <td>Score</td>
        </tr>
        <tr>
            <td>Top 1</td><td id="name1"></td> <td id="score1"></td>
        </tr>
        <tr>
            <td>Top 2</td><td id="name2"></td> <td id="score2"></td>
        </tr>
        <tr>
            <td>Top 3</td><td id="name3"></td> <td id="score3"></td>
        </tr>
    </table>
`

class HighScoreTable extends HTMLElement{
    constructor(){
        super()
        this.attachShadow({mode: "open"})
        this.shadowRoot.appendChild(hsTemplate.content.cloneNode(true))
        this._leaderBoard = [JSON.parse(localStorage.getItem('top1')), JSON.parse(localStorage.getItem('top2')), JSON.parse(localStorage.getItem('top3'))]
        this.name1 = this.shadowRoot.querySelector('#name1')
        this.name2 = this.shadowRoot.querySelector('#name2')
        this.name3 = this.shadowRoot.querySelector('#name3')
        this.score1 = this.shadowRoot.querySelector('#score1')
        this.score2 = this.shadowRoot.querySelector('#score2')
        this.score3 = this.shadowRoot.querySelector('#score3')
        this.check()
    }
    get leaderBoard(){
        return this._leaderBoard
    }
    set leaderBoard(value){
        this._leaderBoard = [JSON.parse(localStorage.getItem('top1')), JSON.parse(localStorage.getItem('top2')), JSON.parse(localStorage.getItem('top3'))]
        this.check()
    }
    check(){
        if (this._leaderBoard[0]){
            this.name1.textContent = this._leaderBoard[0].name
            this.score1.textContent = this._leaderBoard[0].score
            if(this._leaderBoard[1]){
                this.name2.textContent = this._leaderBoard[1].name
                this.score2.textContent = this._leaderBoard[1].score
                if(this._leaderBoard[2]){
                    this.name3.textContent = this._leaderBoard[2].name
                    this.score3.textContent = this._leaderBoard[2].score
                }
            }
        }
    }

}

customElements.define('high-score-table', HighScoreTable);