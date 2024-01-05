const Expense = require('../models/Expense');
let userId;
exports.addExpense = async (req, res, next) => {
    try {
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;
        const data = await Expense.create({ expense_amount: amount, description: description, category: category, userId: userId });

        res.status(201).json({ newExpenseDetail: data });
        console.log('SUCCESSFULLY ADDED');
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
        const expenseId = req.params.id;
        await Expense.destroy({ where: { id: expenseId } });
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}