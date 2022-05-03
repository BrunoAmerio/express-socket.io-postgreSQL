const router = require('express').Router();
const sequelize = require('../db');
const { encrypt } = require('../utils/encrypt');
const { User } = sequelize.models;

/*
	MANEJAR LA CARGA DE LAS FOTOS
*/

router.post('/', async (req, res) => {
	//Encriptamos la contraseña
	req.body.password = encrypt(req.body.password);
	const { name, lastName, email, password } = req.body;
	try {
		if (!name || !lastName || !email || !password)
			throw new Error('The necessary data was not provided');
		const result = await User.findOne({
			where: {
				email,
				disable: false
			}
		});
		if (result) throw new Error('User already exist');

		const newUser = await User.create({
			name: name,
			lastName: lastName,
			email: email,
			password: password,
			favorites: '[]',
			shoppingCart: '[]'
		});

		res.status(201).json({
			success: 'User create successfuly',
			user: {
				name: newUser.name,
				lastName: newUser.lastName,
				email: newUser.email
			}
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;
