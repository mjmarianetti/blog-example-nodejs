'use strict';

const request = require('supertest'),
    endpoint = 'http://localhost:3000/',
    client = request(endpoint),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),

    expect = chai.expect;

chai.use(chaiAsPromised);

module.exports = (db) => {
    let token, anotherToken;

    const user = {
        email: "test@test.com",
        password: "123456"
    };

    const anotherUser = {
        email: "test123@test.com",
        password: "123456"
    };

    describe('GET /posts/{id}', () => {


        beforeEach((done) => {
            db.models.User.remove({})
                .then(() => {
                    return db.models.Post.remove({});
                }).then(() => {
                    return db.models.User.create(user)
                }).then(() => {
                    return db.models.User.create(anotherUser)
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
                    return client.post('users/login')
                        .type('json')
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .send(anotherUser)
                })
                .then((res) => {
                    anotherToken = res.body.token;
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });


        describe('Verifying private and public behavior', () => {

            let postList = [{
                title: "my new test",
                body: "this is the post body content"
            }, {
                title: "a great post to read",
                body: "this is the post body content",
                status: "private"
            }, {
                title: "my new test",
                body: "this is the post body content"
            }, {
                title: "a great post to read",
                body: "this is the post body content",
                status: "private"
            }];

            beforeEach((done) => {
                let promises = [];

                promises.push(client.post('posts')
                    .type('json')
                    .set('Accept', 'application/json')
                    .query({
                        token: token
                    })
                    .expect('Content-Type', /json/)
                    .send(postList[0])
                    .then((res) => {
                        postList[0].id = res.body.id;
                    })
                );

                promises.push(client.post('posts')
                    .type('json')
                    .set('Accept', 'application/json')
                    .query({
                        token: token
                    })
                    .expect('Content-Type', /json/)
                    .send(postList[1])
                    .then((res) => {
                        postList[1].id = res.body.id;
                    }));

                promises.push(client.post('posts')
                    .type('json')
                    .set('Accept', 'application/json')
                    .query({
                        token: anotherToken
                    })
                    .expect('Content-Type', /json/)
                    .send(postList[2])
                    .then((res) => {
                        postList[2].id = res.body.id;
                    }));


                promises.push(client.post('posts')
                    .type('json')
                    .set('Accept', 'application/json')
                    .query({
                        token: anotherToken
                    })
                    .expect('Content-Type', /json/)
                    .send(postList[3])
                    .then((res) => {
                        postList[3].id = res.body.id;
                    }));

                Promise.all(promises)
                    .then((res) => {
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should be able to see any public post without sending my auth jwt', (done) => {

                // I should be able to se my public post
                client.get('posts/' + postList[0].id)
                    .type('json')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then((res) => {
                        expect(res.statusCode).to.eql(200);
                        expect(res.body.title).to.be.eql(postList[0].title);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should be able to see my public post', (done) => {

                // I should be able to se my public post
                client.get('posts/' + postList[0].id)
                    .type('json')
                    .set('Accept', 'application/json')
                    .query({
                        token: token
                    })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then((res) => {
                        expect(res.statusCode).to.eql(200);
                        expect(res.body.title).to.be.eql(postList[0].title);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should get a private post only if I request it', (done) => {

                client.get('posts/' + postList[1].id)
                    .type('json')
                    .set('Accept', 'application/json')
                    .query({
                        token: token
                    })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then((res) => {
                        expect(res.statusCode).to.eql(200);
                        expect(res.body.title).to.be.eql(postList[1].title);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should be able to see a public post of another user', (done) => {

                client.get('posts/' + postList[2].id)
                    .type('json')
                    .set('Accept', 'application/json')
                    .query({
                        token: token
                    })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then((res) => {
                        expect(res.statusCode).to.eql(200);
                        expect(res.body.title).to.be.eql(postList[2].title);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should not be able to see a private post of another user', (done) => {

                client.get('posts/' + postList[3].id)
                    .type('json')
                    .set('Accept', 'application/json')
                    .query({
                        token: token
                    })
                    .expect('Content-Type', /json/)
                    .expect(404)
                    .then((res) => {
                        expect(res.statusCode).to.eql(404);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });



        });

    });
}