const router = require('express').Router();
const { verifyUserToken } = require('../utils/verifyToken');
const sequelize = require('../db');
const { User, Transaction } = sequelize.models;

//EDITAR LA INFORMACION DE UN USUARIO
router.put('/edit/:userId', verifyUserToken, async (req, res) => {
	const { userId } = req.params;
	const { fields, values } = req.body;
	try {
		if (!fields || !values)
			throw new Error('The necesary data was not provided');

		const user = await User.findOne({
			where: {
				id: userId,
				disable: false
			}
		});

		if (!user) throw new Error('User not found');

		for (let i = 0; i < fields.length; i++) {
			user[fields[i]] = values[i];
		}
		user.save();
		res.status(200).json({ success: 'Change save successfuly' }, user);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

//TRAER LAS VENTAS DE UN USUARIO
router.get('/sales/:userId', async (req, res) => {
	const { userId } = req.params;
	try {
		const result = await User.findOne({
			include: {
				model: Transaction,
				where: {
					itSold: true
				}
			},
			where: {
				id: userId,
				disable: false
			}
		});
		if (!result) return res.json({ transactions: [] });

		res.json({ transactions: result.Transactions });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

//TRAER TODAS LAS COMPRAS DE UN USUARIO
router.get('/shopping/:userId', async (req, res) => {
	const { userId } = req.params;

	try {
		const result = await User.findOne({
			include: {
				model: Transaction,
				where: {
					itSold: false
				}
			},
			where: {
				id: userId,
				disable: false
			}
		});

		if (!result) return res.json({ transactions: [] });
		res.json({ transactions: result.Transactions });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

//ELIMINAR UN USUARIO
router.delete('/delete/:userId', verifyUserToken, async (req, res) => {
	const { userId } = req.params;
	try {
		const user = await User.findOne({
			where: {
				id: userId,
				disable: false
			}
		});
		if (!user) throw new Error('User not found');

		//NO ELIMINAMOS EL USUARIO COMO TAL, SI NO QUE LO DESACTIVAMOS DE LAS BUSQUEDAS
		user.disable = true;
		user.save();
		res.json({ success: 'User delete successfuly' });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});
module.exports = router;
