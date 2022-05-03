const { DataTypes } = require('sequelize');

module.exports = sequelize => {
	sequelize.define('Product', {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		//Al menos debe tener una imagen obligadamente
		images: {
			type: DataTypes.STRING,
			allowNull: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false
		},
		//Esta propiedad la obtenemos mediante un promedio de todos los reviews
		points: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
		discount: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
		disable: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	});
};
