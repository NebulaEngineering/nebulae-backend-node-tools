'use strict'

const DEBUG = 0;
const INFO = 1;
const WARN = 2;
const ERROR = 3;
const FATAL = 4;
const LEVEL_NAMES = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
const CURRENT_LEVEL = process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL) : WARN;

class ConsoleLogger {

    /**
     * outputs DEBUG message to the console
     * @param {string} message 
     */
    static d(message) {
        ConsoleLogger.log(DEBUG, message);
    }

    /**
     * outputs INFO message to the console
     * @param {string} message 
     */
    static i(message) {
        ConsoleLogger.log(INFO, message);
    }

    /**
     * outputs WARN message to the console
     * @param {string} message 
     * @param {Error} err 
     */
    static w(message, err) {
        ConsoleLogger.log(WARN, message, err);
    }

    /**
     * outputs ERROR message to the console
     * @param {string} message 
     * @param {Error} err 
     */
    static e(message, err) {
        ConsoleLogger.log(ERROR, message, err);
    }

    /**
     * outputs FATAL message to the console
     * @param {string} message 
     * @param {Error} err 
     */
    static f(message, err) {
        ConsoleLogger.log(FATAL, message, err);
    }

    /**
     * outputs message to the console
     * @param {string} message 
     */
    static log(level, message, error = undefined) {
        if (level < CURRENT_LEVEL) return;
        ((CURRENT_LEVEL >= WARN) ? console.error : console.log)(`${new Date().toISOString()} [${LEVEL_NAMES[level]}]: ${message}${!error ? '' : `;  ERROR(${error.code || 'N/A'}): ${error.message}\n ${error.stack}`}`);
    }

}

module.exports = ConsoleLogger;