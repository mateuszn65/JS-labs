let Persons = new Map()
let Cars = new Map()

function initDatabase() {
    Cars.set("BMW", {
        'ilosc': 5,
        'cena': '200000zł'
    })
    Cars.set("Opel", {
        'ilosc': 3,
        'cena': '120000zł'
    })
    Cars.set("Ford", {
        'ilosc': 7,
        'cena': '150000zł'
    })
    Cars.set("Toyota", {
        'ilosc': 8,
        'cena': '100000zł'
    })
    Persons.set('124124124', {
        'name': 'Helena',
        'cars': ['Opel', 'Ford']
    })
    Persons.set('124125125', {
        'name': 'Marek',
        'cars': ['Toyota']
    })
    Persons.set('543253112', {
        'name': 'Jan',
        'cars': ['BMW', 'BMW', 'Ford']
    })
}
initDatabase()



function onRequest_8080(request, response) {
    const fs = require("fs");
    const file = 'indexcw.html';
    fs.stat(file, function (err, stats) {
        if (err == null) { // If the file exists
            fs.readFile(file, function (err, data) { // Read it content
                response.writeHead(200, {
                    "Content-Type": "text/html; charset=utf-8"
                });
                response.write(data); // Send the content to the web browser
                response.end();
            });
        } else { // If the file does not exists
            response.writeHead(200, {
                "Content-Type": "text/plain; charset=utf-8"
            });
            response.write(`The '${file}'file does not exist`);
            response.end();
        } //else
    }); //fs.stat
}

async function onRequest_8081(request, response) {
    var url = new URL(request.url, `http://${request.headers.host}`)
    if (url.pathname != '/canvas') {
        switch (url.pathname) {
            case '/CAR':

                var marka = url.searchParams.get("marka")
                var ilosc = url.searchParams.get("ilosc")
                var cena = url.searchParams.get("cena")
                Cars.set(marka, {
                    'ilosc': ilosc,
                    'cena': cena + 'zł'
                })
                console.log("added a car")
                break
            case '/DELETE':

                var marka = url.searchParams.get("marka")
                console.log(marka)
                Persons.forEach((value, key)=>{
                    value.cars = value.cars.filter((car)=> {
                        return car != marka
                    })
                })
                Cars.delete(marka)
                console.log("deleted a car")
                break
            case '/PERSON':
                var PESEL = url.searchParams.get("PESEL")
                var name = url.searchParams.get("name")
                var marka = url.searchParams.get("marka")
                if (!Cars.has(marka))
                    break
                if (Persons.has(PESEL)) {
                    let person = Persons.get(PESEL)
                    person.cars.push(marka)
                } else {

                    Persons.set(PESEL, {
                        'name': name,
                        'cars': [marka]
                    })
                }
                Cars.get(marka).ilosc -= 1
                console.log("person bought a car")
                break
        }

        let data = `<?xml version="1.0" encoding="UTF-8"?>`
        data += `<div>`

        Persons.forEach((value) => {
            value.cars.forEach(car => {
                let price = Cars.get(car).cena
                data += `<div>` + value.name + ' ' + car + ' ' + price + `</div>`
            })
        })
        data += `</div>`
        response.writeHead(200, {
            "Content-Type": "application/xml",
            "Access-Control-Allow-Origin": "http://localhost:8080"
        });
        response.write(data);
        response.end();
        
    }else{
        if (request.method == 'GET'){
            
            let data = []
            Cars.forEach((value, key) =>{
                data.push({marka: key, ilosc: value.ilosc})
            })
            data.sort((a, b) => b.ilosc - a.ilosc)

            if (data.length > 3){
                data = data.slice(0, 3)
            }
            
            response.writeHead(200, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:8080"
            });
            response.write(JSON.stringify(data));
            response.end();

        }else if(request.method == 'POST'){
            const buffers = [];
            for await (const chunk of request) {
                buffers.push(chunk);
            }
            const data = Buffer.concat(buffers).toString();
            let marka = JSON.parse(data).marka
            Persons.forEach((value, key)=>{
                value.cars = value.cars.filter((car)=> {
                    return car != marka
                })
            })

            console.log(marka)
            Cars.delete(marka)
            console.log('car deleted')
            response.writeHead(200, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:8080"
            });
            response.end();
        }
        
    }

}

/* ************************************************** */
/* Main block
/* ************************************************** */
var http = require('http');
const { markAsUntransferable } = require("worker_threads")

http.createServer(onRequest_8080).listen(8080);
http.createServer(onRequest_8081).listen(8081);
console.log("The server was started on port 8080 and 8081");
console.log("To stop the server, press 'CTRL + C'");