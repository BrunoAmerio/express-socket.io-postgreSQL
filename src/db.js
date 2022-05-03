require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DATABASE_URL } = process.env;

const sequelize = new Sequelize(DATABASE_URL, { logging: false });

const basename = path.basename(__filename);

const modelDefiners = [];

//Inyectamos todos los modelos de la carpeta models
fs.readdirSync(path.join(__dirname, '/models'))
	.filter(
		file =>
			file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
	)
	.forEach(file => {
		modelDefiners.push(require(path.join(__dirname, '/models', file)));
	});

modelDefiners.forEach(model => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map(entry => [
	entry[0][0].toUpperCase() + entry[0].slice(1),
	entry[1]
]);
sequelize.models = Object.fromEntries(capsEntries);
console.log(sequelize.models);

//RELACIONES
const { Product, Review, Transaction, User } = sequelize.models;

//Un usuario tiene muchos productos
User.hasMany(Product);
Product.belongsTo(User);

//Un usuario tiene muchas transacciones
User.hasMany(Transaction);
Transaction.belongsTo(User);

//Un producto tiene muchas review
Product.hasMany(Review);
Review.belongsTo(Product);

module.exports = sequelize;
