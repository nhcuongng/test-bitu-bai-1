const mqtt = require('mqtt');

class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = 'mqtt://test.mosquitto.org';
  }
  
  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host);

    // Mqtt error calback
    this.mqttClient.on('error', (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      console.log(`mqtt client connected`);
    });

    // mqtt subscriptions
    this.mqttClient.subscribe('mytopic1', {qos: 0});

    this.mqttClient.on('close', () => {
      console.log(`mqtt client disconnected`);
    });
  }

  onMessage() {
    this.mqttClient.on('message', (topic, message) => {
      console.log('aaaaa')
    });
  }

  // Sends a mqtt message to topic: mytopic1
  sendMessage(message) {
    this.mqttClient.publish('mytopic1', message);
  }
}

module.exports = MqttHandler;
