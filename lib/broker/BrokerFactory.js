'use strict'

const {ConsoleLogger} = require('../log');
 
//multiton instances
let instance = {};

class BrokerFactory {
    /**
     * Factory instance and config
     */
    constructor(brokerType = process.env.BROKER_TYPE) {
        switch (brokerType) {
            case 'PUBSUB':
                const PubSubBroker = require('./PubSubBroker');
                this.broker = new PubSubBroker({
                    replyTimeout: process.env.REPLY_TIMEOUT || 2000
                });
                break;
            case 'MQTT':
                const MqttBroker = require('./MqttBroker');
                this.broker = new MqttBroker({
                    mqttServerUrl: process.env.MQTT_SERVER_URL,
                    replyTimeout: process.env.REPLY_TIMEOUT || 2000
                });
                break;
        }
    }
    /**
     * Get the broker instance
     */
    getBroker() {
        return broker
    }
}

module.exports = (brokerType) => {
    if (!instance[brokerType]) {
        instance[brokerType] = new BrokerFactory(brokerType);
        ConsoleLogger.i(`@nebulae/backend-node-tools::BrokerFactory(${brokerType}) multiton instance created `);
    }
    return instance[brokerType].broker;
};