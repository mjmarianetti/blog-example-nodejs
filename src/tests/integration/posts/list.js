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

    describe('GET /posts', () => {


        beforeEach((done) => {
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


        it('should get an empty list of posts', (done) => {
            client.get('posts')
                .type('json')
                .set('Accept', 'application/json')
                .query({
                    token: token
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(
                    (res) => {
                        expect(res.statusCode).to.eql(200);
                        expect(res.body.total).to.be.eql(0);
                        expect(res.body.totalPages).to.be.eql(0);
                        expect(res.body.data).to.be.eql([]);
                    }
                )
                .end(done);
        });

        it('should get a list of posts with limit param', (done) => {

            const post = {
                title: "my new test",
                body: "this is the post body content"
            };

            let promises = [];

            promises.push(client.post('posts')
                .type('json')
                .set('Accept', 'application/json')
                .query({
                    token: token
                })
                .expect('Content-Type', /json/)
                .send(post));


            promises.push(client.post('posts')
                .type('json')
                .set('Accept', 'application/json')
                .query({
                    token: token
                })
                .expect('Content-Type', /json/)
                .send(post));



            promises.push(client.post('posts')
                .type('json')
                .set('Accept', 'application/json')
                .query({
                    token: token
                })
                .expect('Content-Type', /json/)
                .send(post));

            Promise.all(promises)
                .then(() => {
                    return client.get('posts')
                        .type('json')
                        .set('Accept', 'application/json')
                        .query({
                            limit: 1
                        })
                        .expect('Content-Type', /json/)
                        .expect(200);
                })
                .then((res) => {
                    expect(res.statusCode).to.eql(200);
                    expect(res.body.total).to.be.eql(3);
                    expect(res.body.totalPages).to.be.eql(3);
                    expect(res.body.data.length).to.be.eql(1);
                    done();
                })
                .catch((err) => {
                    done(err);
                })
        });

        it('should get a filtered list of posts', (done) => {

            const post = {
                title: "my new test",
                body: "this is the post body content"
            };

            const postToSearch = {
                title: "a great post to read",
                body: "this is the post body content"
            };

            let promises = [];

            promises.push(client.post('posts')
                .type('json')
                .set('Accept', 'application/json')
                .query({
                    token: token
                })
                .expect('Content-Type', /json/)
                .send(post));


            promises.push(client.post('posts')
                .type('json')
                .set('Accept', 'application/json')
                .query({
                    token: token
                })
                .expect('Content-Type', /json/)
                .send(post));



            promises.push(client.post('posts')
                .type('json')
                .set('Accept', 'application/json')
                .query({
                    token: token
                })
                .expect('Content-Type', /json/)
                .send(postToSearch));

            Promise.all(promises)
                .then(() => {
                    return client.get('posts')
                        .type('json')
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .query({
                            search: 'read'
                        })
                        .expect(200);
                })
                .then((res) => {
                    expect(res.statusCode).to.eql(200);
                    expect(res.body.total).to.be.eql(1);
                    expect(res.body.totalPages).to.be.eql(1);
                    expect(res.body.data[0].title).to.be.eql(postToSearch.title);
                    done();
                })
        });

        it('should get a list of posts with author data', (done) => {

            const post = {
                title: "my new test",
                body: "this is the post body content"
            };

            let promises = [];

            promises.push(client.post('posts')
                .type('json')
                .set('Accept', 'application/json')
                .query({
                    token: token
                })
                .expect('Content-Type', /json/)
                .send(post));


            promises.push(client.post('posts')
                .type('json')
                .set('Accept', 'application/json')
                .query({
                    token: token
                })
                .expect('Content-Type', /json/)
                .send(post));



            promises.push(client.post('posts')
                .type('json')
                .set('Accept', 'application/json')
                .query({
                    token: token
                })
                .expect('Content-Type', /json/)
                .send(post));

            Promise.all(promises)
                .then(() => {
                    return client.get('posts')
                        .type('json')
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200);
                })
                .then((res) => {
                    expect(res.statusCode).to.eql(200);
                    expect(res.body.total).to.be.eql(3);
                    expect(res.body.totalPages).to.be.eql(1);
                    expect(res.body.data[0].author.email).to.be.eql(user.email);
                    done();
                })
                .catch((err) => {
                    done(err);
                })
        });

    });
}