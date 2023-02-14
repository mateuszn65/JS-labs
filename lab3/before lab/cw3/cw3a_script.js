let SetIntervalTime = []
let SetTimeoutTime = []
const N = 1000
const M = 1000
let IntervalId
const counterField = document.getElementById('counter')
const spans = document.getElementsByTagName('span')
let counter = document.getElementById('counter').value
function decrement(){
    if (counter > 0){
        if (counter == 1){
            window.setTimeout(changeTextField, M/2)
        }
        counter--
        updateSpans()
    }
    
}

function changeTextField(){
    counterField.value = 0
}
function updateSpans(){
    for (const span of spans) {
        span.textContent = counter
    }
}
function start() {
    updateSpans()
    IntervalId = window.setInterval(decrement, M)
}

function stop(){
    clearInterval(IntervalId)
}
function update(){
    stop()
    if (document.getElementById('counter').value > 0){
        counter = document.getElementById('counter').value
    }
    start()
}
