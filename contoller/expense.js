const Expense = require('../models/Expense');

exports.addExpense = async (req, res, next) => {
    try {
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        const data = await Expense.create({ expense_amount: amount, description: description, category: category });

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
        const allexpenses = await Expense.findAll();
        res.status(200).json({ allExpense: allexpenses });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }
}


exports.deleteExpense = async (req, res, next) => {
    try {
        // if (req.params.id == 'undefined') {
        //     console.log('Id is missing');
        //     return res.status(400).json({ err: 'ID is missing' });
        // }
        const expenseId = req.params.id;
        await Expense.destroy({ where: { id: expenseId } });
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}