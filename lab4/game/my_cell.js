const cellTemplate = document.createElement('template')
cellTemplate.innerHTML = `
    <div style = "border: 1px solid black"></div>
`

class MyCell extends HTMLElement{
    constructor(){
        super()
        this.attachShadow({mode: "open"})
        this.shadowRoot.appendChild(cellTemplate.content.cloneNode(true))
        this._isEmpty = true
        this.cell = this.shadowRoot.querySelector('div')
        this.cell.style.backgroundColor = 'grey'
        this.cell.style.width = '100%'
        this.cell.style.height = '100%'
        this.cell.style.textAlign = 'center'
        this._id = 0
        this.faze = 1
        this.timeToDie = Math.floor(Math.random() *35 - 21)
        this._points = 0
        this.requestId = 0
    }
    get id(){
        return this._id
    }
    get points(){
        return this._points
    }
    get isEmpty(){
        return this._isEmpty
    }
    set id(id){
        this._id = id
        this.cell.id = this._id
    }
    startTimer(){
        this.faze = 1
        this._isEmpty = false
        this.timeStart = new Date().getTime()
        this.requestId = window.requestAnimationFrame(this.timer.bind(this))
    }
    timer(){
        const timeNow = new Date().getTime()
        const timeLeft = 21000 - (timeNow - this.timeStart) * this.faze
        const seconds = Math.floor((timeLeft % (1000 * 60)) / (1000))

        if (seconds > this.timeToDie){
            if (seconds > 0){
                this._points = seconds
                this.cell.textContent = seconds
                this.cell.style.backgroundColor = 'green'
            }else{
                this._points = seconds
                this.cell.textContent = seconds
                this.cell.style.backgroundColor = 'red'
            }
            this.requestId = window.requestAnimationFrame(this.timer.bind(this))
        }else{
            this._isEmpty = true
            this._points = 0
            this.cell.textContent = ''
            this.cell.style.backgroundColor = 'grey'
            this.dispatchEvent(new CustomEvent('cellDied',{
                bubbles: true,
                composed: true
            }))
        }
    }
    fazeChange(faze){
        this.faze = faze
    }
    endGame(){
        cancelAnimationFrame(this.requestId)
    }
}

customElements.define('my-cell', MyCell);