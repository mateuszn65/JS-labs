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
//app.use (express.bodyParser());

app.use(express.urlencoded({
    extended: true
  }))
// Route definitions
app.get('/', function (req, res) {     // The first route
    res.send('<h1>Dane zostaly dodane</h1>'); // Send a response to the browser
});


app.get('/addRoom', (req, res) => {
    res.send('<form method="POST" action="/submit"><input type="number" name="roomNumber"><input type="number" name="capacity"><input type="submit"></form>');
});

app.post('/submit', async(req, res) =>{
    const roomNumber = Number(req.body.roomNumber)
    const capacity = Number(req.body.capacity)
    const collection = await dbo.getDb().collection("rooms");
    collection.updateOne({roomNumber: roomNumber}, {$setOnInsert:{roomNumber: roomNumber, capacity: capacity}}, {upsert: true})
    res.redirect('/');

})