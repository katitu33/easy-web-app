/*
Auth0 Wrapper for pong-security2 module

The MIT License (MIT)

Copyright (c) 2019 Markus Harms, ma@mh-svr.de

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. 
*/


function mSec_Login( params ) { 
  // https://auth0.com/docs/libraries/auth0js/v9
  var webAuth = new auth0.WebAuth({
    domain   : params.authDomain,
    clientID : params.clientId
  });
  var authParam = {
    responseType : 'token id_token',
    clientID     : params.clientId,
    redirectUri  : params.loginRedirect,
    scope        : 'openid profile email read:all',
    // grant_type:"client_credentials",
    //audience     : params.audience,
    state        : 234564678909890   // TODO
  }
  if ( params.audience ) {
    authParam.audience = params.audience
  }
  // alert( JSON.stringify(authParam) );
  webAuth.authorize( authParam );
}

function mSec_isAuthenticated( params, token, callback ) {
  if ( ! token ) { return callback( null ); }
  // init the Auth0 lib
  var webAuth = new auth0.WebAuth({
    domain   : params.authDomain,
    clientID : params.clientId
  });
  // get user profile
  webAuth.client.userInfo( token, function( err, user ) {
    if ( err ) {
      console.log( err )
      callback( null, err );
    } else {
      callback( user, null )
    }
  });
}

function mSec_getIdTokenfromURL() {
  var idx = window.location.href.indexOf( 'id_token' )
  if (  idx > 0 ) {
    var tokenStr = window.location.href.substring( idx + 9 ) 
    if ( tokenStr.indexOf('&') > 0 ) { 
      tokenStr = tokenStr.substring( 0, tokenStr.indexOf('&') )
    }
    // alert( tokenStr );
    return tokenStr
  } else {
    return false
  }
}

function mSec_getAccessTokenFrmURL() {
  var idx = window.location.href.indexOf( 'access_token' )
  if (  idx > 0 ) {
    var tokenStr = window.location.href.substring( idx + 13 ) 
    if ( tokenStr.indexOf('&') > 0 ) { 
      tokenStr = tokenStr.substring( 0, tokenStr.indexOf('&') )
    }
    return tokenStr
  } else {
    return false
  }
}

function mSec_getUserId( userInfo ) {
  //console.log( userInfo );
  if ( userInfo && userInfo.name ) {
    return userInfo.name;
  } else {
    return '?';
  }
}

function mSec_Logout( params ) { 
  // https://auth0.com/docs/api/authentication#logout
  var loginURL = 'https://'+params.authDomain+'/v2/logout'
    + '?client_id=' + params.clientId
    + '&returnTo=' + params.logoutRedirect
  window.location.href = loginURL
}


function mSec_ChangePassword( params, userEmail ) {
  new Auth0ChangePassword({
    container:         "SecurityChangePasswordDiv",                   // required
//    email:             "{{email | escape}}",                          // DO NOT CHANGE THIS
    email:             userEmail,
    csrf_token:        "{{csrf_token}}",                              // DO NOT CHANGE THIS
    ticket:            "{{ticket}}",                                  // DO NOT CHANGE THIS
    password_policy:   "{{password_policy}}",                         // DO NOT CHANGE THIS
    password_complexity_options: '{{password_complexity_options}}',   // DO NOT CHANGE THIS
    theme: {
      icon: "{{tenant.picture_url | default: '//cdn.auth0.com/styleguide/1.0.0/img/badge.png'}}",
      primaryColor: "{{tenant.colors.primary | default: '#ea5323'}}"
    },
    dict: {
      // passwordPlaceholder: "your new password",
      // passwordConfirmationPlaceholder: "confirm your new password",
      // passwordConfirmationMatchError: "Please ensure the password and the confirmation are the same.",
      // passwordStrength: {
      //   containsAtLeast: "Contain at least %d of the following %d types of characters:",
      //   identicalChars: "No more than %d identical characters in a row (e.g., "%s" not allowed)",
      //   nonEmpty: "Non-empty password required",
      //   numbers: "Numbers (i.e. 0-9)",
      //   lengthAtLeast: "At least %d characters in length",
      //   lowerCase: "Lower case letters (a-z)",
      //   shouldContain: "Should contain:",
      //   specialCharacters: "Special characters (e.g. !@#$%^&*)",
      //   upperCase: "Upper case letters (A-Z)"
      // },
      // successMessage: "Your password has been reset successfully.",
      // configurationError: "An error ocurred. There appears to be a misconfiguration in the form.",
      // networkError: "The server cannot be reached, there is a problem with the network.",
      // timeoutError: "The server cannot be reached, please try again.",
      // serverError: "There was an error processing the password reset.",
      // headerText: "Enter a new password for<br />{email}",
      // title: "Change Password",
      // weakPasswordError: "Password is too weak."
      // passwordHistoryError: "Password has previously been used."
    }
  });

  // close form after 30 sec
  setTimeout( ()=> {
    $( "#SecurityChangePasswordDiv" ).toggle( "blind" ); 
  }, 30000 );
}
