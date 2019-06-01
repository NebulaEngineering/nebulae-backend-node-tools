'use strict'

const { CustomError } = require("../error");
const { mergeMap, map, reduce } = require('rxjs/operators');
const { of, throwError, from, Observable } = require('rxjs');

/**
 * Role validator
 */
class RoleValidator {

  /**
  * Checks if the user has the role needed, otherwise throws an error according to the passed parameters.
  *
  * @param {...[string]} UserRoles Roles of the authenticated user
  * @param {string} name Context name
  * @param {string} method method name
  * @param {error} error  This is the error that will be thrown if the user do not have the required roles
  * @param {[string]} requiredRoles Array with required roles (The authenticated user must have at least one of the required roles,
  *  otherwise the operation that the user is trying to do will be rejected.
  * @returns {Observable} observable of validated roles if succed or custom error if verification failed
  */
  static verifyRoles$(
    userRoles,
    method,
    error,
    requiredRoles
  ) {
    return from(requiredRoles)
      .pipe(
        map(requiredRole => {
          const role = { name: requiredRole, value: false };
          if (
            userRoles == undefined ||
            userRoles.length == 0 ||
            !userRoles.includes(requiredRole)
          ) {
            role.value = false;
          } else {
            role.value = true;
          }
          return role;
        }),
        reduce((acc, val) => {
          acc[val.name] = val.value;
          return acc;
        }, {}),
        mergeMap(validRoles => {
          if (!Object.values(validRoles).includes(true)) {
            return throwError(
              new CustomError(error.name, method, error.code, error.description)
            );
          } else {
            return of(validRoles);
          }
        })
      );
  }

  /**
   * Returns true if the user has at least one of the required roles
   * @param {[string]} userRoles Roles of the user
   * @param {[string]} requiredRoles Required roles
   * @returns {boolean} true if the user has the needed roles
   */
  static hasRoles(
    userRoles,
    requiredRoles
  ) {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    if (!userRoles) {
      return false;
    }
    return userRoles.filter(userRole => requiredRoles.includes(userRole)).length > 0;
  }

};

module.exports = RoleValidator;