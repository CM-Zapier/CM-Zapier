require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Creates - Send Text (SMS/Push) Message', () => {
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
        messageContent: null,
        messageType: 'SMS Only',
        reference: 'None',
        to: null,
        validityTime: '48h0m'
      }
    };

    appTester(App.creates['textMessage'].operation.perform, bundle)
      .then(result => {
        result.should.not.be.an.Array();
        done();
      })
      .catch(done);
  });
});
