const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

async function authenticate(userPoolId, clientId, username, password) {
    // if (!context.data.password || !context.data.email) {
    //   throw new Error('Missing username or password');
    // }

    const poolData = {    
      UserPoolId : userPoolId, // Your user pool id here    
      ClientId : clientId // Your client id here
    }; 


    const pool_region = userPoolId.split('_')[0];

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: username,
      Password: password,
    });

    var userData = {
      Username: username,
      Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    const loginResult = await new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          // console.log('access token + ' + result.getAccessToken().getJwtToken());
          // console.log('id token + ' + result.getIdToken().getJwtToken());
          // console.log('refresh token + ' + result.getRefreshToken().getToken());
          resolve({ 
            access: result.getAccessToken().getJwtToken(),
            id: result.getIdToken().getJwtToken(),
            refresh: result.getRefreshToken().getToken()
          });
        },
        onFailure: function (err) {
          console.log(err);

          reject(err);
        },
      });
    });

    return loginResult;
}



module.exports = authenticate;