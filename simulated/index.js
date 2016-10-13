'use strict';

var clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
var Message = require('azure-iot-device').Message;

var deviceID = "Store100Position1";

var connectionString = 'HostName=IoTHackathon.azure-devices.net;DeviceId=' + deviceID + ';SharedAccessKey=ayGOXtRnbvyhjYg1kn+UDMSQ4zzwcHJpEd0kcfJyerI=';

var client = clientFromConnectionString(connectionString);

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

var addresses = [
  "00:0C:29:9C:B3:33",
  "00:1B:63:84:45:E6",
  "E8:11:32:4E:07:DB"];

function randomAddress() {
  return addresses[Math.floor(Math.random()*addresses.length)];
}

var connectCallback = function (err) {
  if (err) {
    console.log('Could not connect: ' + err);
  } else {
    console.log('Client connected');

    // Create a message and send it to the IoT Hub every second
    setInterval(function(){
      var address = randomAddress();
      var date = new Date().toJSON();
      var data = JSON.stringify({ deviceId: deviceID, address: address, date: date });
      var message = new Message(data);
      console.log("Sending message: " + message.getData());
      client.sendEvent(message, printResultFor('send'));
    }, 1000);
  }
};

client.open(connectCallback);
