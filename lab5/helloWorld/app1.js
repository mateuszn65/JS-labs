// No use of any template system
var express = require('express'),
    logger = require('morgan');

const dbo = require('./conn')
var app = express();

dbo.connectToServer((err) => {
    if (err) {
      console.error(err);
      process.exit();
    }
  
    // start the Express server
    // The application is to listen on port number 3000
    app.listen(3000, function () {
        console.log('The application is available on port 3000');
    });
    
});


var x = 1;
var y = 2;

// Determining the contents of the middleware stack
app.use(logger('dev'));                         // Place an HTTP request recorder on the stack — each request will be logged in the console in 'dev' format
// app.use(express.static(__dirname + '/public')); // Place the built-in middleware 'express.static' — static content (files .css, .js, .jpg, etc.) will be provided from the 'public' directory

// Route definitions
app.get('/', function (req, res) {     // The first route
    res.send('<h1>' + x + ' + ' + y + ' = ' + (x + y) + '</h1>'); // Send a response to the browser
});


app.get('/json/:name', (req, res) => {
    const filename = req.params.name.replace(':','') + '.json'
    const operations = require('./' + filename)
    res.send(makeTable(operations));
});


app.get('/calculate/:operation/:x/:y', async(req, res) => {
    const x = Number(req.params.x.replace(':',''))
    const y = Number(req.params.y.replace(':',''))
    if (x && y){
        const operation = req.params.operation.replace(':','')
        let result;
        switch(operation){
            case '+':
                result = x + y 
                break
            case '-':
                result = x - y
                break
            case '*':
                result = x * y
                break
            case ':':
                result = x /y
                break
            default:
                result = 0
        }
        res.send('<h1>' + x + ' ' + operation + ' ' + y + ' = ' + result + '</h1>');

        const collection = await dbo.getDb().collection("operations");
        collection.updateOne({x:x, operation:operation, y:y}, {$setOnInsert:{x:x, operation:operation, y:y}}, {upsert: true})

        
    }else{
        res.send('<h1>Incorrect data</h1>');
    }
});

app.get('/results', async(req, res) => {
    const collection = await dbo.getDb().collection("operations");
    const operations = await collection.find({}).toArray()
    res.send(makeTable(operations));
});

function makeTable(operations){
    let responseString = ''
    responseString += '<style>*{text-align:center;}td{padding: 0.2em 2em;border-bottom: 1px solid grey;}table{border-spacing: 0;}tr:first-child td{border-bottom: 2px solid black;font-weight: bold;}</style>'
    responseString += '<table>'
    responseString += '<tr><td>' + 'x' + '</td><td>' + 'Operation' + '</td><td>' + 'y' + '</td><td>' + 'Result' + '</td></tr>' 
    operations.forEach((element, id) => {
        let result;
        switch(element.operation){
            case '+':
                result = element.x + element.y 
                break
            case '-':
                result = element.x - element.y
                break
            case '*':
                result = element.x * element.y
                break
            case '/':
            case ':':
                result = element.x / element.y
                break
            default:
                result = 0
        }
        responseString += '<tr><td>' + element.x + '</td><td>' + element.operation + '</td><td>' + element.y + '</td><td id="result-' + (id+1) + '">' + result + '</td></tr>' 
    });
    responseString += '</table>'
    return responseString
}