const { DataTypes } = require('sequelize');

module.exports = sequelize => {
	sequelize.define(
		'Transaction',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true
			},
			copyProduct: {
				type: DataTypes.TEXT,
				allowNull: false
			},
			//True para una venta, false para una compra
			itSold: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
		{
			timestamps: true
		}
	);
};
