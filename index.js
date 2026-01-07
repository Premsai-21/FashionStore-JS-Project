/* ===== DATA ===== */
const products = [
  { id:1, name:"Men's Casual Shirt - Blue", price:1499, img:"https://thefoomer.in/cdn/shop/files/jpeg-optimizer_PATP7047.jpg?v=1683819034", desc:"Regular fit, breathable cotton."},
  { id:2, name:"Men's Casual Shirt - Red", price:1499, img:"https://jdcstore.com/cdn/shop/files/IMG_0212_f5f02fbe-de79-4b8d-b39c-8e165b2d0a58.jpg?v=1740821562&width=3000", desc:"Breathable fabric for everyday wear."},
  { id:3, name:"Men's Casual Shirt - Green", price:1499, img:"https://ramrajcotton.in/cdn/shop/files/241224_Ecom_Ramraj19835.jpg?v=1756709156&width=1080", desc:"Classic checks, refined look."},
  { id:4, name:"Men's Casual Shirt - Black", price:1499, img:"https://www.aristobrat.in/cdn/shop/files/ClassicShirt25_JetBlack6.jpg?v=1755253492&width=2048", desc:"Timeless black for work & evening."},
  { id:5, name:"Formal Trousers - Grey", price:1999, img:"https://i.etsystatic.com/24188538/r/il/b09196/5141108339/il_570xN.5141108339_3cv9.jpg", desc:"Tailored finish, wrinkle resistant."},
  { id:6, name:"Formal Trousers - Black", price:1999, img:"https://www.jackjones.in/cdn/shop/files/901005501_g0.jpg?v=1745345265&width=2048", desc:"Sharp finish for formal occasions."},
  { id:7, name:"Denim Jeans - Blue", price:1799, img:"https://m.media-amazon.com/images/I/71uHivtw-OL._AC_UY1100_.jpg", desc:"Comfort stretch denim."},
  { id:8, name:"Denim Jeans - Black", price:1799, img:"https://www.urbanofashion.com/cdn/shop/files/jeanlsvint-black-1.jpg?v=1743772200", desc:"Slim fit, modern cut."},
  { id:9, name:"Leather Shoes - Brown", price:4999, img:"https://img.tatacliq.com/images/i20//437Wx649H/MP000000023812069_437Wx649H_202409241209271.jpeg", desc:"Genuine leather, handcrafted."},
  { id:10, name:"Leather Shoes - Black", price:4999, img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDir3_WEBiJfVtDbBknCihr-RO10_2b9bIeA&s", desc:"Polished leather for formals."},
  { id:11, name:"Casual Sneakers - White", price:2499, img:"https://img.tatacliq.com/images/i16//437Wx649H/MP000000021477456_437Wx649H_202403071959541.jpeg", desc:"Lightweight everyday sneakers."},
  { id:12, name:"Casual Sneakers - Grey", price:2499, img:"https://fausto.in/cdn/shop/files/FSTSNK-12GREY_MoodShot_1_400x.jpg?v=1716974357", desc:"Comfort sole, premium upper."}
];

/* ===== STATE ===== */
let cart = JSON.parse(localStorage.getItem('fs_cart_items') || '[]'); // [{id, qty}]
let favorites = JSON.parse(localStorage.getItem('fs_favs') || '[]');
let currentUser = JSON.parse(localStorage.getItem('fs_user') || 'null');

/* ===== DOM ===== */
const productsContainer = document.getElementById('products');
const cartCountNode = document.getElementById('cart-count');
const searchInput = document.getElementById('search');
const heroShop = document.getElementById('hero-shop');
const viewAll = document.getElementById('view-all');

const accountBtn = document.getElementById('account-btn');
const accountMenu = document.getElementById('account-menu');
const accountUserNode = document.getElementById('account-user');
const loginBtn = document.getElementById('login-btn');
const authModal = document.getElementById('auth-modal');
const authForm = document.getElementById('auth-form');
const closeAuth = document.getElementById('close-auth');

const productModal = document.getElementById('product-modal');
const closeModal = document.getElementById('close-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalDesc = document.getElementById('modal-desc');
const modalAdd = document.getElementById('modal-add');
const modalFav = document.getElementById('modal-fav');

const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItemsNode = document.getElementById('cart-items');
const cartTotalNode = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn'); // NEW: reference

/* ===== LOADER + REVEAL ===== */
window.addEventListener('DOMContentLoaded', ()=>{
  setTimeout(()=>{
    document.getElementById('loader').classList.add('hide');
    document.getElementById('hero')?.classList.add('visible');
    document.querySelector('.products-section')?.classList.add('visible');
    document.querySelectorAll('.info-section').forEach(s => s.classList.add('visible'));
    document.querySelector('.footer-inner')?.classList.add('visible');
  }, 500);
});

/* ===== HELPERS ===== */
function el(tag, cls, html){
  const d = document.createElement(tag);
  if(cls) d.className = cls;
  if(html !== undefined) d.innerHTML = html;
  return d;
}
function findProduct(id){
  return products.find(p => p.id === id);
}
function formatPrice(n){
  return '₹' + n.toLocaleString('en-IN');
}

/* ===== CART LOGIC ===== */
function getCartCount(){
  return cart.reduce((sum, item) => sum + item.qty, 0);
}
function getCartTotal(){
  return cart.reduce((sum, item) => {
    const p = findProduct(item.id);
    return p ? sum + p.price * item.qty : sum;
  }, 0);
}
function saveCart(){
  localStorage.setItem('fs_cart_items', JSON.stringify(cart));
  cartCountNode.innerText = getCartCount();
}
function addToCartProduct(productId, qty=1){
  const existing = cart.find(i => i.id === productId);
  if(existing) existing.qty += qty;
  else cart.push({id: productId, qty});
  saveCart();
}
function setCartQty(productId, qty){
  const idx = cart.findIndex(i => i.id === productId);
  if(idx === -1) return;
  if(qty <= 0){
    cart.splice(idx,1);
  } else {
    cart[idx].qty = qty;
  }
  saveCart();
  renderCartModal();
}
function renderCartModal(){
  cartItemsNode.innerHTML = '';
  if(cart.length === 0){
    cartItemsNode.innerHTML = '<p class="muted">Your cart is empty.</p>';
    cartTotalNode.innerText = formatPrice(0);
    return;
  }
  cart.forEach(item => {
    const p = findProduct(item.id);
    if(!p) return;
    const row = el('div','cart-item-row');
    const main = el('div','cart-item-main');
    const thumb = el('div','cart-thumb');
    const img = el('img');
    img.src = p.img;
    img.alt = p.name;
    thumb.appendChild(img);
    main.appendChild(thumb);
    const txt = el('div');
    txt.appendChild(el('div','cart-item-title',p.name));
    txt.appendChild(el('div','cart-item-price',formatPrice(p.price)));
    main.appendChild(txt);
    row.appendChild(main);

    const qtyWrap = el('div','cart-qty');
    const minus = el('button','qty-btn','−');
    const value = el('div','qty-value', item.qty);
    const plus = el('button','qty-btn','+');
    minus.onclick = ()=> setCartQty(item.id, item.qty - 1);
    plus.onclick = ()=> setCartQty(item.id, item.qty + 1);
    qtyWrap.appendChild(minus);
    qtyWrap.appendChild(value);
    qtyWrap.appendChild(plus);
    row.appendChild(qtyWrap);

    cartItemsNode.appendChild(row);
  });
  cartTotalNode.innerText = formatPrice(getCartTotal());
}

/* ===== RENDER PRODUCTS ===== */
function renderProducts(list = products){
  productsContainer.innerHTML = '';
  list.forEach(p => {
    const card = el('div','card');
    const favWrap = el('div','fav-badge');
    const favBtn = el('button','small-btn', favorites.includes(p.id) ? '♥' : '♡');
    favBtn.style.border = 'none';
    favBtn.onclick = (e) => {
      e.stopPropagation();
      toggleFav(p.id);
      favBtn.innerText = favorites.includes(p.id) ? '♥' : '♡';
    };
    favWrap.appendChild(favBtn);
    card.appendChild(favWrap);

    const visual = el('div','card-visual');
    const img = el('img');
    img.src = p.img;
    img.alt = p.name;
    visual.appendChild(img);
    card.appendChild(visual);

    const info = el('div','card-info');
    info.appendChild(el('div','card-title', p.name));
    info.appendChild(el('div','card-price', formatPrice(p.price)));
    card.appendChild(info);

    const actions = el('div','card-actions');
    const quick = el('button','small-btn','Quick View');
    quick.onclick = (e) => {
      e.stopPropagation();
      openProductModal(p);
    };
    const add = el('button','btn primary glow','Add to cart');
    add.onclick = (e) => {
      e.stopPropagation();
      addToCartProduct(p.id,1);
      add.animate(
        [{transform:'translateY(0)'},{transform:'translateY(-6px)'},{transform:'translateY(0)'}],
        {duration:260}
      );
      alert(`${p.name} added to cart!`);
    };
    actions.appendChild(quick);
    actions.appendChild(add);
    card.appendChild(actions);

    attachTilt(card, img);
    card.addEventListener('click', () => openProductModal(p));

    productsContainer.appendChild(card);
  });
}

/* ===== 3D TILT + LIGHT ===== */
function attachTilt(node, img){
  const maxTilt = 12;
  node.addEventListener('mousemove', (e) => {
    const r = node.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rotY = (x - 0.5) * (maxTilt * 2);
    const rotX = (0.5 - y) * (maxTilt);

    node.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
    img.style.transform = `translateZ(40px) rotateY(${rotY/6}deg) rotateX(${rotX/6}deg) scale(1.05)`;
    node.style.boxShadow = `0 ${24 - Math.abs(rotX)/2}px ${55 + Math.abs(rotY)}px rgba(2,6,23,0.25)`;
  });

  node.addEventListener('mouseleave', () => {
    node.style.transform = '';
    img.style.transform = 'translateZ(0) scale(1.02)';
    node.style.boxShadow = '';
  });
}

/* ===== HERO PARALLAX ===== */
const hero = document.getElementById('hero');
if (hero) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    hero.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
  });
}

/* ===== FAVORITES ===== */
function toggleFav(id){
  const idx = favorites.indexOf(id);
  if(idx === -1) favorites.push(id);
  else favorites.splice(idx,1);
  localStorage.setItem('fs_favs', JSON.stringify(favorites));
}

/* ===== PRODUCT MODAL ===== */
let currentModalProduct = null;
function openProductModal(p){
  currentModalProduct = p;
  modalImg.src = p.img;
  modalTitle.innerText = p.name;
  modalPrice.innerText = formatPrice(p.price);
  modalDesc.innerText = p.desc;
  productModal.setAttribute('aria-hidden','false');
  productModal.classList.add('show');
  productModal.style.display = 'flex';
  modalAdd.onclick = () => {
    addToCartProduct(p.id,1);
    alert(`${p.name} added to cart!`);
  };
  modalFav.onclick = () => {
    toggleFav(p.id);
    modalFav.innerText = favorites.includes(p.id) ? '♥ Favorited' : '♡ Favorite';
  };
  modalFav.innerText = favorites.includes(p.id) ? '♥ Favorited' : '♡ Favorite';
}
closeModal.addEventListener('click', ()=>{
  productModal.setAttribute('aria-hidden','true');
  productModal.classList.remove('show');
  setTimeout(()=>{productModal.style.display='none';},120);
});
productModal.addEventListener('click', (e)=> { if(e.target===productModal) { closeModal.click(); } });

/* ===== AUTH (login) ===== */
loginBtn.addEventListener('click', ()=> {
  authModal.setAttribute('aria-hidden','false');
  authModal.classList.add('show');
  authModal.style.display='flex';
});
closeAuth.addEventListener('click', ()=> {
  authModal.setAttribute('aria-hidden','true');
  authModal.classList.remove('show');
  setTimeout(()=>{authModal.style.display='none';},120);
});
authForm.addEventListener('submit', (e)=> {
  e.preventDefault();
  const email = authForm.querySelector('#email').value.trim();
  const phone = authForm.querySelector('#phone').value.trim();
  if(!email){ alert('Please enter email'); return; }
  currentUser = { email, phone };
  localStorage.setItem('fs_user', JSON.stringify(currentUser));
  accountUserNode.innerText = email;
  alert('Signed in as ' + email);
  closeAuth.click();
});

/* ===== ACCOUNT MENU ===== */
accountBtn.addEventListener('click', (e)=> {
  e.stopPropagation();
  accountMenu.classList.toggle('show');
  const shown = accountMenu.classList.contains('show');
  accountMenu.setAttribute('aria-hidden', !shown);
});
document.addEventListener('click', ()=> accountMenu.classList.remove('show'));

document.getElementById('my-account').addEventListener('click', ()=> {
  const user = JSON.parse(localStorage.getItem('fs_user')||'null');
  if(!user) return alert('Not signed in');
  alert('Profile: ' + user.email);
});
document.getElementById('orders').addEventListener('click', ()=> alert('Orders — coming soon'));
document.getElementById('purchases').addEventListener('click', ()=> alert('Purchases — coming soon'));
document.getElementById('favorites').addEventListener('click', ()=> {
  const favItems = products.filter(p=> favorites.includes(p.id));
  if(favItems.length===0) return alert('No favorites yet');
  renderProducts(favItems);
});
document.getElementById('logout').addEventListener('click', ()=> {
  localStorage.removeItem('fs_user'); currentUser = null; accountUserNode.innerText = 'Not signed in';
  alert('Logged out');
});

/* ===== CART MODAL OPEN/CLOSE ===== */
cartBtn.addEventListener('click', ()=>{
  renderCartModal();
  cartModal.setAttribute('aria-hidden','false');
  cartModal.classList.add('show');
  cartModal.style.display = 'flex';
});
closeCart.addEventListener('click', ()=>{
  cartModal.setAttribute('aria-hidden','true');
  cartModal.classList.remove('show');
  setTimeout(()=>{cartModal.style.display='none';},120);
});
cartModal.addEventListener('click', (e)=> { if(e.target===cartModal) closeCart.click(); });

/* ===== SEARCH ===== */
function performSearch(q){
  q = q.trim().toLowerCase();
  if(!q){
    renderProducts();
    return;
  }
  const filtered = products.filter(p => p.name.toLowerCase().includes(q) || (p.desc && p.desc.toLowerCase().includes(q)));
  renderProducts(filtered);
}
searchInput.addEventListener('input', (e)=> performSearch(e.target.value));
searchInput.addEventListener('keydown', (e)=> { if(e.key === 'Enter') performSearch(e.target.value); });

/* ===== SCROLL SHOP BUTTONS ===== */
function scrollToProducts(){
  const el = document.getElementById('products-section');
  if(!el) return;
  const top = el.offsetTop - 16;
  window.scrollTo({ top, behavior:'smooth' });
}
heroShop?.addEventListener('click', scrollToProducts);
viewAll?.addEventListener('click', scrollToProducts);

/* ===== PLACE ORDER (LOCATION) ===== */
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty. Please add some products first.');
    return;
  }

  const location = prompt('Enter your delivery location (Full address):', '');
  if (!location || !location.trim()) {
    alert('Order cancelled. Location is required.');
    return;
  }

  alert('Your order has been placed successfully!\n\nDelivery location:\n' + location.trim());

  // Clear cart after order placed
  cart = [];
  saveCart();
  renderCartModal();
});

/* ===== INITIALIZE ===== */
cartCountNode.innerText = getCartCount(); // starts from 0 for empty cart
if(currentUser) accountUserNode.innerText = currentUser.email;
else accountUserNode.innerText = 'Not signed in';
renderProducts();

/* ESC closes modals */
document.addEventListener('keydown', (e)=> {
  if(e.key === 'Escape'){
    closeModal.click();
    closeAuth.click();
    closeCart.click();
    accountMenu.classList.remove('show');
  }
});