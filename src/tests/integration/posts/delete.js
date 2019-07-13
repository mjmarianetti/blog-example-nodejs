'use strict';

const request = require('supertest'),
    endpoint = 'http://localhost:3000/',
    client = request(endpoint),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect;

chai.use(chaiAsPromised);

describe('DELETE /posts', () => {


    const post = {
        title: "my new test",
        body: "this is the post body content"
    };

    it('should delete a post', (done) => {

        client.post('posts')
            .type('json')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send(post)
            .expect(200)
            .then((res) => {
                return client.delete('posts/' + res.body.id);
            })
            .then((res) => {
                expect(res.statusCode).to.eql(200);
                expect(res.body.message).to.not.be.undefined;
                done();
            })
            .catch((err) => {
                done(err);
            })
    });

    //idempotence test
    it('should try to delete a post that does not exists', (done) => {

        let postId;
        client.post('posts')
            .type('json')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send(post)
            .expect(200)
            .then((res) => {
                postId = res.body.id;
                return client.delete('posts/' + postId);
            })
            .then((res) => {
                expect(res.statusCode).to.eql(200);
                expect(res.body.message).to.not.be.undefined;
                return client.delete('posts/' + postId);
            })
            .then((res) => {
                expect(res.statusCode).to.eql(200);
                expect(res.body.message).to.not.be.undefined;
                done();
            })
            .catch((err) => {
                done(err);
            })
    });


});