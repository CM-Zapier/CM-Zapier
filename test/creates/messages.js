require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

const MessagesCreate = require('../../creates/messages');

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
        Body: process.env.TEST_BODY,
        From: process.env.TEST_FROM,
        Reference: 'None',
        To: process.env.TEST_TO
      }
    };

    appTester(App.creates[MessagesCreate.key].operation.perform, bundle)
      .then(result => {
        result.should.not.be.an.Array();
        done();
      })
      .catch(done);
  });
});
