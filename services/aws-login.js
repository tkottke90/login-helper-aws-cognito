const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

const poolData = {    
  UserPoolId : "us-west-2_xfao2bjyS", // Your user pool id here    
  ClientId : "5nj3ae6in513dhph30hbj0dbjj" // Your client id here
}; 
const pool_region = 'us-east-2';

async function authenticate(userPoolId, username, password) {
    // if (!context.data.password || !context.data.email) {
    //   throw new Error('Missing username or password');
    // }

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: 'tkottke@witsmd.com',
      Password: '12345Ab!',
    });

    var userData = {
      Username: 'tkottke@witsmd.com',
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