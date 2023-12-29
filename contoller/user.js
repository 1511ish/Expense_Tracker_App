const User = require('../models/User');
const bcrypt = require('bcrypt');


function isStringInvalid(string) {
    if (string == undefined || string.length === 0)
        return true;
    else
        return false;
}

exports.signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (isStringInvalid(name) || isStringInvalid(password) || isStringInvalid(password)) {
            return res.status(400).json({ err: 'Bad parameters, Something is missing' })
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            await User.create({ name: name, email_Id: email, password: hash });
            res.status(201).json({ message: 'Successfully create new user' });
            console.log('SUCCESSFULLY ADDED');
        })

        // await User.create({ name: name, email_Id: email, password: password });
        // res.status(201).json({ message: 'Successfully create new user' });
        // console.log('SUCCESSFULLY ADDED');

    }
    catch (err) {
        res.status(500).json(err);
    }
}


exports.login = async (req, res) => {
    // -------------initally i have done this code------------
    // let flag = true;
    // const { email, password } = req.body;
    // const users = await User.findAll();
    // users.forEach(user => {
    //     if (user.dataValues.email_Id === email) {
    //         if (user.dataValues.password === password) {
    //             console.log("access h bhai");
    //             res.status(200).json({ message: "User login sucessful" });
    //         } else {
    //             console.log("wrong password");
    //             res.status(401).json({ message: "User not authorized" });
    //         }
    //         flag = false;
    //     }
    // });

    // if (flag) {
    //     console.log("user not found or exist!");
    //     return res.status(404).json({ message: "User not found" });
    // }



    // ---------------after watching sir'solution---------------
    // const { email, password } = req.body;
    // if (isStringInvalid(email) || isStringInvalid(password)) {
    //     return res.status(400).json({ message: 'email or password is missing', success: false })
    // }
    // try {
    //     const user = await User.findAll({ where: { email_Id: email } })
    //     if (user.length > 0) {
    //         if (user[0].password === password) {
    //             res.status(200).json({ success: true, message: "User logged in successfully" });
    //         } else {
    //             return res.status(400).json({ success: false, message: 'Password is incorrect' });
    //         }
    //     }
    //     else {
    //         return res.status(404).json({ success: false, message: "User Doesnot exist." });
    //     }
    // } catch (err) {
    //     res.status(500).json({ message: err, success: false });
    // }


    const { email, password } = req.body;
    if (isStringInvalid(email) || isStringInvalid(password)) {
        return res.status(400).json({ message: 'email or password is missing', success: false })
    }
    try {
        const user = await User.findAll({ where: { email_Id: email } })
        if (user.length > 0) {
            console.log(user[0].dataValues.password);
            bcrypt.compare(password, user[0].dataValues.password, (err, result) => {
                if (err){
                    throw new Error('Something went wrong');
                }
                if (result === true) {
                    res.status(200).json({ success: true, message: "User logged in successfully" });
                } else {
                    return res.status(400).json({ success: false, message: 'Password is incorrect' });
                }
            })
        }
        else {
            return res.status(404).json({ success: false, message: "User Doesnot exist." });
        }
    } catch (err) {
        res.status(500).json({ message: err, success: false });
    }

}
