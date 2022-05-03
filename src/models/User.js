const { DataTypes } = require('sequelize');

module.exports = sequelize => {
	sequelize.define(
		'User',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false
			},
			profilePicture: {
				type: DataTypes.STRING,
				allowNull: true
			},
			//Aqui va el arreglo de los uuid de los productos favoritos
			favorites: {
				type: DataTypes.TEXT,
				allowNull: true
			},
			//Aqui va el arreglo de los uuid de los productos en el carrito
			shoppingCart: {
				type: DataTypes.TEXT,
				allowNull: true
			},
			isAdmin: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			disable: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
		{
			timestamp: true
		}
	);
};
