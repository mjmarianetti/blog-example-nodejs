'use strict';

const request = require('supertest'),
    endpoint = 'http://localhost:3000/',
    client = request(endpoint),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),

    expect = chai.expect;

chai.use(chaiAsPromised);

module.exports = (db) => {


    let token;

    const user = {
        email: "test@test.com",
        password: "123456"
    };

    describe('POST /posts', () => {

        before((done) => {
            db.models.User.remove({})
                .then(() => {
                    return db.models.Post.remove({});
                }).then(() => {
                    return db.models.User.create(user)
                })
                .then((res) => {
                    return client.post('users/login')
                        .type('json')
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .send(user)
                })
                .then((res) => {
                    token = res.body.token;
                    done();
                }).catch((err) => {
                    done(err);
                });
        });

        const post = {
            title: "my new test",
            body: "this is the post body content"
        };

        it('should create a new post', (done) => {

            client.post('posts')
                .type('json')
                .set('Accept', 'application/json')
                .query({
                    token: token
                })
                .expect('Content-Type', /json/)
                .send(post)
                .expect(200)
                .then((res) => {
                    expect(res.statusCode).to.eql(200);
                    expect(res.body).to.have.property('id');
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });

        describe('validate params', () => {

            it('should return error if title not provided', (done) => {

                const postData = JSON.parse(JSON.stringify(post));
                delete postData.title;

                client.post('posts')
                    .type('json')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .query({
                        token: token
                    })
                    .send(postData)
                    .expect(500)
                    .expect(
                        (res) => {
                            expect(res.statusCode).to.eql(500);
                            expect(res.body.message.errors.title.message).to.not.be.undefined;
                        }
                    )
                    .end(done);
            });

            it('should return error if body not provided', (done) => {

                const postData = JSON.parse(JSON.stringify(post));
                delete postData.body;

                client.post('posts')
                    .type('json')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .query({
                        token: token
                    })
                    .send(postData)
                    .expect(500)
                    .expect(
                        (res) => {
                            expect(res.statusCode).to.eql(500);
                            expect(res.body.message.errors.body.message).to.not.be.undefined;
                        }
                    )
                    .end(done);
            });
        });


    });

}