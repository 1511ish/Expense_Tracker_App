const Expense = require('../models/Expense');
const sequelize = require('../util/database');

let userId;
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
        userId = req.userId;
        const allexpenses = await Expense.findAll({ where: { userId: userId } });
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