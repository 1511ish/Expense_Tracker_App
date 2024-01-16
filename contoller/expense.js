const Expense = require('../models/Expense');
const sequelize = require('../util/database');
const AWS = require('aws-sdk');

let userId;

function uploadToS3(data, filename) {
    const BUCKET_NAME = 'expenstracker';
    const IAM_USER_KEY = 'AKIAXNDL7V4OL5CLVS5A';
    const IAM_USER_SECRET = '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';

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('Something went wrong', err);
                reject(err);
            } else {
                console.log('success');
                resolve(s3response.Location);
            }
        })
    })

}


exports.downloadexpense = async (req, res) => {
    try {
        const expenses = await req.user.getExpenses();
        const stringifiedExpenses = JSON.stringify(expenses);
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileURL = await uploadToS3(stringifiedExpenses, filename);
        const response = await req.user.createDownload({ fileUrl: fileURL })
        res.status(200).json({ id: response.id, fileUrl: fileURL, success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ fileURL: '', success: false, err: err });
    }
}


exports.addExpense = async (req, res, next) => {
    try {
        const user = req.user;
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;
        const t = await sequelize.transaction();

        const promise1 = user.createExpense({ expense_amount: amount, description: description, category: category, userId: userId }, { transaction: t });
        const promise2 = user.update({ totalExpense: parseInt(user.totalExpense) + parseInt(amount) }, { transaction: t })

        Promise.all([promise1, promise2])
            .then(async ([res1, res2]) => {
                await t.commit();
                res.status(201).json({ newExpenseDetail: res1 });
                console.log('SUCCESSFULLY ADDED');
            })
            .catch(async (err) => {
                await t.rollback();
                console.log(err);
                throw new Error(err);
            })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err })
    }
}


exports.getExpenses = async (req, res, next) => {
    try {
        //userId = req.userId;
        const page = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.pageSize) || 5
        const offset = (page - 1) * pageSize
        const allexpenses = await req.user.getExpenses({
            limit: pageSize,
            offset: offset
        })
        res.status(200).json({ allExpense: allexpenses });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }
}


exports.deleteExpense = async (req, res, next) => {
    try {
        const user = req.user;
        const expenseId = req.params.id;
        const expense = await Expense.findByPk(expenseId);
        const amount = expense.expense_amount;
        const t = await sequelize.transaction();

        const promise1 = user.update({ totalExpense: parseInt(user.totalExpense) - parseInt(amount) }, { transaction: t });
        const promise2 = Expense.destroy({ where: { id: expenseId } }, { transaction: t });
        Promise.all([promise1, promise2])
            .then(async ([res1, res2]) => {
                // res.status(201).json({ newExpenseDetail: res1 });
                await t.commit();
                console.log('SUCCESSFULLY DELETED');
            })
            .catch(async (err) => {
                await t.rollback();
                console.log(err);
                throw new Error(err);
            })
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}