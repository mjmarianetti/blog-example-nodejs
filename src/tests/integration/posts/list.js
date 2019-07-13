'use strict';

const request = require('supertest'),
    endpoint = 'http://localhost:3000/',
    client = request(endpoint),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect;

chai.use(chaiAsPromised);

describe('GET /posts', () => {

    it('should get an empty list of posts', (done) => {
        client.get('posts')
            .type('json')
            .set('Accept', 'application/json')
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
        client.get('posts')
            .type('json')
            .set('Accept', 'application/json')
            .query({
                limit: 1
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(
                (res) => {
                    expect(res.statusCode).to.eql(200);
                }
            )
            .end(done);
    });



    it('should get a list of posts', (done) => {

        const post = {
            title: "my new test",
            body: "this is the post body content"
        };

        let promises = [];

        promises.push(client.post('posts')
            .type('json')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send(post));


        promises.push(client.post('posts')
            .type('json')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send(post));


        promises.push(client.post('posts')
            .type('json')
            .set('Accept', 'application/json')
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
                expect(res.body.data).to.be.eql([post, post]);
                done();
            })
            .catch((err) => {
                done(err);
            })
    });

});