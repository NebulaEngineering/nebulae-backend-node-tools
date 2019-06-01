'use strict'

// TEST LIBS
const assert = require('assert');
const should = require('chai').should();
const expect = require('chai').expect;
const { of } = require('rxjs');
const { map, concatAll, mergeMap, concatMap, take, toArray, reduce } = require('rxjs/operators');

//LIBS FOR TESTING
const { CustomError, PERMISSION_DENIED,INTERNAL_SERVER_ERROR_CODE } = require('../../lib/error');

describe('ERROR', function () {
  describe('CustomError', function () {

    it('default error', function () {
      const InternalServerError = new CustomError('InternalServerError', 'test.mocha');
      expect(InternalServerError.code).to.be.eq(INTERNAL_SERVER_ERROR_CODE);
      expect(InternalServerError.name).to.be.eq('InternalServerError');
      expect(InternalServerError.method).to.be.eq('test.mocha');
      expect(InternalServerError.message).to.be.eq('');
      
    });

    it('permissionDeniedError', function () {
      const permissionDeniedError = new CustomError('PermissionDenied', 'test.mocha',PERMISSION_DENIED,'you shall no pass');
      expect(permissionDeniedError.code).to.be.eq(PERMISSION_DENIED);
      expect(permissionDeniedError.name).to.be.eq('PermissionDenied');
      expect(permissionDeniedError.method).to.be.eq('test.mocha');
      expect(permissionDeniedError.message).to.be.eq('you shall no pass');      
    });

  });
});
