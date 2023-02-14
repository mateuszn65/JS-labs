const boardTemplate = document.createElement('template')
boardTemplate.innerHTML = `
    <style>
        .board{
            --cell-size: 30px;
            --number-of-cells: 10;
            margin: 2em auto;
            width: calc(var(--cell-size)*var(--number-of-cells));
            height: calc(var(--cell-size)*var(--number-of-cells));
            display: grid;
            grid-template-columns: repeat(var(--number-of-cells), [row] var(--cell-size));
            grid-template-rows: repeat(var(--number-of-cells), [col] var(--cell-size));
            background-color: yellow;
            position: relative;
            display: none;
        }
        .board > .circle{
            width: calc(var(--cell-size)/2);
            height: calc(var(--cell-size)/2);
            background-color: blue;
            border-radius: 100%;
            position:absolute;
        }
        .board > .left, .right, .top, .bottom{
            position: absolute;
            background-color: white;
            z-index: 99;
        }
        .board > .left, .right{
            width: calc(var(--cell-size)/4);
            height: calc(var(--cell-size)*var(--number-of-cells));
        }
        .board > .top, .bottom{
            height: calc(var(--cell-size)/4);
            width: calc(var(--cell-size)*var(--number-of-cells) + var(--cell-size)/2);
            left: calc(-1*var(--cell-size)/4);
        }
        .board > .left{
            left: calc(-1*var(--cell-size)/4);
        }
        .board > .right{
            right: calc(-1*var(--cell-size)/4);
        }
        .board > .top{
            top: calc(-1*var(--cell-size)/4);
        }
        .board > .bottom{
            bottom: calc(-1*var(--cell-size)/4);
        }
        @media screen and (min-width: 600px) {
            .board{
                --cell-size: 40px;
            }
        }
    </style>
    <div class="board">
        <div class="circle"></div>
        <div class="left"></div>
        <div class="right"></div>
        <div class="top"></div>
        <div class="bottom"></div>

    </div>
    
`
class Board extends HTMLElement{
    constructor(){
        super()
        this.attachShadow({mode: "open"})
        this.shadowRoot.appendChild(boardTemplate.content.cloneNode(true))
        this.boardElement = this.shadowRoot.querySelector('.board')
        this.board = []
        this.circle = {x:0, y:0, dir: 1, top: 0, left: 0}
        this.circleElement = this.shadowRoot.querySelector('.circle')
        this.start = null
        this.cellSize = 0
        this.numberOfCells = 0
        this.width = 0
        this.prevCellScored = null
        this._score = 0
        this.requestId = 0
        this.faze = 1
    }
    get score(){
        return this._score
    }
    computeStyle(){
        this.cellSize = parseInt(getComputedStyle(this.boardElement).getPropertyValue('--cell-size'))
        this.numberOfCells = parseInt(getComputedStyle(this.boardElement).getPropertyValue('--number-of-cells'))
        this.width = parseInt(getComputedStyle(this.boardElement).width)
    }
    startGame(){
        this.computeStyle()
        const squareRatio = Math.floor(Math.random() * 8 + 3)
        for(let i = 0; i < this.numberOfCells; i++){
            this.board.push([])
            for(let j = 0; j < this.numberOfCells; j++){
                const cell = document.createElement('my-cell')
                cell.id = 'row' + i + 'col' + j
                const startTimer = Math.floor(Math.random() * squareRatio)
                if (startTimer == 0)
                    cell.startTimer()
                this.boardElement.appendChild(cell)
                this.board[i].push(cell)
            }
        }
        document.addEventListener('keydown', e=>{
            switch(e.key){
                case "ArrowLeft":
                    this.circle.dir = 3
                    break
                case "ArrowRight":
                    this.circle.dir = 1
                    break
                case "ArrowUp":
                    this.circle.dir = 0
                    break
                case "ArrowDown":
                    this.circle.dir = 2
                    break
                default:
            }
        })
        this.boardElement.style.display = 'grid'
        requestAnimationFrame(this.step.bind(this))
    }
    step(timestamp){
        if (!this.start) this.start = timestamp
        const progress  = timestamp - this.start
        switch (this.circle.dir){
            case 0: 
                this.circle.top -= progress / (10/this.faze)
                if (this.circle.top + this.cellSize / 4 < 0)
                    this.circle.top = this.width - this.cellSize / 2
                this.circleElement.style.top = this.circle.top + 'px'
                break
            case 1:
                this.circle.left += progress / (10/this.faze)
                if (this.circle.left - this.cellSize / 4 > this.width - this.cellSize / 2)
                    this.circle.left = 0
                this.circleElement.style.left = this.circle.left + 'px'
                break
            case 2:
                this.circle.top += progress / (10/this.faze)
                if (this.circle.top - this.cellSize / 4 > this.width - this.cellSize / 2)
                    this.circle.top = 0
                this.circleElement.style.top = this.circle.top + 'px'
                break
            case 3: 
                this.circle.left -= progress / (10/this.faze)
                if (this.circle.left + this.cellSize / 4 < 0)
                    this.circle.left = this.width - this.cellSize / 2
                this.circleElement.style.left = this.circle.left + 'px'
                break
            default:
        }
        this.circle.x = Math.floor((this.circle.top + this.cellSize / 4) / this.cellSize)
        this.circle.y = Math.floor((this.circle.left + this.cellSize / 4) / this.cellSize)

        if (this.prevCellScored !== this.board[this.circle.x][this.circle.y]){
            this._score += this.board[this.circle.x][this.circle.y].points
            this.prevCellScored = this.board[this.circle.x][this.circle.y]

            this.dispatchEvent(new CustomEvent('updateScore',{
                bubbles: true,
                composed: true
            }))
        }

        this.start = timestamp
        this.requestId = requestAnimationFrame(this.step.bind(this))
        
    }
    fazeChange(faze){
        this.faze = faze
        for (let i = 0; i < this.numberOfCells; i++){
            this.newSquare()
        }

        for(let i = 0; i < this.numberOfCells; i++){
            for(let j = 0; j < this.numberOfCells; j++){
                this.board[i][j].fazeChange(this.faze)
            }
        }
    }
    getEmptyCells(){
        let res = []
        for(let i = 0; i < this.numberOfCells; i++){
            for(let j = 0; j < this.numberOfCells; j++){
                if (this.board[i][j].isEmpty){
                    res.push(this.board[i][j])
                }
            }
        }
        return res
    }
    newSquare(){
        const emptyCells = this.getEmptyCells()
        const i =  Math.floor(Math.random() * emptyCells.length)
        emptyCells[i].startTimer()
    }
    endGame(){
        cancelAnimationFrame(this.requestId)
        for(let i = 0; i < this.numberOfCells; i++){
            for(let j = 0; j < this.numberOfCells; j++){
                if(!this.board[i][j].isEmpty){
                    this.board[i][j].endGame()
                }
            }
        }
    }
}


customElements.define('my-board', Board);