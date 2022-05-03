const server = require('./server');
const http = require('http');
const { Server } = require('socket.io');
const httpServer = http.createServer(server);

const io = new Server(httpServer, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});

module.exports = {
	server: httpServer,
	io: () => {
		io.on('connection', socket => {
			console.log('User conect: ', socket.id);
		});
	}
};
