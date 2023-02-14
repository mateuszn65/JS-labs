let SetIntervalTime = []
let SetTimeoutTime = []
const N = 1000
const M = 1000
let IntervalId
const counterField = document.getElementById('counter')
const spans = document.getElementsByTagName('my-span')
let counter = document.getElementById('counter').value


function changeTextField(){
    counterField.value = 0
}
function updateSpans(){
    for (const span of spans) {
        span.setAttribute("count", counter)
    }
}

function update(){
    if (document.getElementById('counter').value > 0){
        counter = document.getElementById('counter').value
    }
    updateSpans()
}
