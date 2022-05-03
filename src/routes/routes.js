const router = require('express').Router();

//Rutas
const register = require('./register');
const login = require('./login');
const product = require('./product');
const user = require('./user');
const transaction = require('./transaction');

router.use('/login', login);
router.use('/register', register);
router.use('/product', product);
router.use('/user', user);
router.use('/transaction', transaction);

module.exports = router;
