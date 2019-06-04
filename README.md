![NebulaE](docs/images/nebula.png "Nebula Engineering SAS")

#Backend-Node-Tools

Backend-Node-Tools is a client library with several crosscutting tools for developing micro-backends based [NebulaE](https://nebulae.com.co/) Microservices Framework

- [Installation](#installation)
- [Console Logger](#console-logger)
      - [Environment Variables:](#environment-variables)
      - [Example:](#example)
- [Custom Error](#custom-error)
      - [Example:](#example-1)
- [Auth Tools](#auth-tools)
  - [User roles verification](#user-roles-verification)
      - [Example:](#example-2)
  - [User has roles](#user-has-roles)
      - [Example:](#example-3)
- [Broker Factory](#broker-factory)
      - [Environment Variables:](#environment-variables-1)
      - [Example:](#example-4)
- [CQRS tools](#cqrs-tools)
  - [build Success Response](#build-success-response)
  - [handle Error](#handle-error)
      - [Example:](#example-5)


## Installation

```sh
npm install @nebulae/backend-node-tools --save
```

## Console Logger
Tools for standard console logger

##### Environment Variables:
process.env | desc | values | defaults
--- | --- | --- | ---
`LOG_LEVEL` | Log Level Threshold | `DEBUG` `INFO` `WARN` `ERROR` `FATAL` | `WARN`

##### Example:

```js
const { ConsoleLogger } = require('@nebulae/backend-node-tools').log;
const { CustomError } = require('@nebulae/backend-node-tools').error;

ConsoleLogger.d('This is a DEBUG Log');
ConsoleLogger.i('This is an INFO Log');
ConsoleLogger.w('This is a WARN Log', new CustomError('CustomError','Class.Method',1234,'CustomError'));
ConsoleLogger.e('This is an ERROR Log', new CustomError('CustomError','Class.Method',1234,'CustomError'));
ConsoleLogger.f('This is a FATAL Log', new Error('Node Error'));

// log format
// 2019-06-01T03:49:20.907Z [WARN]: This is a WARN Log;  ERROR(1234): CustomError
```


## Custom Error
Node Error extension to includes name, code and method.  This custom error is compatible with CQRS responses.

##### Example:

```js

const { CustomError } = require('@nebulae/backend-node-tools').error;

const myCustomError = new CustomError(
    'ERR_NAME', // Error name
    'SomeClass.SomeMethod', // The Class name and Method where this error had generated
    1234, // Error code
    'Some Message' // Error Message
);
```

## Auth Tools

### User roles verification
Checks if the user has the role needed, otherwise throws an error according to the passed parameters.
returns a RxJS Observable of validated roles if succed or custom error if the verification failed

##### Example:

```js
const { RoleValidator } = require('@nebulae/backend-node-tools').auth;
const { CustomError, PERMISSION_DENIED } =require('@nebulae/backend-node-tools').error;

const userRoles = ['OPERATOR', 'PLATFORM-ADMIN', 'BUSINESS-OWNER'];
const neededRoles = ['PLATFORM-ADMIN', 'SYSADMIN'];
const permissionDeniedError = new CustomError('PermissionDenied', 'test.mocha', PERMISSION_DENIED, 'the user does not have the needed roles to execute this task');

RoleValidator.verifyRoles$(
    userRoles, // current user roles
    'SomeClass.SomeMethod', //current method
    permissionDeniedError, // The Error to throw if validation fails
    neededRoles // needed roles to verify
    ).subscribe(
        (response) => {
            //prints { 'PLATFORM-ADMIN': true, 'SYSADMIN': false }
            console.log(JSON.stringify(response));
        },
);

```
### User has roles
Returns true if the user has at least one of the required roles or false otherwise

##### Example:

```js
const { RoleValidator } = require('@nebulae/backend-node-tools').auth;

const userRoles = ['OPERATOR', 'PLATFORM-ADMIN', 'BUSINESS-OWNER'];
const neededRoles = ['PLATFORM-ADMIN', 'SYSADMIN'];

const hasNeededRoles = RoleValidator.hasRoles(userRoles,neededRoles);
//hasNeededRoles is true

```


## Broker Factory
Creates a MQTT or Google Cloud PubSub Broker based on RxJS with pre-build functions for listening and sending messages

##### Environment Variables:
process.env | desc | values | defaults
--- | --- | --- | ---
`BROKER_TYPE` | Default broker to use | `MQTT` `PUBSUB` | N/A
`GOOGLE_APPLICATION_CREDENTIALS` | gcloud-service-key json file to configure PubSub | gcloud-service-key json file | N/A
`MQTT_SERVER_URL` | mqtt server URL | mqtt://host:port | N/A
`REPLY_TIMEOUT` | send & recieve response timeout millis | milliseconds (number) | 2000

##### Example:

```js
const { brokerFactory } = require('@nebulae/backend-node-tools').broker;

// generates a multiton instance
const broker = brokerFactory('MQTT'); // Valid options: MQTT | PUBSUB

const subscription = broker.getMessageListener$(['TOPIC'], ['messageType']).pipe(
    mergeMap(message => this.processMessage$(message)),
    mergeMap(response => broker.send$('SomeTopic', 'messageType', response))
).subscribe(
    sentId => console.log(sentId),
);

```

## CQRS tools

### build Success Response
Builds an CQRS success response wrapping raw data.
Returns a RxJS Observable stream

### handle Error
gracefully handles an exception on a CQRS request-response stream
Returns a RxJS Observable stream

#####  Example:

```js
const { CqrsResponseHelper } = require('@nebulae/backend-node-tools').cqrs;

const { of } = require('rxjs');
const { mergeMap } = require('rxjs/operators');

of('Some CQRS Requet').pipe(
    mergeMap(request => this.processRequest$(request)),
    mergeMap(rawData => CqrsResponseHelper.buildSuccessResponse$(rawRespponse)), // builds a valid CQRS API response
    catchError(err => CqrsResponseHelper.handleError$(err)) // handles Error and generates a valid CQRS API error response
)
```






