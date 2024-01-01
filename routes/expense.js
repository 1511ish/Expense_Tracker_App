const express = require('express');

const router = express.Router();

const expenseController = require('../contoller/expense');
const userAuthentication = require('../middleware/auth');

router.post('/add-expense', expenseController.addExpense);
router.get('/get-expenses', userAuthentication.authenticate, expenseController.getExpenses);
router.delete('/delete-expense/:id', expenseController.deleteExpense);

module.exports = router;