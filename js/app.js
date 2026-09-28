const modificationsCss = document.createElement("link");
modificationsCss.rel = "stylesheet";
modificationsCss.href = "css/modifications.css";
document.head.append(modificationsCss);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const money = (n) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  })
    .format(n)
    .replace("BDT", "৳")
    .trim();

const getStore = (k) => JSON.parse(localStorage.getItem(k) || "[]");
const setStore = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const cart = () => getStore("veloura_cart");
const wish = () => getStore("veloura_wishlist");

function header() {
  $("#site-header").innerHTML = `
    <div class="announcement">
      Free Shipping on All Orders Over ৳5,000
      <span>|</span>
      A More Thoughtful Wardrobe Awaits
      <small>Ship to: BD⌄</small>
    </div>

    <header>
      <button class="menu-toggle" aria-label="Open menu">
        <i data-lucide="menu"></i>
      </button>

      <a class="brand" href="index.html">VELOURA</a>

      <nav>
        <a href="shop.html?category=men">Men</a>
        <a href="shop.html?category=women">Women</a>
        <a href="shop.html?category=accessories">Accessories</a>
        <a href="shop.html?category=bags">Bags</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
      </nav>

      <div class="header-actions">
        <button class="search-toggle" aria-label="Search">
          <i data-lucide="search"></i>
        </button>

        <a href="wishlist.html" aria-label="Wishlist">
          <i data-lucide="heart"></i>
          <b class="wish-count"></b>
        </a>

        <button class="bag-toggle" aria-label="Your bag">
          <i data-lucide="shopping-bag"></i>
          <b class="cart-count">0</b>
        </button>
      </div>
    </header>

    <div class="mobile-nav">
      <a href="shop.html">Shop</a>
      <a href="shop.html?category=men">Men</a>
      <a href="shop.html?category=women">Women</a>
      <a href="shop.html?category=accessories">Accessories</a>
      <a href="shop.html?category=bags">Bags</a>
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
    </div>

    <div class="header-search">
      <input placeholder="Search products..." aria-label="Search products">
    </div>
  `;
}

function footer() {
  $("#site-footer").innerHTML = `
    <footer>
      <div>
        <a class="brand" href="index.html">VELOURA</a>
        <p>Modern essentials for every<br>expression of style.</p>
      </div>

      <div>
        <h4>Shop</h4>
        <a href="shop.html?category=men">Men</a>
        <a href="shop.html?category=women">Women</a>
        <a href="shop.html?category=accessories">Accessories</a>
        <a href="shop.html?category=bags">Bags</a>
      </div>

      <div>
        <h4>About</h4>
        <a href="about.html">About Us</a>
        <a href="contact.html">Contact</a>
      </div>

      <div>
        <h4>Help</h4>
        <a href="#">Shipping & Returns</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms & Conditions</a>
      </div>

      <div>
        <h4>Follow us</h4>
        <p class="social">◎ ● ◉ ♪</p>
      </div>

      <small>© 2026 Veloura. All rights reserved.</small>
    </footer>
  `;
}

function ui() {
  $("#site-ui").innerHTML = `
    <div class="overlay"></div>

    <aside class="cart-drawer">
      <button class="drawer-close" aria-label="Close">×</button>
      <p class="eyebrow">Your bag</p>
      <div id="drawer-content"></div>
    </aside>

    <div class="toast"></div>
  `;
}

function productCard(p) {
  let liked = wish().includes(p.id);

  return `
    <article class="product-card">
      <a href="product.html?id=${p.id}" class="product-image">
        <img src="${p.image || imagePath}" alt="${p.name}" loading="lazy">
      </a>

      <button
        class="heart ${liked ? "liked" : ""}"
        data-wish="${p.id}"
        aria-label="Save ${p.name}">
        <i data-lucide="heart"></i>
      </button>

      <a href="product.html?id=${p.id}">
        <h3>${p.name}</h3>
        <p>${p.category}</p>
        <strong>${money(p.price)}</strong>
      </a>
    </article>
  `;
}

function updateCounts() {
  let c = cart().reduce((n, x) => n + x.quantity, 0);

  $$(".cart-count").forEach((x) => (x.textContent = c));
  $$(".wish-count").forEach((x) => (x.textContent = wish().length || ""));
}

function toast(t) {
  let e = $(".toast");
  e.textContent = t;
  e.classList.add("show");

  setTimeout(() => {
    e.classList.remove("show");
  }, 2200);
}

function toggleWishlist(id) {
  let x = wish(),
    n = Number(id);

  x = x.includes(n) ? x.filter((i) => i !== n) : [...x, n];

  setStore("veloura_wishlist", x);
  updateCounts();

  document.dispatchEvent(new Event("wishlistchange"));

  toast(
    x.includes(n) ? "Saved to your wishlist." : "Removed from your wishlist.",
  );
}

function addToCart(id, quantity = 1, size = "") {
  let x = cart();
  let p = x.find((i) => i.id === Number(id) && i.size === size);

  p
    ? (p.quantity += quantity)
    : x.push({
        id: Number(id),
        quantity,
        size,
      });

  setStore("veloura_cart", x);
  updateCounts();
  renderDrawer();

  toast("Added to your bag.");
}

function renderDrawer() {
  let el = $("#drawer-content");

  if (!el) return;

  let items = cart();

  if (!items.length) {
    el.innerHTML = `
      <div class="empty">
        <p>Your bag is waiting for its first piece.</p>
        <a class="button dark" href="shop.html">
          Continue shopping
        </a>
      </div>
    `;
    return;
  }

  let total = items.reduce(
    (s, i) => s + products.find((p) => p.id === i.id).price * i.quantity,
    0,
  );

  el.innerHTML =
    items
      .map((i) => {
        let p = products.find((p) => p.id === i.id);

        return `
        <div class="drawer-item">
          <img src="${p.image || imagePath}" alt="${p.name}">

          <div>
            <b>${p.name}</b>

            <p>
              ${money(p.price)}
              ${i.size ? `· ${i.size}` : ""}
            </p>

            <div class="qty">
              <button data-drawer-qty="${p.id}|${i.size}|-1">−</button>
              ${i.quantity}
              <button data-drawer-qty="${p.id}|${i.size}|1">+</button>
            </div>
          </div>
        </div>
      `;
      })
      .join("") +
    `

      <div class="drawer-total">
        Subtotal
        <b>${money(total)}</b>
      </div>

      <a class="button outline" href="cart.html">
        View bag
      </a>

      <button class="button dark checkout">
        Checkout
      </button>
    `;
}

/* =========================================
   CAROUSEL FUNCTIONALITY
========================================= */

function oldInitCarousels() {
  $$(".carousel").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const previous = carousel.querySelector(".carousel-arrow.previous");
    const next = carousel.querySelector(".carousel-arrow.next");

    if (!track || !previous || !next) return;

    const getScrollAmount = () => {
      const card = track.querySelector(".product-card");

      if (!card) {
        return track.clientWidth;
      }

      const gap = parseFloat(getComputedStyle(track).gap) || 0;

      return card.getBoundingClientRect().width + gap;
    };

    const updateButtons = () => {
      const atStart = track.scrollLeft <= 5;

      const atEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;

      previous.disabled = atStart;
      next.disabled = atEnd;

      previous.style.opacity = atStart ? "0.35" : "1";
      next.style.opacity = atEnd ? "0.35" : "1";

      previous.setAttribute("aria-label", "Previous products");

      next.setAttribute("aria-label", "Next products");
    };

    previous.addEventListener("click", () => {
      track.scrollBy({
        left: -getScrollAmount() * 2,
        behavior: "smooth",
      });
    });

    next.addEventListener("click", () => {
      track.scrollBy({
        left: getScrollAmount() * 2,
        behavior: "smooth",
      });
    });

    track.addEventListener("scroll", updateButtons, { passive: true });

    window.addEventListener("resize", updateButtons);

    updateButtons();
  });
}

function initCarousels() {
  $$(".carousel").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const previous = carousel.querySelector(".carousel-arrow.previous");
    const next = carousel.querySelector(".carousel-arrow.next");

    if (!track || !previous || !next) return;
    if (carousel.dataset.carouselReady) {
      carousel.carouselUpdate?.();
      return;
    }

    const getScrollAmount = () => {
      const card = track.querySelector(".product-card");

      if (!card) {
        return track.clientWidth;
      }

      const gap = parseFloat(getComputedStyle(track).gap) || 0;

      return card.getBoundingClientRect().width + gap;
    };

    const updateButtons = () => {
      const canScroll = track.scrollWidth > track.clientWidth + 2;
      const atStart = !canScroll || track.scrollLeft <= 2;

      const atEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;

      previous.disabled = atStart;
      next.disabled = !canScroll || atEnd;

      previous.style.opacity = atStart ? "0.35" : "1";

      next.style.opacity = atEnd ? "0.35" : "1";

      previous.setAttribute("aria-label", "Previous products");

      next.setAttribute("aria-label", "Next products");
    };

    previous.addEventListener("click", () => {
      track.scrollBy({
        left: -getScrollAmount(),
        behavior: "smooth",
      });
    });

    next.addEventListener("click", () => {
      track.scrollBy({
        left: getScrollAmount(),
        behavior: "smooth",
      });
    });

    track.addEventListener("scroll", updateButtons, { passive: true });

    track.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      track.scrollBy({
        left:
          event.key === "ArrowLeft" ? -getScrollAmount() : getScrollAmount(),
        behavior: "smooth",
      });
    });

    window.addEventListener("resize", updateButtons);

    carousel.dataset.carouselReady = "true";
    carousel.carouselUpdate = updateButtons;

    updateButtons();
  });
}

/* =========================================
   EVENT BINDINGS
========================================= */

function bind() {
  document.addEventListener("click", (e) => {
    let w = e.target.closest("[data-wish]");

    if (w) {
      toggleWishlist(w.dataset.wish);
      return;
    }

    if (e.target.closest(".bag-toggle")) {
      $(".cart-drawer").classList.add("open");
      $(".overlay").classList.add("open");
    }

    if (e.target.closest(".drawer-close") || e.target.closest(".overlay")) {
      $(".cart-drawer").classList.remove("open");
      $(".overlay").classList.remove("open");
    }

    if (e.target.closest(".menu-toggle")) {
      $(".mobile-nav").classList.toggle("open");
    }

    if (e.target.closest(".search-toggle")) {
      $(".header-search").classList.toggle("open");
    }

    if (e.target.closest(".checkout")) {
      toast("Checkout is a polished demonstration—no payment required.");
    }

    let q = e.target.closest("[data-drawer-qty]");

    if (q) {
      let [id, size, d] = q.dataset.drawerQty.split("|");

      let x = cart();

      let item = x.find((i) => i.id === +id && i.size === size);

      if (!item) return;

      item.quantity += +d;

      if (item.quantity < 1) {
        x.splice(x.indexOf(item), 1);
      }

      setStore("veloura_cart", x);
      updateCounts();
      renderDrawer();
    }
  });

  $(".header-search input")?.addEventListener("change", (e) => {
    location.href = "shop.html?search=" + encodeURIComponent(e.target.value);
  });
}

/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  header();
  footer();
  ui();

  lucide.createIcons();

  updateCounts();
  renderDrawer();

  bind();

  initCarousels();
});
