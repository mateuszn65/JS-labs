/** This is a description of the Operation class. */
export class Operation{
    /**
     * Represents an operation.
     * @constructor
     * @param {number} x - The first ingredient of the operation.
     * @param {number} y - The second ingredient of the operation.
     */
    constructor(x, y){
        this.x = x
        this.y = y
    }
    /**
     * Sum function
     * @returns the sum of two assigned ingredients
     */
    sum(){
        return this.x + this.y
    }
}