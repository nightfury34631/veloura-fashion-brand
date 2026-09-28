document.addEventListener("DOMContentLoaded", () => {
  if (!window.gsap || matchMedia("(prefers-reduced-motion: reduce)").matches)
    return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".hero-copy > *", {
    y: 24,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: "power3.out",
  });
  gsap.from(".hero img", {
    scale: 1.08,
    opacity: 0,
    duration: 1.2,
    ease: "power2.out",
  });
  gsap.utils
    .toArray(".section,.edit")
    .forEach((s) =>
      gsap.from(s, {
        scrollTrigger: { trigger: s, start: "top 85%" },
        y: 25,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      }),
    );
});
