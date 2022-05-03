const database = require('./src/db');
const { server, io } = require('./src/socket');
const { PORT } = process.env;

//Conectamos la DB
database.sync({ force: false }).then(() => {
	//Encendemos Socket
	io();
	//Encendemos el servidor
	server.listen(PORT, () => console.log(`Server listen at port ${PORT}`));
});
