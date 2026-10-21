const products = [
    { id: 1, name: "Wireless Headphones", price:99.99, category: "electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80", description: "High-fidelity sound reproduction with active noise cancellation." },
    { id: 2, name: "Smart Watch", price: 149.99, category: "electronics", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80", description: "Track your fitness, heart rate, and sleep with advanced sensors." },
    { id: 3, name: "Classic Denim Jacket", price: 69.99, category: "clothing", image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=500&q=80", description: "Timeless styling crafted with durable cotton denim." },
    { id: 4, name: "Casual Sneakers", price: 89.99, category: "clothing", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80", description: "Breathable and lightweight footwear for everyday walking." },
    { id: 5, name: "Leather Backpack", price: 119.99, category: "accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80", description: "Spacious real-leather laptop backpack with multi-compartments." },
    { id: 6, name: "Polarized Sunglasses", price: 39.99, category: "accessories", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500&q=80", description: "UV400 protection stylish sunglasses for summer activities." },
    { id: 7, name: "Mechanical Keyboard", price: 129.99, category: "electronics", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80", description: "Tactile mechanical switches with customizable RGB backlighting." },
    { id: 8, name: "Minimalist Watch", price: 79.99, category: "accessories", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=500&q=80", description: "Sleek analog wrist watch featuring genuine leather strap." }
];

let cart = JSON.parse(localStorage.getItem('SHOPPING ZONE_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateCartCount();
    if (document.getElementById('featured-grid')) renderGrid('featured-grid', products.slice(0, 4));
    if (document.getElementById('all-products-grid')) setupShop();

    document.getElementById('hero-shop-btn')?.addEventListener('click', () => {
        document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' }) || (window.location.href = 'products.html');
    });

    document.querySelectorAll('.close-modal').forEach(b => b.addEventListener('click', () => document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'))));
    document.getElementById('cart-btn')?.addEventListener('click', openCart);
    document.getElementById('contact-form')?.addEventListener('submit', validateForm);
});

function initTheme() {
    const btn = document.getElementById('theme-toggle'), theme = localStorage.getItem('shopease_theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if (btn) {
        btn.textContent = theme === 'dark' ? '☀️' : '🌙';
        btn.onclick = () => {
            const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('shopease_theme', next);
            btn.textContent = next === 'dark' ? '☀️' : '🌙';
        };
    }
}

function renderGrid(id, items) {
    const grid = document.getElementById(id);
    if (!grid) return;
    grid.innerHTML = items.length ? items.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}">
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="product-price">$${p.price.toFixed(2)}</div>
        <p style="font-size:0.85rem; color:var(--secondary); flex-grow:1;">${p.description}</p>
        <div class="product-actions">
          <button class="btn btn-primary btn-sm" onclick="addToCart(${p.id})">Add to Cart</button>
          <button class="btn btn-secondary btn-sm" onclick="showDetails(${p.id})">Details</button>
        </div>
      </div>
    </div>`).join('') : '<p style="grid-column:1/-1;text-align:center;">No products found.</p>';
}

function setupShop() {
    const search = document.getElementById('product-search'), btns = document.querySelectorAll('.filter-btn');
    let cat = new URLSearchParams(window.location.search).get('category') || 'all';

    btns.forEach(b => {
        if (b.dataset.category === cat) b.classList.add('active');
        b.onclick = (e) => {
            btns.forEach(x => x.classList.remove('active'));
            e.target.classList.add('active');
            cat = e.target.dataset.category;
            filter();
        };
    });
    search?.addEventListener('input', filter);

    function filter() {
        const q = search ? search.value.toLowerCase() : '';
        renderGrid('all-products-grid', products.filter(p => (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) && (cat === 'all' || p.category === cat)));
    }
    filter();
}

function addToCart(id) {
    const item = products.find(p => p.id === id), cartItem = cart.find(c => c.id === id);
    cartItem ? cartItem.quantity++ : cart.push({ ...item, quantity: 1 });
    localStorage.setItem('shopease_cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${item.name} added!`);
}

function updateCartCount() {
    const el = document.getElementById('cart-count');
    if (el) el.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
}

function openCart() {
    const modal = document.getElementById('cart-modal'), container = document.getElementById('cart-items-container');
    container.innerHTML = cart.length ? cart.map(i => `
    <div class="cart-item">
      <div><h4>${i.name}</h4><small>$${i.price.toFixed(2)} x ${i.quantity}</small></div>
      <div>
        <button class="btn btn-sm" onclick="adjust(${i.id}, -1)">-</button>
        <span>${i.quantity}</span>
        <button class="btn btn-sm" onclick="adjust(${i.id}, 1)">+</button>
        <button class="btn btn-secondary btn-sm" onclick="adjust(${i.id}, -99)">🗑️</button>
      </div>
    </div>`).join('') : '<p>Your cart is empty.</p>';
    document.getElementById('cart-total-price').textContent = cart.reduce((s, i) => s + (i.price * i.quantity), 0).toFixed(2);
    modal.classList.add('active');
}

function adjust(id, delta) {
    const idx = cart.findIndex(i => i.id === id);
    if (idx > -1) {
        if (delta === -99 || (cart[idx].quantity += delta) <= 0) cart.splice(idx, 1);
        localStorage.setItem('shopease_cart', JSON.stringify(cart));
        updateCartCount();
        openCart();
    }
}

function showDetails(id) {
    const p = products.find(x => x.id === id), modal = document.getElementById('product-modal');
    document.getElementById('product-detail-body').innerHTML = `
    <img src="${p.image}" alt="${p.name}" style="width:100%; border-radius:6px;">
    <div><h2>${p.name}</h2><p class="product-price">$${p.price.toFixed(2)}</p><p style="margin:10px 0;">${p.description}</p><button class="btn btn-primary" onclick="addToCart(${p.id})">Add to Cart</button></div>`;
    modal.classList.add('active');
}

function validateForm(e) {
    e.preventDefault();
    const name = document.getElementById('fullName'), email = document.getElementById('email'), sub = document.getElementById('subject'), msg = document.getElementById('message'), box = document.getElementById('form-message');
    let ok = true;

    [[name, 'Name required'], [email, 'Valid email required', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)], [sub, 'Subject required'], [msg, 'Message required']].forEach(([el, text, cond]) => {
        const valid = cond !== undefined ? cond : el.value.trim() !== '';
        el.parentElement.querySelector('.error-msg').textContent = valid ? '' : text;
        if (!valid) ok = false;
    });

    box.className = `form-message ${ok ? 'success' : 'error'}`;
    box.textContent = ok ? 'Thank you! Your message has been sent.' : 'Please fix the errors above.';
    if (ok) e.target.reset();
}

function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
}