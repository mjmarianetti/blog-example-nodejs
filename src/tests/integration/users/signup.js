'use strict';


const request = require('supertest'),
    endpoint = 'http://localhost:3000/',
    client = request(endpoint),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect;

chai.use(chaiAsPromised);

module.exports = (db) => {

    describe('POST /users/signup', () => {

        before((done) => {
            db.models.User.remove({})
                .then(() => {
                    return db.models.Post.remove({});
                })
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                })
        });

        const user = {
            email: "test@test.com",
            password: "123456"
        };

        it('should register a new user', (done) => {

            client.post('users/signup')
                .type('json')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send(user)
                .expect(200)
                .then((res) => {
                    expect(res.statusCode).to.eql(200);
                    expect(res.body).to.have.property('user');
                    expect(res.body.user.email).to.be.eql(user.email);
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });
    });
}