require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Creates - Send Push Messages', () => {
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
        To: null,
        appkey: null
      }
    };

    appTester(App.creates['Push_Messages'].operation.perform, bundle)
      .then(result => {
        result.should.not.be.an.Array();
        done();
      })
      .catch(done);
  });
});
