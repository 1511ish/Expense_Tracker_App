const express = require('express');

const router = express.Router();

const passwordController = require('../contoller/password');

router.post('/forgotpassword', passwordController.resetPassword);

module.exports = router;