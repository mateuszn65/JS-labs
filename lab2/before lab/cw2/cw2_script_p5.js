"use strict";
var expect = chai.expect;
let total_sum = 0
function engine(){
    while (true){
        let text = window.prompt("Podaj napis: ")
        if (text == null){
            total_sum = 0
            return
        }
        console.log(text)
        console.log("cyfry: " + cyfry(text))
        console.log("litery: " + litery(text))
        console.log("suma: " + suma(text))
    }
}

function cyfry(napis){
    let result = 0
    let arr = napis.split('')
    arr.forEach(element => {
        if (Number(element)){
            result += Number(element)
        }
    });
    return result
}

function litery(napis){
    let result = 0
    let arr = napis.split('')
    arr.forEach(element => {
        if (!Number(element)){
            result += 1
        }
    });
    return result

}

function suma(napis){
    if (parseInt(napis)){
        total_sum += parseInt(napis)
    }
    return total_sum
}

describe('Cyfry', function() {
    it('Returns 10 sum of 5 + 3 + 2 for \'532\'', function(){
        expect(cyfry('532')).to.equal(10);
    })
    it('Returns 0 for \'abc\'', function(){
        expect(cyfry('abc')).to.equal(0);
    })
    it('Returns 5 sum of 3 + 2 for \'aa23\'', function(){
        expect(cyfry('aa23')).to.equal(5);
    })
    it('Returns 5 sum of 3 + 2 for \'32aa\'', function(){
        expect(cyfry('32aa')).to.equal(5);
    })
    it('Returns 0 for \'\'', function(){
        expect(cyfry('')).to.equal(0);
    })
});

describe('Litery', function() {
    it('Returns 0  for \'532\'', function(){
        expect(litery('532')).to.equal(0);
    })
    it('Returns 3 for \'abc\'', function(){
        expect(litery('abc')).to.equal(3);
    })
    it('Returns 2 for aa in \'aa23\'', function(){
        expect(litery('aa23')).to.equal(2);
    })
    it('Returns 2 for aa in \'32aa\'', function(){
        expect(litery('32aa')).to.equal(2);
    })
    it('Returns 0 for \'\'', function(){
        expect(litery('')).to.equal(0);
    })
});
describe('Suma', function() {
    it('Returns 532 for \'532\'', function(){
        expect(suma('532')).to.equal(532);
    })
    it('Returns 532 = 532 + 0 for \'abc\'', function(){
        expect(suma('abc')).to.equal(532);
    })
    it('Returns 532 = 532 + 0 + 0 for \'aa23\'', function(){
        expect(suma('aa23')).to.equal(532);
    })
    it('Returns 564 = 532 + 0 + 0 + 32 for \'32aa\'', function(){
        expect(suma('32aa')).to.equal(564);
    })
    it('Returns 564 = 532 + 0 + 0 + 32 + 0 for \'\'', function(){
        expect(suma('')).to.equal(564);
    })
});