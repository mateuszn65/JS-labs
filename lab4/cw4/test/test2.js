import { equal } from 'assert';
import {check} from '../fs_sync.js'

describe('Find and read if file', () => {
    it('Should log out \'Does not exist\'', () => {
        equal(check('something'), 'Does not exist')
    });
    
    it('Should log out \'It\'s a directory, path: .\\out\'', () => {
        let msg = check('out')
        equal(msg, 'It\'s a directory, path: .\\out')
    });
    it('Should log out \'It\'s a file, path: .\\hello.txt\\nhello world\'', () => {
        let msg = check('hello.txt')
        equal(msg, 'It\'s a file, path: .\\hello.txt\nhello world')
    });
});
