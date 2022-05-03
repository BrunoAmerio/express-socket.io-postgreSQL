const router = require('express').Router();
const sequelize = require('../db');
const { Transaction, User, Product } = sequelize.models;
const { verifyUserToken } = require('../utils/verifyToken');

/*
    Desde el front, nos envíarian el arreglo con los id´s de los productos que tiene en el carrito a la hora de realizar la compra
	junto con el id del usuario que realiza la compra
*/
//GENERAR UNA TRANSACCION
router.post('/create', verifyUserToken, async (req, res) => {
	const { shoppingCart, userId } = req.body;

	try {
		if ((!shoppingCart, !userId))
			throw new Error('The necesary data was not send');

		const user = await User.findOne({
			where: {
				id: userId
			}
		});

		const products = [];
		for (let i = 0; i < shoppingCart.length; i++) {
			//Buscamos todos los productos que nos envian desde el front
			let result = await Product.findOne({
				where: {
					id: shoppingCart[i],
					disable: false
				}
			}).then(res => res.dataValues);
			if (!result)
				throw new Error(`Product not found with id ${shoppingCart[i]}`);

			products.push(result);
		}

		//Transaccion del comprador
		const transactionForUser = await Transaction.create({
			copyProduct: JSON.stringify(products)
		});
		//Relacionamos esa transaccion con el usuario comprador
		user.addTransactions(transactionForUser);

		console.log(products);

		//Ahora le debemos generar una transaccion para cada vendedor de esos productos
		for (let i = 0; i < products.length; i++) {
			let result = await User.findOne({
				where: {
					id: products[i].userId,
					disable: false
				}
			});

			if (!result)
				throw new Error(`User not found with id ${products[i].userId}`);

			const newTransaction = await Transaction.create({
				copyProduct: JSON.stringify(products[i]),
				itSold: true
			});

			result.addTransactions(newTransaction);
		}

		res.status(201).json({
			success: 'Transaction successfuly',
			transaction: transactionForUser
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;
