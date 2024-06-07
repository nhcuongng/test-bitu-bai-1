var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
var mqttHandler = require('./mqtt_handler');
var UniqId = require('./uniqId');
var { generateString, sumFibonacci } = require('./utils');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// connect to mqtt
var mqttClient = new mqttHandler();
mqttClient.connect();

const BOT_ID = 'BOT'
const queue = [];

// listing messages
app.get('/messages', function(req, res) {
  res.status(200).send({
    message: queue
  });
})

// generate user id
app.get('/user', function(req, res) {
  res.status(200).send({
    message: new UniqId()
  });
})

// send message by http method
app.post("/send-message", function(req, res) {
  // author broadcast to all other users
  const msgByUserId = Date.now() + generateString(5);
  mqttClient.sendMessage(`${req.body.message.userId}:${req.body.message.content}:${msgByUserId}`);
  queue.push({ userId: req.body.message.userId, content: req.body.message.content, msgId: msgByUserId  });

  const numberReceived = Number(req.body.message.content);
  const results = !isNaN(numberReceived) ? sumFibonacci(Number(req.body.message.content)) : 'Invalid number';
  
  // bot broadcast to all users
  const msgByBotId = Date.now() + generateString(5);
  mqttClient.sendMessage(`${BOT_ID}:${results}:${msgByBotId}`);
  queue.push({ userId: BOT_ID, content: req.body.message.content, msgId: msgByBotId });

  res.status(200).send({
    message: 'success'
  });
});

var server = app.listen(3000, function () {
  console.log("app running on port.", server.address().port);
});