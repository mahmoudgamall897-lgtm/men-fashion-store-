const bag = [];
const drawer = document.querySelector('.bag-drawer');
const overlay = document.querySelector('.overlay');
const toast = document.querySelector('.toast');
const bagCount = document.querySelectorAll('.bag-count');
const bagItems = document.querySelector('#bag-items');
const bagTotal = document.querySelector('#bag-total');
const orderModal = document.querySelector('.order-modal');
const orderForm = document.querySelector('#order-form');

function renderBag() {
	const count = bag.reduce((total, item) => total + item.quantity, 0);
	const total = bag.reduce((sum, item) => sum + item.price * item.quantity, 0);
	bagCount.forEach((element) => { element.textContent = count; });
	bagTotal.textContent = `$${total}`;
	bagItems.innerHTML = bag.length ? bag.map((item, index) => `<div class="bag-line"><span>${item.name} × ${item.quantity}</span><span>$${item.price * item.quantity} <button data-remove="${index}">Remove</button></span></div>`).join('') : '<p class="empty-bag">Your bag is waiting.<br>Find something worth keeping.</p>';
}

function toggleBag(show) {
	drawer.classList.toggle('open', show);
	overlay.classList.toggle('open', show);
	drawer.setAttribute('aria-hidden', String(!show));
}

document.querySelectorAll('[data-bag-toggle]').forEach((button) => button.addEventListener('click', () => toggleBag(!drawer.classList.contains('open'))));
overlay.addEventListener('click', () => toggleBag(false));
document.querySelectorAll('.add-button').forEach((button) => button.addEventListener('click', () => {
	const existing = bag.find((item) => item.name === button.dataset.product);
	existing ? existing.quantity++ : bag.push({ name: button.dataset.product, price: Number(button.dataset.price), quantity: 1 });
	renderBag();
	toast.textContent = `${button.dataset.product} added to your bag`;
	toast.classList.add('show');
	setTimeout(() => toast.classList.remove('show'), 2200);
}));
bagItems.addEventListener('click', (event) => {
	if (event.target.dataset.remove) { bag.splice(Number(event.target.dataset.remove), 1); renderBag(); }
});

document.querySelectorAll('.wishlist').forEach((button) => button.addEventListener('click', () => {
	button.classList.toggle('saved');
	button.textContent = button.classList.contains('saved') ? '♥' : '♡';
}));

document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
	document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'));
	button.classList.add('active');
	const filter = button.dataset.filter;
	document.querySelectorAll('.product-card').forEach((card) => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
}));

const searchPanel = document.querySelector('.search-panel');
document.querySelector('[data-search-toggle]').addEventListener('click', () => { searchPanel.classList.toggle('open'); if (searchPanel.classList.contains('open')) document.querySelector('#search-input').focus(); });
document.querySelector('.menu-toggle').addEventListener('click', (event) => { const nav = document.querySelector('.main-nav'); nav.classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded', String(nav.classList.contains('open'))); });
document.querySelector('#search-form').addEventListener('submit', (event) => {
	event.preventDefault();
	const query = document.querySelector('#search-input').value.toLowerCase().trim();
	document.querySelectorAll('.product-card').forEach((card) => { card.hidden = Boolean(query) && !card.dataset.name.toLowerCase().includes(query); });
	document.querySelector('#shop').scrollIntoView({ behavior: 'smooth' });
});
document.querySelector('#newsletter-form').addEventListener('submit', (event) => { event.preventDefault(); event.target.innerHTML = '<span style="color:#f3f0e9;padding:10px 0;font-size:12px">You are on the list. Thank you.</span>'; });
document.querySelector('.checkout-button').addEventListener('click', () => {
	if (!bag.length) {
		toast.textContent = 'Add a product to your bag first';
		toast.classList.add('show');
		setTimeout(() => toast.classList.remove('show'), 2200);
		return;
	}
	toggleBag(false);
	orderModal.classList.add('open');
	orderModal.setAttribute('aria-hidden', 'false');
	document.querySelector('#customer-name').focus();
});
document.querySelector('.close-order').addEventListener('click', () => {
	orderModal.classList.remove('open');
	orderModal.setAttribute('aria-hidden', 'true');
});
orderForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const orderNumber = `NG-${Math.floor(10000 + Math.random() * 90000)}`;
	bag.length = 0;
	renderBag();
	orderForm.reset();
	orderModal.classList.remove('open');
	orderModal.setAttribute('aria-hidden', 'true');
	toast.textContent = `Order ${orderNumber} received. Thank you!`;
	toast.classList.add('show');
	setTimeout(() => toast.classList.remove('show'), 3500);
});
renderBag();
