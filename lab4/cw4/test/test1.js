import { strictEqual } from 'assert';
import { Operation } from '../module.js';

describe('The sum() method', function () {
  it('Returns 4 for 2+2', function () {
    var op = new Operation(2, 2);
    strictEqual(op.sum(), 4)
  });
  it('Returns 0 for -2+2', function () {
    var op = new Operation(-2, 2);
    strictEqual(op.sum(), 0)
  });
});
