const Expense = require('../models/Expense');
let userId;
exports.addExpense = async (req, res, next) => {
    try {
        const user = req.user;
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        const promise1 = user.createExpense({ expense_amount: amount, description: description, category: category, userId: userId });
        const promise2 = user.update({ totalExpense: parseInt(user.totalExpense) + parseInt(amount) });

        Promise.all([promise1, promise2])
            .then(([res1, res2]) => {
                res.status(201).json({ newExpenseDetail: res1 });
                console.log('SUCCESSFULLY ADDED');
            })
            .catch((err) => {
                console.log(err);
                throw new Error(err);
            })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        })
    }
}


exports.getExpenses = async (req, res, next) => {
    try {
        userId = req.userId;
        const allexpenses = await Expense.findAll({ where: { userId: userId } });
        //console.log(allexpenses);
        //console.log(allexpenses[0].id);
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

        const promise1 = user.update({ totalExpense: parseInt(user.totalExpense) - parseInt(amount) });
        const promise2 = Expense.destroy({ where: { id: expenseId } });
        Promise.all([promise1, promise2])
            .then(([res1, res2]) => {
                // res.status(201).json({ newExpenseDetail: res1 });
                console.log('SUCCESSFULLY DELETED');
            })
            .catch((err) => {
                console.log(err);
                throw new Error(err);
            })
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}