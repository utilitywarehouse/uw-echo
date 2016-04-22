var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();

var fetch = require('node-fetch');
var server = require('./../src/server');

var address = 'http://0.0.0.0:8888/';

function fetchAndParse(url, options) {
  return fetch(url, options).then(function(res) { return res.json();});
}

describe('echo server', function() {

  before(function() {
    //let's start the app on a test port
    this.app = server.start(8888);
  })

  after(function() {
    this.app.close();
  })

  it('it responds', function() {
    return fetch(address).should.be.fulfilled
  });

  it('it responds to all unknown paths', function() {
    return fetch(address+ 'obviously-not-existing').should.eventually.have.property('status', 200);
  });

  it('it responds with json body', function() {
    return fetchAndParse(address).should.eventually.be.an('object')
  })

  it('it sets content type header to json', function() {
    return fetch(address).should.eventually.satisfy(function(res) {
      return /application\/json/.test(res.headers.get('content-type'))
    });
  })

  it('it returns query string', function() {
    return fetchAndParse(address+ '?a=b').should.eventually.have.deep.property('query.a', 'b');
  })

  it('it parses and returns valid sent json', function() {
    return fetchAndParse(
      address,
      {method: 'POST', body: JSON.stringify({a: 'b'}), headers: {'content-type': 'application/json'}}
    ).should.eventually.have.deep.property('body.a', 'b');
  })

  it('it parses and returns valid urlencoded body', function() {
    return fetchAndParse(
      address,
      {method: 'POST', body: 'a=b', headers: {'content-type': 'application/x-www-form-urlencoded'}}
    ).should.eventually.have.deep.property('body.a', 'b');
  })

  it('it parses and returns nested array in urlencoded body', function() {
    return fetchAndParse(
      address,
      {method: 'POST', body: 'a[c]=b&a[d]=f', headers: {'content-type': 'application/x-www-form-urlencoded'}}
    ).should.eventually.have.deep.property('body.a.c', 'b');
  });

  it('it returns 400 when supplied json is invalid', function() {
    return fetch(
      address,
      {method: 'POST', body: 'xxxx', headers: {'content-type': 'application/json'}}
    ).should.eventually.have.property('status', 400);

  });

});




