const WebSocketServer  = require("ws").Server;
const Helpers = require('../Helpers/Utils');

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

  gameStart() {
    this.brodcast(`Game is Starting`)

    const firstPersonToken = Object.keys(this.Clients)[0];

    for (var i in this.Clients) {
      if (i === firstPersonToken ) {
        this.Clients[i].send(JSON.stringify({
          isTurn: true,
          tiles: this.selectTiles(15)
        }));
      } else {
        this.Clients[i].send(JSON.stringify({
          isTurn: false,
          tiles: this.selectTiles(14)
        }));
      }
    }
  }

  selectTiles(tileCount) {
    const tiles = [];
    const allTiles = Helpers.getAllTiles()
    for(let i = 0; i < tileCount; i++){
      let tile = allTiles[Math.floor(Math.random() * allTiles.length)];
      let order = allTiles.indexOf(tile);
      allTiles.splice(order, 1);
			tiles.push(tile);
    }
    return tiles;
  }

  async start() {
    return new Promise(resolve => {
      this.wss.on('listening', () => {
        console.info(`[WEB SOCKET SERVER] ${this.port}`);
        resolve();
      })

      this.wss.on('connection', (ws) => {
                
        const token = this.getToken();
        this.Clients[token] = ws;
        const clientCount = Object.keys(this.Clients).length;
        console.log('init client Count', clientCount);

        if (clientCount < 4) {
          console.log('token', token, 'Client Count', Object.keys(this.Clients));
          this.brodcast(`We Wait ${4 - Object.keys(this.Clients).length} Person `);

        } else if (clientCount === 4) {

         console.log('token', token, 'Client Count', Object.keys(this.Clients));
         this.brodcast(`Game is starting! We have  ${Object.keys(this.Clients).length} Person `);
         this.gameStart();
        } else if (clientCount > 4) {
          console.log('clientCount', clientCount);
          this.Clients[token].send(`Sorry! Table is Full`)
          ws.close();
        } else {
          console.log('another case', clientCount);
          this.Clients[token].send(`Sorry! Table is Full`)
          ws.close();
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
