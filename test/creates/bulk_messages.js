require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Creates - Send Bulk SMS', () => {
  zapier.tools.env.inject();

  it('should create an object', done => {
    const bundle = {
      authData: {
        // TODO: Put your custom auth data here
      },

      inputData: {
        // TODO: Pulled from input fields' default values. Edit if necessary.
        BulkBody: null,
        BulkFrom: null,
        BulkProductToken: null,
        BulkReference: 'None',
        BulkTo: null
      }
    };

    appTester(App.creates['BulkMessages'].operation.perform, bundle)
      .then(result => {
        result.should.not.be.an.Array();
        done();
      })
      .catch(done);
  });
});
