const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);
const app = App.creates["messages"].Messages


describe('Creates - Send SMS', () => {
  zapier.tools.env.inject();

  it('should create an object', done => {
    const bundle = {
      authData: {
        productToken_text: process.env.PRODUCT_TOKEN_TEXT,
        productToken_voice: process.env.PRODUCT_TOKEN_VOICE,
        shrdKey: process.env.SHRD_KEY,
        userN: process.env.USER_N
      },

      inputData: {
      // TODO: Pulled from input fields' default values. Edit if necessary.
        Body: null,
        From: null,
        Reference: 'None',
        To: null
      }
    };

    // appTester(App.creates['messages'].operation.perform, bundle)
    // appTester(App.creates..operation.perform)
    appTester(app)
      .then(result => {
        result.should.not.be.an.Array();
        
        done();
      })
      .catch(done);
  });
console.log(App.creates["messages"])
});




