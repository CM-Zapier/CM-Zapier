require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Creates - Send Push Message', () => {
  zapier.tools.env.inject();

  it('should create an object', done => {
    const bundle = {
      authData: {
        // TODO: Put your custom auth data here
      },

      inputData: {
        // TODO: Pulled from input fields' default values. Edit if necessary.
        Body: null,
        From: null,
        ProductToken: null,
        Reference: 'none',
        To: null,
        allowedChannels: null,
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
