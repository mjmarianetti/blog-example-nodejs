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

    describe('PUT /posts/{id}', () => {

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

        it('should create a new post and update its title', (done) => {

            let updatedTitle = "new updated title";
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

                    res.body.title = updatedTitle;


                    return client.put('posts/' + res.body.id)
                        .type('json')
                        .set('Accept', 'application/json')
                        .query({
                            token: token
                        })
                        .expect('Content-Type', /json/)
                        .send(res.body)
                })
                .then((res) => {
                    expect(res.statusCode).to.eql(200);
                    expect(res.body.title).to.be.eql(updatedTitle);
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });

        it('should create a new post and update its status to private', (done) => {

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
                    expect(res.body.status).to.be.eql('public');

                    res.body.status = 'private';

                    return client.put('posts/' + res.body.id)
                        .type('json')
                        .set('Accept', 'application/json')
                        .query({
                            token: token
                        })
                        .expect('Content-Type', /json/)
                        .send(res.body);
                })
                .then((res) => {
                    expect(res.statusCode).to.eql(200);
                    expect(res.body.status).to.be.eql('private');
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });
    });

}