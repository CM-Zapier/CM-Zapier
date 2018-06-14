require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

const action = require("../../creates/voice_message")

describe('Creates - Send Voice (Text to Speech) Message', () => {
  zapier.tools.env.inject();

  it('should create an object', done => {
    const bundle = {
      authData: {
        productToken: process.env.PRODUCT_TOKEN
      },

      inputData: {
        from: "",
        to: [""],
        messageContent: "",
        language: "English (Great Britain)",
        gender: 'Female',
        voiceNumber: '1'
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
