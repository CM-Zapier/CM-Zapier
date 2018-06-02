const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

const MessagesCreate = require('../../creates/messages');
const app = App.creates[MessagesCreate.key].Messages;

describe('Creates - Send SMS', () => {
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
        Body: ["Test"],
        From: ["Zapier test"],
        Reference: 'None',
        To: [process.env.TEST_PHONE_NUMBER],
        ValidityTime: '48h0m'
      }
    };

    appTester(app)
      .then(result => {
        result.should.not.be.an.Array();
        done();
      })
      .catch(done);
  });
});
