// Application using the 'Pug' template system
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

// Configuring the application
app.set('views', __dirname + '/views'); // Files with views can be found in the 'views' directory
app.set('view engine', 'pug');          // Use the 'Pug' template system

// Determining the contents of the middleware stack
app.use(logger('dev'));                         // Add an HTTP request recorder to the stack — every request will be logged in the console in the 'dev' format
// app.use(express.static(__dirname + '/public')); // Place the built-in middleware 'express.static' — static content (files .css, .js, .jpg, etc.) will be provided from the 'public' directory

// Route definitions
app.get('/', function (req, res) {      // The first route
    res.render('index', {pretty:true, x: x, y: y}); // Render the 'index' view in 'pretty' mode — the resulting HTML code will be indented — the 'pretty' option has the 'deprecated' status — in the future it will not be supported
    //res.render('index '); // Render the 'index' view; because the 'pretty' mode is, by default, turned off so the resulting HTML will be without indentation
});


app.get('/json/:name', (req, res) => {
    const filename = req.params.name.replace(':','') + '.json'
    const operations = require('./' + filename)
    res.render('table', {pretty:true, operations: operations})
});

app.get('/calculate/:operation/:x/:y', async(req, res) => {
    const x = Number(req.params.x.replace(':',''))
    const y = Number(req.params.y.replace(':',''))
    if (x && y){
        const operation = req.params.operation.replace(':','')
        res.render('insert', {pretty:true, x: x, y: y, operation});

        const collection = await dbo.getDb().collection("operations");
        collection.updateOne({x:x, operation:operation, y:y}, {$setOnInsert:{x:x, operation:operation, y:y}}, {upsert: true})
    }else{
        res.send('<h1>Incorrect data</h1>');
    }
});


app.get('/results', async(req, res) => {
    const collection = await dbo.getDb().collection("operations");
    const operations = await collection.find({}).toArray()
    res.render('table', {pretty:true, operations: operations})
});