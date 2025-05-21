'use strict';
// Testing
console.log("CONNECTED TO JAVASCRIPT!");

// Documents:
const balanceE = document.getElementById("balance");
const incomeAmountE = document.getElementById("income-amount");
const expenseAmountE = document.getElementById("expense-amount");
const transactionListE = document.getElementById("transaction-list");
const transactionFormE = document.getElementById("transaction-form");
const descriptionE = document.getElementById("description");
const amountE = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormE.addEventListener("submit", addTransaction);

function addTransaction(e) {
    e.preventDefault();
    const description = descriptionE.value.trim();
    const amount = parseFloat(amountE.value);

    transactions.push({
        id:Date.now(),
        description,
        amount
    })

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTransactionList();
    updateSummary();

    transactionFormE.reset();
}

function updateTransactionList() {
    transactionListE.innerHTML = "";

    const sortedTransactions = [...transactions].reverse();

    sortedTransactions.forEach((transaction) => {
        const transactionE = createTransactionElement(transaction);
        transactionListE.appendChild(transactionE);
    })
}

function createTransactionElement(transaction) {
    const li = document.createElement("li");
    li.classList.add("transaction");
    li.classList.add(transaction.amount > 0 ? "income" : "expense");

    li.innerHTML = `
    <span>${transaction.description}</span>
    <span>${formatCurrency(transaction.amount)}
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x
    </button>
    </span>
    `;

    return li;
}

function updateSummary() {

    const balance = transactions.reduce((accumulator, transaction) => accumulator + transaction.amount ,0);

    const income = transactions.filter(transaction => transaction.amount > 0)
    .reduce((accumulator, transaction) => accumulator + transaction.amount ,0);

    const expenses = transactions.filter(transaction => transaction.amount < 0)
    .reduce((accumulator, transaction) => accumulator + transaction.amount ,0);

    // Update
    balanceE.textContent = formatCurrency(balance);
    incomeAmountE.textContent = formatCurrency(income);
    expenseAmountE.textContent = formatCurrency(expenses);
}

function formatCurrency(number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(number);
}

function removeTransaction(id) {
    // Filtering out the one that should be deleted.
    transactions = transactions.filter(transaction => transaction.id !== id);

    localStorage.setItem("transaction", JSON.stringify(transactions));

    updateTransactionList();
    updateSummary();
}

// Inital rendering restart page.
updateTransactionList();
updateSummary();