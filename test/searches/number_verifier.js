require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

const search = require("../../searches/number_verifier")

describe('Searches - Number Verifier', () => {
  zapier.tools.env.inject();

  it('should get an object', done => {
    const bundle = {
      authData: {
        productToken: process.env.PRODUCT_TOKEN
      },

      inputData: {
        type: 'Validate',
        phoneNumber: ""
      }
    };

    appTester(App.searches[search.key].operation.perform, bundle)
      .then(results => {
        results.should.be.an.Array();
        results.length.should.be.aboveOrEqual(1);
        results[0].should.have.property('id');
        done();
      })
      .catch(done);
  });
});
