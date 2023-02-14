import {Operation} from './module.js'
let x = Number(process.argv[2]) ? Number(process.argv[2]) : 0
let y = Number(process.argv[3]) ? Number(process.argv[3]) : 0

const op = new Operation(x, y)
console.log(op.sum())