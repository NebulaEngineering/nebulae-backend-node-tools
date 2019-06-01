'use strict'

// TEST LIBS
const assert = require('assert');
const should = require('chai').should();
const expect = require('chai').expect;
const { of } = require('rxjs');
const { map, concatAll, mergeMap, concatMap, take, toArray, reduce } = require('rxjs/operators');

//LIBS FOR TESTING
const { brokerFactory } = require('../../lib/broker');

describe('BROKER', function () {
  describe('BrokerFactory', function () {

    it('Invalid broker type', function () {
      const broker = brokerFactory();
      expect(broker).to.be.undefined;
    });

    it('mqtt', function () {
      const broker = brokerFactory('MQTT');
      expect(broker).to.not.be.undefined;
      expect(broker.send$).to.not.be.undefined;
    });

    it('pubsub', function () {
      const broker = brokerFactory('PUBSUB');
      expect(broker).to.not.be.undefined;
      expect(broker.send$).to.not.be.undefined;
    });

    it('multiton test', function () {
      const broker1 = brokerFactory('MQTT');
      const broker2 = brokerFactory('MQTT');
      const broker3 = brokerFactory('PUBSUB');
      expect(broker1).to.not.be.undefined;
      expect(broker1.send$).to.not.be.undefined;
      expect(broker2).to.not.be.undefined;
      expect(broker2.send$).to.not.be.undefined;
      expect(broker3).to.not.be.undefined;
      expect(broker3.send$).to.not.be.undefined;
      expect(broker1 === broker2).to.be.true;
      expect(broker1 === broker3).to.be.false;
    });
    

  });
});
