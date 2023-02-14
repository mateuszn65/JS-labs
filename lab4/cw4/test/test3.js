//Source:  https://codeforgeek.com/unit-testing-nodejs-application-using-mocha/
import { agent } from "supertest";

// This agent refers to PORT where program is running.
var server = agent("http://localhost:8080");

// UNIT test begin
describe('GET /submit?name=something', function () {
    it('respond with "Does not exist"', function (done) {
        server
                .get('/submit?name=something')
                .expect('Content-Type', /text\/plain/)
                .expect(200, "Does not exist", done);
    });
});
describe('GET /submit?name=out', function () {
    it('respond with "It\'s a directory, path: .\\out"', function (done) {
        server
                .get('/submit?name=out')
                .expect('Content-Type', /text\/plain/)
                .expect(200, "It's a directory, path: .\\out", done);
    });
});
describe('GET /submit?name=bye.txt', function () {
    it('respond with "It\'s a file, path: .\\bye.txt\ngoodbye\r\nworld"', function (done) {
        server
                .get('/submit?name=bye.txt')
                .expect('Content-Type', /text\/plain/)
                .expect(200, "It's a file, path: .\\bye.txt\ngoodbye\r\nworld", done);
    });
});
