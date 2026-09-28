document.addEventListener("DOMContentLoaded", () =>
  $("#contact-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    $("#contact-message").textContent =
      "Thank you. Your message has been received.";
    e.target.reset();
  }),
);
