const router = require('express').Router();
const sequelize = require('../db');
const { Product, User } = sequelize.models;
const { verifyUserToken } = require('../utils/verifyToken');

//DEVUELVE TODOS LOS PRODUCTOS QUE TENGAN EL MAYOR PORCENTAJE DE DESCUENTOS
router.get('/discount', async (req, res) => {
	let discount = 100;
	const productWithDiscount = [];

	try {
		while (discount > 0 || productWithDiscount.length > 10) {
			let findProducts = await Product.findAll({
				where: {
					discount,
					disable: false
				}
			}).then(res =>
				res.map(item => {
					return item.dataValues;
				})
			);
			console.log(findProducts, discount);
			if (findProducts.length) {
				productWithDiscount.push(...findProducts.slice(0, 3));
			}
			discount -= 2;
		}

		res.status(200).json({ products: productWithDiscount });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

//DEVUELVE TODOS LOS PRODUCTOS QUE TENGAN ENTRE 4 Y 5 PUNTOS
router.get('/review', async (req, res) => {
	const products = [];

	try {
		//Primero buscamos los productos con 5 estrellas
		const productsWithFiveStarts = await Product.findAll({
			where: {
				points: 5,
				disable: false
			}
		}).then(res =>
			res.map(item => {
				return item.dataValues;
			})
		);

		if (productsWithFiveStarts.length) {
			products.push(productsWithFiveStarts.slice(0, 5));
		}

		//Ahora buscamos los que tengan 4 estrellas
		const productsWithFourStarts = await Product.findAll({
			where: {
				points: 4,
				disable: false
			}
		}).then(res =>
			res.map(item => {
				return item.dataValues;
			})
		);

		if (productsWithFourStarts.length) {
			products.push(productsWithFourStarts.slice(0, 5));
		}

		res.status(200).json({ products: products });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

//UN PRODUCTO EN ESEPCIFICO
router.get('/:productId', async (req, res) => {
	const { productId } = req.params;

	try {
		const result = await Product.findOne({
			where: {
				id: productId,
				disable: false
			}
		});
		if (!result) throw new Error('Product not found');

		res.status(200).json({ product: result });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

//CREA UN PRODUCTO
router.post('/create', verifyUserToken, async (req, res) => {
	const { images, title, description, userId, price } = req.body;

	/*
        HAY QUE VER COMO CONTROLAMOS EL TEMA DE LAS IMAGENES
    */

	try {
		if (!title || !description || !userId || !price)
			throw new Error('The necesary data was not provided');

		const user = await User.findOne({
			where: {
				id: userId
			}
		});
		if (!user) throw new Error('User not found');

		const newProduct = await Product.create({ ...req.body });

		//Relacionamos el producto con el usuario
		user.addProducts(newProduct);

		res.status(201).json({
			succes: 'Product create successfuly',
			product: {
				id: newProduct.id,
				title: newProduct.title,
				description: newProduct.description,
				price: newProduct.price,
				images: newProduct.images,
				points: newProduct.points,
				discount: newProduct.discount
			}
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

//EDITAR UN PRODUCTO
router.put('/edit/:productId', verifyUserToken, async (req, res) => {
	const { productId } = req.params;
	const { userId, fields, values } = req.body;

	try {
		if (!userId || !fields || !values)
			throw new Error('The necessary data was not provided');
		const result = await Product.findOne({
			where: {
				id: productId,
				disable: false
			}
		});

		if (!result) throw new Error('Product not found');
		//Verificamos que el producto le pertenezca al que que quiere cambiarlo
		if (result.userId !== userId)
			throw new Error('It is not possible to edit this product');

		for (let i = 0; i < fields.length; i++) {
			result[fields[i]] = values[i];
		}
		result.save();
		res
			.status(200)
			.json({ success: 'Product edit successfuly', product: result });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;
