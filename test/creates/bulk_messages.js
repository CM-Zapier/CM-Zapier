require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);
// const app = App.creates["bulk_messages"].operation.inputFields
const app = App.creates["bulk_messages"].operation.perform


console.log(app)


describe('Creates - Send Bulk SMS', () => {
  zapier.tools.env.inject();

  it('should create an object', done => {
    const bundle = {
      authData: {
        productKey: process.env.PRODUCT_KEY,
        shrdKey: process.env.SHRD_KEY,
        userN: process.env.USER_N
      },

      inputData: {
        // TODO: Pulled from input fields' default values. Edit if necessary.
        BulkBody: 'Hallo',
        BulkFrom: '0031618213117',
        BulkReference: 'None',
        BulkTo: '0031618213117'
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

// 18 21 31 17