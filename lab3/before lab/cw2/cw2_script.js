let SetIntervalTime = []
let SetTimeoutTime = []
const N = 1000
let M = 100
let IntervalId
let TimeoutId
let RequestId
function doTimeConsumingCallculationsWithSetInterval(){
    console.log("inteval")
    SetIntervalTime.push(performance.now())
    if (SetIntervalTime.length > N){
        SetIntervalTime.shift()
    }
    calculatePrimes(1000, 1000000)
}


function doTimeConsumingCallculationsWithSetTimeout(){
    console.log("timeout")
    SetTimeoutTime.push(performance.now())
    if (SetTimeoutTime.length > N){
        SetTimeoutTime.shift()
    }
    calculatePrimes(1000, 1000000)
    TimeoutId = window.setTimeout(doTimeConsumingCallculationsWithSetTimeout, M);
}

function calculatePrimes(iterations, multiplier) {
    var primes = [];
    for (var i = 0; i < iterations; i++) {
      var candidate = i * (multiplier * Math.random());
      var isPrime = true;
      for (var c = 2; c <= Math.sqrt(candidate); ++c) {
        if (candidate % c === 0) {
            // not prime
            isPrime = false;
            break;
         }
      }
      if (isPrime) {
        primes.push(candidate);
      }
    }
    return primes;
  }

function drawChart(){
    console.log("draw")
    let sumInterval = 0
    let sumTimeout = 0
    for (let i = 1; i < N && i < SetIntervalTime.length && i < SetTimeoutTime.length; i++) {
        sumInterval += SetIntervalTime[i] - SetIntervalTime[i-1]
        sumTimeout += SetTimeoutTime[i] - SetTimeoutTime[i-1]
    }
    let meanInterval = sumInterval / SetIntervalTime.length
    let meanTimeout = sumTimeout / SetTimeoutTime.length
    let chart = new CanvasJS.Chart("chartContainer",
    {
        title:{text: "wykres"},
        data: [
            {
                type: "column",
                dataPoints:[
                    {y: meanInterval, label: "Interval"},
                    {y: meanTimeout, label: "Timeout"}
                ]
            }
        ]
    })
    chart.render()
    RequestId = window.requestAnimationFrame(drawChart)
}

function start() {
    M = Number(document.getElementById('delay').value)
    IntervalId = window.setInterval(doTimeConsumingCallculationsWithSetInterval, M)
    TimeoutId = window.setTimeout(doTimeConsumingCallculationsWithSetTimeout, M)
    window.requestAnimationFrame(drawChart)
}

function stop(){
    clearInterval(IntervalId)
    clearTimeout(TimeoutId)
    cancelAnimationFrame(RequestId)
    SetIntervalTime = []
    SetTimeoutTime = []
}