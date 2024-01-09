const express = require('express');
const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const path = require('path');
var cors = require('cors');

const User = require('./models/User');
const Expense = require('./models/Expense');
const Order = require('./models/Order')

const app = express();

const expenseRoutes = require('./routes/expense');
const userRoutes = require('./routes/user');
const purchaseRoutes = require('./routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumFeature');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
// app.use('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '/views/signup.html'));
// });
User.hasMany(Expense,{onDelete: 'CASCADE'});
Expense.belongsTo(User);

User.hasMany(Order,{onDelete: 'CASCADE'});
Order.belongsTo(User);

sequelize.sync({force:true})
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })
