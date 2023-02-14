//Source:  https://codeforgeek.com/unit-testing-nodejs-application-using-mocha/
var supertest = require("supertest");
var chai = require('chai');
chai.use(require('chai-json'));

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mateusz:jslab@jslab.xv8bn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// This agent refers to PORT where program is runninng.
var server = supertest.agent("http://localhost:3000");

const jsonObjs = [
    {
        "x": 1,
        "operation": "+",
        "y": 1
    },
    {
        "x": 4,
        "operation": "-",
        "y": 1
    },
    {
        "x": 3,
        "operation": "*",
        "y": 2
    },
    {
        "x": 16,
        "operation": "/",
        "y": 4
    },
    {
        "x": 4,
        "operation": "+",
        "y": 2
    }
]

// UNIT test begin
describe('GET /', function() {
    it('respond with html', function(done) {
        server
        .get('/')
        .expect('Content-Type', /html/)
        .expect(200)
        .end((err, res)=>{
            chai.expect(res.text).to.contain("<h1>1 + 2 = 3</h1>")
            if (err) return done(err);
            return done()
        })
    });
});

describe('GET /json/:operacje', function() {
    it('JSON into table', function(done) {
       server
       .get('/json/:operacje')
       .expect('Content-Type', /html/)
       .expect(200)
       .end((err, res)=>{
            chai.expect(res.text).to.contain("<td id=\"result-1\">2</td>")
            chai.expect(res.text).to.contain("<td id=\"result-2\">3</td>")
            chai.expect(res.text).to.contain("<td id=\"result-3\">6</td>")
            chai.expect(res.text).to.contain("<td id=\"result-4\">4</td>")
            chai.expect(res.text).to.contain("<td id=\"result-5\">6</td>")
            if (err) return done(err);
            return done()
        })
        
    });
});

describe('JSON file', function() {
    it('check if correct file', function(done) {
        server
       .get('/json/:operacje')
       .expect('Content-Type', /html/)
       .expect(200)
       .end((err, res)=>{
            const filename = 'operacje.json'

            chai.expect(filename).to.be.a.jsonFile().and.to.be.jsonObj(jsonObjs);
            chai.expect(filename).to.be.a.jsonFile().and.contain.jsonWithProps(
                    {
                        "x": 1,
                        "operation": "+",
                        "y": 1
                    },
                    {
                        "x": 4,
                        "operation": "-",
                        "y": 1
                    },
                    {
                        "x": 3,
                        "operation": "*",
                        "y": 2
                    },
                    {
                        "x": 16,
                        "operation": "/",
                        "y": 4
                    },
                    {
                        "x": 4,
                        "operation": "+",
                        "y": 2
                    }
            )
            if (err) return done(err);
            return done()
       })
       
    });
});

describe('GET /calculate', () => {
    it('addition', (done) => {
        server
        .get('/calculate/:+/:1/:2')
        .expect('Content-Type', /html/)
        .expect(200)
        .end((err, res)=>{
            chai.expect(res.text).to.contain("<h1>1 + 2 = 3</h1>")
            if (err) return done(err);
            return done()
        })
    });
    it('subtraction', (done) => {
        server
        .get('/calculate/:-/:3/:2')
        .expect('Content-Type', /html/)
        .expect(200)
        .end((err, res)=>{
            chai.expect(res.text).to.contain("<h1>3 - 2 = 1</h1>")
            if (err) return done(err);
            return done()
        })
    });
    it('multiplication', (done) => {
        server
        .get('/calculate/:*/:3/:2')
        .expect('Content-Type', /html/)
        .expect(200)
        .end((err, res)=>{
            chai.expect(res.text).to.contain("<h1>3 * 2 = 6</h1>")
            if (err) return done(err);
            return done()
        })
    });
    it('division', (done) => {
        server
        .get('/calculate/::/:4/:2')
        .expect('Content-Type', /html/)
        .expect(200)
        .end((err, res)=>{
            chai.expect(res.text).to.contain("<h1>4 : 2 = 2</h1>")
            if (err) return done(err);
            return done()
        })
    });
});



describe('GET /results', function() {
    let operations
    before(async () =>{
        await client.connect()
        const collection = client.db("JSlab").collection("operations")
        operations = await collection.find({}).toArray()
        client.close()
    });

    it('DB into table', function(done) {
       server
       .get('/results')
       .expect('Content-Type', /html/)
       .expect(200)
       .end((err, res)=>{
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
                chai.expect(res.text).to.contain("<td id=\"result-" + (id+1) + "\">" + result + "</td>")
            });
            if (err) return done(err);
            return done()
        })
        
    });
});