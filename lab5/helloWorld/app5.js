var express = require('express'),
    logger = require('morgan');

const dbo = require('./conn')
var app = express();
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator')
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

// Configuring the application
app.set('views', __dirname + '/views'); // Files with views can be found in the 'views' directory
app.set('view engine', 'pug');          // Use the 'Pug' template system


// Determining the contents of the middleware stack
app.use(logger('dev'));                         // Place an HTTP request recorder on the stack — each request will be logged in the console in 'dev' format
// app.use(express.static(__dirname + '/public')); // Place the built-in middleware 'express.static' — static content (files .css, .js, .jpg, etc.) will be provided from the 'public' directory
//app.use (express.bodyParser());

app.use(express.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

// Route definitions
app.get('/', function (req, res) { 
    res.render('base', {title:"Hotel app"});
});

app.get('/addGuest', (req, res) => {
    res.render('addGuest', { title: "Add guest", error: false})
});

app.get('/rooms', async(req, res) => {
    const roomsCollection = await dbo.getDb().collection("rooms");
    const rooms = await roomsCollection.find({}).toArray()

    const availableRooms = rooms.filter((val)=>{return val.capacity > 0})
    const notAvailableRooms = rooms.filter((val)=>{return val.capacity == 0})

    res.render('rooms', {title:'rooms', availableRooms: availableRooms, notAvailableRooms: notAvailableRooms})
});

app.get('/rooms/:roomNumber', async(req, res) => {
    const roomNumber = Number(req.params.roomNumber)
    if (isNaN(roomNumber)){
        res.redirect('/rooms')
        return
    }
    const collection = await dbo.getDb().collection("rooms");
    const room = await collection.findOne({roomNumber:roomNumber})

    if (!room){
        res.redirect('/rooms')
        return
    }
    const guestsCollection = await dbo.getDb().collection("guests");
    const guests = await guestsCollection.find({roomNumber:roomNumber}).toArray()
    
    res.render('roomDetails', {title:'room details', roomNumber: roomNumber, guests: guests})
});

app.post('/addGuest', validateGuest(), async(req, res) =>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('addGuest', {title: "Add guest", error: true, errorMsg: errors.array()[0].msg})
        return
    }

    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const roomNumber = Number(req.body.roomNumber)
    const roomsCollection = await dbo.getDb().collection("rooms");
    const room = await roomsCollection.findOne({roomNumber: roomNumber})
    
    if (!room){
        res.render('addGuest', {title: "Add guest", error: true, errorMsg: "No such room number"})
        return
    }
    if(room.capacity == 0){
        res.render('addGuest', {title: "Add guest", error: true, errorMsg: "No space in this room"})
        return
    }
    const guestsCollection = await dbo.getDb().collection("guests");
    roomsCollection.updateOne({roomNumber: roomNumber}, {$set:{capacity: room.capacity - 1}})
    guestsCollection.insertOne({roomNumber: roomNumber, firstName: firstName, lastName:lastName, email:email})
    res.redirect('/rooms');
})

app.get('/addRoom', (req, res) => {
    res.render('addRoom', { title: "Add room", error: false})
});


app.post('/addRoom', validateRoom(), async(req, res) =>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('addRoom', {title: "Add room", error: true, errorMsg: errors.array()[0].msg})
        return
    }

    const roomNumber = Number(req.body.roomNumber)
    const capacity = Number(req.body.capacity)
    const collection = await dbo.getDb().collection("rooms");
    const room = await collection.findOne({roomNumber:roomNumber})

    if (room){
        res.render('addRoom', {title: "Add room", error: true, errorMsg: "Room with this number already exists"})
        return
    }
    collection.insertOne({roomNumber: roomNumber, capacity: capacity, maxCapacity: capacity})
    res.render('addRoom', {title: "Add room", error: false, submitSuccess: true})
})

function validateRoom(){
    return [ 
        body('roomNumber').exists().withMessage('Room number field required')
        .isInt().withMessage('Room number must be a number'),
        body('capacity').exists().withMessage('Capacity field required')
        .isInt({min:1}).withMessage('Capacity number must be a number greater than 0'),
       ] 
}

function validateGuest(){
    return [ 
        body('firstName').trim().isLength({min:1}).escape().withMessage('First name required')
            .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
        body('lastName').trim().isLength({min:1}).escape().withMessage('Last name required')
            .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
        body('email', 'Invalid email').exists().isEmail(),
        body('roomNumber').exists().withMessage('Room number field required')
        .isInt().withMessage('Room number must be a number'),
       ] 
}