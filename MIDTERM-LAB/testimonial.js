
document.addEventListener("DOMContentLoaded", () => {
  const viewMoreBtn = document.getElementById("viewMoreBtn");
  const hiddenItems = document.querySelectorAll(".testimonial-item.hidden");
  let expanded = false;

  viewMoreBtn.addEventListener("click", () => {
    expanded = !expanded;

    hiddenItems.forEach(item => {
      if (expanded) {
        item.style.display = "flex";
        setTimeout(() => (item.style.opacity = "1"), 100);
      } else {
        item.style.opacity = "0";
        setTimeout(() => (item.style.display = "none"), 300);
      }
    });

    viewMoreBtn.textContent = expanded ?viewMoreBtn.textContent = "View Less" : "View More";
  });
});

