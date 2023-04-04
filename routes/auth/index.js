const express = require('express');
const router = express.Router(); 
const loginController = require('../../controller/auth/login');

router.post('/login', loginController.login);

// router.post('/signup', signupRoute);

module.exports = router;