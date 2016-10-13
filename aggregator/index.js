'use strict';

var pmongo = require('promised-mongo');

var EventHubClient = require('azure-event-hubs').Client;
var connectionString = 'HostName=IoTHackathon.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=I9lw6xcoqdIM+7RL9W5/QfNvPN2sDkcPjEnI47Q/Yhg=';

var mongo_url = "mongodb://localhost:27017/aggregator";
var db = pmongo(mongo_url, ['data']);


var printError = function (err) {
  console.log(err.message);
};

var printMessage = function (message) {
  console.log('Message received: ');
  console.log(JSON.stringify(message.body));
  console.log('');
  db.data.insert(message.body);
};

var client = EventHubClient.fromConnectionString(connectionString);
client.open()
    .then(client.getPartitionIds.bind(client))
    .then(function (partitionIds) {
        return partitionIds.map(function (partitionId) {
            return client.createReceiver('$Default', partitionId, { 'startAfterTime' : Date.now()}).then(function(receiver) {
                console.log('Created partition receiver: ' + partitionId)
                receiver.on('errorReceived', printError);
                receiver.on('message', printMessage);
            });
        });
    })
    .catch(printError);
