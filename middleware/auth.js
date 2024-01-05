const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const obj = jwt.verify(token, 'secretkey');
        User.findByPk(obj.userId).then(user => {
            req.user = user;
            req.userId = user.id;
            next();
        }).catch(err => { throw new Error(err) });
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false });
    }
}