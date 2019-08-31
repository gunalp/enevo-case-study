require('./config');

const WsServer = require('./Init/WsServer');

class App {
	static async initialize() {
		console.info('[ENEVO CASE NETWORK APP] STARTING');
		const wsServer = new WsServer();
		await wsServer.start();
	}
}
App.initialize()
    .then(() => console.log('[ENEVO CASE NETWORK APP] STARTED'))
    .catch(err => {
			console.error(err);
			process.exit();
		});
