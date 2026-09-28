document.addEventListener("DOMContentLoaded", () => {
  let p =
    products.find(
      (x) => x.id === +new URLSearchParams(location.search).get("id"),
    ) || products[0];

  let qty = 1;
  let size = p.sizes[0];

  $("#product-detail").innerHTML = `

    <div class="gallery">

      <div class="main-image">

        <img
          id="product-main-img"
          src="${p.image || imagePath}"
          alt="${p.name}"
        >

        <button
          class="gallery-prev"
          aria-label="Previous image"
        >
          ←
        </button>

        <button
          class="gallery-next"
          aria-label="Next image"
        >
          →
        </button>

      </div>


      <div class="thumbs">

        <button class="active" data-src="${p.image || imagePath}">

          <img
            src="${p.image || imagePath}"
            alt="${p.name}"
          >

        </button>


        <button data-src="${p.detailImage || p.image || imagePath}">

          <img
            src="${p.detailImage || p.image || imagePath}"
            alt="${p.name} detail"
          >

        </button>

      </div>

    </div>


    <div class="product-info">

      <p class="eyebrow">
        ${p.category}
      </p>


      <h1>
        ${p.name}
      </h1>


      <p class="price">
        ${money(p.price)}
      </p>


      <p class="description">
        ${p.description}
      </p>


      <p class="eyebrow">
        Size
      </p>


      <div class="sizes">

        ${p.sizes
          .map(
            (s, i) => `

          <button class="${i ? "" : "active"}">
            ${s}
          </button>

        `,
          )
          .join("")}

      </div>


      <p class="eyebrow">
        Quantity
      </p>


      <div class="qty product-qty">

        <button
          aria-label="Decrease quantity"
        >
          −
        </button>

        <span>
          1
        </span>

        <button
          aria-label="Increase quantity"
        >
          +
        </button>

      </div>


      <button class="button dark add-product">
        Add to bag
      </button>


      <button
        class="wishlist-action"
        data-wish="${p.id}"
      >

        <i data-lucide="heart"></i>

        Add to wishlist

      </button>


      <details open>

        <summary>
          Details & materials
        </summary>

        <p>
          ${p.material}.
          Made for a thoughtful, lasting wardrobe.
        </p>

      </details>


      <details>

        <summary>
          Care & shipping
        </summary>

        <p>
          Handle with care.
          Complimentary delivery on orders over ৳5,000.
        </p>

      </details>

    </div>

  `;

  /* =================================
       GALLERY THUMB SWITCHING
    ================================= */

  const thumbs = $$(".thumbs button");
  const mainImg = $("#product-main-img");
  let activeIdx = 0;

  function setGalleryImage(idx) {
    activeIdx = idx;
    thumbs.forEach((t, i) => t.classList.toggle("active", i === idx));
    if (mainImg && thumbs[idx]) {
      mainImg.src = thumbs[idx].dataset.src;
    }
  }

  thumbs.forEach((btn, i) => {
    btn.onclick = () => setGalleryImage(i);
  });

  const prevBtn = $(".gallery-prev");
  const nextBtn = $(".gallery-next");
  if (prevBtn) {
    prevBtn.onclick = () => {
      const nextIdx = (activeIdx - 1 + thumbs.length) % thumbs.length;
      setGalleryImage(nextIdx);
    };
  }
  if (nextBtn) {
    nextBtn.onclick = () => {
      const nextIdx = (activeIdx + 1) % thumbs.length;
      setGalleryImage(nextIdx);
    };
  }

  $$(".sizes button").forEach((b) => {
    b.onclick = () => {
      $$(".sizes button").forEach((x) => {
        x.classList.remove("active");
      });

      b.classList.add("active");

      size = b.textContent.trim();
    };
  });

  /* =================================
       QUANTITY
    ================================= */

  $(".product-qty button")[0].onclick = () => {
    qty = Math.max(1, qty - 1);

    $(".product-qty span").textContent = qty;
  };

  $(".product-qty button")[1].onclick = () => {
    qty++;

    $(".product-qty span").textContent = qty;
  };

  /* =================================
       ADD TO BAG
    ================================= */

  $(".add-product").onclick = () => {
    addToCart(p.id, qty, size);
  };

  /* =================================
       RELATED PRODUCTS
    ================================= */

  $("#related-products").innerHTML = products
    .filter((x) => x.category === p.category && x.id !== p.id)
    .slice(0, 4)
    .map(productCard)
    .join("");

  /* =================================
       INITIALIZE RELATED PRODUCTS CAROUSEL
    ================================= */

  initCarousels();

  /* =================================
       ICONS
    ================================= */

  lucide.createIcons();
});
