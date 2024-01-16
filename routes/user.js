const express = require('express');

const router = express.Router();

const userController = require('../contoller/user');
const expenseController = require('../contoller/expense');
const downloadedUrlController = require('../contoller/DownloadedUrl');

const authenticationmiddleware = require('../middleware/auth');

router.post('/signup', userController.signUp);

router.post('/login',userController.login);

router.get('/download',authenticationmiddleware.authenticate,expenseController.downloadexpense);

router.get('/get-downlodedFileUrls',authenticationmiddleware.authenticate,downloadedUrlController.getDownlodedFileUrls);

module.exports = router;
