const WebSocketServer  = require("ws").Server;
const wss;
const PASS_PORT = 6100;
const Clients = {};

const init = () => {
  wss = new WebSocketServer({port: PASS_PORT});

  wss.on("connection", function (ws) {
    var token = getToken();

    Clients[token] = ws;
    ws.on("close", function () {
      delete Clients[token];
    });
  });

  wss.on("close", function () {
    console.error("DISCONNECTED!");
  });

  wss.on("listening", function () {
    console.info("PASS WS\t" + "[" + PASS_PORT + "]");
  });
}

const broadcast = async (data)  => {
  for (const i in Clients) {
    Clients[i].send(JSON.stringify(data));
  }
}

const getToken = () => {
  let d = new Date().getTime();
  const token = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  .replace(/[xy]/g, (c) => {
    const r =  (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);

    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });

  return token;
}

module.exports = WebSocket;
