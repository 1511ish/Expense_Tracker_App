const User = require('../models/User');
const Expense = require('../models/Expense');
const sequelize = require('../util/database');


exports.getLeaderBoard = async (req, res, next) => {
    try {
        const leaderBoardUsers = await User.findAll({
            //attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.expense_amount')), 'total_cost']],
            // include: [
            //     {
            //         model: Expense,
            //         attributes: []
            //     }
            // ],
            // group: ['user.id'],

            //it is a optimise way..
            attributes: ['id', 'name','totalExpense'],
            order: [['totalExpense','DESC']]

        })
        res.status(200).json(leaderBoardUsers);
    } catch (err) {
        console.log(err)
        res.status(403).json({ message: 'Error fetching leader board!' })
    }
}
// exports.getLeaderBoard = async (req, res, next) => {
//     try {
//         const users = await User.findAll();
//         const expenses = await Expense.findAll();
//         const userAggregatedExpenses = {};
//         console.log(expenses);
//         expenses.forEach(expense => {
//             if(userAggregatedExpenses[expense.userId]){
//                 userAggregatedExpenses[expense.userId] += expense.expense_amount;
//             }else{
//                 userAggregatedExpenses[expense.userId] = expense.expense_amount;
//             }

//         });

//         const userLeaderBoardDetails = [];
//         users.forEach((user) => {
//             userLeaderBoardDetails.push({name: user.name, total_cost: userAggregatedExpenses[user.id]||0} )
//         })
//         userLeaderBoardDetails.sort((a,b) => b.total_cost - a.total_cost);
//         console.log(userLeaderBoardDetails);
//         res.status(200).json(userLeaderBoardDetails);

//     } catch (err) {
//         console.log(err)
//         res.status(403).json({ message: 'Error fetching leader board!' })
//     }
// }


