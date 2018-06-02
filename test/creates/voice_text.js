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
        shrdKey: process.env.SHRD_KEY,
        userN: process.env.USER_N
      },

      inputData: {
        // TODO: Pulled from input fields' default values. Edit if necessary.
        From: "Zapier test",
        Language: "en-US;Male;1",
        Text: "Test",
        To: [process.env.TEST_PHONE_NUMBER],
        ValidityTime: '48h0m'
      }
    };

    appTester(App.creates['VoiceText'].operation.perform, bundle)
      .then(result => {
        result.should.not.be.an.Array();
        done();
      })
      .catch(done);
  });
});
