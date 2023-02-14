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
    res.send('<h1>Dane zostaly dodane</h1>');
    // const collection = await dbo.getDb().collection("guests");
    // const operations = await collection.find({}).toArray()
    // res.send(makeTable(operations));
});


app.get('/addGuest', (req, res) => {
    res.send(`
        <form method="POST" action="/submit-guest">
        <label for="firstName">firsName</label>
        <input type="text" name="firstName" id="firstName">
        <label for="lastName">lastName</label>
        <input type="text" name="lastName" id="lastName">
        <label for="email">email</label>
        <input type="email" name="email" id="email">
        <label for="roomNumber">room number</label>
        <input type="number" name="roomNumber" id="roomNumber">
        <input type="submit"></input>
    `)
});
app.get('/rooms', (req, res) => {
    const roomsCollection = await dbo.getDb().collection("rooms");
    const guestsCollection = await dbo.getDb().collection("guests");
    const rooms = await roomsCollection.find({}).toArray()
    let responseString = ''
    responseString += '<style>*{text-align:center;}td{padding: 0.2em 2em;border-bottom: 1px solid grey;}table{border-spacing: 0;}tr:first-child td{border-bottom: 2px solid black;font-weight: bold;}</style>'
    responseString += '<table>'
    responseString += '<tr><td>' + 'room number' + '</td><td>' + 'free' + '</td><td>' + 'taken' + '</td><td>' + 'guests' + '</td></tr>' 

    rooms.forEach(element => {
        
        responseString += '<tr><td>' + element.roomNumber + '</td><td>' + element.capacity + '</td><td>' + (element.maxCapacity - element.capacity) + '</td><td id="result-' + (id+1) + '">' + result + '</td></tr>' 

    
    });
    res.send()
});
app.post('/submit-guest', async(req, res) =>{
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const roomNumber = Number(req.body.roomNumber)
    const roomsCollection = await dbo.getDb().collection("rooms");
    const room = await roomsCollection.find({roomNumber: roomNumber}).toArray()[0]
    if(room.capacity == 0){
        res.send('<h1>Brak miejsc</h1>');
    }else{
        const guestsCollection = await dbo.getDb().collection("guests");
        guestsCollection.updateOne({roomNumber: roomNumber}, {$setOnInsert:{roomNumber: roomNumber, firstName: firstName, lastName:lastName, email:email}}, {upsert: true})
        roomsCollection.updateOne({roomNumber: roomNumber}, {$set:{capacity: room.capacity}})
        res.redirect('/rooms');
    }

    
    

})

app.get('/addRoom', (req, res) => {
    res.send('<form method="POST" action="/submit-room"><input type="number" name="roomNumber"><input type="number" name="capacity"><input type="submit"></form>');
});

app.post('/submit-room', async(req, res) =>{
    const roomNumber = Number(req.body.roomNumber)
    const capacity = Number(req.body.capacity)
    const collection = await dbo.getDb().collection("rooms");
    collection.updateOne({roomNumber: roomNumber}, {$setOnInsert:{roomNumber: roomNumber, capacity: capacity, maxCapacity: capacity}}, {upsert: true})
    res.redirect('/');

})