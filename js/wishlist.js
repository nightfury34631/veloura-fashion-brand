document.addEventListener("DOMContentLoaded", () => {
  let draw = () => {
    let list = products.filter((p) => wish().includes(p.id));
    $("#wishlist-products").innerHTML = list.length
      ? list.map(productCard).join("")
      : '<div class="empty"><p>Your saved pieces will appear here.</p><a class="button dark" href="shop.html">Continue shopping</a></div>';
    lucide.createIcons();
  };
  draw();
  document.addEventListener("wishlistchange", draw);
});
