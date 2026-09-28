function renderProducts(target, list) {
  const element = $(target);
  if (!element) return;

  element.innerHTML =
    list.map(productCard).join("") ||
    '<div class="empty"><h2>No pieces found.</h2><p>Try another search.</p></div>';
  lucide.createIcons();
}

document.addEventListener("DOMContentLoaded", () => {
  const home = $("#home-products");

  if (home) {
    let active = "all";
    const draw = () => {
      renderProducts(
        "#home-products",
        products
          .filter((product) => active === "all" || product.category === active)
          .slice(0, 6),
      );
      home.scrollLeft = 0;
      initCarousels();
    };

    draw();

    $$("[data-home-filters] button").forEach((button) => {
      button.onclick = () => {
        active = button.dataset.category;
        $$("[data-home-filters] button").forEach((item) =>
          item.classList.toggle("active", item === button),
        );
        draw();
      };
    });

    $("#newsletter-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      $("#newsletter-message").textContent =
        "You're on the list. Welcome to Veloura.";
      event.target.reset();
    });
  }

  const grid = $("#shop-products");
  if (!grid) return;

  const params = new URLSearchParams(location.search);
  let category = params.get("category") || "all";
  let price = "all";
  $("#shop-search").value = params.get("search") || "";

  const drawShop = () => {
    const query = $("#shop-search").value.toLowerCase();
    const results = products.filter(
      (product) =>
        (category === "all" || product.category === category) &&
        (!query || product.name.toLowerCase().includes(query)) &&
        (price === "all" ||
          (price === "under50" && product.price < 50) ||
          (price === "50to100" &&
            product.price >= 50 &&
            product.price <= 100) ||
          (price === "100plus" && product.price > 100)),
    );
    const sort = $("#shop-sort").value;
    if (sort === "low") results.sort((a, b) => a.price - b.price);
    if (sort === "high") results.sort((a, b) => b.price - a.price);
    if (sort === "name") results.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "newest") results.sort((a, b) => b.new - a.new);
    renderProducts("#shop-products", results);
    $("#search-result").textContent = query
      ? `Search results for “${query}”`
      : "";
  };

  drawShop();
  $$("#shop-categories button").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === category);
    button.onclick = () => {
      category = button.dataset.category;
      $$("#shop-categories button").forEach((item) =>
        item.classList.toggle("active", item === button),
      );
      drawShop();
    };
  });
  $$("#price-filters button").forEach(
    (button) =>
      (button.onclick = () => {
        price = button.dataset.price;
        $$("#price-filters button").forEach((item) =>
          item.classList.toggle("active", item === button),
        );
        drawShop();
      }),
  );
  $("#shop-search").oninput = drawShop;
  $("#shop-sort").onchange = drawShop;
});
