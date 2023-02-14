var expect = chai.expect;
const transformer = ({ amount, currency }) => `${amount} ${currency.code}`;
let users = []

class User{
    name;
    accounts = []
    constructor(name){
        this.name = name;
    }
}

function wykonaj(){
    const output = document.getElementById('output')
    output.innerHTML = ''
    const storage = document.getElementById('storage').checked
    const text = document.forms['myForm'].elements['myTextarea'].value
    let text_rows = text.split('\n')
    text_rows.forEach((row, i)=>{
        i += 1
        if (row[0] == '+' || row[0] == '-'){
            row = row.split('')
            let sign = row.splice(0, 1)[0]
            var reg_name = /^[a-zA-Z\s]*$/;
            row = row.join('')
            row = row.split(';')
            let name
            let currency
            let value
            switch(row.length){
                case 1:
                    name = row[0]
                    if (sign == '+' && reg_name.test(name)){
                        if(addUser(name, storage)){
                            output.innerHTML += "("+i+") " + "User: \"" + name + "\", successfully added" + "<br>"
                        }else{
                            output.innerHTML += "("+i+") " + "Couldn\'t add user " + name +  "<br>"
                        }
                    }
                    break
                case 2:
                    currency = row[0]
                    name = row[1]
                    if (sign == '+' && availableCurrencies(currency) && reg_name.test(name)){
                        if (addAccount(name, currency, storage)){
                            output.innerHTML += "("+i+") " + currency + " account "  + " successfully added" + "<br>"
                        }else{
                            output.innerHTML += "("+i+") " + "Couldn\'t add " +  currency + " account\n" + "<br>"
                        }
                    }
                    break
                case 3:
                    value = Number(sign + row[0])
                    currency = row[1]
                    name = row[2]
                    if (value && availableCurrencies(currency) && reg_name.test(name)){
                        if (changeBalance(name, currency, value, storage)){
                            output.innerHTML += "("+i+") " + "Successfully changed balance" + "<br>"
                        }else{
                            output.innerHTML += "("+i+") " + "Couldn\'t change balance" + "<br>"
                        }
                    }
                    break
                default:
                    output.innerHTML += "("+i+") " + "Incorrect input" + "<br>"
            }
        }else{
            output.innerHTML += "("+i+") " + "Incorrect input" + "<br>"
        }
    })
}
function wypisz(){
    const output = document.getElementById('output')
    output.innerHTML = ''
    const storage = document.getElementById('storage').checked
    const text = document.forms['myForm'].elements['myTextarea'].value
    let text_rows = text.split('\n')
    text_rows.forEach((name, i) =>{
        i += 1
        var reg_name = /^[a-zA-Z\s]*$/;
        if (reg_name.test(name)){
            let user
            if (storage){
                user = JSON.parse(sessionStorage.getItem(name))
            }else{
                user = users.find(e=>{return e.name == name})
            }
            if (user){
                output.innerHTML += "("+i+") " + "User: " + user.name + "<br>"
                for (const account of user.accounts) {
                    output.innerHTML += "Account: " + account.amount + account.currency +  "<br>"
                }
                return
            }
            output.innerHTML += "("+i+") " + "User doesn\'t exist" + "<br>"
            return
        }
        output.innerHTML += "("+i+") " + "Incorrect input" + "<br>"
    })
}

function availableCurrencies(currency){
    switch (currency){
        case 'PLN':
            return PLN
        case 'USD':
            return USD
        case 'EUR':
            return EUR
        case 'GBP':
            return GBP
        default:
            return null
    }
}

function addUser(name, storage){
    let new_user
    if (storage){
        if (sessionStorage.getItem(name)){
            return JSON.parse(sessionStorage.getItem(name))
        }
        const tmp_user = users.find(e=>{return e.name == name})
        if (tmp_user){
            new_user = users.splice(users.indexOf(tmp_user), 1)[0]
        }else{
            new_user = new User(name)
        }
        sessionStorage.setItem(name, JSON.stringify(new_user))
        return new_user
    }
    const tmp_user = users.find(e=>{return e.name == name})
    if (tmp_user){
        return tmp_user
    }
    if (sessionStorage.getItem(name)){
        new_user = JSON.parse(sessionStorage.getItem(name))
        sessionStorage.removeItem(name)
    }else{
        new_user = new User(name)
    }
    users.push(new_user)
    return new_user
}

function _addAccount(user, _currency){
    for (const account of user.accounts) {
        if (account.currency == _currency.code){
            return false
        }
    }
    const { amount, currency } = toSnapshot(
        dinero({ amount: 0, currency: _currency }
    ))
    user.accounts.push({ amount: amount, currency: currency.code, money: dinero({ amount: 0, currency: _currency })})
    return true
}

function addAccount(name, _currency, storage){
    _currency = availableCurrencies(_currency)
    if (!_currency){
        return false
    }
    if(storage){
        let user = JSON.parse(sessionStorage.getItem(name))
        if (!user){
            return false
        }
        
        if (!_addAccount(user, _currency)){
            
            return false
        }
        sessionStorage.removeItem(name)
        sessionStorage.setItem(name, JSON.stringify(user))
        return true
    }

    let user = users.find(e=>{return e.name == name})
    if (!user){
        return false
    }
    return _addAccount(user, _currency)
}

function _changeBalance(user, _currency, value, storage){
    for (const account of user.accounts) {
        if (account.currency == _currency.code){
            if (storage){
                account.money = add(dinero({amount: account.amount, currency: _currency}), dinero({ amount: value, currency: _currency }))
                
            }else{
                account.money = add(account.money, dinero({ amount: value, currency: _currency }))
            }
            const { amount } = toSnapshot(
                account.money
            )
            account.amount = amount
            return true
        }
    }
    return false
}

function changeBalance(name, _currency, value, storage){
    _currency = availableCurrencies(_currency)
    if (!_currency){
        return false
    }
    value = Number(value)
    if (!value){
        return false
    }

    if (storage){
        let user = JSON.parse(sessionStorage.getItem(name))
        if (!user){
            return false
        }
        if (_changeBalance(user, _currency, value, storage)){
            sessionStorage.removeItem(name)
            sessionStorage.setItem(name, JSON.stringify(user))
            return true
        }
        return false
    }
    let user = users.find(e=>{return e.name == name})
    if (!user){
        return false
    }
    return _changeBalance(user, _currency, value, storage)
    
}

describe('Add user', ()=>{
    it('Adds new user to variable if user does not exist', ()=>{
        const username = "Jan Kowalski"
        expect(users).to.deep.include(addUser(username, false))
        users = []
    })
    it('Adds new user to storage if user does not exist', ()=>{
        const username = "Jan Kowalski"
        expect(addUser(username, true)).to.deep.equal(JSON.parse(sessionStorage.getItem(username)))
        sessionStorage.removeItem(username)
    })
    it('Moves user from variable to storage if user exists in variable', ()=>{
        const username = "Jan Kowalski"
        let var_user = addUser(username, false)
        expect(users).to.deep.include(var_user)
        let st_user = addUser(username, true)
        expect(var_user).to.deep.equal(st_user)
        expect(st_user).to.deep.equal(JSON.parse(sessionStorage.getItem(username)))
        expect(users).to.deep.not.include(var_user)
        sessionStorage.removeItem(username)
    })
    it('Moves user from storage to variable if user exists in storage', ()=>{
        const username = "Jan Kowalski"
        let st_user = addUser(username, true)
        expect(st_user).to.deep.equal(JSON.parse(sessionStorage.getItem(username)))
        let var_user = addUser(username, false)
        expect(var_user).to.deep.equal(st_user)
        expect(users).to.deep.include(var_user)
        expect(JSON.parse(sessionStorage.getItem(username))).to.equal(null)
        users = []
    })
    it('Doesn\'t add new user to variable if user already exist in variable', ()=>{
        const username = "Jan Kowalski"
        expect(users).to.deep.include(addUser(username, false))
        const l1 = users.length
        expect(users).to.deep.include(addUser(username, false))
        expect(l1).to.equal(users.length)
        users = []
    })
    it('Doesn\'t add new user to storage if user already exist in storage', ()=>{
        const username = "Jan Kowalski"
        let st_user = addUser(username, true)
        expect(st_user).to.deep.equal(JSON.parse(sessionStorage.getItem(username)))
        addUser(username, true)
        expect(st_user).to.deep.equal(JSON.parse(sessionStorage.getItem(username)))
        sessionStorage.removeItem(username)
    })
})

describe('Add currency account', ()=>{
    it('Returns true if successfully added new currency to user in variable', ()=>{
        const username = "Jan Kowalski"
        let user = addUser(username, false)
        expect(users).to.deep.include(user)
        expect(addAccount(username, 'USD', false)).to.be.true
        users = []
    })
    it('Returns true if successfully added new currency to user in storage', ()=>{
        const username = "Jan Kowalski"
        let user = addUser(username, true)
        expect(user).to.deep.equal(JSON.parse(sessionStorage.getItem(username)))
        expect(addAccount(username, 'USD', true)).to.be.true
        sessionStorage.removeItem(username)
    })
    it('Returns false if user doesn\'t exists', ()=>{
        const username = "Jan Kowalski"
        expect(addAccount(username, 'USD', true)).to.be.false
        expect(addAccount(username, 'USD', false)).to.be.false
    })
    it('Returns false if currency isn\'t available', ()=>{
        const username = "Jan Kowalski"
        let user = addUser(username, false)
        expect(users).to.deep.include(user)
        expect(addAccount(username, 'zl', false)).to.be.false
        users = []
    })
    it('Returns false when adding existing currency account', ()=>{
        const username = "Jan Kowalski"
        let user = addUser(username, false)
        expect(users).to.deep.include(user)
        expect(addAccount(username, 'USD', false)).to.be.true
        expect(addAccount(username, 'USD', false)).to.be.false
        users = []

        user = addUser(username, true)
        expect(user).to.deep.equal(JSON.parse(sessionStorage.getItem(username)))
        expect(addAccount(username, 'USD', true)).to.be.true
        expect(addAccount(username, 'USD', true)).to.be.false
        sessionStorage.removeItem(username)
    })
})

describe('Change balance', ()=>{
    it('Returns true if successfully change balance', ()=>{
        const username = "Jan Kowalski"
        let user = addUser(username, false)
        expect(users).to.deep.include(user)
        expect(addAccount(username, 'USD', false)).to.be.true
        expect(changeBalance(username, 'USD', 40, false)).to.be.true
        expect(user.accounts[0].amount).to.equal(40)
        users = []
        user = addUser(username, true)
        expect(user).to.deep.equal(JSON.parse(sessionStorage.getItem(username)))
        expect(addAccount(username, 'USD', true)).to.be.true
        expect(changeBalance(username, 'USD', 40, true)).to.be.true
        expect(JSON.parse(sessionStorage.getItem(username)).accounts[0].amount).to.equal(40)
        sessionStorage.removeItem(username)
    })
    it('Returns false if user doesn\'t exist', ()=>{
        const username = "Jan Kowalski"
        expect(addAccount(username, 'USD', false)).to.be.false
        expect(changeBalance(username, 'USD', 40, false)).to.be.false
        expect(addAccount(username, 'USD', true)).to.be.false
        expect(changeBalance(username, 'USD', 40, true)).to.be.false
    })
    it('Returns false if currency account doesn\'t exist', ()=>{
        const username = "Jan Kowalski"
        let user = addUser(username, false)
        expect(users).to.deep.include(user)
        expect(changeBalance(username, 'USD', 40, false)).to.be.false
        users = []
        user = addUser(username, true)
        expect(user).to.deep.equal(JSON.parse(sessionStorage.getItem(username)))
        expect(changeBalance(username, 'USD', 40, true)).to.be.false
        sessionStorage.removeItem(username)
    })
})