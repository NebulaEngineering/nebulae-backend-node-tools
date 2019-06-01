'use strinct'

const { of } = require('rxjs');
const { map } = require('rxjs/operators');
const { CustomError } = require('../error/CustomError');


/**
 * CQRS Response tools
 */
class CqrsResponseHelper {

    /**
     * Builds an CQRS success response using the input data
     */
    static buildSuccessResponse$(rawRespponse) {
        return of(rawRespponse).pipe(
            map(data => ({
                data,
                result: {
                    code: 200
                }
            }))
        );
    };

    /**
     * Builds an CQRS error response using the input error and data
     */
    static buildErrorResponse$(errCode, rawRespponse) {
        return of(rawRespponse).pipe(
            map(data => ({
                data,
                result: {
                    code: errCode
                }
            }))
        );
    };

    /**
     * gracefully handles an exception on a CQRS request-response stream
     */
    static handleError$(err) {
        return of(err).pipe(
            map(err => {
                err = (err instanceof CustomError) ? err : new CustomError(err.message);
                return {
                    data: null,
                    result: {
                        code: err.code,
                        error: { ...err.getContent() }
                    }
                }
            })
        );
    }
};

module.exports = CqrsResponseHelper;