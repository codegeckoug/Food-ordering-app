const cartText = document.getElementById("cart-text");
const cartHeading = document.querySelector(".cart h3");
const cartImage = document.querySelector(".cart img");
const confirmationBtn = document.getElementById("confirmation-btn");
const totalPrices = document.querySelector(".total-price");
const totalPriceValue = document.querySelector(".total-price-value");
const orderDes = document.getElementById("order-des");
const dessertList = document.getElementById("dessert-list");

let cart = {};
let dessertsData = []; // store desserts for re-rendering

// Fetch and render desserts
fetch("./desserts.json")
  .then((res) => res.json())
  .then((desserts) => {
    dessertsData = desserts;
    renderDessertList();
  });

// Render dessert list with correct controls
function renderDessertList() {
  dessertList.innerHTML = "";

  dessertsData.forEach((dessert, index) => {
    const card = document.createElement("div");
    card.classList.add("dessert-card");
    card.tabIndex = 0;

    const inCart = cart[index];
    const controlsHTML = inCart
      ? `
        <div class="quantity-control" data-id="${index}">
          <button class="decrease">−</button>
          <span class="quantity">${inCart.quantity}</span>
          <button class="increase">+</button>
        </div>
      `
      : `<button class="add-to-cart" data-id="${index}">🛒 Add to Cart</button>`;

    card.innerHTML = `
      <img src="${dessert.image.thumbnail}" alt="${dessert.name}" />
      <h3>${dessert.name}</h3>
      <p class="category">${dessert.category}</p>
      <p class="price">$${dessert.price.toFixed(2)}</p>
      ${controlsHTML}
    `;

    dessertList.appendChild(card);
  });

  // Attach events for Add to Cart
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      const d = dessertsData[id];
      cart[id] = {
        name: d.name,
        price: d.price,
        quantity: 1,
        image: d.image.thumbnail,
      };
      updateCart();
    });
  });

  // Attach events for Increase
  document.querySelectorAll(".increase").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.closest(".quantity-control").getAttribute("data-id");
      cart[id].quantity++;
      updateCart();
    });
  });

  // Attach events for Decrease
  document.querySelectorAll(".decrease").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.closest(".quantity-control").getAttribute("data-id");
      cart[id].quantity--;
      if (cart[id].quantity <= 0) {
        delete cart[id];
      }
      updateCart();
    });
  });
}

// Update cart section
function updateCart() {
  const cartItems = document.querySelector(".cart-items");
  cartItems.innerHTML = "";

  const totalItems = Object.values(cart).reduce(
    (total, item) => total + item.quantity,
    0
  );

  confirmationBtn.style.display = totalItems > 0 ? "block" : "none";
  cartHeading.textContent = `Your Cart (${totalItems})`;
  cartText.style.display = totalItems === 0 ? "block" : "none";
  cartImage.style.display = totalItems === 0 ? "block" : "none";
  orderDes.style.display = totalItems > 0 ? "block" : "none";

  Object.entries(cart).forEach(([id, item]) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
    <div class="cart-add">
    <div class ="cart-add-one">
      <span class="item-info">
        <span class="item-quantity">x ${item.quantity}</span>
        ${item.name} - $${item.price.toFixed(2)}
      </span>
      </div>
      <div class="cart-remove">
      <button class="remove-from-cart" data-id="${id}">❌</button>
      </div>
      </div>
    `;
    cartItems.appendChild(cartItem);
  });

  const totalPrice = Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  totalPrices.textContent = "Total";
  totalPriceValue.textContent = `$${totalPrice.toFixed(2)}`;

  // Remove from cart
  document.querySelectorAll(".remove-from-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      delete cart[id];
      updateCart();
    });
  });

  // Re-render product list to show correct controls
  renderDessertList();
}

// Modal functionality
const modal = document.getElementById("confirmation-modal");
const modalOrderSummary = document.getElementById("modal-order-summary");
const modalTotal = document.getElementById("modal-total");
const newOrderBtn = document.getElementById("new-order-btn");

confirmationBtn.addEventListener("click", () => {
  modalOrderSummary.innerHTML = "";

  Object.values(cart).forEach((item) => {
    const itemRow = document.createElement("div");
    itemRow.classList.add("modal-row");
    itemRow.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="modal-thumb" />
      <div class="modal-item-info">
        <span class="modal-item-name">${item.name}</span>
        <span class="modal-item-quantity">x ${item.quantity}</span>
      </div>
      <span class="modal-item-price">$${(item.price * item.quantity).toFixed(
        2
      )}</span>
    `;
    modalOrderSummary.appendChild(itemRow);
  });

  const totalPrice = Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  modalTotal.textContent = `Order Total: $${totalPrice.toFixed(2)}`;

  modal.style.display = "flex";
});

// Start new order
newOrderBtn.addEventListener("click", () => {
  cart = {};
  updateCart();
  modal.style.display = "none";
});
