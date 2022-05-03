const { DataTypes } = require('sequelize');

module.exports = sequelize => {
	sequelize.define('Review', {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		points: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false
		}
	});
};
