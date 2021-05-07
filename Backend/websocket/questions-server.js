var WebSocketServer = require('websocket').server;

const QUESTION_PROTOCOL = 'questions-streaming';

const testQuestion = {
  type: 'multiple-choice',
  numAnswers: 3,
  correctAnswer: 3,
  answerTexts: ['GME', 'lockdown', 'shutdown']
};

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

function originIsAllowed(origin) {
  // shh... O_O
  return true;
}

wsServer.on('request', request => {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  const connection = request.accept(QUESTION_PROTOCOL, request.origin);
  console.log((new Date()) + ' Connection accepted.');
  connection.send(JSON.stringify(testQuestion));

  const interval = setInterval(() => {
    if (connection.isAlive === false) return connection.close();
    connection.isAlive = false;
    connection.ping();
  }, 10000);

  connection.on('close', () => clearInterval(interval));
  connection.on('pong', () => {
    connection.isAlive = true;
  });
});

module.exports.wsServer = wsServer;
