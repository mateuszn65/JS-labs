
function draw(){
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.fillText("Hello World", 10, 50); //Wykreślenie podanego tekstu na płótnie / Drawing given text on canvas
    ctx.fillStyle = 'blue';
    ctx.fillRect(65,75,70,50);
    ctx.fillStyle = 'red';
    ctx.moveTo(100,160);
    ctx.lineTo(70,200);
    ctx.lineTo(130,200);
    ctx.fill()
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(100,250,30,2*Math.PI,0,false);
    ctx.closePath();
    ctx.fill()
}