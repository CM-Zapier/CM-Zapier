require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Searches - Number Verifier', () => {
  zapier.tools.env.inject();

  it('should get an object', done => {
    const bundle = {
      authData: {
        productToken: process.env.PRODUCT_TOKEN,
        sharedKey: process.env.SHARED_KEY,
        userName: process.env.USER_NAME
      },

      inputData: {
        // TODO: Pulled from input fields' default values. Edit if necessary.
        phoneNumber: null,
        type: 'Validate'
      }
    };

    appTester(App.searches['numberVerifier'].operation.perform, bundle)
      .then(results => {
        results.should.be.an.Array();
        results.length.should.be.aboveOrEqual(1);
        results[0].should.have.property('id');
        done();
      })
      .catch(done);
  });
});
