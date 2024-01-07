const express = require('express');

const premiumFeatureController = require('../contoller/premiumFeature');

const authenticationmiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/showLeaderBoard', authenticationmiddleware.authenticate, premiumFeatureController.getLeaderBoard);


module.exports = router;