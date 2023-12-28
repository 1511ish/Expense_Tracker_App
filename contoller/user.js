const User = require('../models/User');

exports.signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // if(name == null || password == null || email == null){
        //     return res.status(400).json({err: 'Bad parameters, Something is missing'})
        // }
        const new_user = await User.create({ name: name, email_Id: email, password: password });
        res.status(201).json({ message: 'Successfully create new user' });
        console.log('SUCCESSFULLY ADDED');
    }
    catch (err) {
        res.status(500).json(err);
    }
}


exports.login = async (req, res) => {
    let flag = true;
    const { email, password } = req.body;

    const users = await User.findAll();
    users.forEach(user => {
        if (user.dataValues.email_Id === email) {
            if (user.dataValues.password === password) {
                console.log("access h bhai");
                res.status(200).json({ message: "User login sucessful" });
            } else {
                console.log("wrong password");
                res.status(401).json({ message: "User not authorized" });
            }
            flag = false;
        }
    });

    if (flag) {
        console.log("user not found or exist!");
        return res.status(404).json({ message: "User not found" });
    }
}
