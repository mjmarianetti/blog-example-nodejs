'use strict';


const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '../../.env.test')
})

const db = require('../../models')();


function importTest(name, path) {
    describe(name, () => {
        require(path)(db);
    });
}

describe("TESTS", () => {

    after((done) => {
        db.connection.close();
        done();
    })

    describe("USERS", () => {
        importTest("login", './users/login');
        importTest("signup", './users/signup');
    });

    describe("POSTS", () => {
        importTest("create", './posts/create');
        importTest("delete", './posts/delete');
        importTest("list", './posts/list');
    });
})