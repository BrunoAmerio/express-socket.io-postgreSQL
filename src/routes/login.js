const router = require('express').Router();
const jwt = require('jsonwebtoken');
const sequelize = require('../db');
const { decrypt } = require('../utils/encrypt');
const { User } = sequelize.models;
const { JWT_KEY } = process.env;

router.post('/', async (req, res) => {
	const { email, password } = req.body;
	try {
		if (!email || !password) throw new Error('Data was not provided');

		const result = await User.findOne({
			where: {
				email,
				disable: false
			}
		});
		if (!result) throw new Error('User not found');

		//Desencriptamos la contraseña
		const decriptPassword = decrypt(result.password);

		if (decriptPassword !== password) throw new Error('Data no match');

		const accessToken = jwt.sign(
			{
				role: result.isAdmin ? 'Admin' : 'User'
			},
			JWT_KEY,
			{
				expiresIn: 60 * 60 * 1
			}
		);

		res.status(200).json({
			user: {
				id: result.id,
				name: result.name,
				lastName: result.lastName,
				email: result.email,
				profilePicture: result.profilePicture,
				favorites: result.favorites,
				shoppingCart: result.shoppingCart,
				isAdmin: result.isAdmin
			},
			accessToken
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;
