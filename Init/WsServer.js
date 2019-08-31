const WebSocketServer  = require("ws").Server;

class WsServer {

  constructor() {
    this.port = process.env.WEBSOCKETSERVER_PORT;
    this.wss = new WebSocketServer({port: this.port})
    this.Clients = {};
  }

  getToken() {
    var d = new Date().getTime();
    var token = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  
    return token;
  }

  brodcast(msg) {
    for (var i in this.Clients) {
      this.Clients[i].send(msg);
    }
  }

  async start() {
    return new Promise(resolve => {
      this.wss.on('listening', () => {
        console.info(`[WEB SOCKET SERVER] ${this.port}`);
        resolve();
      })

      this.wss.on('connection', (ws) => {
        const clientCount = Object.keys(this.Clients).length;
        const token = this.getToken();
        this.Clients[token] = ws;

        if (clientCount === 4) {
          console.log('clientCount', clientCount);
          this.Clients[token].send(`Sorry! Table is Full`)
          ws.close();
        } else {
          console.log('token', token, 'Client Count', Object.keys(this.Clients));
          this.brodcast(`We Wait ${4 - Object.keys(this.Clients).length} Person `);
        }

        ws.on('close', () => {
          delete this.Clients[token];
          console.log('Client Gonee', Object.keys(this.Clients));
        })
      })

      this.wss.on("close", () => {
        console.error("DISCONNECTED!");
      });
    })
  }
  
}

module.exports = WsServer;
