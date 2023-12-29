const express = require('express');

const router = express.Router();

const expenseController = require('../contoller/expense');

router.post('/add-expense',expenseController.addExpense);
router.get('/get-expenses',expenseController.getExpenses);
router.delete('/delete-expense/:id',expenseController.deleteExpense);

module.exports = router;