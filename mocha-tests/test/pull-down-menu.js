WEB_SERVER_PORT = 9892;

//use zombie.js as headless browser
var Browser = require('zombie');
var assert = require('assert');
var app = null
describe( 
  'Pull-Down-Menu Demo example page', 
  function() {
  
    before( 
        function() {
          app = require('../../examples/pull-down-menu');
          //this.server = http.createServer(app).listen(3000);
          // initialize the browser using the same port as the test application
          this.browser = new Browser({ site: 'http://localhost:'+WEB_SERVER_PORT+'/' });
        } 
    );
    
    // load the contact page
    before(
        function( done ) {
          this.browser.visit( '/', done);
        }
    );
    
    it( 'should show the header and footer', 
      function() {
          this.browser.assert.success();
          this.browser.assert.text( 'h1', 'Pull-Down-Menu Demo' );
          this.browser.assert.element( 'div.copyright-div' );
        }
    );  
    
  }
);