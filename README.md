# AWS User Pool Login Tool

This tool allows for users to login to an AWS Cognito User Pool and displays the access tokens returned, allowing me to use those tokens when developing using API tools like Insomnia or Postman

![App Screenshot](https://github.com/tkottke90/login-helper-aws-cognito/blob/master/docs/images/app-screenshot.png?raw=true)

## Installation

Both Windows and Mac require certificates to sign and build applications for their platforms.  Dont have money I want to burn on that so, sorry.

To install this package, download the repository and then run:

```
npm run build
```

This will generate a new package.  You can then access the application by find the applicaiton called `aws-login`

## AWS Cognito Configuration

To use this tool with AWS you will need take the following steps:

1. Create an AWS Cognito User Pool
2. Create a App Client within that user pool
2a. Ensure that your client does __not__ have a secret as secrets do not work with the Javsscript SDK