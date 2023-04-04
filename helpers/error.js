// importing libraries
const log = require('../log');
const pool = require('../database');

function ErrorHandler() {
  // error codes
  const badRequest = 4000,
    missingField = 4001,
    duplicate = 4003,
    randomError = 4004,
    invalidCredentials = 4005,
    resourceNotFound = 4006,
    numberNotRegistered = 4007,
    duplicateUser = 4008,
    connectionRequest = 4009,
    duplicatePhone = 4010,
    invalidSync = 4011,
    duplicateEmail = 4012,
    teamFull = 6001,
    alreadyInTeam = 6002,
    alreadyInvited = 6003,
    maximumInvites = 6004,
    maximumRequests = 6005;
  // when request body is missing
  this.badRequest = badRequest;
  // when a mandatory field is missing from the request
  this.missingField = missingField;
  // when the value of an input field is not allowed
  this.invalidField = 4002;
  // when a resource already exists
  this.duplicate = duplicate;
  // when the credentials entered by a user are invalid
  this.invalidCredentials = invalidCredentials;
  // when a particular resource is not found on the server
  this.resourceNotFound = resourceNotFound;
  // when a phone number is not registered and is trying to log in
  this.numberNotRegistered = numberNotRegistered;
  // when user is already registered
  this.duplicateUser = duplicateUser;
  // when user has already place max number of connection requests in a day
  this.connectionRequest = connectionRequest;
  // when phone number exists
  this.duplicatePhone = duplicatePhone;
  // when the sync time for healthkit records is less than the last synced time
  this.invalidSync = invalidSync;
  // when the user adds duplicate email from profile
  this.duplicateEmail = duplicateEmail;
  // when team size if full in a challenge
  this.teamFull = teamFull;
  // when user is already in a team
  this.alreadyInTeam = alreadyInTeam;
  // when user is already invited
  this.alreadyInvited = alreadyInvited;
  // when the leader reaches maximum invites
  this.maximumInvites = maximumInvites;
  // when user reaches maximum requests to join teams
  this.maximumRequests = maximumRequests;
  // error messages
  this.invalidAge = 'You should be 18+ and below 100 to use this application.';
  this.invalidGender = 'The gender should be one of the following - Male, Female or Transgender.';
  this.invalidName = 'Sorry but we do not accept names this long. Please provide a short name.';
  this.invalidPhone =
    'Please enter a valid phone number. We support 10 digit Indian mobile numbers only.';
  this.invalidEmail = 'Please provide a valid email address.';
  this.invalidPassword =
    'Please provide a strong password. The password must at least be 6 characters long.';
  this.invalidOtp = 'The OTP is incorrect. Please retry.';
  this.invalidMagicCode =
    'The code you have entered is incorrect. Please try again with a valid code.';

  function standardResponses(errorCode) {
    switch (errorCode) {
      case missingField:
        return 'Please fill all the mandatory fields.';

      case badRequest:
        return 'Seems like there is some error with your request. Please retry.';

      case duplicate:
        return 'This resource already exits. Please try with some different input.';

      case invalidCredentials:
        return 'You have entered wrong credentials. Please try again with the right ones.';

      case resourceNotFound:
        return 'The requested resource could not be found on the server.';

      case numberNotRegistered:
        return 'This phone number is not registered with us. Please register or try with another registered number.';

      case duplicateUser:
        return 'This phone number and email is already registered with us. Please try again with any other credentials.';

      case connectionRequest:
        return 'You can only place 2 requests in a day. Please try again tomorrow';

      case duplicatePhone:
        return 'This phone number is already associated with another user. Please login with this phone number or continue with another number.';

      case invalidSync:
        return 'Some of the data belongs to a time frame prior to the last sync time';

      case duplicateEmail:
        return 'This e-mail address is already in use. Use a different e-mail or contact support.';

      case teamFull:
        return 'This team is full';

      case alreadyInTeam:
        return 'User is already in a team';

      case alreadyInvited:
        return 'You have already invited this user';

      case maximumInvites:
        return 'You have reached the maximum number of invites';

      case maximumRequests:
        return 'You have reached the maximum number of requests';

      default:
        return 'Request could not be processed by the server. Please retry.';
    }
  }
  this.standardER = (errorCode) => {
    // log.error(errorCode);
    return {
      status: 400,
      message: 'serverError',
      errorMessage: standardResponses(errorCode),
      errorCode,
    };
  };

  this.outOfBound = (value1, value2, type) => {
    // log.error({ value1, value2, type }, 'Value not in range');
    // defining error message
    const err = `The ${type} value should be between ${value1} and ${value2}`;
    return {
      status: 400,
      message: 'serverError',
      errorMessage: err,
      errorCode: 1001,
    };
  };

  this.customER = (errorMessage, errorCode) => {
    // log.error(errorCode, errorMessage);
    return {
      status: 400,
      message: 'serverError',
      errorMessage,
      errorCode,
    };
  };

  this.randomError = (debugMessage) => {
    // log.error('Random Error', debugMessage);
    return {
      status: 400,
      message: 'serverError',
      errorMessage: 'Request could not be processed by the server. Please retry.',
      errorCode: randomError,
      debugMessage,
    };
  };

  this.invalidClose = (debugMessage) => {
    return {
      message: 'serverError',
      errorMessage: 'Consultation cannot be closed without prescription or diet plan.',
      debugMessage,
    };
  };

  this.logErrorEvents = (subject, body) => {
    // log.error({ subject, body }, 'Error');
    const logError = 'INSERT INTO `error_events`(`subject`, `body`) VALUES (?,?)';
    return pool.query(logError, [subject, body]);
  };
}

module.exports = new ErrorHandler();
