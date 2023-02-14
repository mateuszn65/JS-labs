const gameTime = 30000
let pictureDisappearTime = 1000
const cells = document.getElementsByTagName('td')
let scoreContainer
let animateId
let score = 0
function start(){
    for (let i = 0; i < cells.length; i++){
        cells[i].setAttribute('data-no', i)
        cells[i].addEventListener('click', updateScore)
    }
    scoreContainer = document.querySelector('#score')
    timeContainer = document.querySelector('#time')
    timeContainer.textContent = gameTime / 1000
    pictureDisappearTime = Number(window.prompt("Podaj czas pojawiania się obrazków", pictureDisappearTime.toString()))
    animateId = window.requestAnimationFrame(animate)
    window.setTimeout(stop, gameTime)
}
function stop(){
    cancelAnimationFrame(animateId)
}

let previousTime = 0
let timeLeft = gameTime / 1000
function animate(){
    animateId = window.requestAnimationFrame(animate)
    if (Date.now() - previousTime < 1000)
        return

    newRandomField()
    timeLeft -= 1
    timeContainer.textContent = timeLeft
    previousTime = Date.now()
    
}
let board = [0, 0, 0, 0, 0, 0, 0, 0, 0]
const CLASSES = ['one', 'two', 'three']
function newRandomField(){
    const noPictures =  Math.floor(Math.random() * 3 + 1);
    const possibleFields = board.map((field, index) => field === 0 ? index : null).filter(field => field !== null)
    if (possibleFields.length === 0)
        return
    const field = possibleFields[Math.floor(Math.random() * possibleFields.length)]
    board[field] = noPictures
    let imgs = []
    for (let i = 0; i < noPictures; i++){
        let img = document.createElement('img')
        img.src = 'clickme.jpg'
        img.classList.add(CLASSES[noPictures - 1])
        cells[field].appendChild(img)
        imgs.push(img)
    }
    cells[field].append(...imgs)
    window.setTimeout(removeField, pictureDisappearTime, field)
}
function updateScore(e){
    e.preventDefault()
    let fieldElement = e.target
    while (fieldElement && !fieldElement.hasAttribute('data-no')){
        fieldElement = fieldElement.parentElement
    }
    if (!fieldElement)
        return
    const field = fieldElement.getAttribute('data-no')
    score += board[field]
    scoreContainer.innerHTML = score
    removeField(field)
}

function removeField(field){
    while (cells[field].firstChild) {
        cells[field].removeChild(cells[field].firstChild);
    }
    board[field] = 0
}
