const scoreTable = document.querySelector('score-table')
const highScoreTable = document.querySelector('high-score-table')
let board = document.querySelector('my-board')
const startBtn = document.querySelector('.start')
const againBtn = document.querySelector('.again')

let username = ''

startBtn.addEventListener('click', ()=>{
    startBtn.style.display = 'none'
    setup()
    start()
})
againBtn.addEventListener('click', ()=>{
    againBtn.style.display = 'none'
    const body = document.querySelector('body')
    body.removeChild(board)
    board = document.createElement('my-board')
    body.appendChild(board)
    start()
})
function start(){
    username = window.prompt('Give your name: ', username)
    scoreTable.startTimer()
    board.startGame()
}

function setup(){
    document.addEventListener('cellDied', ()=>{
        board.newSquare()
    })
    document.addEventListener('updateScore', ()=>{
        scoreTable.score = board.score
    })
    document.addEventListener('faze2', ()=>{
        board.fazeChange(2)
    })
    document.addEventListener('faze3', ()=>{
        board.fazeChange(3)
    })

    document.addEventListener('endGame', ()=>{
        board.endGame()
        const new_score = scoreTable.score
        const new_record = {
            name: username,
            score: new_score
        }
        const top1 = JSON.parse(localStorage.getItem('top1'))
        const top2 = JSON.parse(localStorage.getItem('top2'))
        const top3 = JSON.parse(localStorage.getItem('top3'))
        if (!top3 || top3.score < new_score){
            if (!top2 || top2.score < new_score){
                localStorage.setItem('top3', JSON.stringify(top2))
                if(!top1 || top1.score < new_score){
                    localStorage.setItem('top2', JSON.stringify(top1))
                    localStorage.setItem('top1', JSON.stringify(new_record))
                }else{
                    localStorage.setItem('top2', JSON.stringify(new_record))
                }
            }else{
                localStorage.setItem('top3', JSON.stringify(new_record))
            }
        }
        highScoreTable.leaderBoard = 'value'
        againBtn.style.display = 'inline'
    })
}