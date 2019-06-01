'use strict'

// TEST LIBS
const assert = require('assert');
const should = require('chai').should();
const expect = require('chai').expect;
const { of } = require('rxjs');
const { map, concatAll, mergeMap, concatMap, take, toArray, reduce } = require('rxjs/operators');

//LIBS FOR TESTING
const { RoleValidator } = require('../../lib/auth');
const { CustomError, PERMISSION_DENIED, } = require('../../lib/error');


const permissionDeniedError = new CustomError('PermissionDenied', 'test.mocha', PERMISSION_DENIED, 'the user does not have the needed roles to execute this task');


describe('AUTH', function () {
  describe('RoleValidator', function () {

    it('verifyRoles$: one ok', function (done) {
      const userRoles = ['OPERATOR', 'PLATFORM-ADMIN', 'BUSINESS-OWNER'];
      const neededRoles = ['PLATFORM-ADMIN', 'SYSADMIN'];

      RoleValidator.verifyRoles$(
        userRoles,
        'one ok',
        permissionDeniedError,
        neededRoles
      ).subscribe(
        (okResponse) => {
          expect(okResponse['PLATFORM-ADMIN']).to.be.true;
          expect(okResponse['SYSADMIN']).to.be.false;
        },
        (error) => { return done(error); },
        () => { return done(); }
      );
    });

    it('verifyRoles$: multiple ok', function (done) {
      const userRoles = ['OPERATOR', 'PLATFORM-ADMIN', 'BUSINESS-OWNER'];
      const neededRoles = ['PLATFORM-ADMIN','SYSADMIN', 'BUSINESS-OWNER'];

      RoleValidator.verifyRoles$(
        userRoles,
        'multiple ok',
        permissionDeniedError,
        neededRoles
      ).subscribe(
        (okResponse) => {
          expect(okResponse['PLATFORM-ADMIN']).to.be.true;
          expect(okResponse['BUSINESS-OWNER']).to.be.true;
          expect(okResponse['SYSADMIN']).to.be.false;
        },
        (error) => { return done(error); },
        () => { return done(); }
      );
    });

    it('verifyRoles$: fail', function (done) {
      const userRoles = ['OPERATOR', 'PLATFORM-ADMIN', 'BUSINESS-OWNER'];
      const neededRoles = ['SYSADMIN'];

      RoleValidator.verifyRoles$(
        userRoles,
        'fail',
        permissionDeniedError,
        neededRoles
      ).subscribe(
        (okResponse) => {
          expect(okResponse['SYSADMIN']).to.be.false;
        },
        (error) => {  
          expect(error.code).to.be.eq(PERMISSION_DENIED);
          return done(); 
        },
        () => { return done(new Error('Test should have failed')); }
      );
    });



    it('hasRoles$: one ok', function (done) {
      const userRoles = ['OPERATOR', 'PLATFORM-ADMIN', 'BUSINESS-OWNER'];
      const neededRoles = ['PLATFORM-ADMIN', 'SYSADMIN'];

      of(RoleValidator.hasRoles(
        userRoles,
        neededRoles
      )).subscribe(
        (okResponse) => {
          expect(okResponse).to.be.true;
        },
        (error) => { return done(error); },
        () => { return done(); }
      );
    });
    it('hasRoles$: one-undefined', function (done) {
      const userRoles = ['OPERATOR', 'PLATFORM-ADMIN', 'BUSINESS-OWNER'];
      const neededRoles = undefined;

      of(RoleValidator.hasRoles(
        userRoles,
        neededRoles
      )).subscribe(
        (okResponse) => {
          expect(okResponse).to.be.true;
        },
        (error) => { return done(error); },
        () => { return done(); }
      );
    });

    it('hasRoles$: multiple ok', function (done) {
      const userRoles = ['OPERATOR', 'PLATFORM-ADMIN', 'BUSINESS-OWNER'];
      const neededRoles = ['PLATFORM-ADMIN','SYSADMIN', 'BUSINESS-OWNER'];

      of(RoleValidator.hasRoles(
        userRoles,
        neededRoles
      )).subscribe(
        (okResponse) => {
          expect(okResponse).to.be.true;
        },
        (error) => { return done(error); },
        () => { return done(); }
      );
    });

    it('hasRoles$: fail', function (done) {
      const userRoles = ['OPERATOR', 'PLATFORM-ADMIN', 'BUSINESS-OWNER'];
      const neededRoles = ['SYSADMIN'];
      of(RoleValidator.hasRoles(
        userRoles,
        neededRoles
      )).subscribe(
        (okResponse) => {
          expect(okResponse).to.be.false;
        },
        (error) => {  
          return done(new Error('shouldnt be an error')); 
        },
        () => { return done(); }
      );
    });

    it('hasRoles$: fail-undefined', function (done) {
      const userRoles = undefined;
      const neededRoles = ['SYSADMIN'];
      of(RoleValidator.hasRoles(
        userRoles,
        neededRoles
      )).subscribe(
        (okResponse) => {
          expect(okResponse).to.be.false;
        },
        (error) => {  
          return done(new Error('shouldnt be an error')); 
        },
        () => { return done(); }
      );
    });


    
  });
});
