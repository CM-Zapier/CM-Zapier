require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

const action = require("../../creates/text_message")

describe('Creates - Send Text (SMS/Push) Message', () => {
  zapier.tools.env.inject();

  it('should create an object', done => {
    const bundle = {
      authData: {
        productToken: process.env.PRODUCT_TOKEN
      },

      inputData: {
        messageType: 'SMS Only',
        from: ["Test"],
        to: [process.env.PHONE_NUMBER],
        messageContent: ["Dit is een test."],
        reference: ['None'],
        validityTime: ['48h0m']
      }
    };

    appTester(App.creates[action.key].operation.perform, bundle)
      .then(result => {
        result.should.not.be.an.Array();
        done();
      })
      .catch(done);
  });
});