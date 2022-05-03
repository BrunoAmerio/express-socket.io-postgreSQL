const jwt = require('jsonwebtoken'); //REQUIRE JSON WEB TOKEN PARA VERIFICAR TOKEN DE AUTORIZACION

//Verificacion para las rutas normales
const verifyUserToken = (req, res, next) => {
	if (req.headers.token) {
		next();
	} else {
		return res.status(400).json({ error: 'Token not provided' });
	}
};

//Verficacion para las rutas admin
const verifyAdminToken = (req, res, next) => {
	const token = req.headers.token;
	if (token) {
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		if (decoded.role === 'Admin') {
			next();
		} else {
			return res
				.status(401)
				.json({ error: 'You do not have these permissions ' });
		}
	} else {
		return res.status(400).json({ error: 'Token not provided' });
	}
};

module.exports = {
	verifyUserToken,
	verifyAdminToken
};
