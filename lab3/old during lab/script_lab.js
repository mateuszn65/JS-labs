const gameTime = 30000
let pictureTime
const cells = document.getElementsByTagName('td')
let scoreContainer
let intervalId
let score = 0

function start(){
    scoreContainer = document.querySelector('.score')
    scoreContainer.textContent = score
    pictureTime = Number(window.prompt("Podaj czas pojawiania się obrazków", "600"))
    if (!pictureTime)
        pictureTime = 600
    intervalId = window.setInterval(newRandomField, Math.floor(pictureTime/3) )
    window.setTimeout(stop, gameTime)
}

function stop(){
    clearInterval(intervalId)
}

function newRandomField(){
    const noPictures =  Math.floor(Math.random() * 3 + 1)
    let field
    do{
        field = Math.floor(Math.random() * 9)
    }while(cells[field].lastElementChild != null)
    let imgs = []
    for (let i = 0; i < noPictures; i++){
        let img = document.createElement('img')
        img.src = 'https://res.cloudinary.com/dxyklix4g/image/upload/v1650226910/clickme_a4f0ea.jpg'
        img.classList.add('img'+ noPictures)
        cells[field].appendChild(img)
        imgs.push(img)
    }
    cells[field].addEventListener('click', handler)
    window.setTimeout(removeField, pictureTime, field)
}

function handler(e){
    let cell = e.target.closest('td')
    if (cell != null){
        score += cell.childElementCount
        scoreContainer.textContent = score
        while (cell.lastElementChild){
            cell.removeChild(cell.lastElementChild)
        }
        this.removeEventListener('click', handler)
    }
}

function removeField(field){
    while (cells[field].lastElementChild){
        cells[field].removeChild(cells[field].lastElementChild)
    }
    cells[field].removeEventListener('click', handler)
}
