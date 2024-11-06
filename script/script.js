
// Initialize variables
let history = [];
let grandTotal = 0;

// Load theme preference
document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light');

// DOM Elements
const form = document.getElementById('expenseForm');
const quantityInput = document.getElementById('quantity');
const perPriceInput = document.getElementById('perPrice');
const priceInput = document.getElementById('price');
const currencySelect = document.getElementById('currency');
const currencySymbol = document.getElementById('currencySymbol');
const grandTotalElement = document.getElementById('grandTotal');
const historyList = document.getElementById('historyList');
const clearFormButton = document.getElementById('clearForm');
const clearHistoryButton = document.getElementById('clearHistory');
const themeToggle = document.getElementById('themeToggle');

// Load history from localStorage
function loadHistory() {
const savedHistory = localStorage.getItem('expenseHistory');
if (savedHistory) {
history = JSON.parse(savedHistory);
updateHistoryDisplay();
calculateGrandTotal();
}
}

// Save history to localStorage
function saveHistory() {
localStorage.setItem('expenseHistory', JSON.stringify(history));
}

// Calculate total price based on quantity and per-price
function calculateTotal() {
const quantity = parseFloat(quantityInput.value) || 0;
const perPrice = parseFloat(perPriceInput.value) || 0;
const total = quantity * perPrice;
priceInput.value = total.toFixed(2);
}

// Calculate grand total from history
function calculateGrandTotal() {
grandTotal = history.reduce((total, entry) => total + parseFloat(entry.price), 0);
grandTotalElement.textContent = grandTotal.toFixed(2);
currencySymbol.textContent = currencySelect.value + ' ';
}

// Update history display
function updateHistoryDisplay() {
historyList.innerHTML = '';
history.forEach((entry, index) => {
const historyItem = document.createElement('div');
historyItem.className = 'history-item';
historyItem.innerHTML = `
    <button class="delete-entry" onclick="deleteEntry(${index})">×</button>
    <div class="history-detail">
        <span class="history-label">Task:</span>
        <span class="history-value">${entry.task}</span>
    </div>
    <div class="history-detail">
        <span class="history-label">Status:</span>
        <span class="history-value">${entry.status}</span>
    </div>
    <div class="history-detail">
        <span class="history-label">Owner:</span>
        <span class="history-value">${entry.owner}</span>
    </div>
    <div class="history-detail">
        <span class="history-label">Quantity:</span>
        <span class="history-value">${entry.quantity}</span>
    </div>
    <div class="history-detail">
        <span class="history-label">Per Price:</span>
        <span class="history-value">${entry.currency} ${entry.perPrice}</span>
    </div>
    <div class="history-price">${entry.currency} ${parseFloat(entry.price).toFixed(2)}</div>
    <div class="history-timestamp">${entry.timestamp}</div>
`;
historyList.appendChild(historyItem);
});
}

// Delete entry from history
function deleteEntry(index) {
history.splice(index, 1);
saveHistory();
updateHistoryDisplay();
calculateGrandTotal();
}

// Clear form
function clearForm() {
form.reset();
priceInput.value = '';
}

// Clear all history
function clearAllHistory() {
if (confirm('Are you sure you want to clear all history?')) {
history = [];
saveHistory();
updateHistoryDisplay();
calculateGrandTotal();
}
}

// Toggle theme
function toggleTheme() {
const currentTheme = document.documentElement.getAttribute('data-theme');
const newTheme = currentTheme === 'light' ? 'dark' : 'light';
document.documentElement.setAttribute('data-theme', newTheme);
localStorage.setItem('theme', newTheme);
}

// Event Listeners
form.addEventListener('submit', (e) => {
e.preventDefault();
const entry = {
task: document.getElementById('task').value,
status: document.getElementById('status').value,
owner: document.getElementById('owner').value,
quantity: quantityInput.value,
perPrice: perPriceInput.value,
price: priceInput.value,
currency: currencySelect.value,
timestamp: new Date().toLocaleString()
};
history.push(entry);
saveHistory();
updateHistoryDisplay();
calculateGrandTotal();
clearForm();
});

quantityInput.addEventListener('input', calculateTotal);
perPriceInput.addEventListener('input', calculateTotal);
currencySelect.addEventListener('change', calculateGrandTotal);
clearFormButton.addEventListener('click', clearForm);
clearHistoryButton.addEventListener('click', clearAllHistory);
themeToggle.addEventListener('click', toggleTheme);

// Initialize
loadHistory();

