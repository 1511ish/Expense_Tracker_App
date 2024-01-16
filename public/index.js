
var ul = document.getElementById('expense_list');
var expensefile_ul = document.getElementById('expensefile_list');
var premiumContainer = document.getElementById('premiumContainer');
var addExpense_btn = document.getElementById('add');
let errDiv = document.getElementById('err_div');
let expence_amount = document.getElementById('amount');
let description = document.getElementById('description');
const buyPremium_btn = document.getElementById('rzp-button1');
const show_leaderboard_btn = document.getElementById('show_leaderboard');
const download_btn = document.getElementById('downloadexpense');
const token = localStorage.getItem('token');

addExpense_btn.addEventListener('click', addExpense);
buyPremium_btn.addEventListener('click', buyPremium);
show_leaderboard_btn.addEventListener('click', showLeaderBoard)
download_btn.addEventListener('click', download);

function addExpense() {
    let ind = document.getElementById("options").selectedIndex;
    let category = document.getElementsByTagName("option")[ind];

    const newExpense = {
        amount: expence_amount.value,
        description: description.value,
        category: category.value,
    }

    axios.post('http://localhost:3000/expense/add-expense', newExpense, { headers: { 'Authorization': token } })
        .then(response => {
            showDataOnScreen(response.data.newExpenseDetail);
            expence_amount.value = '';
            description.value = '';
        })
        .catch(err => {
            errDiv.innerHTML = errDiv.innerHTML + `<h4 color:'red'>PLEASE FILL ALL FEILDS</h4>`
            console.log(err)
        });

}


function showPremiumUserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden";
    document.getElementById('message').innerHTML = "You are a premium user.";
    document.getElementById('show_leaderboard').style.visibility = "visible";
    document.getElementById('leaderboard').style.visibility = "visible";
}


function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


let currentPage = 1;
let itemsPerPage = 5;
let pre_btn;
let next_btn
window.addEventListener("DOMContentLoaded", () => {
    console.log("reload");

    const token = localStorage.getItem('token')
    const decodeToken = parseJwt(token);
    const isPremiumUser = decodeToken.isPremium;
    if (isPremiumUser) {
        showPremiumUserMessage();
    }
    axios.get(`http://localhost:3000/expense/get-expenses?page=${currentPage}&pageSize=${itemsPerPage}`, { headers: { 'Authorization': token } })
        .then(response => {
            for (var i = 0; i < response.data.allExpense.length; i++) {
                showDataOnScreen(response.data.allExpense[i])
            }
            pre_btn = document.createElement('button');
            pre_btn.value = currentPage;
            next_btn = document.createElement('button');
            next_btn.value = currentPage+1;
        })
        .catch(err => console.error(err));
    axios.get('http://localhost:3000/user/get-downlodedFileUrls', { headers: { 'Authorization': token } })
        .then(response => {
            console.log(response.data.fileURL);
            for (var i = 0; i < response.data.fileURL.length; i++) {
                showDownloadedFile(response.data.fileURL[i])
            }
        })
        .catch(err => console.log(err));
})


function showDownloadedFile(obj) {
    expensefile_ul.innerHTML = expensefile_ul.innerHTML + `<li><a href= ${obj.fileUrl}>Expense file ${obj.id}</a></li>`;
}

function showDataOnScreen(expense) {
    ul.innerHTML = ul.innerHTML + `<li id="${expense.id}"> ${expense.expense_amount} - ${expense.description} - ${expense.category} - <button onclick="editExpense('${expense.id}','${expense.expense_amount}','${expense.description}','${expense.category}')">Edit</button> <button onclick="deleteExpense(${expense.id})">Delete</button></li>`;
}


function deleteExpense(expenseId) {
    axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`, { headers: { 'Authorization': token } })
        .then((response) => {
            removeExpensefromScreen(expenseId);
        })
        .catch((err) => {
            console.log(err);
        })

    event.preventDefault();
}


function editExpense(expenseId, amount, desc, cate) {
    expence_amount.value = amount;
    description.value = desc;
    deleteExpense(expenseId);
}


function removeExpensefromScreen(expenseId) {
    const childNodeToBeDeleted = document.getElementById(expenseId);
    if (childNodeToBeDeleted)
        ul.removeChild(childNodeToBeDeleted);
}


async function buyPremium(e) {
    e.preventDefault();
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: { "Authorization": token } })
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { "Authorization": token } })

            alert('you are a Premimum user now.');
            localStorage.setItem('token', res.data.token);
            showPremiumUserMessage();
        }
    };

    const rzpl = new Razorpay(options);
    rzpl.open();
    rzpl.on('payment.failed', function (response) {
        console.log(response);
        axios.post('http://localhost:3000/purchase/updatefailedtransactionstatus', {
            order_id: options.order_id,
            //payment_id: response.razorpay_payment_id,
        }, { headers: { "Authorization": token } })
        alert('Something went wrong');
    })
}


async function showLeaderBoard(e) {
    e.preventDefault();
    premiumContainer.innerHTML = '';
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: { "Authorization": token } })
    const arr = response.data;
    arr.forEach(element => {
        const li = document.createElement('li');
        li.innerHTML = `Name- ${element.name} - Totalexpense - ${element.totalExpense}`;
        premiumContainer.appendChild(li);
        console.log(element)
    });
}


function download(e) {
    // e.preventDefault();
    axios.get('http://localhost:3000/user/download', { headers: { "Authorization": token } })
        .then((res) => {
            if (res.status) {
                var a = document.createElement('a');

                a.href = res.data.fileUrl;
                // a.download = 'myexpense.cvs';
                a.click();
                showDownloadedFile(res.data)
            } else {
                throw new Error(res.data.message);
            }
        })
        .catch((err) => {
            console.log(err);
        })
}

