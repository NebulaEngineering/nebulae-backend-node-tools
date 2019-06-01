'use strict'

// TEST LIBS
const assert = require('assert');
const should = require('chai').should();
const expect = require('chai').expect;
const { of, empty } = require('rxjs');
const { concatAll, mergeMap, catchError, take, toArray, first } = require('rxjs/operators');

//LIBS FOR TESTING
const { CustomError, PERMISSION_DENIED, INTERNAL_SERVER_ERROR_CODE } = require('../../lib/error');
const { CqrsResponseHelper } = require('../../lib/cqrs');

describe('CQRS', function () {
  describe('CqrsResponseHelper', function () {

    it('buildSuccessResponse$', function (done) {
      const rawRespponse = { a: 1, b: 2, c: 3 };
      CqrsResponseHelper.buildSuccessResponse$(rawRespponse).pipe(
        first()
      ).subscribe(
        (response) => {
          expect(response.data).to.be.deep.equal(rawRespponse);
          expect(response.result.code).to.be.equal(200);
        },
        (error) => { return done(error); },
        () => { return done(); }
      );
    });

    it('buildErrorResponse$', function (done) {
      const errCode = PERMISSION_DENIED;
      const rawRespponse = { a: 1, b: 2, c: 3 };
      CqrsResponseHelper.buildErrorResponse$(PERMISSION_DENIED, rawRespponse).pipe(
        first()
      ).subscribe(
        (response) => {
          expect(response.data).to.be.deep.equal(rawRespponse);
          expect(response.result.code).to.be.equal(PERMISSION_DENIED);
        },
        (error) => { return done(error); },
        () => { return done(); }
      );
    });


    it('handleError$', function (done) {
      const errCode = PERMISSION_DENIED;
      const rawRespponse = { a: 1, b: 2, c: 3 };
      of('').pipe(
        first(x => x.x),
        catchError(err => CqrsResponseHelper.handleError$(err))
      ).subscribe(
        (response) => {
          expect(response.data).to.be.null;
          expect(response.result.code).to.be.equal(INTERNAL_SERVER_ERROR_CODE);
        },
        (error) => { return done(error); },
        () => { return done(); }
      );
    });



  });
});
