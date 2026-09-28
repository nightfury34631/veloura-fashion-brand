function renderCart() {
  const el = $('#cart-page');
  const items = cart();

  if (!items.length) {
    el.innerHTML = `
      <div class="empty">
        <p>Your bag is waiting for its first piece.</p>
        <a class="button dark" href="shop.html">Continue shopping</a>
      </div>
    `;
    return;
  }

  let total = 0;

  const itemsHtml = items
    .map((item, index) => {
      const product = products.find((x) => x.id === item.id);
      const subtotal = product.price * item.quantity;
      total += subtotal;

      return `
        <article class="cart-item">
          <img src="${product.image || imagePath}" alt="${product.name}">

          <div>
            <h3>${product.name}</h3>
            <p>${item.size || 'One size'}</p>
            <button class="remove" data-remove="${index}">Remove</button>
          </div>

          <b>${money(product.price)}</b>

          <div class="qty">
            <button data-cart-qty="${index}|-1" aria-label="Decrease quantity">−</button>
            ${item.quantity}
            <button data-cart-qty="${index}|1" aria-label="Increase quantity">+</button>
          </div>

          <b>${money(subtotal)}</b>
        </article>
      `;
    })
    .join('');

  const summaryHtml = `
    <div class="cart-summary">
      <span>Subtotal</span>
      <strong>${money(total)}</strong>
      <p>Shipping and duties calculated at checkout.</p>
      <a class="button outline" href="shop.html">Continue shopping</a>
      <button class="button dark checkout">Checkout</button>
    </div>
  `;

  el.innerHTML = `
    <div class="cart-list">
      ${itemsHtml}
    </div>
    ${summaryHtml}
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();

  document.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('[data-remove]');
    const qtyBtn = e.target.closest('[data-cart-qty]');

    if (removeBtn) {
      const x = cart();
      x.splice(+removeBtn.dataset.remove, 1);
      setStore('veloura_cart', x);
    }

    if (qtyBtn) {
      const [index, delta] = qtyBtn.dataset.cartQty.split('|');
      const x = cart();
      x[index].quantity += +delta;

      if (x[index].quantity < 1) {
        x.splice(index, 1);
      }

      setStore('veloura_cart', x);
    }

    if (removeBtn || qtyBtn) {
      renderCart();
      updateCounts();
      renderDrawer();
    }
  });
});
