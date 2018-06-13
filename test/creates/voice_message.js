require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Creates - Send Voice (Text to Speech) Message', () => {
  zapier.tools.env.inject();

  it('should create an object', done => {
    const bundle = {
      authData: {
        productToken: process.env.PRODUCT_TOKEN,
        sharedKey: process.env.SHARED_KEY,
        userName: process.env.USER_NAME
      },

      inputData: {
        // TODO: Pulled from input fields' default values. Edit if necessary.
        from: null,
        gender: 'Female',
        language: null,
        messageContent: null,
        to: null,
        voiceNumber: '1'
      }
    };

    appTester(App.creates['voiceMessage'].operation.perform, bundle)
      .then(result => {
        result.should.not.be.an.Array();
        done();
      })
      .catch(done);
  });
});
