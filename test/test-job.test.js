
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
let server = require('../src/app');

describe('/GET book', () => {
    it('it should GET all the books', (done) => {
        chai.request(server)
            .get('/book')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
                done();
            });
    });
});